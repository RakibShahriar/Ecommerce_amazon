import React from 'react';
import { X, User, ChevronRight, Flame, Sparkles, Tv, Smartphone, BookOpen, Shirt, Home, Gamepad2, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { DEPARTMENTS } from '../data/mockProducts';

export const SideNavDrawer: React.FC = () => {
  const { sideNavOpen, setSideNavOpen, updateFilter, setSearchQuery, setActiveView } = useShop();

  if (!sideNavOpen) return null;

  const handleDeptClick = (dept: string) => {
    updateFilter('department', dept);
    setSearchQuery('', dept);
    setSideNavOpen(false);
  };

  const handleDealsClick = () => {
    updateFilter('department', 'All Departments');
    updateFilter('dealsOnly', true);
    setActiveView('search');
    setSideNavOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setSideNavOpen(false)}
      />

      {/* Slide Drawer Content */}
      <div className="relative w-80 sm:w-96 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 text-xs">
        
        {/* Header with User Greeting */}
        <div className="bg-[#232f3e] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-base text-white">Hello, Alex</span>
          </div>
          <button
            onClick={() => setSideNavOpen(false)}
            className="p-1 rounded text-gray-300 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Nav Sections */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
          
          {/* Trending */}
          <div className="py-3">
            <h3 className="px-6 py-2 font-bold text-gray-900 uppercase text-xs tracking-wider">
              Trending
            </h3>
            <ul className="space-y-0.5 text-gray-700">
              <li>
                <button
                  onClick={handleDealsClick}
                  className="w-full px-6 py-2.5 hover:bg-gray-100 flex items-center justify-between group text-left"
                >
                  <span className="font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Today's Deals
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleDeptClick('Electronics')}
                  className="w-full px-6 py-2.5 hover:bg-gray-100 flex items-center justify-between group text-left"
                >
                  <span className="font-medium flex items-center gap-2">
                    <Flame className="w-4 h-4 text-red-500" />
                    Best Sellers
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
                </button>
              </li>
            </ul>
          </div>

          {/* Shop By Department */}
          <div className="py-3">
            <h3 className="px-6 py-2 font-bold text-gray-900 uppercase text-xs tracking-wider">
              Shop By Department
            </h3>
            <ul className="space-y-0.5 text-gray-700">
              {DEPARTMENTS.slice(1).map((dept) => (
                <li key={dept}>
                  <button
                    onClick={() => handleDeptClick(dept)}
                    className="w-full px-6 py-2.5 hover:bg-gray-100 flex items-center justify-between group text-left"
                  >
                    <span className="font-medium">{dept}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs & Features */}
          <div className="py-3">
            <h3 className="px-6 py-2 font-bold text-gray-900 uppercase text-xs tracking-wider">
              Programs &amp; Features
            </h3>
            <ul className="space-y-0.5 text-gray-700">
              <li className="px-6 py-2.5 hover:bg-gray-100 cursor-pointer flex justify-between font-medium">
                <span>Gift Cards &amp; Registry</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
              <li className="px-6 py-2.5 hover:bg-gray-100 cursor-pointer flex justify-between font-medium">
                <span>SOA Prime Membership</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
              <li className="px-6 py-2.5 hover:bg-gray-100 cursor-pointer flex justify-between font-medium">
                <span>SOA Live Shopping</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
            </ul>
          </div>

          {/* Help & Settings */}
          <div className="py-3">
            <h3 className="px-6 py-2 font-bold text-gray-900 uppercase text-xs tracking-wider">
              Help &amp; Settings
            </h3>
            <ul className="space-y-0.5 text-gray-700">
              <li>
                <button
                  onClick={() => {
                    setActiveView('orders');
                    setSideNavOpen(false);
                  }}
                  className="w-full px-6 py-2.5 hover:bg-gray-100 flex items-center justify-between text-left font-medium"
                >
                  <span>Your Account &amp; Orders</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </li>
              <li className="px-6 py-2.5 hover:bg-gray-100 cursor-pointer flex justify-between font-medium">
                <span>Customer Service</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
              <li className="px-6 py-2.5 hover:bg-gray-100 cursor-pointer flex justify-between font-medium text-red-600">
                <span>Sign Out</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
