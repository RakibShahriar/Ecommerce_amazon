import React from 'react';
import { Menu, Sparkles, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SubNav: React.FC = () => {
  const { setSideNavOpen, setSearchQuery, updateFilter, setActiveView, setSelectedProductId } = useShop();

  const handleCategoryClick = (dept: string, query = '') => {
    setSelectedProductId(null);
    updateFilter('department', dept);
    updateFilter('category', '');
    updateFilter('dealsOnly', false);
    setSearchQuery(query, dept);
    setActiveView('search');
  };

  const handleDealsClick = () => {
    setSelectedProductId(null);
    updateFilter('department', 'All Departments');
    updateFilter('dealsOnly', true);
    setActiveView('search');
  };

  const items = ['মধু', 'বীজ ও পাউডার', 'চাল ও শস্য', 'তেল ও ঘি', 'কম্বোপ্যাক', 'মসলা', 'আটা ও ছাতু'];

  return (
    <nav className="bg-[#232f3e] text-white text-xs font-medium border-t border-slate-700/50 shadow-sm overflow-x-auto no-scrollbar">
      <div className="max-w-[1500px] mx-auto px-2 sm:px-4 flex items-center justify-between gap-1 min-h-[38px] whitespace-nowrap">
        {/* Left Links */}
        <div className="flex items-center gap-1">
          {/* Hamburger All Menu */}
          <button
            id="all-menu-toggle-btn"
            onClick={() => setSideNavOpen(true)}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-sm hover:ring-1 hover:ring-white transition font-bold text-white flex-shrink-0"
          >
            <Menu className="w-4 h-4" />
            <span>All</span>
          </button>

          {/* Today's Deals */}
          <button
            id="subnav-todays-deals-btn"
            onClick={handleDealsClick}
            className="px-2 py-1.5 rounded-sm hover:ring-1 hover:ring-white transition text-gray-100 font-semibold flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            Today's Deals
          </button>

          {/* Seller Central / Admin Link */}
          <button
            id="subnav-seller-central-btn"
            onClick={() => setActiveView('admin')}
            className="px-2 py-1.5 rounded-sm hover:ring-1 hover:ring-white transition text-amber-400 font-bold flex items-center gap-1 bg-amber-400/10 border border-amber-400/30"
          >
            Seller Central (Admin)
          </button>

          {/* 7 Item Section Buttons */}
          {items.map((item) => (
            <button
              key={item}
              id={`subnav-${item.toLowerCase()}-btn`}
              onClick={() => handleCategoryClick(item)}
              className="px-2.5 py-1.5 rounded-sm hover:ring-1 hover:ring-white transition font-bold text-gray-100 hover:text-amber-400"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Right Promo */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-amber-300 font-semibold px-2 py-1 bg-white/5 rounded-full border border-amber-400/20">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>7 Item Sections Storefront Active</span>
        </div>
      </div>
    </nav>
  );
};
