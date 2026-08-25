import React from 'react';
import { Star, Heart, Check, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'compact' | 'horizontal';
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  layout = 'grid',
  onQuickView,
}) => {
  const { setSelectedProductId, setActiveView, addToCart, isInWishlist, toggleWishlist } = useShop();

  const isFavorited = isInWishlist(product.id);

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setActiveView('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const [dollars, cents] = product.price.toFixed(2).split('.');

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className={`group bg-white rounded-md border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer relative ${
        layout === 'horizontal' ? 'flex-row gap-4 p-4' : 'p-3.5 sm:p-4'
      }`}
    >
      {/* Top Badges & Wishlist */}
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1 items-end">
        <button
          onClick={handleToggleWishlist}
          className={`p-1.5 rounded-full bg-white/90 shadow hover:bg-white transition ${
            isFavorited ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
          title={isFavorited ? 'Remove from Wish List' : 'Add to Wish List'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Main Image Container */}
      <div className="relative w-full aspect-square bg-[#f8f9fa] rounded flex items-center justify-center p-3 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
          loading="lazy"
        />

        {/* SOA's Choice / Best Seller Pill */}
        {product.bestSeller && (
          <div className="absolute top-0 left-0 bg-[#e67a00] text-white text-[10px] font-bold px-2 py-0.5 rounded-br uppercase tracking-tight shadow-sm">
            #1 Best Seller
          </div>
        )}
        {product.soasChoice && !product.bestSeller && (
          <div className="absolute top-0 left-0 bg-[#232f3e] text-white text-[10px] font-medium px-2 py-0.5 rounded-br flex items-center gap-1 shadow-sm">
            <span className="text-white">SOA's</span>
            <span className="text-[#f90] font-bold">Choice</span>
          </div>
        )}

        {/* Quick View Button overlay on hover */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-2 inset-x-3 py-1.5 bg-white/95 hover:bg-white text-gray-800 text-xs font-semibold rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 border border-gray-200"
          >
            <Eye className="w-3.5 h-3.5 text-gray-600" />
            Quick Look
          </button>
        )}
      </div>

      {/* Product Content Details */}
      <div className="pt-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Brand */}
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            {product.brand}
          </span>

          {/* Title */}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug group-hover:text-[#007185] transition-colors">
            {product.title}
          </h3>

          {/* Star Ratings & Count */}
          <div className="flex items-center gap-1 text-xs">
            <div className="flex items-center text-[#de7921]">
              {[...Array(5)].map((_, i) => {
                const filled = i < Math.floor(product.rating);
                return (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      filled ? 'fill-[#de7921] text-[#de7921]' : 'text-gray-300'
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-xs font-bold text-gray-800 ml-0.5">{product.rating}</span>
            <span className="text-xs text-[#007185] hover:underline cursor-pointer">
              ({product.reviewsCount.toLocaleString()})
            </span>
          </div>

          {/* Social Proof */}
          {product.boughtInPastMonth && (
            <p className="text-[11px] text-gray-600">
              <span className="font-semibold text-gray-800">{product.boughtInPastMonth}</span> bought in past month
            </p>
          )}

          {/* Deal Tag */}
          {product.dealBadge && (
            <div className="inline-block px-1.5 py-0.5 bg-[#cc0c39] text-white text-[11px] font-bold rounded-sm">
              {product.dealBadge}
            </div>
          )}

          {/* Price Block */}
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <div className="flex items-start text-gray-900">
              <span className="text-xs font-medium relative top-0.5">$</span>
              <span className="text-xl font-bold leading-none tracking-tight">{dollars}</span>
              <span className="text-xs font-medium relative top-0.5">{cents}</span>
            </div>

            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-500 line-through">
                List: ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Prime Badge & Delivery */}
          <div className="space-y-0.5 text-xs text-gray-700">
            {product.prime && (
              <div className="flex items-center gap-1">
                <span className="font-black italic text-[#00a8e1] tracking-tighter text-sm">
                  prime
                </span>
                <Check className="w-3.5 h-3.5 text-[#00a8e1] stroke-[3]" />
              </div>
            )}
            <p className="text-[11px] text-gray-800">
              <span className="font-semibold">FREE delivery</span> <span className="font-bold">Tomorrow, Aug 15</span>
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3">
          <button
            onClick={handleAddToCart}
            className="w-full py-1.5 px-3 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f2b900] text-gray-900 text-xs font-semibold rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 focus:outline-none"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-gray-800" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
