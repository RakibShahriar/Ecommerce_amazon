import React, { useState } from 'react';
import { Star, Check, SlidersHorizontal, Grid, List, RotateCcw, X, Filter } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { toBanglaDigits } from '../utils/formatters';
import { ProductCard } from './ProductCard';
import { DEPARTMENTS } from '../data/mockProducts';
import { QuickViewModal } from './QuickViewModal';
import { Product } from '../types';

export const SearchAndFilterView: React.FC = () => {
  const {
    filteredProducts,
    products,
    filters,
    updateFilter,
    resetFilters,
    setSearchQuery,
  } = useShop();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [minPriceInput, setMinPriceInput] = useState<string>(filters.minPrice ? String(filters.minPrice) : '');
  const [maxPriceInput, setMaxPriceInput] = useState<string>(filters.maxPrice ? String(filters.maxPrice) : '');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Extract all unique brands from catalog
  const allBrands: string[] = Array.from<string>(new Set(products.map((p) => p.brand))).sort();

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    const min = minPriceInput ? parseFloat(minPriceInput) : null;
    const max = maxPriceInput ? parseFloat(maxPriceInput) : null;
    updateFilter('minPrice', isNaN(min as number) ? null : min);
    updateFilter('maxPrice', isNaN(max as number) ? null : max);
  };

  const handleBrandToggle = (brand: string) => {
    const exists = filters.brands.includes(brand);
    const updated = exists
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    updateFilter('brands', updated);
  };

  const hasActiveFilters =
    filters.department !== 'All Departments' ||
    filters.category ||
    filters.minRating !== null ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.primeOnly ||
    filters.dealsOnly ||
    filters.climateFriendlyOnly ||
    filters.brands.length > 0 ||
    Boolean(filters.searchQuery);

  return (
    <div className="max-w-[1500px] mx-auto px-2 sm:px-4 py-4 space-y-4">
      {/* Top Banner / Results Header */}
      <div className="bg-white p-3.5 sm:p-4 rounded-md shadow-sm border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Results Count & Query text */}
        <div>
          <div className="text-xs text-gray-500 flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => updateFilter('department', 'All Departments')}
              className="hover:text-amber-600 hover:underline"
            >
              All
            </button>
            <span>&gt;</span>
            <span className="font-semibold text-gray-700">{filters.department}</span>
            {filters.category && (
              <>
                <span>&gt;</span>
                <span className="font-semibold text-gray-700">{filters.category}</span>
              </>
            )}
          </div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 mt-1">
            {filteredProducts.length > 0
              ? `১-${toBanglaDigits(filteredProducts.length)} / মোট ${toBanglaDigits(filteredProducts.length)} টি ফলাফল`
              : '০ টি ফলাফল'}{' '}
            {filters.searchQuery && (
              <span className="text-[#c7511f]">for "{filters.searchQuery}"</span>
            )}
          </h1>
        </div>

        {/* Sorting & Layout Toggles */}
        <div className="flex items-center gap-2 sm:gap-4 w-full md:w-auto justify-between md:justify-end">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-md border border-gray-300 text-xs font-semibold text-gray-800"
          >
            <Filter className="w-3.5 h-3.5" />
            Filters {hasActiveFilters && '(Active)'}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-600 font-medium whitespace-nowrap hidden sm:inline">
              Sort by:
            </span>
            <select
              id="sort-select"
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value as any)}
              className="bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-md px-2.5 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-sm cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price_low_to_high">Price: Low to High</option>
              <option value="price_high_to_low">Price: High to Low</option>
              <option value="avg_review">Avg. Customer Review</option>
              <option value="newest">Newest Arrivals / Popularity</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="hidden sm:flex items-center bg-gray-100 rounded-md p-0.5 border border-gray-300">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${
                viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex gap-6 items-start">
        {/* Left Filter Sidebar */}
        <aside
          className={`w-64 flex-shrink-0 bg-white rounded-md p-4 shadow-sm border border-gray-200 space-y-5 text-xs md:block ${
            mobileFilterOpen ? 'block fixed inset-0 z-50 overflow-y-auto m-0 rounded-none' : 'hidden'
          }`}
        >
          {/* Mobile Header with Close */}
          <div className="flex items-center justify-between pb-2 border-b border-gray-200 md:hidden">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              Filter Products
            </h3>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <div className="pb-3 border-b border-gray-200 flex items-center justify-between">
              <span className="font-semibold text-gray-700">Applied Filters</span>
              <button
                onClick={() => {
                  resetFilters();
                  setMinPriceInput('');
                  setMaxPriceInput('');
                }}
                className="text-[#007185] hover:text-[#c7511f] hover:underline flex items-center gap-1 font-bold"
              >
                <RotateCcw className="w-3 h-3" /> Clear all
              </button>
            </div>
          )}

          {/* Prime Delivery filter */}
          <div className="space-y-2 pb-4 border-b border-gray-200">
            <h4 className="font-bold text-gray-900 text-sm">Delivery Day</h4>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.primeOnly}
                onChange={(e) => updateFilter('primeOnly', e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
              />
              <div className="flex items-center gap-1">
                <span className="font-black italic text-[#00a8e1] tracking-tighter text-sm">prime</span>
                <Check className="w-3.5 h-3.5 text-[#00a8e1] stroke-[3]" />
                <span className="text-gray-700 text-xs">FREE One-Day</span>
              </div>
            </label>
          </div>

          {/* Departments */}
          <div className="space-y-2 pb-4 border-b border-gray-200">
            <h4 className="font-bold text-gray-900 text-sm">Department</h4>
            <ul className="space-y-1.5">
              {DEPARTMENTS.map((dept) => (
                <li key={dept}>
                  <button
                    onClick={() => updateFilter('department', dept)}
                    className={`text-left w-full hover:text-amber-600 hover:underline ${
                      filters.department === dept ? 'font-bold text-amber-700' : 'text-gray-700'
                    }`}
                  >
                    {dept}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Reviews Rating */}
          <div className="space-y-2 pb-4 border-b border-gray-200">
            <h4 className="font-bold text-gray-900 text-sm">Customer Reviews</h4>
            <ul className="space-y-1.5">
              {[4, 3, 2, 1].map((stars) => (
                <li key={stars}>
                  <button
                    onClick={() =>
                      updateFilter('minRating', filters.minRating === stars ? null : stars)
                    }
                    className={`flex items-center gap-1.5 hover:text-amber-600 w-full text-left p-1 rounded ${
                      filters.minRating === stars ? 'bg-amber-50 font-bold' : ''
                    }`}
                  >
                    <div className="flex items-center text-[#de7921]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < stars ? 'fill-[#de7921] text-[#de7921]' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-700">&amp; Up</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 pb-4 border-b border-gray-200">
            <h4 className="font-bold text-gray-900 text-sm">Price</h4>
            <ul className="space-y-1.5">
              {[
                { label: '৳৫০০-এর নিচে', min: null, max: 500 },
                { label: '৳৫০০ থেকে ৳১,০০০', min: 500, max: 1000 },
                { label: '৳১,০০০ থেকে ৳১,৫০০', min: 1000, max: 1500 },
                { label: '৳১,৫০০ থেকে ৳২,০০০', min: 1500, max: 2000 },
                { label: '৳২,০০০ এবং উপরে', min: 2000, max: null },
              ].map((range, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => {
                      updateFilter('minPrice', range.min);
                      updateFilter('maxPrice', range.max);
                      setMinPriceInput(range.min ? String(range.min) : '');
                      setMaxPriceInput(range.max ? String(range.max) : '');
                    }}
                    className={`text-left hover:text-amber-600 hover:underline ${
                      filters.minPrice === range.min && filters.maxPrice === range.max
                        ? 'font-bold text-amber-700'
                        : 'text-gray-700'
                    }`}
                  >
                    {range.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Custom Min/Max Form */}
            <form onSubmit={handlePriceApply} className="pt-2 flex items-center gap-1.5">
              <input
                type="number"
                placeholder="৳ Min"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="৳ Max"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded font-semibold text-gray-800 shadow-sm"
              >
                Go
              </button>
            </form>
          </div>

          {/* Deals & Climate */}
          <div className="space-y-2 pb-4 border-b border-gray-200">
            <h4 className="font-bold text-gray-900 text-sm">Deals &amp; Discounts</h4>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.dealsOnly}
                onChange={(e) => updateFilter('dealsOnly', e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
              />
              <span className="text-gray-700 text-xs">Today's Deals Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                checked={filters.climateFriendlyOnly}
                onChange={(e) => updateFilter('climateFriendlyOnly', e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
              />
              <span className="text-gray-700 text-xs">Climate Pledge Friendly</span>
            </label>
          </div>

          {/* Brands */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-900 text-sm">Brand</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {allBrands.map((b) => (
                <label key={b} className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(b)}
                    onChange={() => handleBrandToggle(b)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                  />
                  <span className="text-gray-700 text-xs">{b}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results Grid / List Column */}
        <main className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-md p-12 text-center border border-gray-200 space-y-4">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">No matching items found</h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Try clearing some filters or searching for general keywords like "AirPods", "Kindle", "Ninja", or "Headphones".
              </p>
              <button
                onClick={() => {
                  resetFilters();
                  setMinPriceInput('');
                  setMaxPriceInput('');
                }}
                className="px-5 py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold text-sm rounded-full shadow"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                  : 'space-y-4'
              }
            >
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  layout={viewMode === 'list' ? 'horizontal' : 'grid'}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Quick Look Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
