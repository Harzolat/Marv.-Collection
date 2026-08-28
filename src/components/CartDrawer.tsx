import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, ShoppingBag, Trash2, ArrowRight, Sparkles, Tag, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const {
    cart,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    formatPrice,
    openQuoteForProduct,
  } = useShop();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 250;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'ROSE10' || code === 'PINK10') {
      setAppliedDiscount(Math.round(cartSubtotal * 0.1));
      setCouponSuccess('10% Rose Atelier promo applied!');
    } else if (code === 'ATELIER') {
      setAppliedDiscount(50);
      setCouponSuccess('$50 Atelier VIP credit applied!');
    } else {
      setCouponError('Invalid promo code. Try ROSE10 or ATELIER.');
    }
  };

  const finalSubtotal = Math.max(0, cartSubtotal - appliedDiscount);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-gray-950/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300 border-l border-gray-100"
        onClick={(e) => e.stopPropagation()}
        id="cart-drawer"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-pink-500" />
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-tight text-gray-900">
              Wardrobe Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        {cart.length > 0 && (
          <div className="px-5 py-3 bg-pink-50/70 border-b border-pink-100 text-xs">
            <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium text-gray-700">
              {amountToFreeShipping === 0 ? (
                <span className="text-pink-600 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  Unlocked: Free Worldwide Courier Delivery
                </span>
              ) : (
                <span>
                  Add <strong className="text-pink-600">{formatPrice(amountToFreeShipping)}</strong> more for complimentary courier
                </span>
              )}
              <span className="font-bold text-gray-600">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-pink-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-pink-50 text-pink-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1 tracking-tight">
                  Your Wardrobe Bag is Empty
                </h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Explore our curated ready-to-wear pieces or request a bespoke quote tailored to your exact measurements.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Explore Collection
                </button>
                <button
                  onClick={() => {
                    onClose();
                    openQuoteForProduct();
                  }}
                  className="px-5 py-2.5 bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Request a Quote
                </button>
              </div>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3 rounded-xl border border-gray-100 bg-white hover:border-pink-200 transition-all"
              >
                {/* Image */}
                <div className="w-18 h-24 rounded-lg overflow-hidden bg-pink-50 shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-pink-600 transition-colors p-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-semibold">
                        {item.size}
                      </span>
                      <div className="flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-gray-300"
                          style={{ backgroundColor: item.color.hex }}
                        />
                        <span>{item.color.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Quantity Stepper */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-gray-200 rounded-md bg-gray-50">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs text-gray-600 hover:text-gray-900"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs text-gray-600 hover:text-gray-900"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-bold text-pink-600">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gray-100 bg-white space-y-3">
            {/* Promo code accordion */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Promo (ROSE10 or ATELIER)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-gray-200 rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-pink-500 uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-gray-100 hover:bg-pink-50 hover:text-pink-600 text-gray-700 rounded-lg text-xs font-bold transition-colors"
              >
                Apply
              </button>
            </form>

            {couponError && <p className="text-[10px] text-pink-600 font-medium">{couponError}</p>}
            {couponSuccess && <p className="text-[10px] text-pink-700 font-bold">{couponSuccess}</p>}

            {/* Price breakdown */}
            <div className="space-y-1 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-gray-900">{formatPrice(cartSubtotal)}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-pink-600 font-bold">
                  <span>Promotional Privilege:</span>
                  <span>-{formatPrice(appliedDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Courier Shipping:</span>
                <span>
                  {amountToFreeShipping === 0 ? (
                    <strong className="text-pink-600 uppercase text-[10px]">Complimentary</strong>
                  ) : (
                    formatPrice(15)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Estimated Total:</span>
                <span className="text-pink-600 text-base font-bold">
                  {formatPrice(finalSubtotal + (amountToFreeShipping === 0 ? 0 : 15))}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs sm:text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-200 shadow-none"
              id="cart-proceed-checkout-btn"
            >
              <span>Instant Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-500" />
              <span>Encrypted Atelier Checkout • 14-day returns</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
