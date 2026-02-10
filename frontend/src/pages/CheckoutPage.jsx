import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const CheckoutPage = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD'); // Default Cash on Delivery

    if (cartItems.length === 0) {
        navigate('/cart');
        return null; // or redirect
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        // Calculate tax and shipping (mock)
        const itemsPrice = cartTotal;
        const shippingPrice = itemsPrice > 500 ? 0 : 50; // Free shipping over 500
        const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
        const totalPrice = itemsPrice + shippingPrice + taxPrice;

        const orderData = {
            orderItems: cartItems.map((item) => ({
                product: item._id,
                name: item.name,
                image: item.image,
                price: item.price,
                qty: item.qty
            })),
            shippingAddress: {
                address,
                city,
                postalCode,
                country
            },
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        };

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.post(`${apiUrl}/orders`, orderData, config);

            toast.success('Order placed successfully!');
            clearCart();
            // Redirect to order success/details page
            // navigate(`/order/${data._id}`); (If I had that page)
            // For now, redirect to profile or home
            toast.success('Order Placed! Redirecting...');
            navigate('/'); // Or profile
        } catch (error) {
            toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Checkout</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Shipping & Payment Form */}
                <div className="lg:w-2/3 bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                    <form onSubmit={submitHandler} id="checkout-form">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                />
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold mb-4 border-t pt-4">Payment Method</h2>
                        <div className="space-y-3 mb-6">
                            <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={paymentMethod === 'COD'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                                />
                                <span className="font-medium">Cash on Delivery</span>
                            </label>
                            <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 opacity-60">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Card"
                                    disabled
                                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                                />
                                <span className="font-medium">Credit/Debit Card (Coming Soon)</span>
                            </label>
                        </div>
                    </form>
                </div>

                {/* Order Summary Side */}
                <div className="lg:w-1/3">
                    <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
                        <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                        <div className="space-y-3 mb-4 text-sm">
                            {cartItems.map(item => (
                                <div key={item._id} className="flex justify-between">
                                    <span className="text-gray-600">{item.name} x {item.qty}</span>
                                    <span>₹{item.price * item.qty}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-3 space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>{cartTotal > 500 ? 'Free' : '₹50'}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax (5%)</span>
                                <span>₹{(cartTotal * 0.05).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                                <span>Total</span>
                                <span>₹{(cartTotal + (cartTotal > 500 ? 0 : 50) + (cartTotal * 0.05)).toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            className="w-full bg-green-600 text-white mt-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
