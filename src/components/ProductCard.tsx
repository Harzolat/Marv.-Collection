import React, { useState } from 'react';
import { Product, ColorOption } from '../types';
import { useShop } from '../context/ShopContext';
import { Heart, Plus, FileText, Star, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const {
    formatPrice,
    addToCart,
    openQuoteForProduct,
    savedIds,
    toggleSave,
  } = useShop();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const isSaved = savedIds.includes(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, selectedColor, 1);
  };

  const handleRequestQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuoteForProduct(product);
  };

  return (
    <article
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-pink-200 transition-all duration-300 hover:shadow-xl cursor-pointer"
      id={`product-card-${product.id}`}
    >
      {/* Media Image Container */}
      <div 
        className="relative w-full aspect-[3/4] bg-pink-50/50 overflow-hidden"
        onMouseEnter={() => product.images.length > 1 && setCurrentImageIndex(1)}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        <img
          src={product.images[currentImageIndex] || product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="px-2.5 py-1 bg-white/95 backdrop-blur-xs text-pink-600 text-[10px] font-bold tracking-wider uppercase rounded-full shadow-xs border border-pink-100">
              {product.badge}
            </span>
          )}
          {product.originalPrice && (
            <span className="px-2 py-0.5 bg-pink-500 text-white text-[9px] font-bold uppercase rounded-full tracking-wider w-fit">
              Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSave(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isSaved
              ? 'bg-pink-500 text-white shadow-sm'
              : 'bg-white/85 text-gray-600 hover:text-pink-600 hover:bg-white shadow-xs'
          }`}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick Action Drawer (Desktop) */}
        <div className="absolute inset-x-2 bottom-2 hidden sm:flex flex-col gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 backdrop-blur-xs shadow-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Buy ({selectedSize})</span>
          </button>
          
          <button
            onClick={handleRequestQuote}
            className="w-full py-1.5 bg-pink-50/95 hover:bg-pink-100 text-pink-600 rounded-lg text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 backdrop-blur-xs border border-pink-200 transition-colors"
          >
            <FileText className="w-3 h-3 text-pink-500" />
            <span>Request Bespoke Quote</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium mb-1">
            <span className="uppercase tracking-wider text-pink-600 font-semibold">{product.category}</span>
            <div className="flex items-center gap-1 text-gray-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-gray-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-gray-800 group-hover:text-pink-600 transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>

          {/* Subtitle / Tagline */}
          <p className="text-xs text-gray-400 line-clamp-1 mb-3">
            {product.tagline}
          </p>

          {/* Color & Size Swatches */}
          <div className="flex items-center justify-between pt-1 pb-2">
            {/* Colors */}
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    selectedColor.name === c.name
                      ? 'ring-2 ring-pink-500 ring-offset-1 scale-110'
                      : 'border-gray-200 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  aria-label={`Select color ${c.name}`}
                />
              ))}
            </div>

            {/* Sizes */}
            <div className="flex items-center gap-1 text-[10px]" onClick={(e) => e.stopPropagation()}>
              {product.sizes.slice(0, 4).map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    selectedSize === s
                      ? 'bg-pink-100 text-pink-800 font-bold border border-pink-200'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Price and Mobile Action */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between mt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-pink-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Mobile Buttons */}
          <div className="sm:hidden flex items-center gap-1">
            <button
              onClick={handleRequestQuote}
              className="p-1.5 rounded-md bg-pink-50 text-pink-600 border border-pink-200 text-xs flex items-center gap-1"
              title="Request Quote"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleQuickAdd}
              className="p-1.5 rounded-md bg-gray-900 text-white text-xs flex items-center gap-1 font-bold"
              title="Add to Cart"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="text-[11px]">{selectedSize}</span>
            </button>
          </div>

          <div className="hidden sm:block text-[11px] text-gray-400 group-hover:text-pink-600 transition-colors flex items-center gap-1 font-medium">
            <Eye className="w-3 h-3 inline mr-0.5" />
            <span>Details</span>
          </div>
        </div>
      </div>
    </article>
  );
};
