import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Users, ShoppingBag, Edit, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'

    useEffect(() => {
        if (!user || (!user.isAdmin && user.role !== 'seller')) {
            navigate('/');
        } else {
            fetchData();
        }
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            const [productsRes, ordersRes] = await Promise.all([
                axios.get(`${apiUrl}/products`),
                user.isAdmin ? axios.get(`${apiUrl}/orders`, config) : Promise.resolve({ data: [] })
            ]);

            // Filter products for seller
            let productData = productsRes.data;
            if (!user.isAdmin && user.role === 'seller') {
                productData = productData.filter(p => p.user === user._id);
            }

            setProducts(productData);
            setOrders(ordersRes.data);
        } catch (error) {
            toast.error('Error fetching data');
        }
    };

    const createProductHandler = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`${apiUrl}/products`, {}, config);
            toast.success('Product created');
            navigate(`/admin/product/${data._id}/edit`);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const deleteProductHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`${apiUrl}/products/${id}`, config);
                toast.success('Product deleted');
                fetchData();
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            // Use generic status update endpoint for all statuses
            await axios.put(`${apiUrl}/orders/${id}/status`, { status }, config);
            toast.success(`Order Updated to ${status}`);
            fetchData();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    {user?.isAdmin ? 'Admin Dashboard' : 'Seller Dashboard'}
                </h1>
                {activeTab === 'products' && (
                    <button
                        onClick={createProductHandler}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700"
                    >
                        <Plus size={20} className="mr-2" /> Add Product
                    </button>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm font-medium uppercase">Total Products</p>
                            <p className="text-3xl font-bold text-gray-800">{products.length}</p>
                        </div>
                        <Package className="text-blue-500 opacity-20" size={40} />
                    </div>
                </div>

                {user.isAdmin && (
                    <>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-purple-500 cursor-pointer hover:bg-purple-50 transition" onClick={() => setActiveTab('orders')}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium uppercase">Total Orders</p>
                                    <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
                                </div>
                                <ShoppingBag className="text-purple-500 opacity-20" size={40} />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-green-500">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium uppercase">Total Revenue</p>
                                    <p className="text-3xl font-bold text-gray-800">₹{orders.reduce((acc, order) => acc + order.totalPrice, 0)}</p>
                                </div>
                                <div className="text-green-500 opacity-20 text-2xl font-bold">₹</div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b">
                <button
                    className={`pb-2 px-4 font-medium ${activeTab === 'products' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('products')}
                >
                    Products
                </button>
                {user.isAdmin && (
                    <button
                        className={`pb-2 px-4 font-medium ${activeTab === 'orders' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        Orders
                    </button>
                )}
            </div>

            {/* Content */}
            {activeTab === 'products' ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4">Farmer</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="p-4 text-sm text-gray-500 font-mono">{product._id.substring(20, 24)}...</td>
                                    <td className="p-4 font-medium text-gray-800">{product.name}</td>
                                    <td className="p-4">₹{product.price}</td>
                                    <td className="p-4 text-sm text-gray-500">{product.category}</td>
                                    <td className="p-4">{product.countInStock}</td>
                                    <td className="p-4 text-sm">
                                        <div className="font-medium text-gray-800">{product.farmerName || 'Unknown'}</div>
                                        <div className="text-gray-500 text-xs">{product.farmerPhone}</div>
                                    </td>
                                    <td className="p-4 flex space-x-2">
                                        <Link to={`/admin/product/${product._id}/edit`} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            onClick={() => deleteProductHandler(product._id)}
                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">User</th>
                                <th className="p-4">Items</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Paid</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="p-4 text-sm text-gray-500 font-mono">{order._id.substring(20, 24)}...</td>
                                    <td className="p-4 text-sm font-medium">{order.user ? order.user.name : 'Deleted User'}</td>
                                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={order.orderItems.map(i => `${i.name} (${i.qty})`).join(', ')}>
                                        {order.orderItems.map(i => `${i.name} (${i.qty})`).join(', ')}
                                    </td>
                                    <td className="p-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 font-medium">₹{order.totalPrice}</td>
                                    <td className="p-4">
                                        {order.isPaid ? (
                                            <span className="text-green-600 font-medium text-xs bg-green-100 px-2 py-1 rounded">Paid</span>
                                        ) : (
                                            <span className="text-red-600 font-medium text-xs bg-red-100 px-2 py-1 rounded">Pending</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.status || (order.isDelivered ? 'Delivered' : 'Pending')}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={order.status || 'Placed'}
                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                            className={`text-xs border rounded px-2 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-green-500 cursor-pointer ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-gray-600 border-gray-300'}`}
                                            disabled={order.status === 'Delivered'}
                                        >
                                            {['Placed', 'Packed', 'Out for delivery', 'Delivered'].map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};


export default AdminDashboard;
