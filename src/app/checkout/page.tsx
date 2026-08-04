'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Shield,
  Truck,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Package,
  Lock,
  Copy,
  Check,
  Bitcoin,
  RefreshCw,
  ExternalLink,
  CreditCard,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface FormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  streetAddress: string;
  apartment: string;
  postalCode: string;
  paymentMethod: 'bitcoin' | 'bank_transfer';
  notes: string;
}
interface FormErrors { [key: string]: string; }

const INITIAL_FORM: FormData = {
  fullName: '', email: '', phone: '', country: '',
  city: '', streetAddress: '', apartment: '', postalCode: '',
  paymentMethod: 'bitcoin', notes: '',
};

const COUNTRIES = [
  'Ireland', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy',
  'Netherlands', 'Belgium', 'Portugal', 'Austria', 'Switzerland',
  'United States', 'Canada', 'Australia', 'Japan', 'Other',
];

const inputBase = 'w-full px-4 py-3 rounded-xl border text-sm text-[#0B132B] placeholder-gray-400 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500';
const inputNormal = `${inputBase} border-gray-200 hover:border-gray-300`;
const inputError  = `${inputBase} border-red-400 bg-red-50/50 focus:ring-red-400/30 focus:border-red-400`;
const getInputClass = (e: boolean) => e ? inputError : inputNormal;

// ── Field wrapper ──────────────────────────────────────────────────────────────
function Field({ label, id, icon: Icon, error, required, children }: {
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
          <AlertCircle className="w-3 h-3 flex-shrink-0" />{error}
        </p>
      )}
    </div>
  );
}

