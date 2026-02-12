import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useState } from 'react';
import toast from 'react-hot-toast';
import FarmerContactModal from './FarmerContactModal';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isWishlisted = isInWishlist(product._id);
    const [isModalOpen, setIsModalOpen] = useState(false);



    // Prioritize product.image, then product.images[0], then fallback
    const mainImage = product.image || (product.images && product.images.length > 0 ? product.images[0] : '');
    const [imgSrc, setImgSrc] = useState(mainImage);

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent navigation if clicking the button
        addToCart(product);
        toast.success(`Added ${product.name} to cart`);
    };

    const handlePhoneClick = (e) => {
        e.preventDefault(); // Prevent navigation
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 group overflow-hidden relative">
                <button
                    onClick={() => toggleWishlist(product)}
                    className={`absolute top-3 right-3 z-20 p-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-110 ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-500'}`}
                    title="Add to Wishlist"
                >
                    <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                </button>

                {/* Phone Button */}
                <button
                    onClick={handlePhoneClick}
                    className="absolute top-3 right-14 z-20 p-2 rounded-full shadow-md bg-white/80 text-green-600 hover:bg-green-50 hover:text-green-700 transition-all duration-300 transform hover:scale-110"
                    title="Contact Farmer"
                >
                    <Phone size={20} />
                </button>

                <Link to={`/product/${product._id}`}>
                    <div className="h-56 overflow-hidden relative bg-gray-50">
                        <img
                            src={imgSrc}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            onError={() => setImgSrc('https://placehold.co/600x400?text=Fresh+Product')}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 will-change-transform"
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300"></div>

                        {!product.countInStock > 0 && (
                            <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                Out of Stock
                            </div>
                        )}

                        {/* Quick overlay effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>
                </Link>

                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md uppercase tracking-wide">
                            {product.category}
                        </span>
                        <div className="flex items-center text-yellow-400 text-xs gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    fill={i < (product.rating || 0) ? "currentColor" : "none"}
                                    className={i < (product.rating || 0) ? "text-yellow-400" : "text-gray-300"}
                                />
                            ))}
                            <span className="text-gray-400 ml-1">({product.numReviews || 0})</span>
                        </div>
                    </div>

                    <Link to={`/product/${product._id}`}>
                        <h3 className="text-lg font-bold text-gray-800 mb-2 truncate group-hover:text-green-600 transition-colors">
                            {product.name}
                        </h3>
                    </Link>

                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10 leading-relaxed">
                        {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-400 font-medium">Price</span>
                            <span className="text-xl font-extrabold text-gray-900">
                                ₹{product.price}<span className="text-sm font-normal text-gray-500">/{product.unit}</span>
                            </span>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className={`relative overflow-hidden flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shadow-md ${product.countInStock > 0
                                ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-110 active:scale-95'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            disabled={product.countInStock === 0}
                            title="Add to Cart"
                        >
                            <ShoppingCart size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Farmer Contact Modal */}
            <FarmerContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                farmerName={product.farmerName}
                farmerPhone={product.farmerPhone}
            />
        </>
    );
};

export default ProductCard;

