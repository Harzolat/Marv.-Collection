import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { Sparkles, ArrowRight, Scissors } from 'lucide-react';

interface EditorialBannerProps {
  onShopClick: () => void;
}

export const EditorialBanner: React.FC<EditorialBannerProps> = ({ onShopClick }) => {
  const { openQuoteForProduct, setSelectedProduct, formatPrice } = useShop();

  const featuredProduct = PRODUCTS[0]; // Sculpted Silk Blazer

  return (
    <section className="relative overflow-hidden bg-white border-b border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Section: SS/24 Soft Minimalism Headline & CTAs */}
        <div className="lg:col-span-7 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-24 relative overflow-hidden">
          {/* Ambient Subtle Pink Orb */}
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-30 pointer-events-none" />

          <div className="relative z-10 max-w-xl">
            <span className="text-pink-600 font-semibold tracking-widest uppercase text-xs mb-4 block">
              SS/24 Collection
            </span>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-light leading-none mb-6 sm:mb-8 tracking-tighter text-gray-900">
              Soft <br />
              <span className="font-bold text-pink-500">Minimalism</span>
            </h1>

            <p className="max-w-md text-gray-500 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10">
              Curated garments designed for the modern silhouette. Where luxury meets functional creativity in every stitch.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4">
              <button
                onClick={onShopClick}
                className="bg-gray-900 text-white px-8 sm:px-10 py-4 sm:py-5 text-xs sm:text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                id="hero-shop-collection-btn"
              >
                <span>Shop New Arrivals</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openQuoteForProduct()}
                className="border border-pink-200 text-pink-600 px-8 sm:px-10 py-4 sm:py-5 text-xs sm:text-sm font-bold uppercase tracking-widest hover:bg-pink-50 transition-all flex items-center justify-center gap-2"
                id="hero-request-quote-btn"
              >
                <Scissors className="w-4 h-4" />
                <span>Request Quote</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Section: Showcase Card & Quote Estimator Widget */}
        <div className="lg:col-span-5 bg-pink-50 flex flex-col justify-between p-6 sm:p-10 lg:p-12 relative border-t lg:border-t-0 lg:border-l border-pink-100">
          {/* Centered Floating Showcase Card */}
          <div className="flex-1 flex flex-col justify-center items-center py-6 sm:py-8">
            <div
              onClick={() => setSelectedProduct(featuredProduct)}
              className="w-72 sm:w-80 bg-white shadow-2xl rounded-2xl p-4 rotate-2 sm:rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer border border-gray-100 group"
              id="hero-featured-showcase-card"
            >
              <div className="w-full h-64 sm:h-72 bg-pink-100 rounded-xl mb-4 overflow-hidden relative">
                <img
                  src={featuredProduct.images[0]}
                  alt={featuredProduct.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/90 backdrop-blur-xs text-pink-600 text-[10px] font-bold tracking-wider uppercase rounded-full shadow-xs">
                  Atelier Choice
                </span>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base group-hover:text-pink-600 transition-colors">
                    Silk Satin Blazer
                  </h3>
                  <p className="text-xs text-gray-400">Signature Rose Pink</p>
                </div>
                <span className="font-bold text-pink-600 text-base">
                  {formatPrice(420)}
                </span>
              </div>
            </div>
          </div>

          {/* Clean Minimalism Quote Estimator Box */}
          <div className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-pink-100 shadow-sm mt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900">
                Quote Estimator
              </h4>
              <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            </div>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Personalize your fit. Submit measurements for a tailored quote within 24 hours.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => openQuoteForProduct()}
                className="h-10 bg-gray-50 hover:bg-gray-100 rounded flex items-center px-3 text-[11px] font-medium text-gray-500 border border-gray-100 transition-colors text-left truncate"
              >
                100% Grade-6A Silk
              </button>
              <button
                onClick={() => openQuoteForProduct()}
                className="h-10 bg-pink-500 hover:bg-pink-600 text-white rounded flex items-center justify-center text-[10px] sm:text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-none"
                id="hero-quick-quote-box-btn"
              >
                Quick Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
