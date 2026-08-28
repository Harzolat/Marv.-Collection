import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, ArrowRight, Heart, FileText, Scissors, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setIsQuoteModalOpen, setIsQuoteTrackerOpen, openAuthModal, setIsAdminPlatformOpen, currentUser } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-white border-t border-gray-100 px-6 sm:px-12 pt-16 pb-24 md:pb-12 text-gray-500 text-xs">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-100">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-3 md:col-span-1">
            <div className="text-2xl font-bold tracking-tighter text-gray-900">
              MARV<span className="text-pink-500">.</span> <span className="font-light tracking-widest text-xs uppercase text-gray-500 ml-1">collection</span>
            </div>
            <p className="text-gray-500 leading-relaxed text-xs">
              Curated garments designed for the modern silhouette. Where luxury meets functional creativity and bespoke tailoring in every stitch.
            </p>
            <div className="text-[11px] text-pink-600 font-semibold uppercase tracking-wider">
              Paris • Milan • New York
            </div>
          </div>

          {/* Col 2: Services & Bespoke Studio */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 uppercase tracking-widest text-[11px]">
              Bespoke & Quotes
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="hover:text-pink-500 text-left transition-colors flex items-center gap-1.5"
                >
                  <Scissors className="w-3.5 h-3.5 text-pink-500" />
                  <span>Request Custom Quote</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsQuoteTrackerOpen(true)}
                  className="hover:text-pink-500 text-left transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-pink-500" />
                  <span>The Quote Tracker</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="hover:text-pink-500 text-left transition-colors"
                >
                  Bridal & Ceremonial Sets
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="hover:text-pink-500 text-left transition-colors"
                >
                  Tailored Bulk Orders (5-100+ units)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Client & Atelier Portal */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 uppercase tracking-widest text-[11px]">
              Client & Studio
            </h4>
            <ul className="space-y-2 text-gray-500">
              <li>
                <button
                  onClick={() => openAuthModal('signin')}
                  className="hover:text-pink-600 transition-colors"
                >
                  Client Sign In & Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="hover:text-pink-600 transition-colors"
                >
                  New Client Registration
                </button>
              </li>
              <li>
                {currentUser?.role === 'admin' ? (
                  <button
                    onClick={() => setIsAdminPlatformOpen(true)}
                    className="text-pink-600 font-bold hover:underline"
                  >
                    Product Customization Studio →
                  </button>
                ) : (
                  <button
                    onClick={() => openAuthModal('admin')}
                    className="hover:text-gray-800 transition-colors"
                  >
                    Atelier Admin Portal Login
                  </button>
                )}
              </li>
              <li>100% Grade-6A Mulberry Silk</li>
              <li>Certified Low-Impact Rose Dyes</li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 uppercase tracking-widest text-[11px]">
              The Atelier Journal
            </h4>
            <p className="text-gray-500 text-xs">
              Receive private previews of limited seasonal fabric arrivals and custom quote availability.
            </p>
            {subscribed ? (
              <div className="p-3 bg-pink-50 border border-pink-200 text-pink-700 rounded-lg text-xs font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span>You are subscribed to the Atelier Gazette.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-pink-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright matching Clean Minimalism Design */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-widest gap-4">
          <div className="flex flex-wrap gap-6 sm:gap-8">
            <span className="hover:text-pink-600 transition-colors cursor-pointer">Sustainability</span>
            <span className="hover:text-pink-600 transition-colors cursor-pointer">Materials</span>
            <span className="hover:text-pink-600 transition-colors cursor-pointer">Sizing Guide</span>
            <span className="hover:text-pink-600 transition-colors cursor-pointer">Quote Studio</span>
          </div>
          <div>
            © 2024 MARV. COLLECTION. CRAFTED WITH CARE.
          </div>
        </div>
      </div>
    </footer>
  );
};
