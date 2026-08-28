import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Sparkles, FileText, Grid, User as UserIcon, ShieldCheck } from 'lucide-react';

interface MobileBottomNavProps {
  onGoToShop: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onGoToShop }) => {
  const { 
    cartCount, 
    setIsCartOpen, 
    setIsQuoteModalOpen, 
    setIsQuoteTrackerOpen, 
    quotes, 
    currentUser, 
    openAuthModal, 
    setIsAdminPlatformOpen 
  } = useShop();

  return (
    <nav 
      aria-label="Mobile navigation" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 px-2 py-2 safe-area-pb shadow-[0_-4px_12px_rgba(0,0,0,0.03)]"
    >
      <div className="grid grid-cols-5 items-center text-center">
        {/* Collection */}
        <button
          onClick={onGoToShop}
          className="flex flex-col items-center justify-center py-1 text-gray-500 hover:text-pink-600 active:scale-95 transition-transform"
          id="mobile-nav-collection-btn"
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Shop</span>
        </button>

        {/* Request Quote - Highlighted Primary */}
        <button
          onClick={() => setIsQuoteModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-pink-600 active:scale-95 transition-transform relative font-bold"
          id="mobile-nav-quote-btn"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 mb-0.5 text-pink-500" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-500 animate-ping" />
          </div>
          <span className="text-[10px] uppercase tracking-wider">Quote</span>
        </button>

        {/* My Quotes */}
        <button
          onClick={() => setIsQuoteTrackerOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-gray-500 hover:text-pink-600 active:scale-95 transition-transform relative"
          id="mobile-nav-tracker-btn"
        >
          <FileText className="w-5 h-5 mb-0.5" />
          {quotes.length > 0 && (
            <span className="absolute top-0 right-3 w-4 h-4 bg-pink-50 text-pink-700 rounded-full text-[9px] font-bold flex items-center justify-center border border-pink-200">
              {quotes.length}
            </span>
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider">Tracker</span>
        </button>

        {/* Bag */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-gray-500 hover:text-pink-600 active:scale-95 transition-transform relative"
          id="mobile-nav-cart-btn"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5 text-gray-800" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-pink-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">Bag</span>
        </button>

        {/* User Account / Admin Studio */}
        <button
          onClick={() => {
            if (currentUser?.role === 'admin') {
              setIsAdminPlatformOpen(true);
            } else if (currentUser) {
              openAuthModal('signin');
            } else {
              openAuthModal('signin');
            }
          }}
          className="flex flex-col items-center justify-center py-1 text-gray-500 hover:text-pink-600 active:scale-95 transition-transform"
          id="mobile-nav-account-btn"
        >
          {currentUser?.role === 'admin' ? (
            <ShieldCheck className="w-5 h-5 mb-0.5 text-pink-600" />
          ) : (
            <UserIcon className="w-5 h-5 mb-0.5" />
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {currentUser?.role === 'admin' ? 'Studio' : currentUser ? 'Profile' : 'Sign In'}
          </span>
        </button>
      </div>
    </nav>
  );
};

