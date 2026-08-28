import React, { useState } from 'react';
import { Product, ColorOption } from '../types';
import { useShop } from '../context/ShopContext';
import { X, Heart, Star, ShoppingBag, FileText, Check, Truck, RefreshCw, Ruler, ShieldCheck } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const {
    formatPrice,
    addToCart,
    openQuoteForProduct,
    savedIds,
    toggleSave,
    currentUser,
    setIsAdminPlatformOpen,
  } = useShop();

  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'care' | 'shipping'>('details');

  const isSaved = savedIds.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleRequestQuote = () => {
    onClose();
    openQuoteForProduct(product);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/40 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col md:flex-row max-h-[92vh] md:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
        id="product-detail-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-gray-900 shadow-xs backdrop-blur-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Gallery Column */}
        <div className="w-full md:w-1/2 flex flex-col bg-pink-50/30 border-r border-gray-100">
          {/* Main big image */}
          <div className="relative aspect-[3/4] sm:aspect-square md:aspect-[3/4] w-full overflow-hidden bg-pink-50/50">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-white/95 backdrop-blur-xs text-pink-600 text-xs font-bold tracking-wider uppercase rounded-full shadow-xs border border-pink-100">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto bg-white border-t border-gray-100">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx ? 'border-pink-500 scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Garment Details and Purchase Actions */}
        <div className="w-full md:w-1/2 flex flex-col overflow-y-auto p-6 sm:p-8">
          {/* Header & Category */}
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium mb-1.5">
            <span className="text-pink-600 font-bold tracking-wider uppercase">{product.category}</span>
            <div className="flex items-center gap-1.5 text-gray-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-gray-800">{product.rating}</span>
              <span>({product.reviewsCount} reviews)</span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 mb-2">
            {product.name}
          </h2>

          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            {product.tagline}
          </p>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-bold text-pink-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-xs text-pink-700 font-bold px-2 py-0.5 rounded-full bg-pink-50 border border-pink-200">
              In Stock & Ready to Dispatch
            </span>
          </div>

          {/* Color Selection */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-gray-700">
                Palette Shade: <strong className="text-pink-600">{selectedColor.name}</strong>
              </span>
              <span className="text-gray-400 text-[11px]">Signature Pink Hue</span>
            </div>
            <div className="flex items-center gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center ${
                    selectedColor.name === c.name
                      ? 'ring-2 ring-pink-500 ring-offset-2 scale-105'
                      : 'border-gray-200 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {selectedColor.name === c.name && (
                    <Check className={`w-3.5 h-3.5 ${c.hex === '#FFE4E6' || c.hex === '#FFF1F2' ? 'text-gray-800' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-gray-700">Select Size:</span>
              <button
                onClick={() => setShowSizeGuide(!showSizeGuide)}
                className="text-pink-600 hover:text-pink-700 flex items-center gap-1 font-semibold underline"
              >
                <Ruler className="w-3 h-3" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-2 rounded-lg text-xs font-bold tracking-wider transition-all ${
                    selectedSize === s
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'bg-gray-100 hover:bg-pink-50 text-gray-700 border border-transparent hover:border-pink-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Collapsible Size Guide Modal */}
            {showSizeGuide && (
              <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-600 animate-in fade-in duration-150">
                <div className="font-bold text-gray-800 mb-1.5">Atelier Measurement Matrix (Inches)</div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 text-[10px]">
                      <th className="py-1">Size</th>
                      <th>Bust</th>
                      <th>Waist</th>
                      <th>Hips</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-1 font-semibold">XS</td>
                      <td>32"</td>
                      <td>25"</td>
                      <td>35"</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-1 font-semibold">S</td>
                      <td>34"</td>
                      <td>27"</td>
                      <td>37"</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-1 font-semibold">M</td>
                      <td>36"</td>
                      <td>29"</td>
                      <td>39"</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-semibold">L</td>
                      <td>38"</td>
                      <td>31"</td>
                      <td>41"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Primary Action Buttons: Add to Cart & Request Bespoke Quote */}
          <div className="space-y-2.5 mb-6">
            <div className="flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 rounded-lg hover:bg-white text-sm"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 rounded-lg hover:bg-white text-sm"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs sm:text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors shadow-none"
                id="modal-add-to-cart-btn"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buy Now • {formatPrice(product.price * quantity)}</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleSave(product.id)}
                className={`p-3 rounded-xl border transition-colors ${
                  isSaved
                    ? 'border-pink-500 bg-pink-50 text-pink-600'
                    : 'border-gray-200 text-gray-500 hover:text-pink-600 hover:bg-pink-50'
                }`}
                aria-label="Save item"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Request Bespoke Quote Button */}
            <button
              onClick={handleRequestQuote}
              className="w-full py-3 px-4 bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs"
              id="modal-request-quote-btn"
            >
              <FileText className="w-4 h-4 text-pink-500" />
              <span>Need Custom Fit, Made-to-Measure or Bulk? Request a Quote</span>
            </button>

            {/* Admin Direct Customization Button */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => {
                  onClose();
                  setIsAdminPlatformOpen(true);
                }}
                className="w-full py-2.5 px-4 bg-gray-900 hover:bg-black text-pink-300 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-gray-800"
              >
                <ShieldCheck className="w-4 h-4 text-pink-400" />
                <span>Admin: Customize This Garment in Studio</span>
              </button>
            )}
          </div>

          {/* Details Tabs */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex border-b border-gray-200 text-xs font-medium gap-5 mb-3">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === 'details'
                    ? 'border-pink-500 text-pink-600 font-bold'
                    : 'border-transparent text-gray-400 hover:text-gray-800'
                }`}
              >
                Atelier Notes
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === 'materials'
                    ? 'border-pink-500 text-pink-600 font-bold'
                    : 'border-transparent text-gray-400 hover:text-gray-800'
                }`}
              >
                Composition
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === 'shipping'
                    ? 'border-pink-500 text-pink-600 font-bold'
                    : 'border-transparent text-gray-400 hover:text-gray-800'
                }`}
              >
                Shipping & Returns
              </button>
            </div>

            <div className="text-xs text-gray-500 leading-relaxed min-h-[60px]">
              {activeTab === 'details' && (
                <ul className="space-y-1.5 list-disc pl-4">
                  {product.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              )}
              {activeTab === 'materials' && (
                <div className="space-y-2">
                  <p><strong className="text-gray-800">Materials:</strong> {product.materials}</p>
                  <p><strong className="text-gray-800">Garment Care:</strong> {product.care}</p>
                </div>
              )}
              {activeTab === 'shipping' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Truck className="w-4 h-4 text-pink-500 shrink-0" />
                    <span>Complimentary express courier shipping worldwide on orders above $250.</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <RefreshCw className="w-4 h-4 text-pink-500 shrink-0" />
                    <span>14-day return window in unworn original atelier packaging.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
