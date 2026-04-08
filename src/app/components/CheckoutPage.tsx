import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  CreditCard,
  Lock,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Truck,
  X,
} from 'lucide-react';

import { useCart } from './CartContext';
import { fetchPaymentMethods, updateCheckoutDraft, type WooAddress, type WooPaymentMethod } from '../lib/woocommerce';
import { formatCurrency, getFittingStationByValue, getWpRuntimeConfig } from '../lib/wordpress';

const CONTAINER = 'max-w-[1184px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-8 2xl:px-10';

type Step = 'cart' | 'details' | 'payment' | 'confirmation';
type CheckoutForm = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  address2: string;
  city: string;
  postcode: string;
  fittingStation: string;
};

const emptyForm: CheckoutForm = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  address2: '',
  city: '',
  postcode: '',
  fittingStation: '',
};

const toAddress = (form: CheckoutForm, useStationAddress: boolean): WooAddress => {
  const station = getFittingStationByValue(form.fittingStation);
  const baseAddress = useStationAddress && station
    ? {
        address_1: station.label,
        address_2: 'Fitting station delivery',
        city: station.city || form.city,
        postcode: station.postcode || form.postcode,
        company: station.label,
      }
    : {
        address_1: form.address,
        address_2: form.address2,
        city: form.city,
        postcode: form.postcode,
        company: '',
      };

  return {
    first_name: form.firstName,
    last_name: form.lastName,
    company: baseAddress.company,
    address_1: baseAddress.address_1,
    address_2: baseAddress.address_2,
    city: baseAddress.city,
    state: '',
    postcode: baseAddress.postcode,
    country: 'NZ',
    email: form.email,
    phone: form.phone,
  };
};

const buildOrderNote = (form: CheckoutForm) => {
  const station = getFittingStationByValue(form.fittingStation);
  return station ? `Preferred fitting station: ${station.label}` : '';
};

