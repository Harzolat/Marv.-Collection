import React, { useState } from 'react';
import { useShop, CURRENCIES } from '../context/ShopContext';
import { ShoppingBag, FileText, Heart, Search, Menu, X, Globe, Sparkles, User as UserIcon, ShieldCheck, LogOut, Sliders } from 'lucide-react';
import { Currency } from '../types';

interface HeaderProps {
  onSearchClick: () => void;
  onFilterCategory?: (cat: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchClick, onFilterCategory }) => {
  const {
    cartCount,
    setIsCartOpen,
    setIsQuoteModalOpen,
    setIsQuoteTrackerOpen,
    savedIds,
    currency,
    setCurrency,
    quotes,
    currentUser,
    openAuthModal,
    signOut,
    setIsAdminPlatformOpen,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (category: string) => {
    if (onFilterCategory) {
      onFilterCategory(category);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-200">
      {/* Top micro-bar */}
      <div className="bg-pink-50/60 border-b border-pink-100/60 px-4 sm:px-12 py-1.5 text-xs tracking-wider text-gray-700 flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-1.5 text-pink-600 mx-auto font-medium">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>SS/24 Soft Minimalism — Marv. collection bespoke tailoring & ready-to-wear pieces</span>
        </div>
        <div className="sm:hidden text-center w-full text-pink-600 font-semibold text-[11px] uppercase tracking-wider">
          Marv. collection SS/24
        </div>
        <div className="hidden md:flex items-center gap-3 text-xs text-gray-400">
          <button 
            onClick={() => setIsQuoteTrackerOpen(true)}
            className="hover:text-pink-500 transition-colors flex items-center gap-1 font-medium"
          >
            <FileText className="w-3 h-3 text-pink-500" />
            <span>Track Quote ({quotes.length})</span>
          </button>
          
          {currentUser?.role === 'admin' ? (
            <button
              onClick={() => setIsAdminPlatformOpen(true)}
              className="text-pink-700 hover:text-pink-800 font-bold flex items-center gap-1 bg-pink-100/80 px-2 py-0.5 rounded-full"
            >
              <ShieldCheck className="w-3 h-3 text-pink-600" />
              <span>Admin Studio</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('admin')}
              className="hover:text-gray-600 transition-colors text-[11px]"
            >
              Atelier Admin
            </button>
          )}
        </div>
      </div>

      {/* Main navigation container */}
      <nav className="flex justify-between items-center px-4 sm:px-8 lg:px-12 py-5 sm:py-6 border-b border-gray-100">
        {/* Left: Brand Logo */}
        <div 
          className="flex items-center cursor-pointer select-none" 
          onClick={() => handleNavClick('All')}
        >
          <span className="text-2xl font-bold tracking-tighter text-gray-900">
            MARV<span className="text-pink-500">.</span> <span className="font-light tracking-widest text-xs uppercase text-gray-500 ml-1">collection</span>
          </span>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex gap-8 lg:gap-12 text-sm font-medium uppercase tracking-widest text-gray-500">
          <button
            onClick={() => handleNavClick('All')}
            className="hover:text-pink-500 transition-colors text-pink-600 border-b border-pink-600 pb-0.5"
          >
            Collection
          </button>
          <button
            onClick={() => setIsQuoteModalOpen(true)}
            className="hover:text-pink-500 transition-colors"
          >
            Bespoke
          </button>
          <button
            onClick={() => setIsQuoteTrackerOpen(true)}
            className="hover:text-pink-500 transition-colors flex items-center gap-1"
          >
            <span>The Quote</span>
            {quotes.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
            )}
          </button>
          <button
            onClick={() => handleNavClick('Saved')}
            className="hover:text-pink-500 transition-colors relative"
          >
            Archive {savedIds.length > 0 && `(${savedIds.length})`}
          </button>

          {/* If admin, quick studio shortcut in desktop nav */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setIsAdminPlatformOpen(true)}
              className="text-pink-600 hover:text-pink-700 font-bold flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Customize</span>
            </button>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Search Trigger */}
          <button
            onClick={onSearchClick}
            className="p-2 hover:bg-pink-50 rounded-full text-gray-700 hover:text-pink-600 transition-colors"
            aria-label="Search garments"
            id="header-search-btn"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Currency Switcher */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-pink-600 py-1.5 px-2.5 rounded-full hover:bg-pink-50 transition-colors"
              id="currency-switch-btn"
            >
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              <span>{currency.code}</span>
            </button>

            {currencyDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl py-1 z-50 text-xs"
                onMouseLeave={() => setCurrencyDropdownOpen(false)}
              >
                {(Object.keys(CURRENCIES) as (keyof typeof CURRENCIES)[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setCurrency(CURRENCIES[key]);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-pink-50 flex items-center justify-between ${
                      currency.code === key ? 'text-pink-600 font-bold bg-pink-50/50' : 'text-gray-700'
                    }`}
                  >
                    <span>{CURRENCIES[key].code}</span>
                    <span className="text-gray-400">{CURRENCIES[key].symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist / Saved */}
          <div className="relative hidden md:block">
            <button
              onClick={() => onFilterCategory && onFilterCategory('Saved')}
              className="p-2 hover:bg-pink-50 rounded-full text-gray-700 hover:text-pink-600 transition-colors relative"
              aria-label="Saved items"
            >
              <Heart className="w-5 h-5" />
              {savedIds.length > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 w-4 h-4 bg-pink-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                  {savedIds.length}
                </span>
              )}
            </button>
          </div>

          {/* Client Account / Sign In / Admin Trigger */}
          <div className="relative">
            {currentUser ? (
              <div>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-pink-50 text-gray-700 transition-colors border border-gray-200"
                  aria-label="Client account menu"
                  id="client-account-btn"
                >
                  <div className="w-6 h-6 rounded-full bg-pink-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {currentUser.avatarInitials || currentUser.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline text-xs font-semibold text-gray-800 max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 text-xs"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="p-2 border-b border-gray-100 pb-3 mb-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-gray-900 truncate block">
                          {currentUser.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 uppercase tracking-wider">
                          {currentUser.role === 'admin' ? 'Atelier Admin' : currentUser.vipTier || 'Client'}
                        </span>
                      </div>
                      <span className="text-gray-400 text-[11px] truncate block">{currentUser.email}</span>
                    </div>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setIsAdminPlatformOpen(true);
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-xl font-bold flex items-center gap-2 mb-2 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-pink-600" />
                        <span>Product Customization Studio</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setIsQuoteTrackerOpen(true);
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-xl flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                        <span>My Bespoke Inquiries</span>
                      </span>
                      <span className="font-bold text-pink-600">{quotes.length}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onFilterCategory) onFilterCategory('Saved');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-xl flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Heart className="w-3.5 h-3.5 text-gray-400" />
                        <span>Saved Archive</span>
                      </span>
                      <span className="font-bold text-gray-500">{savedIds.length}</span>
                    </button>

                    <div className="pt-2 mt-2 border-t border-gray-100">
                      <button
                        onClick={() => {
                          signOut();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2 font-semibold transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openAuthModal('signin')}
                  className="px-3 py-1.5 text-xs font-bold text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors flex items-center gap-1.5"
                  id="header-signin-btn"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              </div>
            )}
          </div>

          {/* Cart Button from Clean Minimalism */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-pink-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 text-xs font-bold uppercase tracking-tighter hover:bg-pink-600 transition-colors flex items-center gap-2 cursor-pointer shadow-none rounded-lg"
            aria-label="Shopping Cart"
            id="header-cart-btn"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cart ({cartCount})</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-pink-500 focus:outline-none"
            aria-label="Toggle menu"
            id="mobile-menu-toggle-btn"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          {/* User profile card or sign in in mobile menu */}
          <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
            {currentUser ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-pink-500 text-white font-bold text-xs flex items-center justify-center">
                    {currentUser.avatarInitials || 'MC'}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">{currentUser.name}</span>
                    <span className="text-[10px] text-gray-500">{currentUser.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-red-600 p-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-gray-600 font-medium">Welcome to Marv.</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      openAuthModal('signin');
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-bold text-gray-800 hover:text-pink-600"
                  >
                    Sign In
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => {
                      openAuthModal('signup');
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-bold text-pink-600"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Admin Platform button for mobile if admin */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                setIsAdminPlatformOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-pink-400" />
              <span>Product Customization Studio</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold uppercase tracking-wider">
            <button
              onClick={() => handleNavClick('All')}
              className="text-left py-2.5 px-3 rounded hover:bg-pink-50 text-gray-800"
            >
              Collection
            </button>
            <button
              onClick={() => handleNavClick('Outerwear')}
              className="text-left py-2.5 px-3 rounded hover:bg-pink-50 text-gray-800"
            >
              Outerwear
            </button>
            <button
              onClick={() => handleNavClick('Dresses')}
              className="text-left py-2.5 px-3 rounded hover:bg-pink-50 text-gray-800"
            >
              Dresses
            </button>
            <button
              onClick={() => handleNavClick('Saved')}
              className="text-left py-2.5 px-3 rounded hover:bg-pink-50 text-gray-800"
            >
              Archive ({savedIds.length})
            </button>
          </div>

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsQuoteModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-lg"
              id="mobile-menu-request-quote-btn"
            >
              <FileText className="w-4 h-4" />
              <span>Request Bespoke Quote</span>
            </button>
            
            <button
              onClick={() => {
                setIsQuoteTrackerOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 border border-pink-200 text-pink-600 hover:bg-pink-50 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-lg"
            >
              <span>The Quote Tracker ({quotes.length})</span>
            </button>

            {/* Quick Admin link in mobile if not logged in */}
            {!currentUser && (
              <button
                onClick={() => {
                  openAuthModal('admin');
                  setMobileMenuOpen(false);
                }}
                className="text-center text-[11px] text-gray-400 hover:text-gray-700 py-1"
              >
                Atelier Admin Portal Login →
              </button>
            )}

            {/* Mobile Currency Selection */}
            <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
              <span className="uppercase tracking-wider font-semibold text-[10px]">Currency:</span>
              <div className="flex gap-1.5">
                {(Object.keys(CURRENCIES) as (keyof typeof CURRENCIES)[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setCurrency(CURRENCIES[key])}
                    className={`px-2 py-1 text-xs font-bold uppercase rounded ${
                      currency.code === key
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
