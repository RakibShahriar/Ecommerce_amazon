import React, { useState } from 'react';
import {
  Star,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  Heart,
  Share2,
  ChevronRight,
  Sparkles,
  MapPin,
  ThumbsUp
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProduct,
    addToCart,
    placeOrder,
    setActiveView,
    deliveryLocation,
    setLocationModalOpen,
    isInWishlist,
    toggleWishlist,
    showToast,
  } = useShop();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedProduct) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <h2 className="text-xl font-bold text-gray-800">No product selected</h2>
        <button
          onClick={() => setActiveView('home')}
          className="mt-4 px-4 py-2 bg-amber-400 font-bold rounded"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const p = selectedProduct;
  const isFavorited = isInWishlist(p.id);
  const gallery = p.galleryImages?.length ? p.galleryImages : [p.image];
  const activeImage = gallery[activeImageIndex] || p.image;

  const handleAddToCart = () => {
    addToCart(p, selectedQuantity, selectedVariants);
  };

  const handleBuyNow = () => {
    addToCart(p, selectedQuantity, selectedVariants);
    setActiveView('cart');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedLink(true);
    showToast('Product link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleVariantSelect = (type: string, value: string) => {
    setSelectedVariants((prev) => ({ ...prev, [type]: value }));
  };

  return (
    <div className="max-w-[1500px] mx-auto px-2 sm:px-4 py-4 space-y-6">
      {/* Breadcrumbs */}
      <div className="text-xs text-gray-500 flex items-center gap-1 flex-wrap">
        <button onClick={() => setActiveView('home')} className="hover:text-amber-600 hover:underline">
          Home
        </button>
        <ChevronRight className="w-3 h-3" />
        <button
          onClick={() => setActiveView('search')}
          className="hover:text-amber-600 hover:underline"
        >
          {p.department}
        </button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-700 font-medium">{p.category}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-400 truncate max-w-xs">{p.title}</span>
      </div>

      {/* Main 3-Column PDP Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Image Gallery & Thumbnails (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col-reverse md:flex-row gap-4 sticky top-20">
          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[480px] p-1">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  onMouseEnter={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded border-2 p-1 bg-white flex-shrink-0 flex items-center justify-center transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#e77600] ring-2 ring-[#e77600]/30'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image with zoom frame */}
          <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-center aspect-square relative group overflow-hidden shadow-sm">
            <img
              src={activeImage}
              alt={p.title}
              className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300 cursor-crosshair"
            />
            {p.dealBadge && (
              <span className="absolute top-3 left-3 bg-[#cc0c39] text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm">
                {p.dealBadge}
              </span>
            )}
          </div>
        </div>

        {/* Center Column: Product Information & Specs (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <span className="text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer">
              Visit the {p.brand} Store
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug mt-1">
              {p.title}
            </h1>
          </div>

          {/* Ratings & Social Proof */}
          <div className="flex items-center gap-2 text-xs flex-wrap pb-2 border-b border-gray-200">
            <div className="flex items-center text-[#de7921]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(p.rating) ? 'fill-[#de7921] text-[#de7921]' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-bold text-gray-900">{p.rating}</span>
            <span className="text-[#007185] hover:underline cursor-pointer">
              {p.reviewsCount.toLocaleString()} ratings
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600">Search this page</span>
          </div>

          {p.boughtInPastMonth && (
            <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded border border-gray-100">
              <span className="font-bold text-gray-900">{p.boughtInPastMonth}</span> bought in past month
            </p>
          )}

          {/* Badges */}
          <div className="flex gap-2">
            {p.bestSeller && (
              <div className="bg-[#e67a00] text-white text-xs font-bold px-2.5 py-0.5 rounded shadow-sm">
                #1 Best Seller in {p.category}
              </div>
            )}
            {p.soasChoice && !p.bestSeller && (
              <div className="bg-[#232f3e] text-white text-xs font-medium px-2.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                <span>SOA's</span>
                <span className="text-[#f90] font-bold">Choice</span>
              </div>
            )}
          </div>

          {/* Price Block */}
          <div className="space-y-1 py-2 border-y border-gray-200">
            <div className="flex items-baseline gap-2">
              {p.dealDiscountPercent && (
                <span className="text-2xl font-light text-[#cc0c39]">
                  -{p.dealDiscountPercent}%
                </span>
              )}
              <div className="flex items-baseline text-gray-900">
                <span className="text-lg font-bold mr-0.5">৳</span>
                <span className="text-3xl font-black leading-none">{p.price.toLocaleString()}</span>
              </div>
            </div>

            {p.originalPrice && p.originalPrice > p.price && (
              <div className="text-xs text-gray-500">
                Typical price: <span className="line-through">৳{p.originalPrice.toLocaleString()}</span>
              </div>
            )}

            {p.prime && (
              <div className="flex items-center gap-1 text-xs pt-1">
                <span className="font-black italic text-[#00a8e1] tracking-tighter text-base">prime</span>
                <Check className="w-4 h-4 text-[#00a8e1] stroke-[3]" />
                <span className="text-gray-600 font-medium">One-Day Delivery &amp; Free Returns</span>
              </div>
            )}
          </div>

          {/* Variant Selectors (e.g. Color, Storage, Size) */}
          {p.variants && p.variants.length > 0 && (
            <div className="space-y-3 py-2">
              <span className="text-xs font-bold text-gray-800">Options &amp; Variants:</span>
              <div className="flex flex-wrap gap-2">
                {p.variants.map((v) => {
                  const isSelected = selectedVariants[v.type] === v.value;
                  return (
                    <button
                      key={v.id}
                      onClick={() => handleVariantSelect(v.type, v.value)}
                      className={`px-3 py-1.5 rounded text-xs font-medium border transition-all ${
                        isSelected
                          ? 'border-[#e77600] bg-amber-50 ring-1 ring-[#e77600] font-bold text-gray-900'
                          : 'border-gray-300 hover:border-gray-500 bg-white text-gray-700'
                      }`}
                    >
                      {v.name} {v.priceModifier ? `(+৳${v.priceModifier})` : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* About this item (Bullet points) */}
          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-bold text-gray-900">About this item</h3>
            <ul className="space-y-2 text-xs text-gray-700 list-disc list-outside pl-4 leading-relaxed">
              {p.bulletPoints.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>

          {/* Technical Specifications */}
          {p.specs && (
            <div className="space-y-2 pt-3 border-t border-gray-200">
              <h3 className="text-sm font-bold text-gray-900">Product Specifications</h3>
              <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded border border-gray-200">
                {Object.entries(p.specs).map(([k, v]) => (
                  <div key={k} className="flex flex-col">
                    <span className="font-semibold text-gray-500">{k}</span>
                    <span className="font-medium text-gray-900">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky SOA Buy Box (3 cols on lg) */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-300 p-4 shadow-sm space-y-3.5 sticky top-20 text-xs">
            {/* Price in Buy Box */}
            <div className="flex items-baseline text-gray-900">
              <span className="text-base font-bold mr-0.5">৳</span>
              <span className="text-2xl font-black leading-none">{p.price.toLocaleString()}</span>
            </div>

            {/* Delivery Info */}
            <div className="space-y-1">
              <p className="text-gray-800 font-semibold">
                FREE delivery <span className="font-bold text-gray-900">Tomorrow, Aug 15</span>
              </p>
              <p className="text-gray-500 text-[11px]">
                Order within <span className="text-green-700 font-bold">4 hrs 22 mins</span>
              </p>
              <button
                onClick={() => setLocationModalOpen(true)}
                className="text-[#007185] hover:text-[#c7511f] hover:underline flex items-center gap-1 pt-1 text-[11px]"
              >
                <MapPin className="w-3 h-3" />
                Deliver to {deliveryLocation.city} {deliveryLocation.zip}
              </button>
            </div>

            {/* In Stock Indicator */}
            <div>
              {p.stockStatus === 'in_stock' ? (
                <span className="text-base font-bold text-[#007600]">In Stock</span>
              ) : p.stockStatus === 'low_stock' ? (
                <span className="text-sm font-bold text-[#b12704]">
                  Only {p.stock} left in stock - order soon.
                </span>
              ) : (
                <span className="text-base font-bold text-[#b12704]">Currently unavailable</span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">Quantity:</span>
              <select
                id="pdp-quantity-select"
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                className="bg-gray-50 border border-gray-300 rounded px-2.5 py-1 text-xs font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-sm"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            {/* Yellow Add to Cart & Orange Buy Now Buttons */}
            <div className="space-y-2 pt-2">
              <button
                id="pdp-add-to-cart-btn"
                onClick={handleAddToCart}
                className="w-full py-2.5 px-4 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f2b900] text-gray-900 font-bold text-xs rounded-full shadow-sm hover:shadow transition-all focus:outline-none"
              >
                Add to Cart
              </button>

              <button
                id="pdp-buy-now-btn"
                onClick={handleBuyNow}
                className="w-full py-2.5 px-4 bg-[#ffa41c] hover:bg-[#fa8900] active:bg-[#e87a00] text-gray-900 font-bold text-xs rounded-full shadow-sm hover:shadow transition-all focus:outline-none"
              >
                Buy Now
              </button>
            </div>

            {/* Secure Transaction & Seller Table */}
            <div className="pt-2 border-t border-gray-200 space-y-1.5 text-[11px] text-gray-600">
              <div className="flex items-center gap-1.5 text-gray-700">
                <Lock className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[#007185] hover:underline cursor-pointer">Secure transaction</span>
              </div>
              <div className="grid grid-cols-2 gap-1 pt-1">
                <span className="text-gray-500">Ships from</span>
                <span className="font-semibold text-gray-800">{p.shipsFrom || 'SOA'}</span>
                <span className="text-gray-500">Sold by</span>
                <span className="font-semibold text-gray-800">{p.soldBy || 'SOA'}</span>
                <span className="text-gray-500">Returns</span>
                <span className="font-semibold text-[#007185]">30-day refund/replacement</span>
              </div>
            </div>

            {/* Wishlist & Share */}
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => toggleWishlist(p.id)}
                className={`flex items-center gap-1 text-xs font-semibold hover:underline ${
                  isFavorited ? 'text-red-600' : 'text-[#007185]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-red-600' : ''}`} />
                {isFavorited ? 'In Wish List' : 'Add to List'}
              </button>

              <button
                onClick={handleShare}
                className="text-gray-500 hover:text-gray-800 p-1.5 rounded-full hover:bg-gray-100 transition"
                title="Share product"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-6 mt-8">
        <h2 className="text-lg font-bold text-gray-900">Customer reviews &amp; ratings</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Star Distribution Column */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-baseline gap-2">
              <div className="flex items-center text-[#de7921]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(p.rating) ? 'fill-[#de7921] text-[#de7921]' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xl font-bold text-gray-900">{p.rating} out of 5</span>
            </div>
            <p className="text-xs text-gray-500">
              {p.reviewsCount.toLocaleString()} global ratings
            </p>

            {/* Percentage Bars */}
            <div className="space-y-2 pt-2 text-xs">
              {[
                { star: 5, pct: 78 },
                { star: 4, pct: 14 },
                { star: 3, pct: 5 },
                { star: 2, pct: 2 },
                { star: 1, pct: 1 },
              ].map(({ star, pct }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-12 text-[#007185] hover:underline cursor-pointer font-medium">
                    {star} star
                  </span>
                  <div className="flex-1 bg-gray-200 h-4 rounded-sm overflow-hidden border border-gray-300">
                    <div
                      className="bg-[#ffa41c] h-full rounded-sm"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-gray-500">{pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Customer Reviews list */}
          <div className="md:col-span-8 space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Top reviews from the United States</h3>
            {p.reviews && p.reviews.length > 0 ? (
              p.reviews.map((rev) => (
                <div key={rev.id} className="border-b border-gray-200 pb-4 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-amber-200 text-amber-900 rounded-full flex items-center justify-center font-bold text-xs">
                      {rev.author.charAt(0)}
                    </div>
                    <span className="font-semibold text-gray-900">{rev.author}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-[#de7921]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-[#de7921] text-[#de7921]' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-gray-900">{rev.title}</span>
                  </div>

                  <p className="text-[11px] text-gray-500">
                    Reviewed in the United States on {rev.date}
                  </p>

                  {rev.verified && (
                    <span className="text-[#c45500] font-bold text-[11px]">
                      Verified Purchase
                    </span>
                  )}

                  <p className="text-gray-700 leading-relaxed pt-1">{rev.comment}</p>

                  <div className="flex items-center gap-3 pt-2 text-gray-500 text-[11px]">
                    <span>{rev.helpfulCount} people found this helpful</span>
                    <button className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium shadow-sm flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 text-gray-500" /> Helpful
                    </button>
                    <span className="cursor-pointer hover:underline text-gray-400">Report</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic">
                Showing verified customer experiences for {p.title}. All ratings verified by SOA.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
