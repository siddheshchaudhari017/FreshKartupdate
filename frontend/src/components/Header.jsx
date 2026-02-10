import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search, X, LogOut, Heart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [keyword, setKeyword] = useState('');
    const { cartItems } = useCart();
    const { wishlist } = useWishlist();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/shop?keyword=${keyword}`);
        } else {
            navigate('/shop');
        }
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const wishlistCount = wishlist.length;

    const logoutHandler = () => {
        logout();
        navigate('/');
        setIsDropdownOpen(false);
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/shop" className="text-2xl font-bold text-green-600 flex items-center">
                        FreshKart
                    </Link>

                    {/* Desktop Search */}
                    <form onSubmit={submitHandler} className="hidden md:flex flex-1 mx-8 max-w-xl relative group">
                        <input
                            type="text"
                            placeholder="Search for vegetables, fruits, dairy..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all shadow-sm group-hover:shadow-md"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 p-1 rounded-full hover:bg-green-50 transition-colors">
                            <Search size={20} />
                        </button>
                    </form>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link to="/wishlist" className="relative text-gray-700 hover:text-green-600 group">
                            <Heart size={24} className="group-hover:scale-110 transition-transform" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        <Link to="/cart" className="relative text-gray-700 hover:text-green-600">
                            <ShoppingCart size={24} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center text-gray-700 hover:text-green-600 font-medium focus:outline-none"
                                >
                                    <User size={24} className="mr-1" />
                                    {user.name}
                                </button>
                                {/* Dropdown */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-100">
                                        {(user.isAdmin || user.role === 'seller') && (
                                            <Link
                                                to="/admin/dashboard"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Dashboard
                                            </Link>
                                        )}
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={logoutHandler}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center text-gray-700 hover:text-green-600 font-medium">
                                <User size={24} className="mr-1" />
                                Login
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-700"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Search & Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 space-y-4">
                        <form onSubmit={submitHandler} className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            />
                            <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-green-600">
                                <Search size={20} />
                            </button>
                        </form>
                        <div className="flex flex-col space-y-3">
                            <Link to="/cart" className="flex items-center text-gray-700 py-2 border-b">
                                <ShoppingCart size={20} className="mr-3" /> Cart ({cartCount})
                            </Link>

                            <Link to="/wishlist" className="flex items-center text-gray-700 py-2 border-b">
                                <Heart size={20} className="mr-3" /> Wishlist ({wishlistCount})
                            </Link>

                            {user ? (
                                <>
                                    <Link to="/profile" className="flex items-center text-gray-700 py-2 border-b">
                                        <User size={20} className="mr-3" /> Profile
                                    </Link>
                                    {(user.isAdmin || user.role === 'seller') && (
                                        <Link to="/admin/dashboard" className="flex items-center text-gray-700 py-2 border-b">
                                            <div className="w-5 mr-3"></div> Dashboard
                                        </Link>
                                    )}
                                    <button onClick={logoutHandler} className="flex items-center text-red-600 py-2 border-b">
                                        <LogOut size={20} className="mr-3" /> Logout
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="flex items-center text-gray-700 py-2 border-b">
                                    <User size={20} className="mr-3" /> Login / Register
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
