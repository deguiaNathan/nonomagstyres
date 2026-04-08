import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  addCartItem,
  fetchCart,
  getCartItemSize,
  getCartItemUnitPrice,
  normalizeCartErrorCart,
  placeWooOrder,
  removeCartItem,
  selectCartShippingRate,
  updateCartCustomer,
  updateCartItem,
  type WooAddress,
  type WooCartResponse,
  type WooShippingPackage,
} from '../lib/woocommerce';
import { amountFromMinorUnit, getWpRuntimeConfig } from '../lib/wordpress';

export type CartItem = {
  id: number;
  key?: string;
  name: string;
  size: string;
  price: number;
  image: string;
  qty: number;
  permalink?: string;
  quantityLimits?: {
    minimum: number;
    maximum: number;
    editable: boolean;
  };
};

type PlaceOrderPayload = {
  billingAddress: WooAddress;
  shippingAddress: WooAddress;
  paymentMethod: string;
  customerNote?: string;
};

type CartContextType = {
  isWooEnabled: boolean;
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (keyOrId: string | number) => Promise<void>;
  updateQty: (keyOrId: string | number, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  updateCustomer: (payload: { billingAddress?: Partial<WooAddress>; shippingAddress?: Partial<WooAddress> }) => Promise<void>;
  selectShippingRate: (packageId: number, rateId: string) => Promise<void>;
  placeOrder: (payload: PlaceOrderPayload) => Promise<any>;
  totalItems: number;
  totalPrice: number;
  shippingTotal: number;
  taxTotal: number;
  grandTotal: number;
  cartLoading: boolean;
  cartError: string | null;
  checkoutLoading: boolean;
  checkoutError: string | null;
  cartData: WooCartResponse | null;
  billingAddress: WooAddress | null;
  shippingAddress: WooAddress | null;
  shippingPackages: WooShippingPackage[];
  paymentMethodIds: string[];
};

const noopAsync = async () => {};

const CartContext = createContext<CartContextType>({
  isWooEnabled: false,
  items: [],
  addItem: noopAsync,
  removeItem: noopAsync,
  updateQty: noopAsync,
  clearCart: noopAsync,
  refreshCart: noopAsync,
  updateCustomer: noopAsync,
  selectShippingRate: noopAsync,
  placeOrder: async () => null,
  totalItems: 0,
  totalPrice: 0,
  shippingTotal: 0,
  taxTotal: 0,
  grandTotal: 0,
  cartLoading: false,
  cartError: null,
  checkoutLoading: false,
  checkoutError: null,
  cartData: null,
  billingAddress: null,
  shippingAddress: null,
  shippingPackages: [],
  paymentMethodIds: [],
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const isWooEnabled = getWpRuntimeConfig().wooEnabled;
  const [cartData, setCartData] = useState<WooCartResponse | null>(null);
  const [cartLoading, setCartLoading] = useState(isWooEnabled);
  const [cartError, setCartError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [localItems, setLocalItems] = useState<CartItem[]>([]);

  const syncWooCart = useCallback(async (loader: () => Promise<WooCartResponse>) => {
    setCartError(null);

    try {
      const nextCart = await loader();
      setCartData(nextCart);
    } catch (error) {
      const fallbackCart = normalizeCartErrorCart(error);
      if (fallbackCart) {
        setCartData(fallbackCart);
      }

      setCartError(error instanceof Error ? error.message : 'Unable to sync your cart right now.');
      throw error;
    }
  }, []);

  const refreshCart = useCallback(async () => {
    if (!isWooEnabled) {
      return;
    }

    setCartLoading(true);
    try {
      await syncWooCart(() => fetchCart());
    } finally {
      setCartLoading(false);
    }
  }, [isWooEnabled, syncWooCart]);

  useEffect(() => {
    if (!isWooEnabled) {
      return;
    }

    refreshCart().catch(() => {});
  }, [isWooEnabled, refreshCart]);

  const addItem = useCallback(async (item: CartItem) => {
    if (!isWooEnabled) {
      setLocalItems((previousItems) => {
        const existingItem = previousItems.find((existing) => existing.id === item.id);
        if (existingItem) {
          return previousItems.map((existing) => (
            existing.id === item.id
              ? { ...existing, qty: existing.qty + item.qty }
              : existing
          ));
        }

        return [...previousItems, item];
      });
      return;
    }

    setCartLoading(true);
    try {
      await syncWooCart(() => addCartItem(item.id, item.qty));
    } finally {
      setCartLoading(false);
    }
  }, [isWooEnabled, syncWooCart]);

  const resolveCartItemKey = useCallback((keyOrId: string | number) => {
    if (typeof keyOrId === 'string') {
      return keyOrId;
    }

    return cartData?.items.find((item) => item.id === keyOrId)?.key ?? String(keyOrId);
  }, [cartData]);

  const removeItem = useCallback(async (keyOrId: string | number) => {
    if (!isWooEnabled) {
      setLocalItems((previousItems) => previousItems.filter((item) => item.id !== keyOrId));
      return;
    }

    setCartLoading(true);
    try {
      await syncWooCart(() => removeCartItem(resolveCartItemKey(keyOrId)));
    } finally {
      setCartLoading(false);
    }
  }, [isWooEnabled, resolveCartItemKey, syncWooCart]);

  const updateQty = useCallback(async (keyOrId: string | number, qty: number) => {
    if (!isWooEnabled) {
      if (qty <= 0) {
        setLocalItems((previousItems) => previousItems.filter((item) => item.id !== keyOrId));
        return;
      }

      setLocalItems((previousItems) => previousItems.map((item) => (
        item.id === keyOrId
          ? { ...item, qty }
          : item
      )));
      return;
    }

    if (qty <= 0) {
      await removeItem(keyOrId);
      return;
    }

    setCartLoading(true);
    try {
      await syncWooCart(() => updateCartItem(resolveCartItemKey(keyOrId), qty));
    } finally {
      setCartLoading(false);
    }
  }, [isWooEnabled, removeItem, resolveCartItemKey, syncWooCart]);

  const clearCart = useCallback(async () => {
    if (!isWooEnabled) {
      setLocalItems([]);
      return;
    }

    const itemsToRemove = [...(cartData?.items ?? [])];
    for (const item of itemsToRemove) {
      // Sequential removal keeps the Woo session state in sync.
      // eslint-disable-next-line no-await-in-loop
      await removeItem(item.key);
    }
  }, [cartData, isWooEnabled, removeItem]);

  const updateCustomer = useCallback(async (payload: { billingAddress?: Partial<WooAddress>; shippingAddress?: Partial<WooAddress> }) => {
    if (!isWooEnabled) {
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      await syncWooCart(() => updateCartCustomer({
        billing_address: payload.billingAddress,
        shipping_address: payload.shippingAddress,
      }));
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Unable to save your details right now.');
      throw error;
    } finally {
      setCheckoutLoading(false);
    }
  }, [isWooEnabled, syncWooCart]);

  const selectShippingRate = useCallback(async (packageId: number, rateId: string) => {
    if (!isWooEnabled) {
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      await syncWooCart(() => selectCartShippingRate(packageId, rateId));
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Unable to update the delivery method right now.');
      throw error;
    } finally {
      setCheckoutLoading(false);
    }
  }, [isWooEnabled, syncWooCart]);

  const placeOrder = useCallback(async (payload: PlaceOrderPayload) => {
    if (!isWooEnabled) {
      return null;
    }

    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const result = await placeWooOrder({
        billing_address: payload.billingAddress,
        shipping_address: payload.shippingAddress,
        customer_note: payload.customerNote,
        payment_method: payload.paymentMethod,
      });

      await refreshCart();

      return result;
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Unable to place your order right now.');
      throw error;
    } finally {
      setCheckoutLoading(false);
    }
  }, [isWooEnabled, refreshCart]);

  const items = useMemo(() => {
    if (!isWooEnabled) {
      return localItems;
    }

    return (cartData?.items ?? []).map((item) => ({
      id: item.id,
      key: item.key,
      name: item.name,
      size: getCartItemSize(item),
      price: getCartItemUnitPrice(item),
      image: item.images?.[0]?.thumbnail || item.images?.[0]?.src || '',
      qty: item.quantity,
      permalink: item.permalink,
      quantityLimits: item.quantity_limits,
    }));
  }, [cartData, isWooEnabled, localItems]);

  const totalItems = isWooEnabled
    ? items.reduce((sum, item) => sum + item.qty, 0)
    : localItems.reduce((sum, item) => sum + item.qty, 0);

  const totalPrice = isWooEnabled
    ? amountFromMinorUnit(cartData?.totals.total_items ?? '0', {
        currencyMinorUnit: cartData?.totals.currency_minor_unit ?? 2,
      })
    : localItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const shippingTotal = isWooEnabled
    ? amountFromMinorUnit(cartData?.totals.total_shipping ?? '0', {
        currencyMinorUnit: cartData?.totals.currency_minor_unit ?? 2,
      })
    : 0;

  const taxTotal = isWooEnabled
    ? amountFromMinorUnit(cartData?.totals.total_tax ?? '0', {
        currencyMinorUnit: cartData?.totals.currency_minor_unit ?? 2,
      })
    : 0;

  const grandTotal = isWooEnabled
    ? amountFromMinorUnit(cartData?.totals.total_price ?? '0', {
        currencyMinorUnit: cartData?.totals.currency_minor_unit ?? 2,
      })
    : totalPrice;

  const billingAddress = cartData?.billing_address ?? null;
  const shippingAddress = cartData?.shipping_address ?? null;
  const shippingPackages = cartData?.shipping_rates ?? [];
  const paymentMethodIds = cartData?.payment_methods ?? [];

  const contextValue = useMemo(() => ({
    isWooEnabled,
    items,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    refreshCart,
    updateCustomer,
    selectShippingRate,
    placeOrder,
    totalItems,
    totalPrice,
    shippingTotal,
    taxTotal,
    grandTotal,
    cartLoading,
    cartError,
    checkoutLoading,
    checkoutError,
    cartData,
    billingAddress,
    shippingAddress,
    shippingPackages,
    paymentMethodIds,
  }), [
    addItem,
    billingAddress,
    cartData,
    cartError,
    cartLoading,
    checkoutError,
    checkoutLoading,
    clearCart,
    grandTotal,
    isWooEnabled,
    items,
    placeOrder,
    refreshCart,
    removeItem,
    selectShippingRate,
    paymentMethodIds,
    shippingAddress,
    shippingPackages,
    shippingTotal,
    taxTotal,
    totalItems,
    totalPrice,
    updateCustomer,
    updateQty,
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
