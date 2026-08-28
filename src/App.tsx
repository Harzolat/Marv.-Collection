import React, { useState, useRef, useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { EditorialBanner } from './components/EditorialBanner';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { QuoteRequestModal } from './components/QuoteRequestModal';
import { QuoteTrackerModal } from './components/QuoteTrackerModal';
import { AuthModal } from './components/AuthModal';
import { AdminPlatformModal } from './components/AdminPlatformModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ToastContainer } from './components/Toast';
import { Footer } from './components/Footer';
import { Product } from './types';

const MainShopApp: React.FC = () => {
  const {
    products,
    isCartOpen,
    setIsCartOpen,
    isQuoteModalOpen,
    setIsQuoteModalOpen,
    isQuoteTrackerOpen,
    setIsQuoteTrackerOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
    selectedProduct,
    setSelectedProduct,
    isAuthModalOpen,
    isAdminPlatformOpen,
  } = useShop();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const collectionRef = useRef<HTMLDivElement>(null);

  // Prevent background page from scrolling whenever any modal or drawer is active
  const isAnyModalOpen = Boolean(
    selectedProduct ||
    isCartOpen ||
    isCheckoutOpen ||
    isQuoteModalOpen ||
    isQuoteTrackerOpen ||
    isAuthModalOpen ||
    isAdminPlatformOpen
  );

  useEffect(() => {
    if (isAnyModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isAnyModalOpen]);

  const scrollToCollection = () => {
    const el = document.getElementById('collection-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryNav = (cat: string) => {
    setActiveCategory(cat);
    scrollToCollection();
  };

  const handleSearchFocus = () => {
    scrollToCollection();
    const searchInput = document.getElementById('product-search-input') as HTMLInputElement | null;
    if (searchInput) {
      searchInput.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-pink-100 selection:text-pink-900 font-sans relative pb-16 md:pb-0">
      {/* Top Main Navigation */}
      <Header
        onSearchClick={handleSearchFocus}
        onFilterCategory={handleCategoryNav}
      />

      {/* Hero / Creative Editorial Banner */}
      <EditorialBanner onShopClick={scrollToCollection} />

      {/* Main Ready-to-Wear and Quote-Ready Products Section */}
      <main className="flex-1">
        <ProductGrid
          products={products}
          onSelectProduct={(p: Product) => setSelectedProduct(p)}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </main>

      {/* Atelier Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar for Ergonomic Fast Access */}
      <MobileBottomNav onGoToShop={scrollToCollection} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Shopping Bag / Cart Slide-out Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Direct Buy Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Interactive Bespoke & Bulk Quote Studio Configurator Modal */}
      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />

      {/* Quote Progress & Pipeline Tracker Modal */}
      <QuoteTrackerModal
        isOpen={isQuoteTrackerOpen}
        onClose={() => setIsQuoteTrackerOpen(false)}
      />

      {/* Client Sign In, Sign Up & Admin Authentication Modal */}
      <AuthModal />

      {/* Atelier Studio Admin & Product Customization Platform */}
      <AdminPlatformModal />

      {/* Micro-interaction Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainShopApp />
    </ShopProvider>
  );
}
