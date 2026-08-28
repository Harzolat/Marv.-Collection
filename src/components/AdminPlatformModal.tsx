import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, Category, ColorOption } from '../types';
import { 
  X, Plus, Edit3, Trash2, Copy, Sparkles, Sliders, Check, 
  RotateCcw, Image, Palette, Eye, CheckCircle, Clock, 
  FileText, ShoppingBag, ShieldCheck, Search, Filter, ArrowUpRight
} from 'lucide-react';
import { FABRIC_OPTIONS } from '../data/products';

const CURATED_IMAGE_PRESETS = [
  { name: 'Blush Silk Blazer', url: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Silk Slip Dress', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Minimalist Trench', url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Poplin Sculpted Shirt', url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80' },
  { name: 'High-Waist Trousers', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Cashmere Knit', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Pink Silk Scarf', url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Evening Organza Gown', url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80' },
];

const PRESET_COLOR_SWATCHES: ColorOption[] = [
  { name: 'Rose Quartz', hex: '#F472B6' },
  { name: 'Blush Silk', hex: '#FDA4AF' },
  { name: 'Dusty Rose', hex: '#E879F9' },
  { name: 'Petal Crimson', hex: '#F43F5E' },
  { name: 'Pale Shell', hex: '#FFE4E6' },
  { name: 'Deep Dahlia', hex: '#BE123C' },
  { name: 'Atelier Ivory', hex: '#FDFBF7' },
  { name: 'Charcoal Noir', hex: '#1F2937' },
  { name: 'Champagne Taupe', hex: '#D1C7BD' },
];

