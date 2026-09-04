import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, Truck, ArrowLeft, PackageCheck, Clock } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { toBanglaDigits } from '../utils/formatters';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    shippingAddress,
    setShippingAddress,
    paymentMethod,
    setPaymentMethod,
    placeOrder,
    setActiveView,
    currentOrderConfirmation,
    setCurrentOrderConfirmation,
  } = useShop();

  const [deliverySpeed, setDeliverySpeed] = useState<'free' | 'standard' | 'priority'>('free');
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState(shippingAddress);

  const activeItems = cart.filter((i) => !i.savedForLater && i.selectedForCheckout);
  const itemsSubtotal = cartSubtotal;
  const shippingCost = deliverySpeed === 'priority' ? 60 : 0;
  const estimatedTax = Number((itemsSubtotal * 0.088).toFixed(2));
  const orderTotal = Number((itemsSubtotal + shippingCost + estimatedTax).toFixed(2));

  const handlePlaceOrder = () => {
    placeOrder(deliverySpeed);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setShippingAddress(addressForm);
    setEditingAddress(false);
  };

  // Order Confirmation View
  if (currentOrderConfirmation) {
    const ord = currentOrderConfirmation;
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Success Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-start gap-4 shadow-sm">
          <div className="p-2 bg-green-500 text-white rounded-full flex-shrink-0">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-green-900">
              Order placed, thank you!
            </h1>
            <p className="text-xs sm:text-sm text-green-800">
              Confirmation will be sent to your email. Order #{ord.orderNumber}
            </p>
            <p className="text-xs text-gray-600 pt-1">
              Guaranteed delivery: <span className="font-bold text-gray-900">{ord.estimatedDelivery}</span>
            </p>
          </div>
        </div>

        {/* Tracking & Timeline Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Package Tracking</h2>
              <p className="text-xs text-gray-500">Shipped with SOA Logistics</p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full">
              Ordered
            </span>
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
            {ord.trackingSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-1.5 relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.completed
                      ? 'bg-green-600 text-white ring-4 ring-green-100'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {idx + 1}
                </div>
                <h4 className="text-xs font-bold text-gray-900">{step.title}</h4>
                <p className="text-[11px] text-gray-500">{step.description}</p>
                <span className="text-[10px] text-gray-400 font-medium">{step.date}</span>
              </div>
            ))}
          </div>

          {/* Ordered items preview */}
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <h3 className="text-sm font-bold text-gray-900">Items in this shipment:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ord.items.map((it) => (
                <div key={it.cartItemId} className="flex items-center gap-3 p-2 bg-gray-50 rounded border border-gray-200">
                  <img src={it.product.image} alt={it.product.title} className="w-14 h-14 object-contain" />
                  <div className="text-xs space-y-0.5">
                    <p className="font-semibold text-gray-900 line-clamp-1">{it.product.title}</p>
                    <p className="text-gray-500">Qty: {toBanglaDigits(it.quantity)} &bull; ৳{toBanglaDigits(it.product.price * it.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setCurrentOrderConfirmation(null);
                setActiveView('orders');
              }}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs rounded-full border border-gray-300 shadow-sm"
            >
              View Your Orders
            </button>
            <button
              onClick={() => {
                setCurrentOrderConfirmation(null);
                setActiveView('home');
              }}
              className="flex-1 py-2.5 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold text-xs rounded-full shadow"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-6 space-y-6">
      {/* Checkout Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <button
          onClick={() => setActiveView('cart')}
          className="flex items-center gap-1.5 text-xs text-[#007185] hover:text-[#c7511f] hover:underline font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </button>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('home')}><img src="/assets/logo.png" alt="SOA TRACEABLE FOODS Icon" className="h-8 w-8 object-contain rounded-lg shadow-sm" /><div className="flex flex-col leading-none"><span className="font-black text-base text-gray-900 tracking-wider">SOA</span><span className="text-[9px] font-bold tracking-widest text-amber-800 uppercase">TRACEABLE FOODS</span></div></div>
          <span className="text-lg font-light text-gray-400">|</span>
          <span className="text-base font-bold text-gray-700">Checkout</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600 text-xs">
          <Lock className="w-4 h-4 text-green-700" />
          <span className="hidden sm:inline">Secure Checkout</span>
        </div>
      </div>

      {/* Main 2-Column Checkout Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Steps Column (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6 text-xs">
          
          {/* Step 1: Shipping Address */}
          <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#131921] text-white flex items-center justify-center text-xs">
                  1
                </span>
                Shipping address
              </h2>
              {!editingAddress && (
                <button
                  onClick={() => setEditingAddress(true)}
                  className="text-[#007185] hover:text-[#c7511f] hover:underline font-semibold"
                >
                  Change
                </button>
              )}
            </div>

            {editingAddress ? (
              <form onSubmit={handleSaveAddress} className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Phone</label>
                    <input
                      type="text"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded mt-1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-700">Street Address</label>
                  <input
                    type="text"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700">City</label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">State</label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Zip Code</label>
                    <input
                      type="text"
                      value={addressForm.zip}
                      onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded mt-1"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold rounded-full shadow-sm"
                  >
                    Use this address
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingAddress(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full border border-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-gray-800 space-y-0.5 leading-relaxed pl-8">
                <p className="font-bold text-gray-900">{shippingAddress.fullName}</p>
                <p>{shippingAddress.street} {shippingAddress.apt}</p>
                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</p>
                <p className="text-gray-500">Phone: {shippingAddress.phone}</p>
              </div>
            )}
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#131921] text-white flex items-center justify-center text-xs">
                  2
                </span>
                Payment method
              </h2>
              <span className="text-xs text-green-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> SOA Prime Rewards Active
              </span>
            </div>

            <div className="pl-8 space-y-3">
              <label className="flex items-center gap-3 p-3 bg-amber-50/60 border border-amber-300 rounded-md cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod.type === 'prime_card'}
                  onChange={() =>
                    setPaymentMethod({
                      id: 'pm-1',
                      type: 'prime_card',
                      last4: '4242',
                      brand: 'SOA Prime Rewards Visa',
                      expiryMonth: '08',
                      expiryYear: '29',
                      holderName: 'Alex Johnson',
                    })
                  }
                  className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                />
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">
                      SOA Prime Rewards Visa Signature ending in 4242
                    </p>
                    <p className="text-gray-500 text-[11px]">Earn 5% back on this order</p>
                  </div>
                  <span className="font-bold text-blue-700 uppercase text-xs">VISA</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod.type === 'gift_card'}
                  onChange={() =>
                    setPaymentMethod({
                      id: 'pm-2',
                      type: 'gift_card',
                      last4: '9821',
                      brand: `SOA Gift Card Balance (৳${toBanglaDigits(5000)})`,
                      expiryMonth: '12',
                      expiryYear: '30',
                      holderName: 'Alex Johnson',
                    })
                  }
                  className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <p className="font-bold text-gray-900">SOA Gift Card Balance</p>
                  <p className="text-green-700 text-[11px] font-semibold">Available: ৳{toBanglaDigits(5000)}</p>
                </div>
              </label>
            </div>
          </div>

          {/* Step 3: Review Items and Shipping Speeds */}
          <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200 space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#131921] text-white flex items-center justify-center text-xs">
                  3
                </span>
                Review items and shipping speed
              </h2>
            </div>

            <div className="pl-8 space-y-4">
              {/* Delivery Speed Options */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900">Choose your Prime delivery option:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`p-3 rounded border cursor-pointer flex flex-col justify-between ${
                      deliverySpeed === 'free'
                        ? 'border-[#e77600] bg-amber-50/50 ring-1 ring-[#e77600]'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="speed"
                        checked={deliverySpeed === 'free'}
                        onChange={() => setDeliverySpeed('free')}
                        className="text-amber-500"
                      />
                      <span className="font-bold text-green-700">FREE One-Day</span>
                    </div>
                    <span className="text-[11px] text-gray-600 mt-1">Tomorrow, Aug 15</span>
                  </label>

                  <label
                    className={`p-3 rounded border cursor-pointer flex flex-col justify-between ${
                      deliverySpeed === 'standard'
                        ? 'border-[#e77600] bg-amber-50/50 ring-1 ring-[#e77600]'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="speed"
                        checked={deliverySpeed === 'standard'}
                        onChange={() => setDeliverySpeed('standard')}
                        className="text-amber-500"
                      />
                      <span className="font-bold text-gray-800">FREE Two-Day</span>
                    </div>
                    <span className="text-[11px] text-gray-600 mt-1">Sunday, Aug 16</span>
                  </label>

                  <label
                    className={`p-3 rounded border cursor-pointer flex flex-col justify-between ${
                      deliverySpeed === 'priority'
                        ? 'border-[#e77600] bg-amber-50/50 ring-1 ring-[#e77600]'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="speed"
                        checked={deliverySpeed === 'priority'}
                        onChange={() => setDeliverySpeed('priority')}
                        className="text-amber-500"
                      />
                      <span className="font-bold text-gray-800">Priority (৳{toBanglaDigits(60)})</span>
                    </div>
                    <span className="text-[11px] text-gray-600 mt-1">Today by 8 PM</span>
                  </label>
                </div>
              </div>

              {/* Items Summary list */}
              <div className="pt-3 border-t border-gray-200 space-y-3">
                <h4 className="font-bold text-gray-900">Items ({activeItems.length}):</h4>
                <div className="space-y-3">
                  {activeItems.map((item) => (
                    <div key={item.cartItemId} className="flex items-center gap-4">
                      <img src={item.product.image} alt={item.product.title} className="w-12 h-12 object-contain" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 line-clamp-1">{item.product.title}</p>
                        <p className="text-gray-500">
                          Qty: {toBanglaDigits(item.quantity)} &bull; ৳{toBanglaDigits(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary Column (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-md shadow-sm border border-gray-300 space-y-4 sticky top-20 text-xs">
          <button
            id="checkout-place-order-btn"
            onClick={handlePlaceOrder}
            className="w-full py-3 px-4 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f2b900] text-gray-900 font-bold text-sm rounded-full shadow transition-all focus:outline-none"
          >
            Place your order
          </button>

          <p className="text-[11px] text-gray-500 text-center leading-tight">
            By placing your order, you agree to SOA's <span className="text-[#007185] hover:underline cursor-pointer">privacy notice</span> and <span className="text-[#007185] hover:underline cursor-pointer">conditions of use</span>.
          </p>

          <div className="pt-3 border-t border-gray-200 space-y-2">
            <h3 className="font-bold text-sm text-gray-900">Order Summary</h3>
            <div className="flex justify-between text-gray-700">
              <span>Items ({toBanglaDigits(activeItems.reduce((acc, i) => acc + i.quantity, 0))}):</span>
              <span>৳{toBanglaDigits(itemsSubtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping &amp; handling:</span>
              <span>{shippingCost === 0 ? 'FREE' : `৳${toBanglaDigits(shippingCost)}`}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Estimated tax:</span>
              <span>৳{toBanglaDigits(estimatedTax)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#b12704] pt-2 border-t border-gray-200">
              <span>Order total:</span>
              <span>৳{toBanglaDigits(orderTotal)}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 text-[11px] text-gray-500 space-y-1">
            <div className="flex items-center gap-1.5 text-gray-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-green-700" />
              <span>How are delivery costs calculated?</span>
            </div>
            <p>Prime members enjoy Free Two-Day and One-Day Shipping on millions of items.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
