import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const WishlistPage = () => {
    const { wishlist } = useWishlist();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-8">
                <Heart className="text-red-500 mr-3" size={32} fill="currentColor" />
                <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
                <span className="ml-4 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                    {wishlist.length} Items
                </span>
            </div>

            {wishlist.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="bg-white p-6 rounded-full inline-block mb-6 shadow-sm">
                        <Heart size={64} className="text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Seems like you haven't found anything yet. Browse our fresh products and save your favorites!
                    </p>
                    <Link
                        to="/shop"
                        className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition shadow-lg shadow-green-200"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlist.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
