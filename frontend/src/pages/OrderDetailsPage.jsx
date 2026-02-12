import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MapPin, CreditCard, Package, CheckCircle, Truck, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchOrder = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.get(`${apiUrl}/orders/${id}`, config);
            setOrder(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchOrder();
        }
    }, [id, user]);

    const cancelOrderHandler = async () => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                setCancelLoading(true);
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                };
                await axios.put(`${apiUrl}/orders/${id}/cancel`, {}, config);
                toast.success('Order Cancelled Successfully');
                fetchOrder();
            } catch (err) {
                toast.error(err.response?.data?.message || err.message);
            } finally {
                setCancelLoading(false);
            }
        }
    };

    if (loading) return <Loader />;
    if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;
    if (!order) return <div className="text-center py-20">Order not found</div>;

    const steps = [
        { status: 'Placed', icon: ShoppingBag },
        { status: 'Packed', icon: Package },
        { status: 'Out for delivery', icon: Truck },
        { status: 'Delivered', icon: CheckCircle },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.status) !== -1
        ? steps.findIndex(s => s.status === order.status)
        : (order.isDelivered ? 3 : 0);

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/profile" className="inline-flex items-center text-gray-500 hover:text-green-600 mb-6 font-medium">
                <ArrowLeft size={20} className="mr-2" /> Back to Orders
            </Link>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Order #{order._id}</h1>
                                <p className="text-gray-500 text-sm mt-1">
                                    Placed on {new Date(order.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${order.isDelivered ? 'bg-green-100 text-green-700' : order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-600'
                                }`}>
                                {order.status}
                            </span>
                        </div>

                        {/* Order Progress */}
                        {order.status === 'Cancelled' ? (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 text-center font-medium">
                                This order has been cancelled.
                            </div>
                        ) : (
                            <div className="relative mb-10 mt-8">
                                <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                                <div
                                    className="hidden md:block absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 z-0 transition-all duration-1000"
                                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                                ></div>

                                <div className="flex justify-between relative z-10 w-full">
                                    {steps.map((step, index) => {
                                        const Icon = step.icon;
                                        const isActive = index <= currentStepIndex;
                                        const isCurrent = index === currentStepIndex;

                                        return (
                                            <div key={index} className="flex flex-col items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 bg-white ${isActive
                                                    ? 'border-green-500 text-green-600'
                                                    : 'border-gray-200 text-gray-300'
                                                    } ${isCurrent ? 'ring-4 ring-green-100 scale-110' : ''}`}>
                                                    <Icon size={18} fill={isActive && step.status === 'Delivered' ? 'currentColor' : 'none'} />
                                                </div>
                                                <span className={`mt-2 text-xs font-semibold ${isActive ? 'text-green-700' : 'text-gray-400'
                                                    }`}>
                                                    {step.status}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Cancel Order Button */}
                        {!order.isDelivered && order.status !== 'Cancelled' && (
                            <div className="mt-6 text-right">
                                <button
                                    onClick={cancelOrderHandler}
                                    disabled={cancelLoading}
                                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {cancelLoading ? 'Cancelling...' : 'Cancel Order'}
                                </button>
                            </div>
                        )}

                        {/* Items */}
                        <div className="space-y-4 mt-6">
                            <h3 className="font-bold text-gray-800 text-lg mb-4">Items in Order</h3>
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="flex items-center py-3 border-b last:border-0 border-gray-50">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-4">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <Link to={`/product/${item.product}`} className="font-medium text-gray-800 hover:text-green-600">
                                            {item.name}
                                        </Link>
                                        <div className="text-sm text-gray-500">
                                            {item.qty} x ₹{item.price}
                                        </div>
                                    </div>
                                    <div className="font-bold text-gray-800">
                                        ₹{item.qty * item.price}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:w-1/3 space-y-6">
                    {/* Summary */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Items Total</span>
                                <span>₹{order.itemsPrice || (order.totalPrice - order.taxPrice - order.shippingPrice).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-green-600">{order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice}`}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax</span>
                                <span>₹{order.taxPrice}</span>
                            </div>
                            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-gray-900">
                                <span>Total</span>
                                <span>₹{order.totalPrice}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <MapPin size={20} className="mr-2 text-green-600" /> Shipping Address
                        </h2>
                        <div className="text-gray-600 leading-relaxed">
                            <p className="font-medium text-gray-800">{user.name}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <CreditCard size={20} className="mr-2 text-green-600" /> Payment
                        </h2>
                        <p className="text-gray-600 font-medium">{order.paymentMethod}</p>
                        <p className={`text-sm mt-1 ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                            {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Payment Pending'}
                        </p>
                    </div>

                    {/* Cancel Order Button */}
                    {order.status === 'Placed' && !user.isAdmin && (
                        <button
                            onClick={cancelOrderHandler}
                            className="w-full bg-red-50 text-red-600 font-bold py-3 px-4 rounded-xl border border-red-100 hover:bg-red-100 transition flex items-center justify-center"
                        >
                            Cancel Order
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
