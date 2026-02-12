import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Package, Clock, CheckCircle } from 'lucide-react';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            const fetchOrders = async () => {
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                    const config = {
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    };
                    const { data } = await axios.get(`${apiUrl}/orders/myorders`, config);
                    setOrders(data);
                    setLoading(false);
                } catch (error) {
                    toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
                    setLoading(false);
                }
            };
            fetchOrders();
        }
    }, [navigate, user]);

    if (loading) return <div className="text-center py-20">Loading profile...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* User Info Sidebar */}
                <div className="md:w-1/4">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold mb-4">User Profile</h2>
                        <div className="mb-4">
                            <label className="block text-gray-600 text-sm">Name</label>
                            <p className="text-lg font-medium">{user.name}</p>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-600 text-sm">Email</label>
                            <p className="text-lg font-medium">{user.email}</p>
                        </div>
                        {user.isAdmin && (
                            <Link
                                to="/admin/dashboard"
                                className="block w-full bg-indigo-600 text-white text-center py-2 rounded-lg mb-3 hover:bg-indigo-700 transition"
                            >
                                Admin Dashboard
                            </Link>
                        )}
                        <button
                            onClick={() => { logout(); navigate('/'); }}
                            className="w-full bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Order History */}
                <div className="md:w-3/4">
                    <h2 className="text-2xl font-bold mb-6">My Orders</h2>
                    {orders.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                            <Package size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                            <Link to="/" className="text-green-600 hover:underline">Start Shopping</Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                                    <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center border-b">
                                        <div>
                                            <span className="text-sm text-gray-500 block">Order ID</span>
                                            <span className="font-mono font-medium text-gray-700">{order._id}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500 block">Date</span>
                                            <span className="font-medium text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500 block">Total</span>
                                            <span className="font-bold text-gray-900">₹{order.totalPrice}</span>
                                        </div>
                                        <div className="mt-2 sm:mt-0 flex items-center gap-4">
                                            <Link to={`/order/${order._id}`} className="text-green-600 hover:text-green-800 text-sm font-semibold hover:underline">
                                                View Details
                                            </Link>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.status || (order.isDelivered ? 'Delivered' : 'Processing')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        {order.orderItems.map((item, index) => (
                                            <div key={index} className="flex items-center py-2 border-b last:border-0 border-gray-50">
                                                <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden mr-4">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                                                    <p className="text-sm text-gray-500">{item.qty} x ₹{item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