export const AdminPlatformModal: React.FC = () => {
  const {
    isAdminPlatformOpen,
    setIsAdminPlatformOpen,
    currentUser,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    resetProductsToDefault,
    quotes,
    updateQuoteStatus,
    deleteQuote,
    orders,
    updateOrderStatus,
    formatPrice,
    showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'products' | 'quotes' | 'orders'>('products');
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Editor State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Editor Form State
  const [formName, setFormName] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formCategory, setFormCategory] = useState<Exclude<Category, 'All'>>('Outerwear');
  const [formPrice, setFormPrice] = useState<number>(350);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | undefined>(undefined);
  const [formDescription, setFormDescription] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formInStock, setFormInStock] = useState(true);
  const [formQuoteAvailable, setFormQuoteAvailable] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formMaterials, setFormMaterials] = useState('');
  const [formCare, setFormCare] = useState('');
  const [formDetails, setFormDetails] = useState<string[]>([]);
  const [newDetailText, setNewDetailText] = useState('');
  const [formSizes, setFormSizes] = useState<('XS' | 'S' | 'M' | 'L' | 'XL')[]>(['S', 'M', 'L']);
  const [formColors, setFormColors] = useState<ColorOption[]>([]);
  const [formImages, setFormImages] = useState<string[]>([]);

  // Color adder helper
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#F472B6');

  // Image adder helper
  const [newImageUrl, setNewImageUrl] = useState('');

  if (!isAdminPlatformOpen) return null;

  const handleOpenEdit = (p: Product) => {
    setIsCreatingNew(false);
    setEditingProduct(p);
    setFormName(p.name);
    setFormTagline(p.tagline);
    setFormCategory(p.category);
    setFormPrice(p.price);
    setFormOriginalPrice(p.originalPrice);
    setFormDescription(p.description);
    setFormBadge(p.badge || '');
    setFormInStock(p.inStock);
    setFormQuoteAvailable(p.quoteAvailable);
    setFormFeatured(!!p.featured);
    setFormMaterials(p.materials);
    setFormCare(p.care);
    setFormDetails([...p.details]);
    setFormSizes([...p.sizes]);
    setFormColors([...p.colors]);
    setFormImages([...p.images]);
  };

  const handleOpenCreateNew = () => {
    setIsCreatingNew(true);
    setEditingProduct(null);
    setFormName('');
    setFormTagline('Bespoke crafted garment designed for the Marv. collection.');
    setFormCategory('Outerwear');
    setFormPrice(380);
    setFormOriginalPrice(undefined);
    setFormDescription('Artisanal silhouette cut from premium fabrications with meticulous attention to detail.');
    setFormBadge('New Arrival');
    setFormInStock(true);
    setFormQuoteAvailable(true);
    setFormFeatured(false);
    setFormMaterials('100% Mulberry Silk / Fine Italian Wool');
    setFormCare('Specialist dry clean only. Cool iron on reverse.');
    setFormDetails([
      'Hand-finished seams and custom-engraved Marv. horn buttons',
      'Structured shoulder construction with soft breathable lining',
      'Available for made-to-measure tailored adjustments'
    ]);
    setFormSizes(['S', 'M', 'L']);
    setFormColors([
      { name: 'Rose Quartz', hex: '#F472B6' },
      { name: 'Atelier Ivory', hex: '#FDFBF7' }
    ]);
    setFormImages([
      CURATED_IMAGE_PRESETS[0].url,
      CURATED_IMAGE_PRESETS[1].url
    ]);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Product name cannot be empty', 'info');
      return;
    }
    if (formImages.length === 0) {
      showToast('Please provide at least one product image', 'info');
      return;
    }
    if (formColors.length === 0) {
      showToast('Please provide at least one color swatch', 'info');
      return;
    }

    const payload = {
      name: formName.trim(),
      tagline: formTagline.trim(),
      category: formCategory,
      price: Math.max(1, formPrice),
      originalPrice: formOriginalPrice && formOriginalPrice > formPrice ? formOriginalPrice : undefined,
      rating: editingProduct?.rating || 5.0,
      reviewsCount: editingProduct?.reviewsCount || 1,
      images: formImages,
      sizes: formSizes,
      colors: formColors,
      description: formDescription,
      details: formDetails.length > 0 ? formDetails : ['Tailored signature finish'],
      materials: formMaterials,
      care: formCare,
      inStock: formInStock,
      badge: formBadge.trim() || undefined,
      quoteAvailable: formQuoteAvailable,
      featured: formFeatured,
    };

    if (isCreatingNew) {
      addProduct(payload);
    } else if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    }

    setEditingProduct(null);
    setIsCreatingNew(false);
  };

  const handleAddDetail = () => {
    if (newDetailText.trim()) {
      setFormDetails([...formDetails, newDetailText.trim()]);
      setNewDetailText('');
    }
  };

  const handleRemoveDetail = (idx: number) => {
    setFormDetails(formDetails.filter((_, i) => i !== idx));
  };

  const handleAddColor = () => {
    if (newColorName.trim()) {
      setFormColors([...formColors, { name: newColorName.trim(), hex: newColorHex }]);
      setNewColorName('');
    }
  };

  const handleRemoveColor = (name: string) => {
    if (formColors.length <= 1) {
      showToast('A product must have at least one color shade', 'info');
      return;
    }
    setFormColors(formColors.filter((c) => c.name !== name));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormImages([...formImages, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormImages([...formImages, event.target.result as string]);
          showToast('Image uploaded successfully', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    if (formImages.length <= 1) {
      showToast('Product needs at least one image', 'info');
      return;
    }
    setFormImages(formImages.filter((_, i) => i !== index));
  };

  const toggleSize = (size: 'XS' | 'S' | 'M' | 'L' | 'XL') => {
    if (formSizes.includes(size)) {
      if (formSizes.length === 1) {
        showToast('At least one size must remain active', 'info');
        return;
      }
      setFormSizes(formSizes.filter((s) => s !== size));
    } else {
      setFormSizes([...formSizes, size]);
    }
  };

  // Filter products in catalog view
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-platform-title"
    >
      <div 
        className="bg-white w-full max-w-7xl max-h-[94vh] rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Admin App Bar */}
        <header className="bg-gray-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="admin-platform-title" className="text-base font-bold tracking-tight text-white">
                  MARV. Studio Platform
                </h2>
                <span className="bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                  Admin & Atelier Control
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {currentUser?.name || 'Administrator'} • {currentUser?.title || 'Creative Director'}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center bg-gray-800/80 p-1 rounded-xl gap-1 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('products');
                setEditingProduct(null);
                setIsCreatingNew(false);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'products' ? 'bg-pink-500 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Products ({products.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('quotes');
                setEditingProduct(null);
                setIsCreatingNew(false);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'quotes' ? 'bg-pink-500 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Bespoke Quotes ({quotes.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('orders');
                setEditingProduct(null);
                setIsCreatingNew(false);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'orders' ? 'bg-pink-500 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Orders ({orders.length})</span>
            </button>
          </div>

          {/* Close modal */}
          <button
            onClick={() => setIsAdminPlatformOpen(false)}
            className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            aria-label="Close admin platform"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Platform Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50/50">
          {/* TAB 1: PRODUCT CUSTOMIZATION */}
          {activeTab === 'products' && (
            <div>
              {/* If editing or creating a product, display the Customization Editor */}
              {editingProduct || isCreatingNew ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                  {/* Editor Top Bar */}
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-100">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-pink-600 font-bold">
                        Product Customization Studio
                      </span>
                      <h3 className="text-2xl font-light tracking-tight text-gray-900">
                        {isCreatingNew ? 'Create New Garment' : `Customizing: ${editingProduct?.name}`}
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setIsCreatingNew(false);
                      }}
                      className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs font-bold uppercase tracking-wider"
                    >
                      Back to Catalog
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left 7 Columns: Form Controls */}
                    <div className="lg:col-span-7 space-y-6">
                      {/* Name & Tagline */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Garment Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="e.g. Sculpted Silk Trench"
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-pink-500 outline-hidden font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Category *
                          </label>
                          <select
                            value={formCategory}
                            onChange={(e) => setFormCategory(e.target.value as Exclude<Category, 'All'>)}
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-pink-500 outline-hidden font-medium"
                          >
                            <option value="Outerwear">Outerwear</option>
                            <option value="Dresses">Dresses</option>
                            <option value="Tops">Tops</option>
                            <option value="Trousers">Trousers</option>
                            <option value="Knitwear">Knitwear</option>
                            <option value="Accessories">Accessories</option>
                          </select>
                        </div>
                      </div>

                      {/* Tagline */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                          Editorial Tagline
                        </label>
                        <input
                          type="text"
                          value={formTagline}
                          onChange={(e) => setFormTagline(e.target.value)}
                          placeholder="Single-breasted wool-silk architecture with soft padded shoulders."
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-pink-500 outline-hidden"
                        />
                      </div>

                      {/* Pricing & Badge */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Base Price ($ USD) *
                          </label>
                          <input
                            type="number"
                            required
                            min={1}
                            value={formPrice}
                            onChange={(e) => setFormPrice(Number(e.target.value))}
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-pink-500 outline-hidden font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Original Price (Optional)
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={formOriginalPrice || ''}
                            onChange={(e) => setFormOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                            placeholder="e.g. 480 (for sale)"
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-pink-500 outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Badge Label
                          </label>
                          <input
                            type="text"
                            value={formBadge}
                            onChange={(e) => setFormBadge(e.target.value)}
                            placeholder="e.g. Runway, New Arrival"
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-pink-500 outline-hidden"
                          />
                        </div>
                      </div>

                      {/* Availability Toggles */}
                      <div className="p-4 rounded-xl bg-pink-50/40 border border-pink-100 flex flex-wrap items-center gap-6 text-xs font-semibold">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formInStock}
                            onChange={(e) => setFormInStock(e.target.checked)}
                            className="w-4 h-4 text-pink-600 rounded-sm focus:ring-pink-500"
                          />
                          <span className="text-gray-800">In Stock for Direct Checkout</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formQuoteAvailable}
                            onChange={(e) => setFormQuoteAvailable(e.target.checked)}
                            className="w-4 h-4 text-pink-600 rounded-sm focus:ring-pink-500"
                          />
                          <span className="text-gray-800">Available for Bespoke Quoting</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formFeatured}
                            onChange={(e) => setFormFeatured(e.target.checked)}
                            className="w-4 h-4 text-pink-600 rounded-sm focus:ring-pink-500"
                          />
                          <span className="text-gray-800">Featured Editorial Showcase</span>
                        </label>
                      </div>

                      {/* Color Swatches Customization */}
                      <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                            <Palette className="w-3.5 h-3.5 text-pink-500" />
                            <span>Color Swatches & Tones ({formColors.length})</span>
                          </label>
                        </div>

                        {/* Existing colors list */}
                        <div className="flex flex-wrap gap-2">
                          {formColors.map((color) => (
                            <div
                              key={color.name}
                              className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-full border border-gray-200 bg-gray-50 text-xs font-medium"
                            >
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-xs"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span>{color.name}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveColor(color.name)}
                                className="p-0.5 hover:bg-gray-200 rounded-full text-gray-400 hover:text-red-600"
                                aria-label={`Remove color ${color.name}`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add color tool */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                          <input
                            type="color"
                            value={newColorHex}
                            onChange={(e) => setNewColorHex(e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200 p-0.5"
                          />
                          <input
                            type="text"
                            value={newColorName}
                            onChange={(e) => setNewColorName(e.target.value)}
                            placeholder="Color Name (e.g. Blush Dahlia)"
                            className="flex-1 min-w-[140px] px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={handleAddColor}
                            className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Swatch</span>
                          </button>
                        </div>

                        {/* Preset Quick Swatches */}
                        <div className="pt-2">
                          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
                            Quick Presets:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {PRESET_COLOR_SWATCHES.map((preset) => (
                              <button
                                key={preset.name}
                                type="button"
                                onClick={() => {
                                  if (!formColors.some((c) => c.name === preset.name)) {
                                    setFormColors([...formColors, preset]);
                                  }
                                }}
                                className="text-[11px] px-2 py-0.5 rounded-full border border-gray-200 hover:border-pink-300 hover:bg-pink-50 text-gray-600 flex items-center gap-1"
                              >
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.hex }} />
                                <span>{preset.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Sizes Matrix */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                          Enabled Sizing Range
                        </label>
                        <div className="flex gap-2">
                          {(['XS', 'S', 'M', 'L', 'XL'] as const).map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => toggleSize(sz)}
                              className={`w-11 h-10 rounded-xl text-xs font-bold transition-all border ${
                                formSizes.includes(sz)
                                  ? 'bg-gray-900 text-white border-gray-900'
                                  : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Product Imagery Customization */}
                      <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                          <Image className="w-3.5 h-3.5 text-pink-500" />
                          <span>Garment Imagery & Gallery ({formImages.length})</span>
                        </label>

                        {/* Current images thumbnails */}
                        <div className="grid grid-cols-4 gap-2">
                          {formImages.map((imgUrl, idx) => (
                            <div key={idx} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-gray-200 group bg-gray-100">
                              <img src={imgUrl} alt="Product" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                                aria-label="Delete image"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                                #{idx + 1}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Add image URL or file upload */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                          <input
                            type="url"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder="Add image URL (https://...)"
                            className="flex-1 min-w-[200px] px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={handleAddImage}
                            className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg uppercase tracking-wider"
                          >
                            Add URL
                          </button>
                          <label className="px-3 py-1.5 border border-pink-200 text-pink-600 hover:bg-pink-50 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer">
                            Upload File
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                          </label>
                        </div>

                        {/* Presets */}
                        <div className="pt-2">
                          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
                            Curated Fashion Presets:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {CURATED_IMAGE_PRESETS.map((preset) => (
                              <button
                                key={preset.name}
                                type="button"
                                onClick={() => {
                                  if (!formImages.includes(preset.url)) {
                                    setFormImages([...formImages, preset.url]);
                                  }
                                }}
                                className="text-[11px] px-2.5 py-1 rounded-lg border border-gray-200 hover:border-pink-300 hover:bg-pink-50 text-gray-600 flex items-center gap-1"
                              >
                                <span>{preset.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Description & Materials */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Description *
                          </label>
                          <textarea
                            rows={3}
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-pink-500 outline-hidden leading-relaxed"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                              Materials Composition
                            </label>
                            <input
                              type="text"
                              value={formMaterials}
                              onChange={(e) => setFormMaterials(e.target.value)}
                              placeholder="e.g. 100% Mulberry Silk (22 momme)"
                              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-pink-500 outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                              Care Instructions
                            </label>
                            <input
                              type="text"
                              value={formCare}
                              onChange={(e) => setFormCare(e.target.value)}
                              placeholder="e.g. Specialist dry clean only."
                              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-pink-500 outline-hidden"
                            />
                          </div>
                        </div>

                        {/* Bullet Details */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Atelier Craft Points
                          </label>
                          <div className="space-y-1.5 mb-2">
                            {formDetails.map((detail, idx) => (
                              <div key={idx} className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded-lg text-xs text-gray-700">
                                <span>• {detail}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDetail(idx)}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newDetailText}
                              onChange={(e) => setNewDetailText(e.target.value)}
                              placeholder="Add bespoke detail point..."
                              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-hidden"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddDetail();
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={handleAddDetail}
                              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
                            >
                              Add Point
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 flex items-center gap-3 border-t border-gray-100">
                        <button
                          type="submit"
                          className="flex-1 py-3 px-6 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-pink-200 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>{isCreatingNew ? 'Publish to Marv. Collection' : 'Save Changes'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(null);
                            setIsCreatingNew(false);
                          }}
                          className="py-3 px-6 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold uppercase tracking-widest rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                    {/* Right 5 Columns: Live Storefront Card Preview */}
                    <div className="lg:col-span-5">
                      <div className="sticky top-6">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                          <Eye className="w-3.5 h-3.5 text-pink-500" />
                          <span>Live Storefront Card Preview</span>
                        </div>

                        {/* Product Card Replica */}
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md">
                          <div className="relative aspect-[3/4] bg-pink-50/50 overflow-hidden">
                            {formImages[0] ? (
                              <img src={formImages[0]} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No image selected
                              </div>
                            )}

                            {formBadge && (
                              <div className="absolute top-3 left-3">
                                <span className="px-2.5 py-1 bg-white/95 text-pink-600 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs border border-pink-100">
                                  {formBadge}
                                </span>
                              </div>
                            )}

                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                              <span className="bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                                {formatPrice(formPrice)}
                                {formOriginalPrice && formOriginalPrice > formPrice && (
                                  <span className="ml-1 line-through text-gray-400 text-[9px]">
                                    {formatPrice(formOriginalPrice)}
                                  </span>
                                )}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                formInStock ? 'bg-emerald-500 text-white' : 'bg-gray-500 text-white'
                              }`}>
                                {formInStock ? 'In Stock' : 'Bespoke Only'}
                              </span>
                            </div>
                          </div>

                          <div className="p-4 space-y-2">
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                              {formCategory}
                            </span>
                            <h4 className="font-bold text-base text-gray-900 leading-snug">
                              {formName || 'Untitled Garment'}
                            </h4>
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {formTagline || formDescription}
                            </p>

                            {/* Colors */}
                            <div className="flex items-center gap-1.5 pt-2">
                              {formColors.map((col) => (
                                <span
                                  key={col.name}
                                  className="w-3.5 h-3.5 rounded-full border border-gray-300"
                                  style={{ backgroundColor: col.hex }}
                                  title={col.name}
                                />
                              ))}
                              <span className="text-[10px] text-gray-400 ml-1">
                                {formColors.length} shade{formColors.length > 1 ? 's' : ''}
                              </span>
                            </div>

                            {/* Sizes */}
                            <div className="flex gap-1 pt-1">
                              {formSizes.map((sz) => (
                                <span key={sz} className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">
                                  {sz}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <p className="text-[11px] text-gray-400 mt-3 text-center">
                          Updates save instantly to the storefront, cart, and custom quote catalog.
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                /* Catalog Overview Grid / Table */
                <div className="space-y-6">
                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                    {/* Search & Filter */}
                    <div className="flex flex-wrap items-center gap-2.5 flex-1">
                      <div className="relative min-w-[220px]">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          placeholder="Search garments by name or category..."
                          className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-hidden focus:bg-white focus:border-pink-500"
                        />
                      </div>

                      {/* Category selector */}
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-hidden"
                      >
                        <option value="All">All Categories</option>
                        <option value="Outerwear">Outerwear</option>
                        <option value="Dresses">Dresses</option>
                        <option value="Tops">Tops</option>
                        <option value="Trousers">Trousers</option>
                        <option value="Knitwear">Knitwear</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                    </div>

                    {/* CTAs */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={resetProductsToDefault}
                        className="px-3 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-600 flex items-center gap-1.5 transition-colors"
                        title="Reset catalog back to initial Marv. default collection"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
                        <span className="hidden sm:inline">Reset Defaults</span>
                      </button>

                      <button
                        onClick={handleOpenCreateNew}
                        className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Garment</span>
                      </button>
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between hover:border-pink-300 transition-all group"
                      >
                        <div className="flex gap-4">
                          {/* Image Thumbnail */}
                          <div className="w-24 h-32 rounded-xl overflow-hidden bg-pink-50 shrink-0 relative border border-gray-100">
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                            />
                            {prod.badge && (
                              <span className="absolute top-1 left-1 bg-white/90 text-pink-600 text-[8px] font-bold px-1.5 py-0.5 rounded shadow-xs uppercase">
                                {prod.badge}
                              </span>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] uppercase font-bold text-gray-400">
                                {prod.category}
                              </span>
                              <span className="text-xs font-bold text-gray-900 font-mono">
                                {formatPrice(prod.price)}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-gray-900 truncate mt-0.5">
                              {prod.name}
                            </h4>
                            <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                              {prod.tagline || prod.description}
                            </p>

                            {/* Color Swatches */}
                            <div className="flex items-center gap-1 mt-2">
                              {prod.colors.map((c) => (
                                <span
                                  key={c.name}
                                  className="w-2.5 h-2.5 rounded-full border border-gray-300"
                                  style={{ backgroundColor: c.hex }}
                                  title={c.name}
                                />
                              ))}
                              <span className="text-[10px] text-gray-400 ml-1">
                                {prod.sizes.join(' • ')}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                prod.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                              }`}>
                                {prod.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                              {prod.quoteAvailable && (
                                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-pink-50 text-pink-600">
                                  Bespoke Quote
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-gray-100 text-xs">
                          <button
                            onClick={() => duplicateProduct(prod.id)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Duplicate product"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(prod.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="px-3 py-1.5 bg-gray-900 hover:bg-pink-600 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Customize</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                      <p className="text-gray-500 text-sm">No products found matching your filter.</p>
                      <button
                        onClick={() => {
                          setProductSearch('');
                          setSelectedCategory('All');
                        }}
                        className="mt-2 text-pink-600 font-bold text-xs hover:underline"
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BESPOKE QUOTES PIPELINE */}
          {activeTab === 'quotes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Bespoke Inquiry Management</h3>
                  <p className="text-xs text-gray-500">Track and advance client custom orders through atelier production stages.</p>
                </div>
                <span className="bg-pink-50 text-pink-600 font-bold text-xs px-3 py-1 rounded-full border border-pink-200">
                  {quotes.length} Inquiries
                </span>
              </div>

              <div className="space-y-3">
                {quotes.map((q) => (
                  <div key={q.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-pink-600">#{q.id}</span>
                          <span className="text-xs font-bold text-gray-900">{q.clientName}</span>
                          <span className="text-xs text-gray-400">({q.clientEmail} • {q.clientPhone})</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Project: <strong className="text-gray-700 capitalize">{q.projectType.replace('_', ' ')}</strong> • Silhouette: <strong className="text-gray-700">{q.garmentSilhouette}</strong> • Qty: <strong>{q.targetQuantity} units</strong>
                        </p>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold uppercase text-gray-400">Stage:</label>
                        <select
                          value={q.status}
                          onChange={(e) => updateQuoteStatus(q.id, e.target.value as any)}
                          className="text-xs font-bold py-1.5 px-3 rounded-lg border border-pink-200 bg-pink-50 text-pink-700 outline-hidden cursor-pointer"
                        >
                          <option value="Under Review">Under Review</option>
                          <option value="Material Sourcing">Material Sourcing</option>
                          <option value="Pattern Drafting">Pattern Drafting</option>
                          <option value="Tailor Assigned">Tailor Assigned</option>
                          <option value="Approved">Approved & Sizing Complete</option>
                        </select>
                        <button
                          onClick={() => deleteQuote(q.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600"
                          title="Delete quote"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Details Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <span className="font-bold text-gray-400 uppercase text-[10px] block">Fabric & Shade</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: q.pinkTone.hex }} />
                          <span className="font-semibold text-gray-800">{q.pinkTone.name}</span>
                        </div>
                        <span className="text-gray-500 mt-0.5 block">{q.fabricType}</span>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-xl">
                        <span className="font-bold text-gray-400 uppercase text-[10px] block">Budget & Timeline</span>
                        <span className="font-bold text-gray-900 text-sm mt-1 block">
                          ${q.estimatedBudget.toLocaleString()} USD
                        </span>
                        <span className="text-gray-500 capitalize">{q.targetTimeline} Delivery</span>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-xl">
                        <span className="font-bold text-gray-400 uppercase text-[10px] block">Client Notes</span>
                        <p className="text-gray-600 line-clamp-2 mt-1 italic">
                          "{q.notes || 'No custom notes provided.'}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Direct Purchases & Dispatches</h3>
                  <p className="text-xs text-gray-500">Orders placed by clients for ready-to-wear items.</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-3 py-1 rounded-full border border-emerald-200">
                  {orders.length} Orders
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                  <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No client purchases placed yet in this session.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((o) => (
                    <div key={o.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-gray-900">#{o.id}</span>
                            <span className="text-xs font-bold text-gray-700">{o.customer.fullName}</span>
                            <span className="text-xs text-gray-400 font-mono">Tracking: {o.trackingNumber}</span>
                          </div>
                          <span className="text-xs text-gray-500 mt-0.5 block">
                            Destination: {o.customer.city}, {o.customer.country}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900 font-mono">
                            {formatPrice(o.total)}
                          </span>
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                            className="text-xs font-bold py-1.5 px-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 outline-hidden cursor-pointer"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="In Production">In Production</option>
                            <option value="Dispatched">Dispatched</option>
                          </select>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="flex flex-wrap gap-2 text-xs">
                        {o.items.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                            <img src={it.product.images[0]} alt={it.product.name} className="w-7 h-9 object-cover rounded" />
                            <div>
                              <span className="font-bold text-gray-800 block">{it.product.name}</span>
                              <span className="text-gray-500">{it.size} • {it.color.name} (Qty: {it.quantity})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
