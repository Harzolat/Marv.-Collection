import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Lock, Mail, User as UserIcon, Phone, Eye, EyeOff, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authInitialTab,
    signIn,
    signUp,
    setIsAdminPlatformOpen,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'admin'>(authInitialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formScrollRef = useRef<HTMLDivElement>(null);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState<'Ready-to-Wear' | 'Bespoke Atelier' | 'Both'>('Both');

  // Prevent background page from scrolling while Auth modal is open
  useEffect(() => {
    if (isAuthModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isAuthModalOpen]);

  // Sync tab when opened with a specific tab & reset scroll
  useEffect(() => {
    if (isAuthModalOpen) {
      setActiveTab(authInitialTab);
      setErrorMsg(null);
      if (formScrollRef.current) {
        formScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
      }
    }
  }, [isAuthModalOpen, authInitialTab]);

  // When switching tabs (e.g. clicking "Create an account"), smoothly reset scroll to top of modal form
  const handleSwitchTab = (tab: 'signin' | 'signup' | 'admin') => {
    setActiveTab(tab);
    setErrorMsg(null);
    if (formScrollRef.current) {
      formScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setErrorMsg(null);
  };

  const handleQuickClientDemo = () => {
    setEmail('client@marv.com');
    setPassword('client123');
    setErrorMsg(null);
  };

  const handleQuickAdminDemo = () => {
    setEmail('admin@marv.com');
    setPassword('admin123');
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (activeTab === 'admin') {
        const res = await signIn(email, password, 'admin');
        if (res.success) {
          handleClose();
          setIsAdminPlatformOpen(true);
        } else {
          setErrorMsg(res.error || 'Invalid admin credentials');
        }
      } else if (activeTab === 'signin') {
        const res = await signIn(email, password, 'client');
        if (res.success) {
          handleClose();
        } else {
          setErrorMsg(res.error || 'Failed to sign in');
        }
      } else {
        // Sign up
        const res = await signUp({
          name: fullName,
          email,
          password,
          phone,
          role: 'client',
        });
        if (res.success) {
          handleClose();
        } else {
          setErrorMsg(res.error || 'Failed to register account');
        }
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overscroll-contain animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      id="auth-modal-overlay"
    >
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden relative overscroll-contain my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        id="auth-modal-dialog"
      >
        {/* Header decoration - Sticky top banner */}
        <div className="bg-gradient-to-r from-pink-50 via-white to-pink-50/60 p-5 sm:p-6 border-b border-gray-100 relative shrink-0">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
            id="auth-modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl font-bold tracking-tighter text-gray-900">
              MARV<span className="text-pink-500">.</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-pink-600 font-semibold bg-pink-100/70 px-2 py-0.5 rounded-full">
              Atelier Client Portal
            </span>
          </div>

          <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-light tracking-tight text-gray-900">
            {activeTab === 'signin' && 'Welcome Back'}
            {activeTab === 'signup' && 'Create Client Account'}
            {activeTab === 'admin' && 'Atelier Admin Portal'}
          </h2>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {activeTab === 'signin' && 'Sign in to access your bespoke orders, quote tracker, and curated sizing profile.'}
            {activeTab === 'signup' && 'Register for private atelier access, custom made-to-measure tailoring, and express checkout.'}
            {activeTab === 'admin' && 'Authorized personnel access for product catalog customization and bespoke inquiries.'}
          </p>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 p-1.5 gap-1 text-xs font-semibold shrink-0">
          <button
            type="button"
            id="auth-tab-signin-btn"
            onClick={() => handleSwitchTab('signin')}
            className={`flex-1 py-2.5 rounded-lg transition-all text-center cursor-pointer ${
              activeTab === 'signin'
                ? 'bg-white text-gray-900 shadow-xs font-bold'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Client Sign In
          </button>
          <button
            type="button"
            id="auth-tab-signup-btn"
            onClick={() => handleSwitchTab('signup')}
            className={`flex-1 py-2.5 rounded-lg transition-all text-center cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-white text-gray-900 shadow-xs font-bold'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            New Client Sign Up
          </button>
          <button
            type="button"
            id="auth-tab-admin-btn"
            onClick={() => handleSwitchTab('admin')}
            className={`flex-1 py-2.5 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-white text-pink-600 shadow-xs font-bold'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Login</span>
          </button>
        </div>

        {/* Dedicated Scrollable Form Body Container */}
        <div 
          ref={formScrollRef}
          className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 overscroll-contain focus-within:scroll-smooth"
          id="auth-modal-scroll-body"
        >
          {/* Quick Demo Fill Pill (convenient testing) */}
          <div>
            {activeTab === 'admin' ? (
              <button
                type="button"
                id="auth-quick-demo-admin-btn"
                onClick={handleQuickAdminDemo}
                className="w-full bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs py-2 px-3 rounded-xl font-medium border border-pink-200/70 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  <span>1-Click Test Admin Demo Credentials</span>
                </div>
                <span className="text-[11px] text-pink-600 font-mono font-semibold group-hover:underline">
                  admin@marv.com
                </span>
              </button>
            ) : (
              <button
                type="button"
                id="auth-quick-demo-client-btn"
                onClick={handleQuickClientDemo}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs py-2 px-3 rounded-xl font-medium border border-gray-200 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  <span>1-Click Test Client Demo (Vivienne Vance)</span>
                </div>
                <span className="text-[11px] text-gray-500 font-mono group-hover:text-gray-900">
                  client@marv.com
                </span>
              </button>
            )}
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="space-y-4" id="auth-main-form">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-in fade-in">
                {errorMsg}
              </div>
            )}

            {/* Full Name for Sign Up */}
            {activeTab === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    id="auth-fullname-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Eleanor Sinclair"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-hidden transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  id="auth-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeTab === 'admin' ? 'admin@marv.com' : 'you@example.com'}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-hidden transition-colors"
                />
              </div>
            </div>

            {/* Phone for Sign Up */}
            {activeTab === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    id="auth-phone-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-hidden transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Password *
                </label>
                {activeTab !== 'signup' && (
                  <span className="text-[11px] text-gray-400">
                    {activeTab === 'admin' ? 'Default: admin123' : 'Default: client123'}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  id="auth-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-hidden transition-colors"
                />
                <button
                  type="button"
                  id="auth-toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Tailoring Interests for Sign Up */}
            {activeTab === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Collection Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Ready-to-Wear', 'Bespoke Atelier', 'Both'] as const).map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      id={`auth-pref-${pref.toLowerCase().replace(/\s+/g, '-')}-btn`}
                      onClick={() => setInterest(pref)}
                      className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        interest === pref
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="auth-submit-btn"
                disabled={isLoading}
                className={`w-full py-3 px-6 text-xs font-bold uppercase tracking-widest text-white transition-all rounded-xl flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-gray-900 hover:bg-black'
                    : 'bg-pink-500 hover:bg-pink-600 shadow-md shadow-pink-200'
                }`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {activeTab === 'signin' && 'Sign In to Marv.'}
                      {activeTab === 'signup' && 'Create Client Account'}
                      {activeTab === 'admin' && 'Access Admin Platform'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Footer note with seamless tab switching & scroll reset */}
            <div className="text-center pt-2">
              {activeTab === 'signin' ? (
                <p className="text-xs text-gray-500">
                  New to Marv. collection?{' '}
                  <button
                    type="button"
                    id="auth-switch-to-signup-btn"
                    onClick={() => handleSwitchTab('signup')}
                    className="text-pink-600 font-bold hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </p>
              ) : activeTab === 'signup' ? (
                <p className="text-xs text-gray-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    id="auth-switch-to-signin-btn"
                    onClick={() => handleSwitchTab('signin')}
                    className="text-pink-600 font-bold hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </p>
              ) : (
                <p className="text-xs text-gray-400">
                  Need client shopping?{' '}
                  <button
                    type="button"
                    id="auth-switch-to-client-login-btn"
                    onClick={() => handleSwitchTab('signin')}
                    className="text-gray-600 font-bold hover:underline cursor-pointer"
                  >
                    Switch to client login
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
