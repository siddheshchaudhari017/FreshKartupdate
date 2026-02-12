import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Minus, Plus, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [qty, setQty] = useState(1);
    const [imgSrc, setImgSrc] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const { data } = await axios.get(`${apiUrl}/products/${id}`);
                setProduct(data);
                setImgSrc(data.image);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, qty);
        toast.success(`Added ${qty} ${product.unit} of ${product.name} to cart`);
        navigate('/cart');
    };

    if (loading) return <Loader />;
    if (error) return (
        <div className="container mx-auto px-4 py-20 text-center">
            <h2 className="text-2xl text-red-500 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link to="/shop" className="text-green-600 hover:underline">Back to Shop</Link>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/shop" className="inline-flex items-center text-gray-500 hover:text-green-600 mb-6 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Back to Shop
            </Link>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {/* Left: Image Section */}
                    <div className="bg-gray-50 flex items-center justify-center p-8 md:p-16 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <img
                            src={imgSrc}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            onError={() => setImgSrc('https://placehold.co/600x400?text=Fresh+Product')}
                            className="max-h-[500px] w-full object-contain drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* Right: Details Section */}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                        <div className="mb-2 flex items-center space-x-2">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                {product.category}
                            </span>
                            {product.countInStock > 0 ? (
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                                    In Stock
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold">
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-display">
                            {product.name}
                        </h1>

                        <div className="flex items-center mb-6">
                            <div className="flex text-yellow-400 mr-2">
                                <Star size={18} fill="currentColor" />
                                <Star size={18} fill="currentColor" />
                                <Star size={18} fill="currentColor" />
                                <Star size={18} fill="currentColor" />
                                <Star size={18} fill="currentColor" className="text-gray-300" />
                            </div>
                            <span className="text-gray-400 text-sm">(4.0 Reviews)</span>
                        </div>

                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Farmer Details Section */}
                        {(product.farmerName || product.farmerPhone) && (
                            <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-xl">
                                <h3 className="text-sm font-bold text-green-800 uppercase tracking-wide mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    Farmer Information
                                </h3>
                                <div className="space-y-2">
                                    {product.farmerName && (
                                        <div className="flex items-center text-gray-700">
                                            <span className="font-medium text-sm text-gray-500 w-24">Name:</span>
                                            <span className="text-base font-semibold">{product.farmerName}</span>
                                        </div>
                                    )}
                                    {product.farmerPhone && (
                                        <div className="flex items-center text-gray-700">
                                            <span className="font-medium text-sm text-gray-500 w-24">Phone:</span>
                                            <a
                                                href={`tel:${product.farmerPhone}`}
                                                className="text-base font-semibold text-green-600 hover:text-green-700 hover:underline"
                                            >
                                                {product.farmerPhone}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex items-end mb-8">
                            <span className="text-5xl font-bold text-gray-900 tracking-tight">
                                ₹{product.price * qty}
                            </span>
                            <span className="text-gray-500 ml-2 mb-2 text-lg font-medium">
                                {qty > 1 ? `(Total for ${qty} ${product.unit})` : `/ ${product.unit}`}
                            </span>
                        </div>

                        {/* Quantity Selector */}
                        {product.countInStock > 0 && (
                            <div className="mb-8">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                <div className="flex items-center w-max bg-gray-100 rounded-full p-1">
                                    <button
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        className="w-10 h-10 rounded-full bg-white text-gray-600 shadow-sm flex items-center justify-center hover:bg-gray-50 transition active:scale-95"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-12 text-center text-lg font-bold text-gray-800">{qty}</span>
                                    <button
                                        onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                                        className="w-10 h-10 rounded-full bg-white text-green-600 shadow-sm flex items-center justify-center hover:bg-gray-50 transition active:scale-95"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.countInStock === 0}
                                className={`flex-1 py-4 px-8 rounded-full flex items-center justify-center text-lg font-bold transition-all transform hover:-translate-y-1 ${product.countInStock > 0
                                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <ShoppingCart size={24} className="mr-2" />
                                {product.countInStock > 0 ? 'Add to Cart' : 'Sold Out'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
