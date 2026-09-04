import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, SlidersHorizontal } from 'lucide-react';
import { HOME_CARDS, MOCK_PRODUCTS } from '../data/mockProducts';
import { ProductCard } from './ProductCard';
import { useShop } from '../context/ShopContext';
import { toBanglaDigits } from '../utils/formatters';
import { Product } from '../types';
import { QuickViewModal } from './QuickViewModal';

export const HomeFeed: React.FC = () => {
  const { setSearchQuery, updateFilter, setActiveView, setSelectedProductId } = useShop();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleSectionClick = (category: string) => {
    setSelectedProductId(null);
    updateFilter('department', category);
    updateFilter('category', '');
    setSearchQuery('', category);
    setActiveView('search');
  };

  const handleSubItemClick = (category: string, query: string) => {
    setSelectedProductId(null);
    updateFilter('department', category);
    setSearchQuery(query, category);
    setActiveView('search');
  };

  const scrollCarousel = (id: string, direction: 'left' | 'right') => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  const banglaCategories = ['মধু', 'বীজ ও পাউডার', 'চাল ও শস্য', 'তেল ও ঘি', 'কম্বোপ্যাক', 'মসলা', 'আটা ও ছাতু'];

  return (
    <div className="relative z-10 max-w-[1500px] mx-auto px-2 sm:px-4 -mt-20 md:-mt-44 pb-16 space-y-6">
      
      {/* Category Navigation Pills Ribbon */}
      <div className="bg-white p-3 rounded-xl shadow-md border border-gray-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0 mr-1">
          <Sparkles className="w-4 h-4 text-amber-500" /> ক্যাটাগরি:
        </span>
        {banglaCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleSectionClick(cat)}
            className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-400 text-amber-950 hover:text-gray-950 border border-amber-200 hover:border-amber-500 rounded-full text-xs font-bold transition flex-shrink-0 shadow-sm"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 7 Item Sections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {HOME_CARDS.map((card) => (
          <div
            key={card.id}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-gray-200/80 group"
          >
            <div>
              {/* Section Header */}
              <div className="flex items-baseline justify-between mb-2">
                <h2 className="text-xl font-black text-gray-900 tracking-tight group-hover:text-amber-600 transition-colors">
                  {card.title}
                </h2>
                <span className="text-xs text-gray-500 font-medium">{card.subtitle}</span>
              </div>

              {/* Main Hero Picture for this section */}
              <div
                onClick={() => handleSectionClick(card.category)}
                className="cursor-pointer mb-3 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 relative group/hero aspect-[16/9]"
              >
                <img
                  src={card.heroImage}
                  alt={`${card.title} Hero`}
                  className="w-full h-full object-cover group-hover/hero:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-2 left-3 right-3 text-white">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 bg-black/50 px-2 py-0.5 rounded">
                    Featured {card.title}
                  </span>
                </div>
              </div>

              {/* Sub-items grid inside section */}
              {card.items && card.items.length > 0 && (
                <div className={`grid gap-2 ${card.items.length >= 4 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {card.items.slice(0, 4).map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSubItemClick(card.category, item.name)}
                      className="group/item cursor-pointer flex items-center gap-2 p-1.5 rounded-lg bg-gray-50 hover:bg-amber-50/70 border border-gray-100 hover:border-amber-200 transition"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded flex-shrink-0 border border-gray-200"
                      />
                      <span className="text-xs font-semibold text-gray-800 line-clamp-1 group-hover/item:text-amber-700">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Explore Section Footer Link */}
            <button
              onClick={() => handleSectionClick(card.category)}
              className="text-xs font-bold text-[#007185] hover:text-[#c7511f] hover:underline pt-4 flex items-center justify-between border-t border-gray-100 mt-3"
            >
              <span>{card.linkText}</span>
              <ChevronRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      {/* Mobile-First Touch-Swipeable Horizontal Carousels for Categories */}
      {banglaCategories.map((itemCategory) => {
        const itemProducts = MOCK_PRODUCTS.filter((p) => p.department === itemCategory);
        if (itemProducts.length === 0) return null;
        const carouselId = `carousel-${itemCategory.replace(/\s+/g, '-')}`;

        return (
          <div
            key={itemCategory}
            className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200 space-y-3 relative group/carousel"
          >
            {/* Category Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 text-amber-900 rounded-lg font-black text-xs uppercase tracking-wider">
                  {itemCategory}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  {itemCategory} কালেকশন
                </h3>
              </div>
              <button
                onClick={() => handleSectionClick(itemCategory)}
                className="text-xs font-bold text-[#007185] hover:text-[#c7511f] hover:underline flex items-center gap-0.5"
              >
                সব দেখুন ({toBanglaDigits(itemProducts.length)}) <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Carousel Container with Scroll Buttons */}
            <div className="relative">
              <button
                type="button"
                onClick={() => scrollCarousel(carouselId, 'left')}
                className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 bg-white/95 text-gray-800 p-2 rounded-full shadow-lg border border-gray-200 hover:bg-amber-400 hover:text-gray-950 transition opacity-0 group-hover/carousel:opacity-100 hidden sm:flex items-center justify-center focus:outline-none"
                title="Scroll Left"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={() => scrollCarousel(carouselId, 'right')}
                className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 bg-white/95 text-gray-800 p-2 rounded-full shadow-lg border border-gray-200 hover:bg-amber-400 hover:text-gray-950 transition opacity-0 group-hover/carousel:opacity-100 hidden sm:flex items-center justify-center focus:outline-none"
                title="Scroll Right"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Touch-Swipeable Horizontal Track */}
              <div
                id={carouselId}
                className="flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 scrollbar-none scroll-smooth pb-2 pt-1 px-1"
              >
                {itemProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="w-[200px] sm:w-[230px] flex-shrink-0 snap-start"
                  >
                    <ProductCard
                      product={prod}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

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

