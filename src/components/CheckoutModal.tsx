import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';
import { X, CheckCircle2, Lock, CreditCard, Printer } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    cartSubtotal,
    formatPrice,
    placeOrder,
    currency,
    currentUser,
    showToast,
  } = useShop();

  if (!isOpen) return null;

  // Form inputs - auto prefilled from client account
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'invoice'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');

  // Completed order receipt
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const shippingCost = shippingMethod === 'express' ? 35 : (cartSubtotal >= 250 ? 0 : 15);
  const totalCost = cartSubtotal + shippingCost;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !address || !city) {
      showToast('Please complete all delivery address fields to dispatch your order.', 'info');
      return;
    }

    const order = placeOrder({
      items: [...cart],
      subtotal: cartSubtotal,
      discount: 0,
      shipping: shippingCost,
      total: totalCost,
      currency,
      customer: {
        fullName,
        email,
        address,
        city,
        postalCode,
        country,
      },
      shippingMethod: shippingMethod === 'express' ? 'Priority Express Air Courier' : 'Standard Atelier Courier',
    });

    setCompletedOrder(order);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/40 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        id="checkout-modal"
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-xs">
              <Lock className="w-4 h-4 text-pink-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-gray-900">
                Atelier Direct Purchase & Checkout
              </h2>
              <p className="text-[11px] text-gray-400">
                Secure 256-bit encrypted checkout with complimentary return guarantee
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          {completedOrder ? (
            /* Order confirmation receipt */
            <div className="py-4 text-center space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider mb-2 border border-pink-200">
                  Order Dispatched To Atelier • #{completedOrder.id}
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
                  Thank You for Your Order, {completedOrder.customer.fullName}
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                  Your garments have been assigned to our master packaging team. A confirmation email and tracking link have been dispatched to <strong className="text-gray-900">{completedOrder.customer.email}</strong>.
                </p>
              </div>

              {/* Receipt card */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 text-left max-w-lg mx-auto text-xs space-y-3 print:border-none">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Courier Tracking Reference:</span>
                  <span className="font-mono font-bold text-pink-600">{completedOrder.trackingNumber}</span>
                </div>

                <div className="space-y-2 py-1">
                  {completedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div>
                        <strong className="text-gray-800">{item.product.name}</strong>
                        <span className="text-gray-500 text-[11px] block">
                          Size: {item.size} • Shade: {item.color.name} • Qty: {item.quantity}
                        </span>
                      </div>
                      <span className="font-bold text-pink-600">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-2 space-y-1 text-gray-600">
                  <div className="flex justify-between">
                    <span>Shipping ({completedOrder.shippingMethod}):</span>
                    <span>{completedOrder.shipping === 0 ? 'Complimentary' : formatPrice(completedOrder.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-900 pt-1 border-t border-gray-100">
                    <span>Total Charged:</span>
                    <span className="text-pink-600 font-bold text-base">{formatPrice(completedOrder.total)}</span>
                  </div>
                </div>

                <div className="text-[10px] text-gray-400 border-t border-gray-200 pt-2">
                  Delivering to: {completedOrder.customer.address}, {completedOrder.customer.city}, {completedOrder.customer.country}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handlePrintReceipt}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => {
                    setCompletedOrder(null);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-colors"
                >
                  Return to Collection
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Order Items Preview */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} items)
                </div>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color.hex }} />
                        <span className="font-medium text-gray-800">{item.product.name} ({item.size})</span>
                        <span className="text-gray-400">×{item.quantity}</span>
                      </div>
                      <span className="font-bold text-pink-600">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  1. Dispatch Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Camille Laurent"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Email Address (for tracking dispatch) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="camille@atelier.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="742 Rose Avenue, Apt 4B"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-600 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="New York"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-600 mb-1">Postal Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="10012"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-600 mb-1">Country</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:outline-none focus:border-pink-500"
                    >
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>France</option>
                      <option>Germany</option>
                      <option>Italy</option>
                      <option>Canada</option>
                      <option>Japan</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Courier Delivery Choice */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  2. Courier Method
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShippingMethod('standard')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      shippingMethod === 'standard'
                        ? 'border-pink-500 bg-pink-50/70 ring-1 ring-pink-200'
                        : 'border-gray-200 hover:border-pink-200 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-gray-900 mb-1">
                      <span>Standard Courier</span>
                      <span className="text-pink-600">{cartSubtotal >= 250 ? 'FREE' : formatPrice(15)}</span>
                    </div>
                    <p className="text-[10px] text-gray-400">3-5 business days with tracked signature</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingMethod('express')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      shippingMethod === 'express'
                        ? 'border-pink-500 bg-pink-50/70 ring-1 ring-pink-200'
                        : 'border-gray-200 hover:border-pink-200 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-gray-900 mb-1">
                      <span>Express Air Priority</span>
                      <span className="text-pink-600">{formatPrice(35)}</span>
                    </div>
                    <p className="text-[10px] text-gray-400">1-2 business days expedited dispatch</p>
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  3. Encrypted Payment Details
                </h3>

                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                      paymentMethod === 'card' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                      paymentMethod === 'apple' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span>Apple / Google Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('invoice')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                      paymentMethod === 'invoice' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span>Atelier Invoice</span>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 font-mono text-gray-800 focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 font-mono text-gray-800 focus:outline-none focus:border-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">
                          CVC
                        </label>
                        <input
                          type="password"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 font-mono text-gray-800 focus:outline-none focus:border-pink-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'apple' && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center text-xs text-gray-600">
                    <p className="font-semibold text-gray-800 mb-1">One-Touch Device Biometric Payment</p>
                    <p className="text-[11px] text-gray-400">Device biometric authentication will trigger upon confirming.</p>
                  </div>
                )}

                {paymentMethod === 'invoice' && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center text-xs text-gray-600">
                    <p className="font-semibold text-gray-800 mb-1">Atelier Net-30 Wire Invoice</p>
                    <p className="text-[11px] text-gray-400">Dispatched with official atelier tax invoice payable via bank transfer.</p>
                  </div>
                )}
              </div>

              {/* Total & Submit Button */}
              <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Amount to Pay</span>
                  <div className="text-2xl font-bold text-gray-900 tracking-tight">
                    {formatPrice(totalCost)}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs sm:text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-200"
                  id="checkout-confirm-pay-btn"
                >
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Complete Purchase</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
