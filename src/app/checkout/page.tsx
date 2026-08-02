'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/components/CartContext';
import {
  ShoppingBag,
  ChevronRight,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  CreditCard,
  Shield,
  Truck,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Package,
  Lock,
} from 'lucide-react';

// -- Types ---------------------------------------------------------------------
interface FormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  streetAddress: string;
  apartment: string;
  postalCode: string;
  paymentMethod: string;
  notes: string;
}

interface FormErrors {
  [key: string]: string;
}

const INITIAL_FORM: FormData = {
  fullName: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  streetAddress: '',
  apartment: '',
  postalCode: '',
  paymentMethod: 'pay_on_delivery',
  notes: '',
};

const COUNTRIES = [
  'Ireland', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy',
  'Netherlands', 'Belgium', 'Portugal', 'Austria', 'Switzerland',
  'United States', 'Canada', 'Australia', 'Japan', 'Other',
];

const inputBase = 'w-full px-4 py-3 rounded-xl border text-sm text-[#0B132B] placeholder-gray-400 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500';
const inputNormal = `${inputBase} border-gray-200 hover:border-gray-300`;
const inputError = `${inputBase} border-red-400 bg-red-50/50 focus:ring-red-400/30 focus:border-red-400`;

function getInputClass(hasError: boolean) {
  return hasError ? inputError : inputNormal;
}

