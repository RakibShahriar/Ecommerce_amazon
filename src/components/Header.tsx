import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, MapPin, ChevronDown, User, Heart, Package, X, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { DEPARTMENTS, SEARCH_SUGGESTIONS } from '../data/mockProducts';

export const Header: React.FC = () => {
  const {
    cartCount,
    cartSubtotal,
    activeView,
    setActiveView,
    filters,
    setSearchQuery,
    setLocationModalOpen,
    deliveryLocation,
    wishlist,
    setSelectedProductId,
  } = useShop();

  const [inputVal, setInputVal] = useState(filters.searchQuery);
  const [selectedDept, setSelectedDept] = useState(filters.department || 'All Departments');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showCartTooltip, setShowCartTooltip] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync input value when global filter changes
  useEffect(() => {
    setInputVal(filters.searchQuery);
  }, [filters.searchQuery]);

  // Click outside listener for search autocomplete
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchQuery(inputVal.trim(), selectedDept);
    setIsSearchFocused(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputVal(suggestion);
    setSearchQuery(suggestion, selectedDept);
    setIsSearchFocused(false);
  };

  const filteredSuggestions = SEARCH_SUGGESTIONS.filter((s) =>
    inputVal.trim() ? s.toLowerCase().includes(inputVal.toLowerCase()) : true
  ).slice(0, 8);

  return (
    <header className="bg-[#131921] text-white text-sm sticky top-0 z-50 select-none shadow-md">
      {/* Top Header Row */}
      <div className="max-w-[1500px] mx-auto px-2 sm:px-4 py-2 flex items-center justify-between gap-2 md:gap-4">
        
        {/* Amazon Logo */}
        <button
          id="amazon-logo-btn"
          onClick={() => {
            setActiveView('home');
            setSelectedProductId(null);
          }}
          className="flex items-center p-1.5 rounded-sm hover:ring-1 hover:ring-white transition group focus:outline-none flex-shrink-0"
          title="Amazon Home"
        >
          <div className="flex flex-col items-start leading-none relative">
            <div className="flex items-baseline font-black tracking-tight text-xl text-white">
              <span>amazon</span>
              <span className="text-[#febd69] text-xs font-semibold ml-0.5">.com</span>
            </div>
            {/* Amazon Smile Arc */}
            <svg
              className="w-16 h-3 text-[#ff9900] -mt-1"
              viewBox="0 0 100 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 5 6 Q 50 22 95 6"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 86 10 L 96 6 L 93 15"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>

        {/* Deliver To Pin */}
        <button
          id="deliver-to-btn"
          onClick={() => setLocationModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 p-1.5 rounded-sm hover:ring-1 hover:ring-white transition text-left flex-shrink-0"
        >
          <MapPin className="w-4 h-4 text-white mt-2 flex-shrink-0" />
          <div className="flex flex-col text-xs leading-tight">
            <span className="text-[#cccccc]">Deliver to Alex</span>
            <span className="font-bold text-white tracking-tight flex items-center gap-0.5">
              {deliveryLocation.city} {deliveryLocation.zip}
            </span>
          </div>
        </button>

        {/* Omnibar Search Box */}
        <div ref={searchContainerRef} className="flex-1 max-w-3xl relative mx-1">
          <form
            onSubmit={handleSearchSubmit}
            className={`flex items-center h-10 rounded-md overflow-hidden bg-white text-gray-900 shadow-inner border-2 ${
              isSearchFocused ? 'border-[#f90] ring-2 ring-[#f90]/50' : 'border-transparent'
            }`}
          >
            {/* Department Dropdown */}
            <div className="relative bg-[#e6e6e6] hover:bg-[#d4d4d4] text-gray-800 h-full flex items-center px-2.5 border-r border-gray-300 cursor-pointer text-xs font-medium flex-shrink-0">
              <select
                id="search-department-select"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="appearance-none bg-transparent pr-4 pl-0.5 py-2 cursor-pointer focus:outline-none text-xs font-semibold text-gray-800"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="text-gray-900 bg-white">
                    {dept}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-gray-600 pointer-events-none absolute right-1.5" />
            </div>

            {/* Input field */}
            <div className="relative flex-1 flex items-center h-full">
              <input
                id="amazon-search-input"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search Amazon (e.g. মধু, বীজ ও পাউডার, চাল ও শস্য, তেল ও ঘি, মসলা...)"
                className="w-full h-full px-3 text-sm text-gray-900 bg-white placeholder-gray-500 focus:outline-none"
              />
              {inputVal && (
                <button
                  type="button"
                  onClick={() => {
                    setInputVal('');
                    setSearchQuery('', selectedDept);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-700 mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Orange Submit Button */}
            <button
              id="search-submit-btn"
              type="submit"
              className="bg-[#febd69] hover:bg-[#f3a847] active:bg-[#e49b38] h-full px-4 flex items-center justify-center transition-colors text-slate-900"
              title="Search"
            >
              <Search className="w-5 h-5 stroke-[2.5]" />
            </button>
          </form>

          {/* Autocomplete Dropdown Panel */}
          {isSearchFocused && (
            <div className="absolute top-11 left-0 right-0 bg-white text-gray-900 rounded-b-md shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in duration-100">
              <div className="p-2 border-b border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
                <span>{inputVal ? 'Search suggestions' : 'Trending on Amazon'}</span>
                <span className="text-[11px] text-gray-400">Press Enter to search</span>
              </div>
              <ul className="py-1 max-h-72 overflow-y-auto">
                {filteredSuggestions.map((item) => (
                  <li
                    key={item}
                    onMouseDown={() => handleSuggestionClick(item)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between text-sm group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Search className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
                      <span className="font-medium text-gray-800 group-hover:text-amber-800">
                        {item}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
          {/* Language Flag Selector */}
          <div className="hidden lg:flex items-center gap-1 p-1.5 rounded-sm hover:ring-1 hover:ring-white transition cursor-pointer text-xs font-bold">
            <span className="text-base leading-none">🇺🇸</span>
            <span>EN</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>

          {/* Account & Lists */}
          <div
            className="relative"
            onMouseEnter={() => setShowAccountMenu(true)}
            onMouseLeave={() => setShowAccountMenu(false)}
          >
            <button
              id="account-menu-btn"
              onClick={() => setActiveView('orders')}
              className="flex flex-col text-xs leading-tight p-1.5 rounded-sm hover:ring-1 hover:ring-white transition text-left"
            >
              <span className="text-[#cccccc]">Hello, Alex</span>
              <span className="font-bold text-white flex items-center gap-0.5">
                Account & Lists <ChevronDown className="w-3 h-3 text-gray-400" />
              </span>
            </button>

            {/* Dropdown Menu */}
            {showAccountMenu && (
              <div className="absolute right-0 top-full mt-1 w-72 bg-white text-gray-900 rounded-md shadow-2xl border border-gray-200 p-4 z-50 text-xs">
                <div className="pb-3 border-b border-gray-200">
                  <p className="font-bold text-sm text-gray-900">Your Account</p>
                  <p className="text-gray-500 text-[11px]">Alex Johnson (Prime Member)</p>
                </div>
                <div className="py-2 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1.5 uppercase text-[11px] tracking-wide text-gray-500">
                      Your Lists
                    </h4>
                    <ul className="space-y-1.5 text-gray-700">
                      <li>
                        <button
                          onClick={() => {
                            setActiveView('search');
                            setShowAccountMenu(false);
                          }}
                          className="hover:text-amber-600 hover:underline flex items-center gap-1"
                        >
                          <Heart className="w-3.5 h-3.5 text-red-500" />
                          Wish List ({wishlist.length})
                        </button>
                      </li>
                      <li className="hover:text-amber-600 cursor-pointer">Shopping List</li>
                      <li className="hover:text-amber-600 cursor-pointer">Explore Showroom</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1.5 uppercase text-[11px] tracking-wide text-gray-500">
                      Your Account
                    </h4>
                    <ul className="space-y-1.5 text-gray-700">
                      <li>
                        <button
                          onClick={() => {
                            setActiveView('orders');
                            setShowAccountMenu(false);
                          }}
                          className="hover:text-amber-600 hover:underline flex items-center gap-1 font-semibold text-gray-900"
                        >
                          <Package className="w-3.5 h-3.5 text-blue-600" />
                          Your Orders
                        </button>
                      </li>
                      <li className="hover:text-amber-600 cursor-pointer">Prime Membership</li>
                      <li className="hover:text-amber-600 cursor-pointer">Addresses</li>
                      <li className="hover:text-amber-600 cursor-pointer">Payment Options</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Returns & Orders */}
          <button
            id="orders-nav-btn"
            onClick={() => setActiveView('orders')}
            className="hidden sm:flex flex-col text-xs leading-tight p-1.5 rounded-sm hover:ring-1 hover:ring-white transition text-left"
          >
            <span className="text-[#cccccc]">Returns</span>
            <span className="font-bold text-white">&amp; Orders</span>
          </button>

          {/* Admin / Seller Central Access */}
          <button
            id="seller-central-btn"
            onClick={() => setActiveView('admin')}
            className={`flex flex-col text-xs leading-tight px-2 py-1 rounded transition text-left border ${
              activeView === 'admin'
                ? 'bg-amber-400 text-gray-900 border-amber-500 font-black shadow'
                : 'bg-amber-500/15 text-amber-300 border-amber-400/50 hover:bg-amber-400/25 hover:text-amber-200'
            }`}
            title="Open Seller Central Admin Portal"
          >
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-amber-400">Admin</span>
            <span className="font-bold text-xs">Seller Central</span>
          </button>

          {/* Cart Button with Badge */}
          <button
            id="header-cart-btn"
            onClick={() => setActiveView('cart')}
            onMouseEnter={() => setShowCartTooltip(true)}
            onMouseLeave={() => setShowCartTooltip(false)}
            className="flex items-end p-1.5 rounded-sm hover:ring-1 hover:ring-white transition relative group focus:outline-none"
            title="Shopping Cart"
          >
            <div className="relative flex items-center">
              <ShoppingCart className="w-8 h-8 text-white group-hover:text-amber-400 transition" />
              <span className="absolute -top-1 left-3.5 bg-[#f08804] text-[#111] text-xs font-black rounded-full px-1.5 py-0.2 min-w-[20px] text-center leading-tight shadow-sm">
                {cartCount}
              </span>
            </div>
            <span className="font-bold text-sm text-white hidden md:inline ml-1 mb-0.5">
              Cart
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
