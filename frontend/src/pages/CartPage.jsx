import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    const checkoutHandler = () => {
        // Check if user is logged in, else redirect to login
        const userInfo = localStorage.getItem('freshkart_user');
        if (userInfo) {
            navigate('/checkout');
        } else {
            navigate('/login?redirect=checkout');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                    <Link
                        to="/"
                        className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 text-sm font-semibold text-gray-600 border-b">
                            <div className="col-span-6">Product</div>
                            <div className="col-span-2 text-center">Price</div>
                            <div className="col-span-2 text-center">Quantity</div>
                            <div className="col-span-2 text-center">Total</div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {cartItems.map((item) => (
                                <div key={item._id} className="p-4 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                                    {/* Product Info */}
                                    <div className="col-span-6 flex items-center w-full">
                                        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden mr-4">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <Link to={`/product/${item._id}`} className="font-medium text-gray-800 hover:text-green-600 block mb-1">
                                                {item.name}
                                            </Link>
                                            <span className="text-xs text-gray-500">{item.category}</span>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="col-span-2 text-center w-full md:w-auto flex justify-between md:block">
                                        <span className="md:hidden text-gray-500">Price:</span>
                                        <span className="font-medium">₹{item.price}</span>
                                    </div>

                                    {/* Quantity */}
                                    <div className="col-span-2 flex justify-center w-full md:w-auto items-center">
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <button
                                                className="p-1 hover:bg-gray-100 text-gray-600 disabled:opacity-50"
                                                onClick={() => updateQuantity(item._id, Math.max(1, item.qty - 1))}
                                                disabled={item.qty <= 1}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-10 text-center font-medium">{item.qty}</span>
                                            <button
                                                className="p-1 hover:bg-gray-100 text-gray-600 disabled:opacity-50"
                                                onClick={() => updateQuantity(item._id, Math.max(1, item.qty + 1))} // Add max stock check logic later
                                                disabled={item.qty >= item.countInStock}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subtotal & Remove */}
                                    <div className="col-span-2 flex items-center justify-between w-full md:w-auto">
                                        <span className="md:hidden text-gray-500">Total:</span>
                                        <span className="font-bold text-gray-900">₹{item.price * item.qty}</span>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="ml-4 text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition"
                                            title="Remove item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 pb-4 border-b">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Charges</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
                                <span>Total Amount</span>
                                <span>₹{cartTotal}</span>
                            </div>
                        </div>

                        <button
                            onClick={checkoutHandler}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg shadow-green-200"
                        >
                            Proceed to Checkout
                        </button>

                        <div className="mt-4 text-center">
                            <Link to="/" className="text-green-600 hover:underline text-sm font-medium">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
