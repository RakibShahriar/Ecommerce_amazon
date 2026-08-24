import React from 'react';
import { CheckCircle2, Trash2, Heart, ShieldCheck, Check, ArrowRight, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    toggleCheckoutItem,
    selectAllForCheckout,
    saveForLater,
    moveToCartFromSaved,
    deleteSavedItem,
    cartSubtotal,
    cartCount,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    setActiveView,
    setSelectedProductId,
    products,
  } = useShop();

  const activeItems = cart.filter((item) => !item.savedForLater);
  const savedItems = cart.filter((item) => item.savedForLater);
  const allSelected = activeItems.length > 0 && activeItems.every((item) => item.selectedForCheckout);
  const checkoutCount = activeItems.filter((i) => i.selectedForCheckout).reduce((acc, i) => acc + i.quantity, 0);

  const [dollars, cents] = cartSubtotal.toFixed(2).split('.');

  const handleProceedToCheckout = () => {
    if (checkoutCount === 0) return;
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const recommendedProducts = products.filter((p) => !cart.some((c) => c.productId === p.id)).slice(0, 4);

  return (
    <div className="max-w-[1500px] mx-auto px-2 sm:px-4 py-6 space-y-6">
      {/* Free Shipping Progress Indicator */}
      <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-full text-green-700 flex-shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="flex-1 space-y-1">
          {amountNeededForFreeShipping <= 0 ? (
            <p className="text-xs sm:text-sm font-bold text-green-800">
              Your order qualifies for FREE Delivery. <span className="font-normal text-gray-600">Choose this option at checkout.</span>
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-gray-800">
              Add <span className="font-bold text-[#b12704]">${amountNeededForFreeShipping.toFixed(2)}</span> of eligible items to get <span className="font-bold text-green-800">FREE Delivery</span>.
            </p>
          )}
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-green-600 h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Items + Right Checkout Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Cart Items (8 cols on lg) */}
        <div className="lg:col-span-8 bg-white p-4 sm:p-6 rounded-md shadow-sm border border-gray-200 space-y-6">
          <div className="flex items-baseline justify-between pb-3 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              {activeItems.length > 0 && (
                <button
                  onClick={() => selectAllForCheckout(!allSelected)}
                  className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline pt-1"
                >
                  {allSelected ? 'Deselect all items' : 'Select all items'}
                </button>
              )}
            </div>
            <span className="text-xs text-gray-500 font-medium hidden sm:inline">Price</span>
          </div>

          {/* Active Cart Item List */}
          {activeItems.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Your Amazon Cart is empty</h2>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Check out Today's Deals or search for items to add to your cart.
              </p>
              <button
                onClick={() => setActiveView('home')}
                className="px-6 py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold text-xs rounded-full shadow"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {activeItems.map((item) => (
                <div key={item.cartItemId} className="py-4 flex gap-3 sm:gap-4 items-start">
                  {/* Select Checkbox */}
                  <input
                    type="checkbox"
                    checked={item.selectedForCheckout}
                    onChange={() => toggleCheckoutItem(item.cartItemId)}
                    className="mt-2 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                  />

                  {/* Thumbnail */}
                  <div
                    onClick={() => {
                      setSelectedProductId(item.productId);
                      setActiveView('product_detail');
                    }}
                    className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded p-2 flex items-center justify-center flex-shrink-0 cursor-pointer border border-gray-100"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-1 text-xs">
                    <h3
                      onClick={() => {
                        setSelectedProductId(item.productId);
                        setActiveView('product_detail');
                      }}
                      className="text-sm font-semibold text-gray-900 hover:text-[#007185] cursor-pointer line-clamp-2 leading-snug"
                    >
                      {item.product.title}
                    </h3>

                    <div className="text-[#007600] font-bold text-[11px]">In Stock</div>

                    {item.product.prime && (
                      <div className="flex items-center gap-1">
                        <span className="font-black italic text-[#00a8e1] tracking-tighter text-sm">prime</span>
                        <Check className="w-3.5 h-3.5 text-[#00a8e1] stroke-[3]" />
                        <span className="text-gray-500 text-[11px]">FREE Delivery Tomorrow</span>
                      </div>
                    )}

                    {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                      <div className="text-[11px] text-gray-500">
                        {Object.entries(item.selectedVariants).map(([k, v]) => (
                          <span key={k} className="mr-2">
                            <span className="capitalize">{k}</span>: <strong>{v}</strong>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1 text-gray-600">
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                        <input type="checkbox" defaultChecked={item.isGift} className="w-3.5 h-3.5 text-amber-500 rounded" />
                        This is a gift <span className="text-[#007185] hover:underline">Learn more</span>
                      </label>
                    </div>

                    {/* Quantity & Actions Bar */}
                    <div className="flex items-center gap-3 pt-2.5 flex-wrap text-[11px]">
                      {/* Qty Selector */}
                      <div className="flex items-center bg-gray-100 rounded border border-gray-300 px-2 py-0.5 shadow-sm">
                        <span className="text-gray-600 font-medium mr-1.5">Qty:</span>
                        <select
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.cartItemId, Number(e.target.value))}
                          className="bg-transparent font-bold text-gray-900 focus:outline-none cursor-pointer"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </div>

                      <span className="text-gray-300">|</span>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-[#007185] hover:text-[#c7511f] hover:underline"
                      >
                        Delete
                      </button>

                      <span className="text-gray-300">|</span>

                      <button
                        onClick={() => saveForLater(item.cartItemId)}
                        className="text-[#007185] hover:text-[#c7511f] hover:underline"
                      >
                        Save for later
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right font-bold text-base text-gray-900 whitespace-nowrap pl-2">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Subtotal Footer */}
          {activeItems.length > 0 && (
            <div className="pt-4 border-t border-gray-200 text-right text-sm">
              <span>Subtotal ({checkoutCount} items): </span>
              <span className="font-bold text-lg text-gray-900">${cartSubtotal.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Right Column: Checkout Summary Box (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white p-4 sm:p-5 rounded-md shadow-sm border border-gray-200 space-y-4 sticky top-20">
          <div className="space-y-1">
            <div className="text-sm">
              Subtotal ({checkoutCount} items):{' '}
              <span className="text-lg font-bold text-gray-900">${cartSubtotal.toFixed(2)}</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 pt-1">
              <input type="checkbox" className="w-3.5 h-3.5 text-amber-500 rounded" />
              <span>This order contains a gift</span>
            </label>
          </div>

          <button
            id="proceed-to-checkout-btn"
            disabled={checkoutCount === 0}
            onClick={handleProceedToCheckout}
            className={`w-full py-2.5 px-4 rounded-full font-bold text-xs shadow transition-all flex items-center justify-center gap-1.5 ${
              checkoutCount > 0
                ? 'bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f2b900] text-gray-900 cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Proceed to checkout ({checkoutCount} items)
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-3 border-t border-gray-200 text-xs text-gray-500 space-y-2">
            <div className="flex items-center gap-2 text-gray-700">
              <ShieldCheck className="w-4 h-4 text-green-700" />
              <span className="font-semibold">Safe and Secure 256-bit Checkout</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Prime members enjoy unlimited FREE Two-Day Delivery and exclusive access to movies, TV shows, music, Kindle books, and original audio series.
            </p>
          </div>
        </div>
      </div>

      {/* Saved for Later Section */}
      {savedItems.length > 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">
            Saved for later ({savedItems.length} items)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {savedItems.map((item) => (
              <div key={item.cartItemId} className="border border-gray-200 rounded p-3 space-y-2 text-xs">
                <div className="aspect-square bg-gray-50 rounded p-2 flex items-center justify-center">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 line-clamp-2">{item.product.title}</h4>
                <div className="font-bold text-sm text-gray-900">${item.product.price.toFixed(2)}</div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => moveToCartFromSaved(item.cartItemId)}
                    className="flex-1 py-1 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold rounded-full text-xs shadow-sm"
                  >
                    Move to cart
                  </button>
                  <button
                    onClick={() => deleteSavedItem(item.cartItemId)}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full border border-gray-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations Carousel */}
      <div className="bg-white p-4 sm:p-6 rounded-md shadow-sm border border-gray-200 space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">
          Customers who bought items in your cart also bought
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {recommendedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