export const CheckoutPage = ({ onNavigate }: { onNavigate: (page: string, url?: string) => void }) => {
  const {
    items,
    removeItem,
    updateQty,
    totalPrice,
    totalItems,
    shippingTotal,
    taxTotal,
    grandTotal,
    cartLoading,
    cartError,
    checkoutLoading,
    checkoutError,
    cartData,
    billingAddress,
    shippingPackages,
    updateCustomer,
    selectShippingRate,
    placeOrder,
  } = useCart();
  const [step, setStep] = useState<Step>('cart');
  const [form, setForm] = useState<CheckoutForm>(emptyForm);
  const [paymentMethods, setPaymentMethods] = useState<WooPaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{ orderId: number; orderKey: string } | null>(null);

  useEffect(() => {
    if (!billingAddress) {
      return;
    }

    setForm((current) => ({
      ...current,
      email: current.email || billingAddress.email || '',
      firstName: current.firstName || billingAddress.first_name || '',
      lastName: current.lastName || billingAddress.last_name || '',
      phone: current.phone || billingAddress.phone || '',
      address: current.address || billingAddress.address_1 || '',
      address2: current.address2 || billingAddress.address_2 || '',
      city: current.city || billingAddress.city || '',
      postcode: current.postcode || billingAddress.postcode || '',
    }));
  }, [billingAddress]);

  useEffect(() => {
    fetchPaymentMethods().then((response) => {
      setPaymentMethods(response.methods);
      if (response.methods[0]) {
        setSelectedPaymentMethod(response.methods[0].id);
      }
    }).catch(() => {});
  }, []);

  const selectedGateway = useMemo(
    () => paymentMethods.find((method) => method.id === selectedPaymentMethod) || null,
    [paymentMethods, selectedPaymentMethod]
  );

  const shippingOptions = shippingPackages.flatMap((shippingPackage) =>
    shippingPackage.shipping_rates.map((rate) => ({
      packageId: shippingPackage.package_id,
      rateId: rate.rate_id,
      label: rate.name,
      selected: rate.selected,
      price: formatCurrency(Number(rate.price) / Math.pow(10, rate.currency_minor_unit || 2)),
    }))
  );

  const validateDetails = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      throw new Error('Please complete your contact details before continuing.');
    }

    if (!form.address || !form.city || !form.postcode) {
      throw new Error('Please complete the delivery address so WooCommerce can calculate shipping correctly.');
    }
  };

  const saveCustomerDetails = async () => {
    validateDetails();
    const billing = toAddress(form, false);
    const shipping = toAddress(form, form.fittingStation !== '');
    await updateCustomer({ billingAddress: billing, shippingAddress: shipping });
  };

  const handleContinueToPayment = async () => {
    setPaymentError(null);
    try {
      await saveCustomerDetails();
      setStep('payment');
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Unable to continue right now.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethod) {
      setPaymentError('Choose a payment method before placing your order.');
      return;
    }

    setPaymentError(null);

    try {
      const billing = toAddress(form, false);
      const shipping = toAddress(form, form.fittingStation !== '');
      const note = buildOrderNote(form);

      if (selectedGateway?.requiresNativeCheckout) {
        window.location.href = getWpRuntimeConfig().nativeCheckoutUrl;
        return;
      }

      await updateCheckoutDraft({
        payment_method: selectedPaymentMethod,
        order_notes: note,
      });

      const result = await placeOrder({
        billingAddress: billing,
        shippingAddress: shipping,
        paymentMethod: selectedPaymentMethod,
        customerNote: note,
      });

      if (result?.payment_result?.redirect_url) {
        window.location.href = result.payment_result.redirect_url;
        return;
      }

      if (result) {
        setConfirmation({ orderId: result.order_id, orderKey: result.order_key });
        setStep('confirmation');
      }
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Unable to place your order right now.');
    }
  };

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="bg-[#F9FAFB] min-h-screen">
        <div className="bg-[#132043] text-white">
          <div className={`${CONTAINER} py-6`}>
            <nav className="flex items-center gap-1.5 text-xs text-slate-400" aria-label="Breadcrumb">
              <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors font-medium">Home</button>
              <ChevronRight size={12} />
              <span className="text-white font-medium">Cart</span>
            </nav>
          </div>
        </div>
        <div className={`${CONTAINER} py-24`}>
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart size={32} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#132043] mb-3">Your cart is empty</h2>
            <p className="text-slate-500 mb-8 max-w-md">Looks like you haven't added any WooCommerce products yet.</p>
            <button onClick={() => onNavigate('store')} className="bg-[#FF5C00] hover:bg-[#E05200] text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-colors shadow-lg">
              Browse Tyres <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="bg-[#F9FAFB] min-h-screen">
        <div className="bg-[#132043] text-white">
          <div className={`${CONTAINER} py-6`}>
            <nav className="flex items-center gap-1.5 text-xs text-slate-400" aria-label="Breadcrumb">
              <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors font-medium">Home</button>
              <ChevronRight size={12} />
              <span className="text-white font-medium">Order Confirmed</span>
            </nav>
          </div>
        </div>
        <div className={`${CONTAINER} py-16`}>
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#132043] mb-3">Order Confirmed!</h1>
            <p className="text-slate-600 mb-2">WooCommerce created your order successfully.</p>
            <p className="text-2xl font-extrabold text-[#FF5C00] mb-6">#{confirmation?.orderId || '-'}</p>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-left mb-8">
              <h3 className="font-bold text-[#132043] mb-3">What happens next?</h3>
              <div className="space-y-3">
                {[
                  { icon: <CheckCircle size={16} className="text-green-600" />, text: 'Order confirmation recorded in WooCommerce' },
                  { icon: <Truck size={16} className="text-[#FF5C00]" />, text: 'Shipping and payment will continue through your configured store gateways' },
                  { icon: <MapPin size={16} className="text-[#FF5C00]" />, text: 'Your fitting-station preference was included in the order note when provided' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm text-slate-600">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => onNavigate('home')} className="bg-[#132043] text-white px-6 py-3 rounded-xl font-bold transition-colors hover:bg-[#0B132C]">
                Back to Home
              </button>
              <button onClick={() => onNavigate('store')} className="bg-[#FF5C00] hover:bg-[#E05200] text-white px-6 py-3 rounded-xl font-bold transition-colors">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const steps: { key: Step; label: string; num: number }[] = [
    { key: 'cart', label: 'Cart', num: 1 },
    { key: 'details', label: 'Details', num: 2 },
    { key: 'payment', label: 'Payment', num: 3 },
    { key: 'confirmation', label: 'Confirmation', num: 4 },
  ];
  const stepIndex = steps.findIndex((currentStep) => currentStep.key === step);

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      <div className="bg-[#132043] text-white">
        <div className={`${CONTAINER} py-6`}>
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-4" aria-label="Breadcrumb">
            <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors font-medium">Home</button>
            <ChevronRight size={12} />
            <span className="text-white font-medium">Checkout</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight">Checkout</h1>
        </div>
      </div>

      <div className="bg-white border-b border-slate-200">
        <div className={`${CONTAINER} py-4`}>
          <div className="flex items-center justify-center gap-0">
            {steps.map((currentStep, index) => (
              <React.Fragment key={currentStep.key}>
                <button
                  onClick={() => index < stepIndex && setStep(currentStep.key)}
                  disabled={index > stepIndex}
                  className={`flex items-center gap-2 ${index <= stepIndex ? 'text-[#132043]' : 'text-slate-300'} ${index < stepIndex ? 'cursor-pointer hover:text-[#FF5C00]' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    index < stepIndex ? 'bg-green-500 text-white' : index === stepIndex ? 'bg-[#FF5C00] text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {index < stepIndex ? <CheckCircle size={16} /> : currentStep.num}
                  </div>
                  <span className="text-sm font-bold hidden sm:inline">{currentStep.label}</span>
                </button>
                {index < steps.length - 1 && <div className={`w-12 sm:w-20 h-0.5 mx-2 ${index < stepIndex ? 'bg-green-500' : 'bg-slate-200'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className={`${CONTAINER} py-10`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 'cart' && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                  <h2 className="font-extrabold text-[#132043] text-lg">Your Cart ({totalItems} items)</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <div key={item.key || item.id} className="flex gap-4 p-6">
                      <div className="w-24 h-24 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#132043]">{item.name}</h3>
                        <p className="text-sm text-slate-500">{item.size}</p>
                        <p className="text-sm font-bold text-[#FF5C00] mt-1">{formatCurrency(item.price)} each</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button onClick={() => removeItem(item.key || item.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                          <X size={18} />
                        </button>
                        <div className="flex items-center border-2 border-slate-200 rounded-lg overflow-hidden">
                          <button onClick={() => updateQty(item.key || item.id, item.qty - 1)} className="px-2 py-1 hover:bg-slate-100 transition-colors">
                            <Minus size={14} />
                          </button>
                          <span className="px-3 py-1 font-bold text-sm text-[#132043] border-x-2 border-slate-200">{item.qty}</span>
                          <button onClick={() => updateQty(item.key || item.id, item.qty + 1)} className="px-2 py-1 hover:bg-slate-100 transition-colors">
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-lg font-extrabold text-[#132043]">{formatCurrency(item.price * item.qty)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between">
                  <button onClick={() => onNavigate('store')} className="text-sm font-bold text-[#132043] hover:text-[#FF5C00] flex items-center gap-1 transition-colors">
                    <ChevronRight size={14} className="rotate-180" /> Continue Shopping
                  </button>
                  <button onClick={() => setStep('details')} className="bg-[#FF5C00] hover:bg-[#E05200] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg">
                    Proceed to Details <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 'details' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <h2 className="font-extrabold text-[#132043] text-lg mb-6">Delivery Details</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-bold text-[#132043] mb-1.5">First Name</label><input type="text" value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FF5C00]" placeholder="John" /></div>
                    <div><label className="block text-sm font-bold text-[#132043] mb-1.5">Last Name</label><input type="text" value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FF5C00]" placeholder="Smith" /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-bold text-[#132043] mb-1.5">Email</label><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FF5C00]" placeholder="john@example.co.nz" /></div>
                    <div><label className="block text-sm font-bold text-[#132043] mb-1.5">Phone</label><input type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FF5C00]" placeholder="021 123 4567" /></div>
                  </div>

                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="font-bold text-[#132043] mb-4 flex items-center gap-2"><MapPin size={18} className="text-[#FF5C00]" /> Delivery Address</h3>
                    <div className="space-y-4">
                      <div><label className="block text-sm font-bold text-[#132043] mb-1.5">Street Address</label><input type="text" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FF5C00]" /></div>
                      <div><label className="block text-sm font-bold text-[#132043] mb-1.5">Address Line 2</label><input type="text" value={form.address2} onChange={(event) => setForm({ ...form, address2: event.target.value })} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FF5C00]" placeholder="Apartment, unit, or extra notes" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-bold text-[#132043] mb-1.5">City</label><input type="text" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FF5C00]" /></div>
                        <div><label className="block text-sm font-bold text-[#132043] mb-1.5">Postcode</label><input type="text" value={form.postcode} onChange={(event) => setForm({ ...form, postcode: event.target.value })} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FF5C00]" /></div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="font-bold text-[#132043] mb-4 flex items-center gap-2"><MapPin size={18} className="text-[#FF5C00]" /> Preferred Fitting Station</h3>
                    <div className="bg-[#FF5C00]/5 border border-[#FF5C00]/20 rounded-xl p-4 mb-4">
                      <p className="text-sm text-[#132043]"><strong>Optional:</strong> If you want delivery coordinated with a fitting station, choose one below and we'll include it in the WooCommerce order note.</p>
                    </div>
                    <select value={form.fittingStation} onChange={(event) => setForm({ ...form, fittingStation: event.target.value })} className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FF5C00] bg-white">
                      <option value="">No fitting station selected</option>
                      {getWpRuntimeConfig().fittingStations.map((station) => <option key={station.value} value={station.value}>{station.label}</option>)}
                    </select>
                  </div>

                  {shippingOptions.length > 0 && (
                    <div className="border-t border-slate-200 pt-6">
                      <h3 className="font-bold text-[#132043] mb-4 flex items-center gap-2"><Truck size={18} className="text-[#FF5C00]" /> Shipping Method</h3>
                      <div className="space-y-3">
                        {shippingOptions.map((option) => (
                          <button key={`${option.packageId}-${option.rateId}`} onClick={() => selectShippingRate(option.packageId, option.rateId)} className={`w-full flex items-center justify-between rounded-xl border px-4 py-4 text-left transition-colors ${option.selected ? 'border-[#FF5C00] bg-[#FF5C00]/5' : 'border-slate-200 hover:border-[#FF5C00]/40'}`}>
                            <div><p className="font-bold text-[#132043]">{option.label}</p><p className="text-sm text-slate-500">WooCommerce live shipping rate</p></div>
                            <div className="font-bold text-[#132043]">{option.price}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {(paymentError || checkoutError) && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{paymentError || checkoutError}</div>}
                <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                  <button onClick={() => setStep('cart')} className="text-sm font-bold text-slate-600 hover:text-[#132043] flex items-center gap-1"><ChevronRight size={14} className="rotate-180" /> Back to Cart</button>
                  <button onClick={handleContinueToPayment} className="bg-[#FF5C00] hover:bg-[#E05200] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg">
                    Continue to Payment <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <h2 className="font-extrabold text-[#132043] text-lg mb-6 flex items-center gap-2"><CreditCard size={20} className="text-[#FF5C00]" /> Payment Details</h2>
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-6"><Lock size={14} className="text-green-600" /><span className="text-xs font-bold text-green-700">WooCommerce will process payment using your configured gateways.</span></div>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button key={method.id} onClick={() => setSelectedPaymentMethod(method.id)} className={`w-full rounded-xl border px-4 py-4 text-left transition-colors ${selectedPaymentMethod === method.id ? 'border-[#FF5C00] bg-[#FF5C00]/5' : 'border-slate-200 hover:border-[#FF5C00]/40'}`}>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-[#132043]">{method.title}</p>
                          <p className="text-sm text-slate-500">{method.description || 'Configured in WooCommerce.'}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${selectedPaymentMethod === method.id ? 'border-[#FF5C00] bg-[#FF5C00]' : 'border-slate-300'}`} />
                      </div>
                    </button>
                  ))}
                </div>
                {(paymentError || checkoutError) && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{paymentError || checkoutError}</div>}
                <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                  <button onClick={() => setStep('details')} className="text-sm font-bold text-slate-600 hover:text-[#132043] flex items-center gap-1"><ChevronRight size={14} className="rotate-180" /> Back</button>
                  <button onClick={handlePlaceOrder} className="bg-[#FF5C00] hover:bg-[#E05200] text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-colors shadow-lg" disabled={checkoutLoading}>
                    <Lock size={18} /> {selectedGateway?.requiresNativeCheckout ? 'Continue to Secure Payment' : `Pay ${formatCurrency(grandTotal)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-[140px]">
              <h3 className="font-extrabold text-[#132043] text-lg mb-4">Order Summary</h3>
              {cartError && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">{cartError}</div>}
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.key || item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#132043] truncate">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.qty}</p>
                    </div>
                    <span className="text-sm font-bold text-[#132043]">{formatCurrency(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><span className="font-bold text-[#132043]">{formatCurrency(totalPrice)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Shipping</span><span className="font-bold text-[#132043]">{formatCurrency(shippingTotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Tax</span><span className="font-bold text-[#132043]">{formatCurrency(taxTotal)}</span></div>
                <div className="flex justify-between pt-3 border-t border-slate-200"><span className="font-extrabold text-[#132043]">Total</span><span className="text-2xl font-extrabold text-[#132043]">{formatCurrency(grandTotal)}</span></div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { icon: <ShieldCheck size={14} className="text-[#FF5C00]" />, label: 'Woo\nSession' },
                  { icon: <Truck size={14} className="text-[#FF5C00]" />, label: 'Live\nShipping' },
                  { icon: <Lock size={14} className="text-[#FF5C00]" />, label: 'Secure\nCheckout' },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center text-center bg-slate-50 rounded-lg p-2">
                    {item.icon}
                    <span className="text-[10px] font-bold text-slate-500 mt-1 whitespace-pre-line leading-tight">{item.label}</span>
                  </div>
                ))}
              </div>
              {(cartLoading || checkoutLoading) && <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">Syncing WooCommerce session...</div>}
              {cartData && <div className="mt-4 text-xs text-slate-400">Woo session synced for {cartData.items_count} item(s).</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
