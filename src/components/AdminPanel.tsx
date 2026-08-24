import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, Order } from '../types';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Search,
  ArrowUpRight,
  RefreshCw,
  Box,
  DollarSign,
  Truck,
  X,
  Filter,
  Eye,
  Tag,
  ShieldAlert
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    setActiveView,
    setSelectedProductId,
    showToast
  } = useShop();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'analytics'>('dashboard');

  // Filters & Search for Products Catalog
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // New Product Form State
  const [newProd, setNewProd] = useState<Partial<Product>>({
    title: '',
    brand: 'Amazon Brand',
    category: 'Electronics',
    department: 'Electronics',
    price: 49.99,
    originalPrice: 69.99,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    description: 'Premium quality electronics device designed for ultimate performance and reliability.',
    bulletPoints: ['High durability', '1-year warranty included', 'Amazon Prime fast shipping'],
    prime: true,
    bestSeller: false,
    amazonsChoice: false
  });

  // Calculate Dashboard Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalOrdersCount = orders.length;
  const activeProductsCount = products.length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock < 10).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  // Unique categories for filter
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Filtered Products List
  const filteredAdminProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.asin.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'in_stock' && p.stock >= 10) ||
      (stockFilter === 'low_stock' && p.stock > 0 && p.stock < 10) ||
      (stockFilter === 'out_of_stock' && p.stock <= 0);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.title || !newProd.price || !newProd.category) {
      showToast('Please fill out all required fields.');
      return;
    }

    addProduct({
      asin: `B0${Math.floor(10000000 + Math.random() * 90000000)}`,
      title: newProd.title || 'Untitled Product',
      brand: newProd.brand || 'Amazon Basics',
      category: newProd.category || 'General',
      department: newProd.department || newProd.category || 'General',
      price: Number(newProd.price),
      originalPrice: newProd.originalPrice ? Number(newProd.originalPrice) : undefined,
      rating: 4.8,
      reviewsCount: 1,
      image: newProd.image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
      galleryImages: [newProd.image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'],
      prime: !!newProd.prime,
      bestSeller: !!newProd.bestSeller,
      amazonsChoice: !!newProd.amazonsChoice,
      stock: Number(newProd.stock || 10),
      stockStatus: Number(newProd.stock || 10) <= 0 ? 'out_of_stock' : Number(newProd.stock || 10) < 10 ? 'low_stock' : 'in_stock',
      description: newProd.description || 'Quality product available on Amazon Clone.',
      bulletPoints: newProd.bulletPoints || ['Premium quality build', 'Ships quickly with Prime'],
      specs: { Brand: newProd.brand || 'Amazon Basics', Category: newProd.category || 'General' }
    });

    setIsAddModalOpen(false);
    // Reset form
    setNewProd({
      title: '',
      brand: 'Amazon Brand',
      category: 'Electronics',
      department: 'Electronics',
      price: 49.99,
      originalPrice: 69.99,
      stock: 25,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      description: 'Premium product description.',
      bulletPoints: ['High performance', 'Prime shipping'],
      prime: true
    });
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      title: editingProduct.title,
      brand: editingProduct.brand,
      category: editingProduct.category,
      price: Number(editingProduct.price),
      originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : undefined,
      stock: Number(editingProduct.stock),
      image: editingProduct.image,
      prime: editingProduct.prime,
      bestSeller: editingProduct.bestSeller,
      amazonsChoice: editingProduct.amazonsChoice
    });

    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] text-gray-900 pb-16 font-sans">
      {/* Top Seller Central Header Banner */}
      <header className="bg-[#131921] text-white border-b border-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#febd69] text-[#131921] p-2 rounded-lg font-black tracking-wider text-lg flex items-center gap-1.5 shadow">
              <Box className="w-5 h-5" />
              <span>amazon</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#232f3e] bg-amber-200/80 px-1.5 py-0.5 rounded">
                Seller Central
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                Merchant Admin Control Center
              </h1>
              <p className="text-xs text-gray-400">Manage catalog, fulfillment, orders & store analytics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('home')}
              className="px-3.5 py-1.5 bg-[#232f3e] hover:bg-gray-700 text-white rounded text-xs font-medium border border-gray-600 transition flex items-center gap-1.5 shadow-sm"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
              View Customer Storefront
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#131921] font-bold text-xs rounded shadow transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add New Product
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#232f3e] border-t border-gray-700/60">
          <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
                activeTab === 'dashboard'
                  ? 'border-amber-400 text-amber-400 bg-white/5'
                  : 'border-transparent text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
                activeTab === 'products'
                  ? 'border-amber-400 text-amber-400 bg-white/5'
                  : 'border-transparent text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Package className="w-4 h-4" />
              Product Catalog ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
                activeTab === 'orders'
                  ? 'border-amber-400 text-amber-400 bg-white/5'
                  : 'border-transparent text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Orders Fulfillment ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
                activeTab === 'analytics'
                  ? 'border-amber-400 text-amber-400 bg-white/5'
                  : 'border-transparent text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Stock Alerts & Insights
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 pt-6">
        {/* ================= TAB 1: DASHBOARD OVERVIEW ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Sales Revenue</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">${totalRevenue.toFixed(2)}</h3>
                  <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +12.4% from last week
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Orders</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalOrdersCount}</h3>
                  <p className="text-xs text-gray-500 mt-1">Avg Order Value: ${avgOrderValue.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Inventory</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{activeProductsCount}</h3>
                  <p className="text-xs text-gray-500 mt-1">{categories.length} product categories</p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Low Stock Alerts</p>
                  <h3 className="text-2xl font-bold text-amber-600 mt-1">{lowStockCount}</h3>
                  <p className="text-xs text-red-500 font-medium mt-1">{outOfStockCount} out of stock</p>
                </div>
                <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Orders Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders List */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-500" />
                    Recent Customer Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-sm text-gray-500 py-6 text-center">No orders have been placed yet.</p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {orders.slice(0, 4).map((ord) => (
                      <div key={ord.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                        <div>
                          <p className="font-bold text-gray-900">{ord.orderNumber}</p>
                          <p className="text-gray-500">
                            {ord.shippingAddress.fullName} &bull; {ord.orderDate}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-900">${ord.total.toFixed(2)}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-semibold capitalize text-[10px] ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'shipped' || ord.status === 'out_for_delivery'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Seller Actions & System Status */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-500" />
                  Quick Store Actions
                </h3>

                <div className="space-y-2">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full text-left px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-semibold transition flex items-center justify-between border border-amber-200/70"
                  >
                    <span>+ Create New Product Listing</span>
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('products');
                      setStockFilter('low_stock');
                    }}
                    className="w-full text-left px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-900 rounded-lg text-xs font-semibold transition flex items-center justify-between border border-rose-200/70"
                  >
                    <span>Inspect Low Stock Items ({lowStockCount})</span>
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="w-full text-left px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg text-xs font-semibold transition flex items-center justify-between border border-blue-200/70"
                  >
                    <span>Update Package Shipping Status</span>
                    <Truck className="w-4 h-4 text-blue-600" />
                  </button>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="bg-gray-50 p-3 rounded-lg text-[11px] text-gray-600 space-y-1 border border-gray-200">
                    <p className="font-semibold text-gray-800 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Amazon Fulfillment Network Active
                    </p>
                    <p>Local state synced automatically across storefront views.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PRODUCT CATALOG CRUD ================= */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Filter and Action Header */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[260px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by title, brand, or ASIN..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-amber-400 outline-none bg-white font-medium"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-amber-400 outline-none bg-white font-medium"
                >
                  <option value="all">All Stock Statuses</option>
                  <option value="in_stock">In Stock (&ge;10)</option>
                  <option value="low_stock">Low Stock (&lt;10)</option>
                  <option value="out_of_stock">Out of Stock (0)</option>
                </select>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold text-xs rounded-lg shadow transition flex items-center gap-1.5 ml-auto"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#232f3e] text-gray-200 uppercase font-semibold text-[11px] tracking-wider border-b border-gray-700">
                      <th className="py-3.5 px-4">Item & ASIN</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Stock Level</th>
                      <th className="py-3.5 px-4">Badges</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAdminProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          No products found matching your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredAdminProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-amber-50/40 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-11 h-11 object-contain rounded border border-gray-200 bg-white p-1 flex-shrink-0"
                              />
                              <div className="max-w-xs">
                                <p className="font-bold text-gray-900 line-clamp-1">{product.title}</p>
                                <p className="text-[11px] text-gray-500 flex items-center gap-2">
                                  <span>ASIN: <code className="bg-gray-100 px-1 rounded text-gray-700 font-mono">{product.asin}</code></span>
                                  <span>&bull; {product.brand}</span>
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-700 font-medium">
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-[11px]">
                              {product.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                            {product.originalPrice && (
                              <span className="block text-[10px] text-gray-400 line-through font-normal">
                                ${product.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateProduct(product.id, { stock: Math.max(0, product.stock - 1) })}
                                className="w-6 h-6 border border-gray-300 rounded hover:bg-gray-100 flex items-center justify-center font-bold text-gray-600"
                                title="Decrease stock"
                              >
                                -
                              </button>
                              <span
                                className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                                  product.stock <= 0
                                    ? 'bg-rose-100 text-rose-700'
                                    : product.stock < 10
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {product.stock} units
                              </span>
                              <button
                                onClick={() => updateProduct(product.id, { stock: product.stock + 1 })}
                                className="w-6 h-6 border border-gray-300 rounded hover:bg-gray-100 flex items-center justify-center font-bold text-gray-600"
                                title="Increase stock"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {product.prime && (
                                <span className="bg-blue-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded tracking-tighter">
                                  prime
                                </span>
                              )}
                              {product.bestSeller && (
                                <span className="bg-amber-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded">
                                  Best Seller
                                </span>
                              )}
                              {product.amazonsChoice && (
                                <span className="bg-[#232f3e] text-amber-400 font-bold text-[9px] px-1.5 py-0.5 rounded">
                                  Amazon's Choice
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedProductId(product.id);
                                  setActiveView('product_detail');
                                }}
                                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded"
                                title="View Storefront Page"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingProduct(product)}
                                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                title="Edit Product"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(product.id)}
                                className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: ORDERS MANAGEMENT ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900 text-sm">Customer Order Fulfillment Center</h2>
                <p className="text-xs text-gray-500">Update tracking statuses and review order payloads</p>
              </div>
              <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                {orders.length} Total Orders Recorded
              </span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#232f3e] text-gray-200 uppercase font-semibold text-[11px] tracking-wider">
                      <th className="py-3.5 px-4">Order ID & Date</th>
                      <th className="py-3.5 px-4">Customer Details</th>
                      <th className="py-3.5 px-4">Purchased Items</th>
                      <th className="py-3.5 px-4">Total Amount</th>
                      <th className="py-3.5 px-4">Delivery Progress Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          No customer orders placed yet. Place an order via checkout to test fulfillment.
                        </td>
                      </tr>
                    ) : (
                      orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-gray-50 transition">
                          <td className="py-3 px-4 font-mono font-bold text-gray-900">
                            <div>{ord.orderNumber}</div>
                            <div className="text-[11px] text-gray-500 font-sans font-normal">{ord.orderDate}</div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-gray-900">{ord.shippingAddress.fullName}</p>
                            <p className="text-[11px] text-gray-500">
                              {ord.shippingAddress.city}, {ord.shippingAddress.state} ({ord.shippingAddress.zip})
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              {ord.items.map((item) => (
                                <p key={item.cartItemId} className="text-gray-800 line-clamp-1">
                                  <span className="font-bold">{item.quantity}x</span> {item.product.title}
                                </p>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold text-gray-900">
                            ${ord.total.toFixed(2)}
                            <span className="block text-[10px] text-gray-400 font-normal uppercase">
                              {ord.deliverySpeed} shipping
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={ord.status}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value as Order['status'])}
                              className={`border rounded-lg px-2.5 py-1 text-xs font-bold outline-none cursor-pointer ${
                                ord.status === 'delivered'
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                  : ord.status === 'out_for_delivery' || ord.status === 'shipped'
                                  ? 'bg-blue-50 border-blue-300 text-blue-800'
                                  : 'bg-amber-50 border-amber-300 text-amber-800'
                              }`}
                            >
                              <option value="ordered">Ordered (Processing)</option>
                              <option value="shipped">Shipped (In Transit)</option>
                              <option value="out_for_delivery">Out for Delivery</option>
                              <option value="delivered">Delivered (Complete)</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: ANALYTICS & INSIGHTS ================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3 mb-4">
                  Inventory Distribution by Category
                </h3>
                <div className="space-y-3">
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category === cat).length;
                    const percent = Math.round((count / products.length) * 100);
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>{cat}</span>
                          <span className="text-gray-500">
                            {count} products ({percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Low Stock Priority Warning List */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3 mb-4 text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Restock Priority List ({lowStockCount + outOfStockCount})
                </h3>
                <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto pr-1">
                  {products
                    .filter((p) => p.stock < 10)
                    .map((p) => (
                      <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img src={p.image} alt={p.title} className="w-8 h-8 object-contain rounded" />
                          <div className="max-w-[200px]">
                            <p className="font-semibold text-gray-900 truncate">{p.title}</p>
                            <p className="text-[10px] text-gray-500">{p.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-bold text-[11px] ${
                              p.stock === 0 ? 'text-rose-600' : 'text-amber-600'
                            }`}
                          >
                            {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                          </span>
                          <button
                            onClick={() => updateProduct(p.id, { stock: p.stock + 20 })}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded text-[11px] font-bold border border-amber-300"
                          >
                            + Restock (+20)
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: ADD PRODUCT ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                Create New Amazon Product Listing
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newProd.title}
                  onChange={(e) => setNewProd({ ...newProd, title: e.target.value })}
                  placeholder="e.g. Wireless Noise Cancelling Headphones"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={newProd.brand}
                    onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProd.originalPrice || ''}
                    onChange={(e) => setNewProd({ ...newProd, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={newProd.image}
                  onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={newProd.prime}
                    onChange={(e) => setNewProd({ ...newProd, prime: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
                  />
                  <span>Amazon Prime Eligible</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={newProd.bestSeller}
                    onChange={(e) => setNewProd({ ...newProd, bestSeller: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
                  />
                  <span>Best Seller Badge</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold rounded-lg shadow"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT PRODUCT ================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                Edit Listing details
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Title</label>
                <input
                  type="text"
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Delete Product Listing?</h3>
              <p className="text-xs text-gray-500 mt-1">
                This item will be permanently deleted from the store catalog.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
