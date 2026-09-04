import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, MapPin, ChevronDown, User, Heart, Package, X, ArrowRight, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { toBanglaDigits } from '../utils/formatters';
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
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode,
    isAdminAuthenticated,
    logoutUser,
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

  const handleAdminClick = () => {
    if (!isAdminAuthenticated) {
      setAuthModalMode('admin');
      setIsAuthModalOpen(true);
    } else {
      setActiveView('admin');
    }
  };

  return (
    <header className="bg-[#131921] text-white text-sm sticky top-0 z-50 select-none shadow-md">
      {/* Container */}
      <div className="max-w-[1500px] mx-auto px-2 sm:px-4 py-2 space-y-2 md:space-y-0">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 md:gap-4">
          
          {/* Left: SOA Logo */}
          <button
            id="soa-logo-btn"
            onClick={() => { setSelectedProductId(null); setActiveView('home'); }}
            className="flex items-center gap-2 p-1 rounded hover:ring-1 hover:ring-white transition group focus:outline-none flex-shrink-0"
            title="SOA TRACEABLE FOODS Home"
          >
            <img src="/assets/logo.png" alt="SOA Icon" className="h-8 w-8 md:h-10 md:w-10 object-contain rounded-lg shadow-md transition group-hover:scale-105" />
            <div className="flex flex-col items-start text-left leading-tight">
              <span className="font-extrabold tracking-wider text-sm md:text-lg text-white group-hover:text-amber-400 transition">SOA</span>
              <span className="text-[9px] md:text-[11px] font-medium tracking-widest text-amber-200/90 uppercase hidden sm:inline">Traceable Foods</span>
            </div>
          </button>

          {/* Deliver To Pin (Desktop) */}
          <button
            id="deliver-to-btn"
            onClick={() => setLocationModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 p-1.5 rounded-sm hover:ring-1 hover:ring-white transition text-left flex-shrink-0"
          >
            <MapPin className="w-4 h-4 text-white flex-shrink-0" />
            <div className="flex flex-col text-xs leading-tight">
              <span className="text-[#cccccc]">Deliver to {currentUser ? currentUser.name.split(' ')[0] : 'Guest'}</span>
              <span className="font-bold text-white tracking-tight flex items-center gap-0.5">
                {deliveryLocation.city} {deliveryLocation.zip}
              </span>
            </div>
          </button>

          {/* Desktop Search Box (hidden on mobile, rendered below on mobile) */}
          <div ref={searchContainerRef} className="hidden md:block flex-1 max-w-3xl relative mx-1">
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
                  id="soa-search-input"
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search SOA (e.g. মধু, বীজ, চাল, তেল, মসলা...)"
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
                  <span>{inputVal ? 'Search suggestions' : 'Trending on SOA'}</span>
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
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Account & Sign In Selector */}
            <div
              className="relative"
              onMouseEnter={() => setShowAccountMenu(true)}
              onMouseLeave={() => setShowAccountMenu(false)}
            >
              <button
                id="account-menu-btn"
                onClick={() => {
                  if (!currentUser) {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  } else {
                    setActiveView('orders');
                  }
                }}
                className="flex flex-col text-xs leading-tight p-1.5 rounded-sm hover:ring-1 hover:ring-white transition text-left"
              >
                <span className="text-[#cccccc] text-[10px] sm:text-xs">
                  {currentUser ? `Hello, ${currentUser.name.split(' ')[0]}` : 'Sign in'}
                </span>
                <span className="font-bold text-white flex items-center gap-0.5 text-[11px] sm:text-xs">
                  Account <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:inline" />
                </span>
              </button>

              {/* Dropdown Menu */}
              {showAccountMenu && (
                <div className="absolute right-0 top-full mt-1 w-72 bg-white text-gray-900 rounded-md shadow-2xl border border-gray-200 p-4 z-50 text-xs">
                  <div className="pb-3 border-b border-gray-200">
                    {currentUser ? (
                      <div>
                        <p className="font-bold text-sm text-gray-900">{currentUser.name}</p>
                        <p className="text-gray-500 text-[11px] flex items-center justify-between mt-0.5">
                          <span>{currentUser.email}</span>
                          {currentUser.primeMember && (
                            <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">Prime</span>
                          )}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center space-y-2 py-1">
                        <button
                          onClick={() => {
                            setAuthModalMode('login');
                            setIsAuthModalOpen(true);
                            setShowAccountMenu(false);
                          }}
                          className="w-full py-1.5 bg-amber-400 hover:bg-amber-500 font-bold text-gray-900 rounded shadow text-xs flex items-center justify-center gap-1.5"
                        >
                          <LogIn className="w-3.5 h-3.5" /> Sign In
                        </button>
                        <p className="text-[11px] text-gray-500">
                          New customer?{' '}
                          <button
                            onClick={() => {
                              setAuthModalMode('register');
                              setIsAuthModalOpen(true);
                              setShowAccountMenu(false);
                            }}
                            className="text-amber-700 font-bold hover:underline"
                          >
                            Start here
                          </button>
                        </p>
                      </div>
                    )}
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
                        {currentUser && (
                          <li>
                            <button
                              onClick={() => {
                                logoutUser();
                                setShowAccountMenu(false);
                              }}
                              className="hover:text-red-600 cursor-pointer text-red-600 flex items-center gap-1 font-bold pt-1 border-t border-gray-100"
                            >
                              <LogOut className="w-3.5 h-3.5" /> Sign Out
                            </button>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Returns & Orders (Desktop) */}
            <button
              id="orders-nav-btn"
              onClick={() => setActiveView('orders')}
              className="hidden lg:flex flex-col text-xs leading-tight p-1.5 rounded-sm hover:ring-1 hover:ring-white transition text-left"
            >
              <span className="text-[#cccccc]">Returns</span>
              <span className="font-bold text-white">&amp; Orders</span>
            </button>

            {/* Admin / Seller Central Access Button */}
            <button
              id="seller-central-btn"
              onClick={handleAdminClick}
              className={`flex flex-col text-xs leading-tight px-2 py-1 rounded transition text-left border flex-shrink-0 ${
                activeView === 'admin' && isAdminAuthenticated
                  ? 'bg-amber-400 text-gray-900 border-amber-500 font-black shadow'
                  : 'bg-amber-500/20 text-amber-300 border-amber-400/50 hover:bg-amber-400/30'
              }`}
              title="Open Seller Central Admin Portal"
            >
              <span className="text-[9px] uppercase font-black tracking-wider text-amber-400 flex items-center gap-0.5">
                {isAdminAuthenticated && <ShieldCheck className="w-2.5 h-2.5 text-amber-950" />} Admin
              </span>
              <span className="font-bold text-[11px] sm:text-xs">Seller Central</span>
            </button>

            {/* Cart Button with Badge */}
            <button
              id="header-cart-btn"
              onClick={() => setActiveView('cart')}
              onMouseEnter={() => setShowCartTooltip(true)}
              onMouseLeave={() => setShowCartTooltip(false)}
              className="flex items-end p-1 rounded-sm hover:ring-1 hover:ring-white transition relative group focus:outline-none flex-shrink-0"
              title="Shopping Cart"
            >
              <div className="relative flex items-center">
                <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8 text-white group-hover:text-amber-400 transition" />
                <span className="absolute -top-1 left-3 bg-[#f08804] text-[#111] text-[11px] font-black rounded-full px-1.5 py-0.2 min-w-[18px] text-center leading-tight shadow-sm">
                  {toBanglaDigits(cartCount)}
                </span>
              </div>
              <span className="font-bold text-xs text-white hidden md:inline ml-1 mb-0.5">
                Cart
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Row (visible on < md screens) */}
        <div className="block md:hidden pb-1">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center h-9 rounded-md overflow-hidden bg-white text-gray-900 shadow-inner border border-gray-300"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search SOA (মধু, বীজ, চাল, তেল, মসলা...)"
              className="w-full h-full px-3 text-xs text-gray-900 bg-white placeholder-gray-500 focus:outline-none"
            />
            {inputVal && (
              <button
                type="button"
                onClick={() => {
                  setInputVal('');
                  setSearchQuery('', selectedDept);
                }}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="bg-[#febd69] hover:bg-[#f3a847] h-full px-3 flex items-center justify-center text-slate-900"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>

      </div>
    </header>
  );
};

