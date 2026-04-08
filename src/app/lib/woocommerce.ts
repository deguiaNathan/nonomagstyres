import {
  amountFromMinorUnit,
  buildApiUrl,
  formatCurrency,
  getStoreApiNonce,
  getWpRuntimeConfig,
  setStoreApiNonce,
  type CurrencyConfig,
} from './wordpress';

export type StorefrontProductSpec = {
  label: string;
  value: string;
};

export type StorefrontReview = {
  id: number;
  name: string;
  location: string;
  rating: number;
  date: string;
  text: string;
};

export type StorefrontProduct = {
  id: number;
  slug: string;
  permalink: string;
  brand: string;
  name: string;
  category: string;
  categories: string[];
  size: string;
  width: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  badgeColor: string;
  inStock: boolean;
  image: string;
  images: string[];
  isNew?: boolean;
  summary: string;
  description: string;
  specs: StorefrontProductSpec[];
  hasOptions: boolean;
  purchasable: boolean;
};

export type StorefrontProductsResponse = {
  items: StorefrontProduct[];
  filters: {
    categories: string[];
    brands: string[];
    widths: string[];
    maxPrice: number;
  };
};

export type StorefrontProductResponse = {
  product: StorefrontProduct;
  related: StorefrontProduct[];
  reviews: StorefrontReview[];
};

export type WooCartItemQuantityLimits = {
  minimum: number;
  maximum: number;
  editable: boolean;
  multiple_of?: number;
};

export type WooCartImage = {
  src: string;
  thumbnail?: string;
  alt?: string;
};

export type WooCartItem = {
  key: string;
  id: number;
  quantity: number;
  quantity_limits: WooCartItemQuantityLimits;
  name: string;
  sku?: string;
  permalink: string;
  images: WooCartImage[];
  variation: Array<{ attribute: string; value: string }>;
  item_data?: Array<{ key: string; value: string }>;
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_prefix: string;
    currency_suffix: string;
  };
  totals: {
    line_total: string;
    line_subtotal: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
  };
};

export type WooShippingRate = {
  rate_id: string;
  name: string;
  description?: string;
  price: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  selected: boolean;
};

export type WooShippingPackage = {
  package_id: number;
  name: string;
  shipping_rates: WooShippingRate[];
};

export type WooAddress = {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
};

export type WooCartResponse = {
  items: WooCartItem[];
  items_count: number;
  totals: {
    total_items: string;
    total_shipping: string;
    total_tax: string;
    total_price: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_prefix: string;
    currency_suffix: string;
  };
  billing_address: WooAddress;
  shipping_address: WooAddress;
  shipping_rates: WooShippingPackage[];
  needs_payment: boolean;
  needs_shipping: boolean;
  payment_methods: string[];
};

export type WooPaymentMethod = {
  id: string;
  title: string;
  description: string;
  orderButtonText: string;
  requiresNativeCheckout: boolean;
  supports: string[];
};

export type WooPaymentMethodsResponse = {
  methods: WooPaymentMethod[];
};

export type WooCheckoutResponse = {
  order_id: number;
  order_key: string;
  status: string;
  payment_method: string;
  payment_result: {
    payment_status?: string;
    redirect_url?: string;
  } | null;
};

type RequestOptions = {
  method?: string;
  body?: BodyInit | null;
  needsNonce?: boolean;
  headers?: HeadersInit;
};

type RequestError = Error & {
  status?: number;
  responseData?: any;
};

const buildCustomEndpoint = (path: string, params?: Record<string, string | number | boolean | undefined>) =>
  buildApiUrl(getWpRuntimeConfig().apiBase, path, params);

const buildStoreEndpoint = (path: string, params?: Record<string, string | number | boolean | undefined>) =>
  buildApiUrl(getWpRuntimeConfig().storeApiBase, path, params);

async function requestJson<T>(url: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers ?? {});
  headers.set('Accept', 'application/json');

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.needsNonce) {
    const nonce = getStoreApiNonce();
    if (nonce) {
      headers.set('Nonce', nonce);
    }
  }

  const response = await fetch(url, {
    method: options.method ?? 'GET',
    body: options.body ?? null,
    credentials: 'same-origin',
    headers,
  });

  const nextNonce = response.headers.get('Nonce');
  if (nextNonce) {
    setStoreApiNonce(nextNonce);
  }

  const rawText = await response.text();
  let payload: any = null;

  if (rawText) {
    try {
      payload = JSON.parse(rawText);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const error = new Error(payload?.message || rawText || `Request failed with status ${response.status}`) as RequestError;
    error.status = response.status;
    error.responseData = payload;
    throw error;
  }

  if (rawText && payload === null) {
    throw new Error('The server returned an unexpected response format.');
  }

  return payload as T;
}

