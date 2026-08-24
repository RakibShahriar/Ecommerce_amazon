import React from 'react';
import { X, Star, ShoppingCart, Check, ShieldCheck, Heart } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart, setSelectedProductId, setActiveView, isInWishlist, toggleWishlist } = useShop();

  const handleFullView = () => {
    setSelectedProductId(product.id);
    setActiveView('product_detail');
    onClose();
  };

  const isFavorited = isInWishlist(product.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-200 relative animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Quick Look &bull; {product.department}
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Image */}
          <div className="aspect-square bg-gray-50 rounded-lg p-4 flex items-center justify-center border border-gray-100 relative">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-full max-w-full object-contain mix-blend-multiply"
            />
            {product.dealBadge && (
              <span className="absolute top-2 left-2 bg-[#cc0c39] text-white text-xs font-bold px-2 py-0.5 rounded">
                {product.dealBadge}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-gray-500">{product.brand}</div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">{product.title}</h3>

            {/* Ratings */}
            <div className="flex items-center gap-1.5 text-xs">
              <div className="flex items-center text-[#de7921]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating) ? 'fill-[#de7921] text-[#de7921]' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-gray-800">{product.rating}</span>
              <span className="text-gray-500">({product.reviewsCount.toLocaleString()} ratings)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Prime delivery */}
            {product.prime && (
              <div className="flex items-center gap-1 text-xs text-gray-700">
                <span className="font-black italic text-[#00a8e1] tracking-tighter text-sm">prime</span>
                <Check className="w-3.5 h-3.5 text-[#00a8e1] stroke-[3]" />
                <span className="font-semibold text-gray-800">FREE One-Day Delivery</span>
              </div>
            )}

            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
              {product.description}
            </p>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  addToCart(product, 1);
                  onClose();
                }}
                className="w-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold text-xs rounded-full shadow transition flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleFullView}
                  className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-full border border-gray-300 transition"
                >
                  View full details
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-1.5 rounded-full border border-gray-300 hover:bg-gray-50 transition ${
                    isFavorited ? 'text-red-500 border-red-200 bg-red-50' : 'text-gray-600'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