// -- Field wrapper -------------------------------------------------------------
function Field({
  label, id, icon: Icon, error, required, children,
}: {
  label: string; id: string; icon: React.ElementType;
  error?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-semibold text-[#0B132B]">
        <Icon className="w-3.5 h-3.5 text-emerald-500" />
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 font-medium" role="alert">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// -- Main ----------------------------------------------------------------------
export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (items.length === 0) router.push('/shop');
  }, [items, router]);

  const shipping = totalPrice >= 100 ? 0 : 9.99;
  const grandTotal = totalPrice + shipping;

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    else if (form.fullName.trim().length < 2) e.fullName = 'Name must be at least 2 characters';
    if (!form.email.trim()) e.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^[\+\d\s\-\(\)]{7,20}$/.test(form.phone)) e.phone = 'Please enter a valid phone number';
    if (!form.country) e.country = 'Please select your country';
    if (!form.city.trim()) e.city = 'City / town is required';
    if (!form.streetAddress.trim()) e.streetAddress = 'Street address is required';
    if (!form.postalCode.trim()) e.postalCode = 'Postal / ZIP code is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      document.querySelector('[role="alert"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (step === 1) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSubmitting(true);
    const orderLines = items
      .map((i) => `  - ${i.name} x${i.quantity} -- EUR ${(i.price * i.quantity).toFixed(2)}`)
      .join('\n');
    const payLabel = form.paymentMethod === 'pay_on_delivery' ? 'Pay on Delivery' : 'Bank Transfer';
    const parts = [
      'NEW ORDER - Elite TCG Vault',
      '',
      'Customer Details',
      `  Name: ${form.fullName}`,
      `  Email: ${form.email}`,
      `  Phone: ${form.phone}`,
      '',
      'Delivery Address',
      `  Country: ${form.country}`,
      `  City: ${form.city}`,
      `  Address: ${form.streetAddress}${form.apartment ? `, ${form.apartment}` : ''}`,
      `  Postal Code: ${form.postalCode}`,
      '',
      'Order Items',
      orderLines,
      '',
      `Subtotal: EUR ${totalPrice.toFixed(2)}`,
      `Shipping: ${shipping === 0 ? 'FREE' : 'EUR ' + shipping.toFixed(2)}`,
      `Grand Total: EUR ${grandTotal.toFixed(2)}`,
      '',
      `Payment Method: ${payLabel}`,
      form.notes ? `\nNotes: ${form.notes}` : '',
      '',
      "Thank you! We'll confirm your order shortly.",
    ];
    const message = parts.join('\n').trim();
    const waNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '673008952';
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(message)}`, '_blank');
    clearCart();
    router.push('/checkout/success');
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#FCF9F2]">
      {/* Header */}
      <header className="bg-[#0B132B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-[#FFC800] bg-clip-text text-transparent">
            Elite TCG Vault
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            Secure Checkout
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 1 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
              </div>
              <span className={`text-sm font-semibold hidden sm:block ${step === 1 ? 'text-[#0B132B]' : 'text-gray-400'}`}>Your Details</span>
            </div>
            <div className={`flex-1 h-0.5 rounded transition-all ${step >= 2 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 2 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <span className={`text-sm font-semibold hidden sm:block ${step === 2 ? 'text-[#0B132B]' : 'text-gray-400'}`}>Review & Place Order</span>
            </div>
            <div className="flex-1 h-0.5 rounded bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-gray-200 text-gray-400">3</div>
              <span className="text-sm font-semibold text-gray-400 hidden sm:block">Confirmed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">

          {/* LEFT: Form */}
          <div className="lg:col-span-3">
            {step === 1 ? (
              <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0B132B] mb-6 transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to cart
              </button>
            ) : (
              <button onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0B132B] mb-6 transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Edit details
              </button>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {step === 1 && (
                <>
                  {/* Contact */}
                  <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                    <h2 className="text-base font-bold text-[#0B132B] mb-5 flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-500" />
                      Contact Details
                    </h2>
                    <div className="space-y-4">
                      <Field label="Full Name" id="fullName" icon={User} error={errors.fullName} required>
                        <input id="fullName" type="text" autoComplete="name" placeholder="John Smith"
                          value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)}
                          className={getInputClass(!!errors.fullName)} />
                      </Field>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Email Address" id="email" icon={Mail} error={errors.email} required>
                          <input id="email" type="email" autoComplete="email" placeholder="john@example.com"
                            value={form.email} onChange={(e) => handleChange('email', e.target.value)}
                            className={getInputClass(!!errors.email)} />
                        </Field>
                        <Field label="Phone / Tel" id="phone" icon={Phone} error={errors.phone} required>
                          <input id="phone" type="tel" autoComplete="tel" placeholder="+353 87 123 4567"
                            value={form.phone} onChange={(e) => handleChange('phone', e.target.value)}
                            className={getInputClass(!!errors.phone)} />
                        </Field>
                      </div>
                    </div>
                  </section>

                  {/* Address */}
                  <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                    <h2 className="text-base font-bold text-[#0B132B] mb-5 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      Delivery Address
                    </h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Country" id="country" icon={MapPin} error={errors.country} required>
                          <select id="country" value={form.country} onChange={(e) => handleChange('country', e.target.value)}
                            className={getInputClass(!!errors.country) + ' appearance-none cursor-pointer'}>
                            <option value="">Select country...</option>
                            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </Field>
                        <Field label="City / Town" id="city" icon={MapPin} error={errors.city} required>
                          <input id="city" type="text" autoComplete="address-level2" placeholder="Dublin"
                            value={form.city} onChange={(e) => handleChange('city', e.target.value)}
                            className={getInputClass(!!errors.city)} />
                        </Field>
                      </div>
                      <Field label="Street Address" id="streetAddress" icon={MapPin} error={errors.streetAddress} required>
                        <input id="streetAddress" type="text" autoComplete="street-address" placeholder="12 Oak Street"
                          value={form.streetAddress} onChange={(e) => handleChange('streetAddress', e.target.value)}
                          className={getInputClass(!!errors.streetAddress)} />
                      </Field>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Apartment / Suite" id="apartment" icon={MapPin}>
                          <input id="apartment" type="text" placeholder="Apt 3A (optional)"
                            value={form.apartment} onChange={(e) => handleChange('apartment', e.target.value)}
                            className={getInputClass(false)} />
                        </Field>
                        <Field label="Postal / ZIP Code" id="postalCode" icon={MapPin} error={errors.postalCode} required>
                          <input id="postalCode" type="text" autoComplete="postal-code" placeholder="D01 AB12"
                            value={form.postalCode} onChange={(e) => handleChange('postalCode', e.target.value)}
                            className={getInputClass(!!errors.postalCode)} />
                        </Field>
                      </div>
                    </div>
                  </section>

                  {/* Payment */}
                  <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                    <h2 className="text-base font-bold text-[#0B132B] mb-5 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-500" />
                      Payment Method
                    </h2>
                    <div className="space-y-3">
                      {[
                        { value: 'pay_on_delivery', label: 'Pay on Delivery', desc: 'Pay in cash when your order arrives', icon: '??' },
                        { value: 'bank_transfer', label: 'Bank Transfer', desc: 'Transfer payment directly to our account', icon: '??' },
                      ].map(({ value, label, desc, icon }) => (
                        <label key={value} htmlFor={`pay-${value}`}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            form.paymentMethod === value ? 'border-emerald-500 bg-emerald-50/60' : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}>
                          <input type="radio" id={`pay-${value}`} name="paymentMethod" value={value}
                            checked={form.paymentMethod === value}
                            onChange={() => handleChange('paymentMethod', value)} className="sr-only" />
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${form.paymentMethod === value ? 'border-emerald-500' : 'border-gray-300'}`}>
                            {form.paymentMethod === value && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                          </div>
                          <span className="text-xl">{icon}</span>
                          <div>
                            <p className="font-semibold text-sm text-[#0B132B]">{label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </section>

                  {/* Notes */}
                  <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
                    <h2 className="text-base font-bold text-[#0B132B] mb-5 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-500" />
                      Order Notes
                      <span className="text-xs font-normal text-gray-400 ml-1">(optional)</span>
                    </h2>
                    <textarea id="notes" rows={3}
                      placeholder="Any special instructions for your delivery? e.g. Leave at door if no answer..."
                      value={form.notes} onChange={(e) => handleChange('notes', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#0B132B] placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 hover:border-gray-300 transition-all resize-none" />
                  </section>

                  <button type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-base shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/35">
                    Review Order
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                    <h2 className="text-base font-bold text-[#0B132B] mb-5">Review Your Details</h2>
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact</p>
                        <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-sm">
                          <p className="font-semibold text-[#0B132B]">{form.fullName}</p>
                          <p className="text-gray-600">{form.email}</p>
                          <p className="text-gray-600">{form.phone}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery Address</p>
                        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-0.5">
                          <p>{form.streetAddress}{form.apartment ? `, ${form.apartment}` : ''}</p>
                          <p>{form.city}, {form.postalCode}</p>
                          <p>{form.country}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment</p>
                        <div className="bg-gray-50 rounded-xl p-4 text-sm font-semibold text-[#0B132B]">
                          {form.paymentMethod === 'pay_on_delivery' ? '?? Pay on Delivery' : '?? Bank Transfer'}
                        </div>
                      </div>
                      {form.notes && (
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
                          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 italic">"{form.notes}"</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-sm text-green-800">
                    <span className="text-xl flex-shrink-0">??</span>
                    <p>Clicking <strong>"Place Order"</strong> will open WhatsApp with your complete order details pre-filled. We will confirm your order and arrange payment from there.</p>
                  </div>

                  <button type="submit" disabled={submitting}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-base shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/35">
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Placing order...
                      </>
                    ) : (
                      <><span>??</span> Place Order via WhatsApp</>
                    )}
                  </button>
                </>
              )}
            </form>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-[#0B132B] px-6 py-4 flex items-center justify-between">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    Order Summary
                  </h3>
                  <span className="text-xs font-semibold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                    {items.reduce((s, i) => s + i.quantity, 0)} items
                  </span>
                </div>
                <div className="p-4 space-y-3 border-b border-gray-100 max-h-72 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="w-14 h-14 rounded-lg border border-gray-100 overflow-hidden bg-gray-50 flex-shrink-0">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0B132B] line-clamp-2 leading-tight">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-emerald-600 flex-shrink-0">
                        EUR {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-4 space-y-2.5">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">EUR {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Shipping</span>
                    <span className={`font-semibold ${shipping === 0 ? 'text-emerald-600' : ''}`}>
                      {shipping === 0 ? 'FREE' : `EUR ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping > 0 && <p className="text-xs text-gray-400 italic">Free shipping on orders over EUR 100</p>}
                  <div className="border-t border-gray-100 pt-2.5 flex justify-between items-center">
                    <span className="font-bold text-[#0B132B]">Total</span>
                    <span className="text-xl font-bold text-emerald-600">EUR {grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { icon: Shield, label: 'Secure Checkout' },
                  { icon: CheckCircle, label: '100% Authentic' },
                  { icon: Truck, label: 'Fast Dispatch' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col items-center gap-1.5 text-center shadow-sm">
                    <Icon className="w-4 h-4 text-emerald-500" />
                    <p className="text-xs font-semibold text-gray-600 leading-tight">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