export function getCartCurrency(cart?: WooCartResponse | null): Partial<CurrencyConfig> | undefined {
  if (!cart) {
    return undefined;
  }

  return {
    currencyCode: cart.totals.currency_code,
    currencySymbol: cart.totals.currency_symbol,
    currencyMinorUnit: cart.totals.currency_minor_unit,
    currencyPrefix: cart.totals.currency_prefix,
    currencySuffix: cart.totals.currency_suffix,
  };
}

export function formatCartMoney(rawAmount: string | number, cart?: WooCartResponse | null) {
  const currency = getCartCurrency(cart);
  return formatCurrency(amountFromMinorUnit(rawAmount, currency), currency);
}

export function getCartItemUnitPrice(item: WooCartItem) {
  return amountFromMinorUnit(item.prices.price, {
    currencyMinorUnit: item.prices.currency_minor_unit,
  });
}

export function getCartItemLineTotal(item: WooCartItem) {
  return amountFromMinorUnit(item.totals.line_total, {
    currencyMinorUnit: item.totals.currency_minor_unit,
  });
}

export function getCartItemSize(item: WooCartItem) {
  const variationSize = item.variation?.map((entry) => entry.value).filter(Boolean).join(' / ');
  if (variationSize) {
    return variationSize;
  }

  const itemDataSize = item.item_data?.map((entry) => entry.value).filter(Boolean).join(' / ');
  if (itemDataSize) {
    return itemDataSize;
  }

  return item.sku || 'Exact fit available';
}

export function normalizeCartErrorCart(error: unknown) {
  const maybeError = error as RequestError;
  return maybeError?.responseData?.data?.cart as WooCartResponse | undefined;
}

export async function fetchStorefrontProducts() {
  return requestJson<StorefrontProductsResponse>(buildCustomEndpoint('products'));
}

export async function fetchStorefrontProduct(productRef: string) {
  return requestJson<StorefrontProductResponse>(buildCustomEndpoint(`products/${productRef}`));
}

export async function fetchPaymentMethods() {
  return requestJson<WooPaymentMethodsResponse>(buildCustomEndpoint('payment-methods'));
}

export async function fetchCart() {
  return requestJson<WooCartResponse>(buildStoreEndpoint('cart'));
}

export async function addCartItem(productId: number, quantity: number) {
  return requestJson<WooCartResponse>(buildStoreEndpoint('cart/add-item', { id: productId, quantity }), {
    method: 'POST',
    needsNonce: true,
  });
}

export async function removeCartItem(key: string) {
  return requestJson<WooCartResponse>(buildStoreEndpoint('cart/remove-item', { key }), {
    method: 'POST',
    needsNonce: true,
  });
}

export async function updateCartItem(key: string, quantity: number) {
  return requestJson<WooCartResponse>(buildStoreEndpoint('cart/update-item', { key, quantity }), {
    method: 'POST',
    needsNonce: true,
  });
}

export async function updateCartCustomer(payload: {
  billing_address?: Partial<WooAddress>;
  shipping_address?: Partial<WooAddress>;
}) {
  return requestJson<WooCartResponse>(buildStoreEndpoint('cart/update-customer'), {
    method: 'POST',
    body: JSON.stringify(payload),
    needsNonce: true,
  });
}

export async function selectCartShippingRate(packageId: number, rateId: string) {
  return requestJson<WooCartResponse>(buildStoreEndpoint('cart/select-shipping-rate', { package_id: packageId, rate_id: rateId }), {
    method: 'POST',
    needsNonce: true,
  });
}

export async function updateCheckoutDraft(payload: {
  payment_method?: string;
  order_notes?: string;
}) {
  return requestJson<any>(buildStoreEndpoint('checkout', { __experimental_calc_totals: 'false' }), {
    method: 'PUT',
    body: JSON.stringify(payload),
    needsNonce: true,
  });
}

export async function placeWooOrder(payload: {
  billing_address: WooAddress;
  shipping_address: WooAddress;
  customer_note?: string;
  payment_method: string;
  payment_data?: Array<{ key: string; value: string }>;
}) {
  return requestJson<WooCheckoutResponse>(buildStoreEndpoint('checkout'), {
    method: 'POST',
    body: JSON.stringify({
      ...payload,
      payment_data: payload.payment_data ?? [],
    }),
    needsNonce: true,
  });
}
