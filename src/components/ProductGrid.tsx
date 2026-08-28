import React, { useState, useMemo } from 'react';
import { Category, Product, FilterState } from '../types';
import { ProductCard } from './ProductCard';
import { useShop } from '../context/ShopContext';
import { Search, SlidersHorizontal, Grid3X3, BookOpen, X, Sparkles, FileText, ArrowRight } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  activeCategory?: string;
  onCategoryChange?: (cat: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onSelectProduct,
  activeCategory = 'All',
  onCategoryChange,
}) => {
  const { savedIds, openQuoteForProduct, formatPrice } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [sortBy, setSortBy] = useState<FilterState['sortBy']>('featured');
  const [pinkTonesOnly, setPinkTonesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'lookbook'>('grid');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const categories: (Category | 'Saved')[] = [
    'All',
    'Outerwear',
    'Dresses',
    'Tops',
    'Trousers',
    'Knitwear',
    'Accessories',
    'Saved',
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter
      if (activeCategory === 'Saved') {
        if (!savedIds.includes(item.id)) return false;
      } else if (activeCategory !== 'All' && item.category !== activeCategory) {
        return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        const matchesMaterial = item.materials.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat && !matchesMaterial) {
          return false;
        }
      }

      // Size
      if (selectedSize !== 'All' && !item.sizes.includes(selectedSize as any)) {
        return false;
      }

      // Pink tone filter
      if (pinkTonesOnly) {
        const hasPink = item.colors.some((c) =>
          ['rose', 'blush', 'petal', 'pink', 'shell', 'dahlia'].some((term) =>
            c.name.toLowerCase().includes(term)
          )
        );
        if (!hasPink) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: featured first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [products, activeCategory, searchQuery, selectedSize, pinkTonesOnly, sortBy, savedIds]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSize('All');
    setPinkTonesOnly(false);
    setSortBy('featured');
    if (onCategoryChange) onCategoryChange('All');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" id="collection-section">
      {/* Category Pills & Controls */}
      <div className="flex flex-col gap-5 mb-8">
        {/* Row 1: Category scrolling tabs */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange && onCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 ${
                  activeCategory === cat
                    ? 'bg-pink-500 text-white shadow-none'
                    : 'bg-gray-50 hover:bg-pink-50 text-gray-500 hover:text-pink-600 border border-gray-100'
                }`}
                id={`cat-filter-${cat.toLowerCase()}`}
              >
                {cat === 'Saved' ? `Archive (${savedIds.length})` : cat}
              </button>
            ))}
          </div>

          {/* View Mode Toggle: Grid vs Lookbook */}
          <div className="hidden sm:flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Minimal Grid View"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('lookbook')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'lookbook'
                  ? 'bg-white text-pink-600 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Editorial Lookbook View"
            >
              <BookOpen className="w-3.5 h-3.5 text-pink-500" />
              <span>Editorial</span>
            </button>
          </div>
        </div>

        {/* Row 2: Search, Filters, and Sorters */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by silhouette, silk, blazer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-8 py-2 text-xs bg-white border border-gray-200 rounded-full focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all text-gray-900 placeholder:text-gray-400"
              id="product-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Filters */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Signature Pink Only Filter Toggle */}
            <button
              onClick={() => setPinkTonesOnly(!pinkTonesOnly)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all ${
                pinkTonesOnly
                  ? 'bg-pink-50 border-pink-300 text-pink-700 font-semibold shadow-xs'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-pink-200'
              }`}
              id="filter-pink-palette-btn"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
              <span>Pink Palette</span>
            </button>

            {/* Size Filter */}
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-700 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 cursor-pointer"
            >
              <option value="All">All Sizes</option>
              <option value="XS">Size XS</option>
              <option value="S">Size S</option>
              <option value="M">Size M</option>
              <option value="L">Size L</option>
              <option value="XL">Size XL</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-700 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 cursor-pointer"
            >
              <option value="featured">Curated (Featured)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className="sm:hidden p-2 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-pink-50"
              aria-label="Filter"
            >
              <SlidersHorizontal className="w-4 h-4 text-pink-600" />
            </button>
          </div>
        </div>

        {/* Results summary bar */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
          <span>
            Showing <strong className="text-gray-900 font-semibold">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'creation' : 'creations'}
            {activeCategory !== 'All' && <span> in <strong className="text-pink-600">{activeCategory}</strong></span>}
            {pinkTonesOnly && <span> • in signature rose shades</span>}
          </span>

          {(searchQuery || selectedSize !== 'All' || pinkTonesOnly || activeCategory !== 'All') && (
            <button
              onClick={handleResetFilters}
              className="text-pink-600 hover:text-pink-800 underline font-medium"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Grid or Lookbook Mode */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-pink-200 p-8">
          <div className="w-12 h-12 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            No matching creations found
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">
            We couldn’t find garments matching your criteria. You can reset filters or request a bespoke quote to have it custom-tailored!
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={() => openQuoteForProduct()}
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Request Bespoke Quote
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        /* Editorial Lookbook Mode */
        <div className="space-y-12">
          {filteredProducts.map((product, idx) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className={`cursor-pointer rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-pink-200 transition-all p-6 sm:p-8 flex flex-col ${
                idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-8 items-center group shadow-xs hover:shadow-xl`}
            >
              {/* Images Showcase */}
              <div className="w-full lg:w-1/2 grid grid-cols-2 gap-3">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-pink-50">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-pink-50">
                  <img
                    src={product.images[1] || product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Editorial Description & Quotes */}
              <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-pink-600">
                      {product.category} • Atelier Edition
                    </span>
                    {product.badge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800 text-[10px] font-semibold">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">
                    {product.name}
                  </h2>

                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {product.description}
                  </p>

                  {/* Highlights list */}
                  <div className="space-y-1.5 mb-6 text-xs text-gray-500">
                    <p><strong className="text-gray-800">Materials:</strong> {product.materials}</p>
                    <p><strong className="text-gray-800">Care:</strong> {product.care}</p>
                  </div>

                  {/* Color tones */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs text-gray-400">Available Tones:</span>
                    <div className="flex items-center gap-1.5">
                      {product.colors.map((c) => (
                        <span
                          key={c.name}
                          className="w-4 h-4 rounded-full border border-gray-200 shadow-xs"
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openQuoteForProduct(product);
                      }}
                      className="px-4 py-2.5 bg-pink-50 text-pink-700 border border-pink-200 rounded-full text-xs font-semibold hover:bg-pink-100 transition-colors flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-pink-600" />
                      <span>Request Quote for this Piece</span>
                    </button>

                    <button
                      onClick={() => onSelectProduct(product)}
                      className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-none"
                    >
                      <span>View & Buy</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
