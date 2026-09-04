import React, { useState } from 'react';
import { Package, Search, RotateCcw, ChevronRight, CheckCircle2, Truck, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';

export const OrdersHistoryModal: React.FC = () => {
  const { orders, addToCart, setActiveView, setSelectedProductId } = useShop();
  const [searchOrderQuery, setSearchOrderQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'buy_again' | 'not_shipped'>('orders');
  const [selectedTrackOrder, setSelectedTrackOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((ord) => {
    if (!searchOrderQuery.trim()) return true;
    const q = searchOrderQuery.toLowerCase();
    return (
      ord.orderNumber.toLowerCase().includes(q) ||
      ord.items.some((i) => i.product.title.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-6 space-y-6">
      {/* Header & Breadcrumb */}
      <div className="space-y-1">
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <button onClick={() => setActiveView('home')} className="hover:underline">
            Your Account
          </button>
          <span>&gt;</span>
          <span className="font-semibold text-gray-800">Your Orders</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>

          {/* Search Orders */}
          <div className="flex items-center gap-2 max-w-sm w-full">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search all orders"
                value={searchOrderQuery}
                onChange={(e) => setSearchOrderQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2" />
            </div>
            <button className="px-4 py-1.5 bg-[#131921] hover:bg-[#232f3e] text-white text-xs font-bold rounded-md shadow-sm">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 text-xs font-medium">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-2.5 font-bold ${
            activeTab === 'orders'
              ? 'text-amber-700 border-b-2 border-amber-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('buy_again')}
          className={`pb-2.5 font-bold ${
            activeTab === 'buy_again'
              ? 'text-amber-700 border-b-2 border-amber-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Buy Again
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-md p-12 text-center border border-gray-200 space-y-3">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-800">No orders found</h3>
          <p className="text-xs text-gray-500">You haven't placed any orders matching this search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden text-xs"
            >
              {/* Order Metadata Header Bar */}
              <div className="bg-[#f0f2f2] px-4 py-3 border-b border-gray-300 flex flex-wrap items-center justify-between gap-4 text-gray-600">
                <div className="flex gap-6 flex-wrap">
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500">
                      Order Placed
                    </span>
                    <span className="font-bold text-gray-800">{ord.orderDate}</span>
                  </div>

                  <div>
                    <span className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500">
                      Total
                    </span>
                    <span className="font-bold text-gray-800">৳{ord.total.toLocaleString()}</span>
                  </div>

                  <div>
                    <span className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500">
                      Ship To
                    </span>
                    <span className="font-bold text-[#007185] hover:underline cursor-pointer">
                      {ord.shippingAddress.fullName}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500">
                    Order # {ord.orderNumber}
                  </span>
                  <div className="flex items-center gap-2 pt-0.5">
                    <button className="text-[#007185] hover:underline">View invoice</button>
                  </div>
                </div>
              </div>

              {/* Order Items Body */}
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                    <span className="font-bold text-sm text-gray-900">
                      {ord.status === 'delivered' ? 'Delivered' : 'Arriving ' + ord.estimatedDelivery}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedTrackOrder(selectedTrackOrder?.id === ord.id ? null : ord)}
                    className="px-3 py-1.5 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold rounded-full shadow-sm text-xs"
                  >
                    Track Package
                  </button>
                </div>

                {/* Tracking expansion */}
                {selectedTrackOrder?.id === ord.id && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3 animate-in fade-in duration-150">
                    <h4 className="font-bold text-gray-900">Package Progress:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {ord.trackingSteps.map((s, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className={`h-1.5 rounded-full ${s.completed ? 'bg-green-600' : 'bg-gray-300'}`} />
                          <p className="font-bold text-gray-900">{s.title}</p>
                          <p className="text-[10px] text-gray-500">{s.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="space-y-3">
                  {ord.items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-16 h-16 object-contain cursor-pointer"
                          onClick={() => {
                            setSelectedProductId(item.productId);
                            setActiveView('product_detail');
                          }}
                        />
                        <div>
                          <h4
                            onClick={() => {
                              setSelectedProductId(item.productId);
                              setActiveView('product_detail');
                            }}
                            className="font-bold text-gray-900 hover:text-[#007185] cursor-pointer line-clamp-2"
                          >
                            {item.product.title}
                          </h4>
                          <p className="text-gray-500 text-[11px] mt-0.5">
                            Sold by: {item.product.soldBy || 'SOA'} &bull; Return window closed
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={() => addToCart(item.product, 1)}
                          className="px-4 py-1.5 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold rounded-full shadow-sm text-xs"
                        >
                          Buy it again
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProductId(item.productId);
                            setActiveView('product_detail');
                          }}
                          className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-full border border-gray-300 text-xs"
                        >
                          View item
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