// ── BTC Payment Panel ──────────────────────────────────────────────────────────
function BtcPaymentPanel({
  grandTotal, btcAddress, onConfirm, submitting,
}: {
  grandTotal: number;
  btcAddress: string;
  onConfirm: () => void;
  submitting: boolean;
}) {
  const [btcRate, setBtcRate] = useState<number | null>(null);
  const [rateLoading, setRateLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchRate = useCallback(async () => {
    setRateLoading(true);
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur');
      const data = await res.json();
      setBtcRate(data?.bitcoin?.eur ?? null);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      setBtcRate(null);
    } finally {
      setRateLoading(false);
    }
  }, []);

  useEffect(() => { fetchRate(); }, [fetchRate]);

  const btcAmount = btcRate ? (grandTotal / btcRate) : null;
  const bitcoinUri = btcAmount
    ? `bitcoin:${btcAddress}?amount=${btcAmount.toFixed(8)}&label=Elite+TCG+Vault`
    : `bitcoin:${btcAddress}&label=Elite+TCG+Vault`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(bitcoinUri)}&bgcolor=ffffff&color=0B132B&margin=10`;

  const copyAddress = async () => {
    await navigator.clipboard.writeText(btcAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#F7931A]/10 to-[#F7931A]/5 border border-[#F7931A]/30 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-[#F7931A] rounded-full flex items-center justify-center flex-shrink-0">
            <Bitcoin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-[#0B132B] text-base">Pay with Bitcoin (BTC)</h2>
            <p className="text-xs text-gray-500">Send the exact BTC amount to the address below</p>
          </div>
        </div>

        {/* BTC Amount */}
        <div className="bg-white rounded-xl p-4 border border-[#F7931A]/20">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Amount to Send</p>
          {rateLoading ? (
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-[#F7931A] rounded-full animate-spin" />
              <span className="text-sm">Fetching live BTC rate...</span>
            </div>
          ) : btcAmount ? (
            <div>
              <p className="text-2xl font-bold text-[#0B132B]">
                ₿ {btcAmount.toFixed(8)}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                ≈ ${grandTotal.toFixed(2)} &nbsp;·&nbsp; 1 BTC = ${btcRate?.toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-xs text-gray-400">Rate updated: {lastUpdated}</span>
                <button onClick={fetchRate} className="text-[#F7931A] hover:text-[#e07d0e] transition-colors" title="Refresh rate">
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-red-500 mb-1">Could not fetch live rate</p>
              <p className="text-xs text-gray-500">Please check the current rate and send the equivalent of <strong>${grandTotal.toFixed(2)}</strong></p>
              <button onClick={fetchRate} className="mt-2 flex items-center gap-1 text-xs text-[#F7931A] hover:underline">
                <RefreshCw className="w-3 h-3" /> Retry
              </button>
            </div>
          )}
        </div>
      </div>

      {/* QR Code + Address */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Scan QR or Copy Address</p>
        <div className="flex flex-col sm:flex-row gap-5 items-center">
          {/* QR Code */}
          <div className="flex-shrink-0 w-[140px] h-[140px] rounded-xl overflow-hidden border-2 border-[#F7931A]/30 bg-white p-1">
            <img
              src={qrUrl}
              alt="Bitcoin payment QR code"
              className="w-full h-full object-contain"
            />
          </div>
          {/* Address */}
          <div className="flex-1 w-full space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1.5 font-medium">BTC Wallet Address</p>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-200 px-3 py-2.5">
                <code className="text-xs text-[#0B132B] break-all flex-1 font-mono leading-relaxed">
                  {btcAddress}
                </code>
                <button
                  onClick={copyAddress}
                  className={`flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
                    copied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#F7931A] text-white hover:bg-[#e07d0e]'
                  }`}
                >
                  {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                </button>
              </div>
            </div>
            <a
              href={bitcoinUri}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F7931A] hover:text-[#e07d0e] transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Open in Bitcoin wallet app
            </a>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2 text-sm text-amber-800">
        <p className="font-bold flex items-center gap-1.5">⚠️ Important Instructions</p>
        <ol className="list-decimal list-inside space-y-1 text-xs text-amber-700">
          <li>Send <strong>exactly the BTC amount shown above</strong> (or the ${grandTotal.toFixed(2)} equivalent).</li>
          <li>Only send <strong>Bitcoin (BTC)</strong> — do not send BCH, BSV or other coins.</li>
          <li>After sending, click <strong>"I've Sent the Payment"</strong> below to confirm your order via WhatsApp.</li>
          <li>Your order is shipped once we confirm receipt on the blockchain.</li>
        </ol>
      </div>

      {/* CTA */}
      <button
        onClick={onConfirm}
        disabled={submitting}
        className="w-full bg-[#25D366] hover:bg-[#20b857] active:scale-[0.98] disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-base shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30"
      >
        {submitting ? (
          <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
        ) : (
          <>✅ I've Sent the Payment — Confirm via WhatsApp</>
        )}
      </button>
    </div>
  );
}

// ── Order Summary sidebar ──────────────────────────────────────────────────────
function OrderSummary({ items, totalPrice, shipping, grandTotal }: {
  items: any[]; totalPrice: number; shipping: number; grandTotal: number;
}) {
  return (
    <div className="sticky top-6 space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-[#0B132B] px-6 py-4 flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />Order Summary
          </h3>
          <span className="text-xs font-semibold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
            {items.reduce((s: number, i: any) => s + i.quantity, 0)} items
          </span>
        </div>
        <div className="p-4 space-y-3 border-b border-gray-100 max-h-72 overflow-y-auto">
          {items.map((item: any) => (
            <div key={item.id} className="flex gap-3 items-center">
              <div className="w-14 h-14 rounded-lg border border-gray-100 overflow-hidden bg-gray-50 flex-shrink-0">
                {item.imageUrl
                  ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-gray-300" /></div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0B132B] line-clamp-2 leading-tight">{item.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-emerald-600 flex-shrink-0">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="p-4 space-y-2.5">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="font-semibold">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Shipping (10%)</span>
            <span className="font-semibold">${shipping.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-100 pt-2.5 flex justify-between items-center">
            <span className="font-bold text-[#0B132B]">Total</span>
            <span className="text-xl font-bold text-emerald-600">${grandTotal.toFixed(2)}</span>
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
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const btcAddress = process.env.NEXT_PUBLIC_BTC_ADDRESS || '1jeZk1oZ1H2bRAePCEBm6QJdcxitcEN63';

  useEffect(() => {
    if (items.length === 0) router.push('/shop');
  }, [items, router]);

  const shipping = totalPrice * 0.10; // 10% of subtotal
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

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      document.querySelector('[role="alert"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmPayment = () => {
    setSubmitting(true);
    const orderLines = items
      .map((i) => `  - ${i.name} x${i.quantity} -- $${(i.price * i.quantity).toFixed(2)}`)
      .join('\n');
    const isBtc = form.paymentMethod === 'bitcoin';
    const header = isBtc
      ? '🪙 NEW BITCOIN ORDER — Elite TCG Vault'
      : '🏦 NEW BANK TRANSFER ORDER — Elite TCG Vault';
    const paymentLines = isBtc
      ? ['💰 Payment Method: Bitcoin (BTC)', `  BTC Address: ${btcAddress}`, '', 'I have sent the Bitcoin payment. Please confirm receipt and process my order. Thank you!']
      : ['🏦 Payment Method: Bank Transfer', '', 'Please send me your bank account details so I can complete the transfer. Thank you!'];
    const parts = [
      header,
      '',
      '👤 Customer Details',
      `  Name: ${form.fullName}`,
      `  Email: ${form.email}`,
      `  Phone: ${form.phone}`,
      '',
      '📦 Delivery Address',
      `  Country: ${form.country}`,
      `  City: ${form.city}`,
      `  Address: ${form.streetAddress}${form.apartment ? `, ${form.apartment}` : ''}`,
      `  Postal Code: ${form.postalCode}`,
      '',
      '🛒 Order Items',
      orderLines,
      '',
      `Subtotal: $${totalPrice.toFixed(2)}`,
      `Shipping (10%): $${shipping.toFixed(2)}`,
      `Grand Total: $${grandTotal.toFixed(2)}`,
      '',
      ...paymentLines,
      form.notes ? `\n📝 Notes: ${form.notes}` : '',
    ].filter(Boolean);
    const message = parts.join('\n').trim();
    const waNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '673008952';
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(message)}`, '_blank');
    clearCart();
    router.push('/checkout/success');
  };

  if (items.length === 0) return null;

  const stepLabels = ['Your Details', 'Review & Pay', 'Confirmed'];

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
            Secure Crypto Checkout
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            {stepLabels.map((label, i) => {
              const n = i + 1;
              const active = step >= n;
              const done = step > n;
              return (
                <div key={label} className="flex items-center gap-3 flex-1 last:flex-none">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${active ? 'bg-[#F7931A] text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {done ? <CheckCircle className="w-4 h-4" /> : n}
                    </div>
                    <span className={`text-sm font-semibold hidden sm:block ${step === n ? 'text-[#0B132B]' : 'text-gray-400'}`}>{label}</span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div className={`flex-1 h-0.5 rounded transition-all ${active ? 'bg-[#F7931A]' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">

          {/* LEFT */}
          <div className="lg:col-span-3">
            {step === 1 ? (
              <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0B132B] mb-6 transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />Back to cart
              </button>
            ) : (
              <button onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0B132B] mb-6 transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />Edit details
              </button>
            )}

            {/* STEP 1 — Details form */}
            {step === 1 && (
              <form onSubmit={handleStep1Submit} noValidate>
                {/* Contact */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                  <h2 className="text-base font-bold text-[#0B132B] mb-5 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-500" />Contact Details
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
                    <MapPin className="w-4 h-4 text-emerald-500" />Delivery Address
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

                {/* Payment Method */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                  <h2 className="text-base font-bold text-[#0B132B] mb-5 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-500" />Payment Method
                  </h2>
                  <div className="space-y-3">
                    {([
                      { value: 'bitcoin' as const, icon: '₿', label: 'Bitcoin (BTC)', desc: 'Pay with crypto — scan a QR code or copy wallet address', accent: 'border-[#F7931A] bg-[#F7931A]/5', dot: 'border-[#F7931A] bg-[#F7931A]' },
                      { value: 'bank_transfer' as const, icon: '🏦', label: 'Bank Transfer', desc: 'Transfer directly — we\'ll send our bank details via WhatsApp', accent: 'border-emerald-500 bg-emerald-50/60', dot: 'border-emerald-500 bg-emerald-500' },
                    ]).map(({ value, icon, label, desc, accent, dot }) => (
                      <label key={value} htmlFor={`pay-${value}`}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          form.paymentMethod === value ? accent : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}>
                        <input type="radio" id={`pay-${value}`} name="paymentMethod" value={value}
                          checked={form.paymentMethod === value}
                          onChange={() => handleChange('paymentMethod', value)} className="sr-only" />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          form.paymentMethod === value ? dot : 'border-gray-300'
                        }`}>
                          {form.paymentMethod === value && <div className="w-2 h-2 rounded-full bg-white" />}
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
                    placeholder="Any special instructions for your delivery?"
                    value={form.notes} onChange={(e) => handleChange('notes', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#0B132B] placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 hover:border-gray-300 transition-all resize-none" />
                </section>

                <button type="submit"
                  className="w-full bg-[#0B132B] hover:bg-[#0B132B]/90 active:scale-[0.98] text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-base shadow-lg shadow-[#0B132B]/20 hover:shadow-xl">
                  Review & Pay
                  <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            )}

            {/* STEP 2 — Payment */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Review summary */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-base font-bold text-[#0B132B] mb-4">Your Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact</p>
                      <div className="bg-gray-50 rounded-xl p-3 space-y-0.5 text-sm">
                        <p className="font-semibold text-[#0B132B]">{form.fullName}</p>
                        <p className="text-gray-600">{form.email}</p>
                        <p className="text-gray-600">{form.phone}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery</p>
                      <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 space-y-0.5">
                        <p>{form.streetAddress}{form.apartment ? `, ${form.apartment}` : ''}</p>
                        <p>{form.city}, {form.postalCode}</p>
                        <p>{form.country}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                      form.paymentMethod === 'bitcoin'
                        ? 'bg-[#F7931A]/10 text-[#a05c00]'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {form.paymentMethod === 'bitcoin' ? '₿ Bitcoin (BTC)' : '🏦 Bank Transfer'}
                    </div>
                  </div>
                </div>

                {/* Bitcoin payment panel */}
                {form.paymentMethod === 'bitcoin' && (
                  <BtcPaymentPanel
                    grandTotal={grandTotal}
                    btcAddress={btcAddress}
                    onConfirm={handleConfirmPayment}
                    submitting={submitting}
                  />
                )}

                {/* Bank Transfer panel */}
                {form.paymentMethod === 'bank_transfer' && (
                  <div className="space-y-5">
                    <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-200 rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-lg">🏦</span>
                        </div>
                        <div>
                          <h2 className="font-bold text-[#0B132B] text-base">Bank Transfer</h2>
                          <p className="text-xs text-gray-500">Our bank details will be sent to you via WhatsApp</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-emerald-100 space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold mt-0.5">1.</span>
                          <p className="text-gray-700">Click <strong>"Confirm Order via WhatsApp"</strong> below.</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold mt-0.5">2.</span>
                          <p className="text-gray-700">We'll reply with our <strong>bank account details</strong> (IBAN / sort code).</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold mt-0.5">3.</span>
                          <p className="text-gray-700">Complete your transfer for <strong>${grandTotal.toFixed(2)}</strong> and send us the payment reference.</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold mt-0.5">4.</span>
                          <p className="text-gray-700">Your order ships once payment clears.</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleConfirmPayment}
                      disabled={submitting}
                      className="w-full bg-[#25D366] hover:bg-[#20b857] active:scale-[0.98] disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-base shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30"
                    >
                      {submitting
                        ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                        : <>✅ Confirm Order via WhatsApp</>
                      }
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT — Order summary */}
          <div className="lg:col-span-2">
            <OrderSummary
              items={items}
              totalPrice={totalPrice}
              shipping={shipping}
              grandTotal={grandTotal}
            />
          </div>

        </div>
      </main>
    </div>
  );
}
