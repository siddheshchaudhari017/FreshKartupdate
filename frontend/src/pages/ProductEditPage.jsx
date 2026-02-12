import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { validateFarmerName, validateFarmerPhone } from '../utils/productValidation';

const ProductEditPage = () => {
    const { id } = useParams();
    const isEditMode = id ? true : false;

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [unit, setUnit] = useState('kg');
    const [farmerName, setFarmerName] = useState('');
    const [farmerPhone, setFarmerPhone] = useState('');
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || (!user.isAdmin && user.role !== 'seller')) {
            navigate('/');
        } else {
            if (isEditMode) {
                const fetchProduct = async () => {
                    try {
                        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                        const { data } = await axios.get(`${apiUrl}/products/${id}`);
                        setName(data.name);
                        setPrice(data.price);
                        setImage(data.image);
                        setCategory(data.category);
                        setCountInStock(data.countInStock);
                        setDescription(data.description);
                        setUnit(data.unit || 'kg');
                        setFarmerName(data.farmerName || '');
                        setFarmerPhone(data.farmerPhone || '');
                    } catch (error) {
                        toast.error(error.message);
                    }
                };
                fetchProduct();
            }
        }
    }, [id, isEditMode, user, navigate]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.post(`${apiUrl}/upload`, formData, config);
            setImage(data);
            setUploading(false);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error(error);
            setUploading(false);
            // If backend cloudinary fails (due to placeholder keys), we might still want to proceed for demo.
            // But let's show error.
            // For demo purposes, if fails, maybe we don't block?
            // User instructed: "EXPECTED: Cloudinary credentials... placeholder... Assume valid values will be provided later."
            // So if it fails, it fails properly.
            toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        // Validate farmer details
        const farmerNameError = validateFarmerName(farmerName);
        const farmerPhoneError = validateFarmerPhone(farmerPhone);

        if (farmerNameError || farmerPhoneError) {
            setErrors({
                farmerName: farmerNameError,
                farmerPhone: farmerPhoneError
            });
            toast.error('Please fix the errors in the form');
            return;
        }

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const productData = {
                name,
                price,
                image,
                category,
                countInStock,
                description,
                unit,
                farmerName,
                farmerPhone
            };

            if (isEditMode) {
                await axios.put(
                    `${apiUrl}/products/${id}`,
                    productData,
                    config
                );
                toast.success('Product updated successfully');
            } else {
                await axios.post(
                    `${apiUrl}/products`,
                    productData,
                    config
                );
                toast.success('Product created successfully');
            }
            navigate('/admin/dashboard');
        } catch (error) {
            toast.error(error.response && error.response.data.message ? error.response.data.message : error.message);
        }
    };

    // Actually, let's fix the Controller to allow creating with data.
    // I'll do that in a separate step or just rely on the 'Create Sample -> Edit' flow which is robust.
    // Let's implement 'Create Sample -> Edit' flow in Dashboard. 
    // So `ProductEditPage` is ONLY for editing.
    // I will rename this component to `ProductEditPage` explicitly (it is joined currently).

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <Link to="/admin/dashboard" className="flex items-center text-gray-600 hover:text-green-600 mb-6">
                <ArrowLeft size={20} className="mr-2" /> Go Back
            </Link>

            <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Product' : 'Create Product'}</h1>

            <form onSubmit={submitHandler} className="bg-white p-8 rounded-xl shadow-sm space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Name</label>
                    <input
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label className="block text-gray-700 font-medium mb-1">Price</label>
                        <input
                            type="number"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-gray-700 font-medium mb-1">Unit</label>
                        <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="kg">kg</option>
                            <option value="gm">gm</option>
                            <option value="piece">piece</option>
                            <option value="bunch">bunch</option>
                            <option value="liter">liter</option>
                            <option value="dozen">dozen</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Image</label>
                    <div className="flex space-x-4 items-center">
                        <input
                            type="text"
                            placeholder="Enter image URL"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="flex-1 border rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium transition">
                            Choose File
                            <input type="file" className="hidden" onChange={uploadFileHandler} />
                        </label>
                    </div>
                    {uploading && <p className="text-sm text-blue-500 mt-1">Uploading...</p>}
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Category</label>
                    <input
                        type="text"
                        placeholder="Enter category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Count In Stock</label>
                    <input
                        type="number"
                        placeholder="Enter stock"
                        value={countInStock}
                        onChange={(e) => setCountInStock(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Description</label>
                    <textarea
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2 h-32 focus:ring-green-500 focus:border-green-500"
                    ></textarea>
                </div>

                {/* Farmer Details Section */}
                <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Farmer Details</h3>

                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-gray-700 font-medium mb-1">
                                Farmer Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter farmer name"
                                value={farmerName}
                                onChange={(e) => {
                                    setFarmerName(e.target.value);
                                    if (errors.farmerName) {
                                        setErrors({ ...errors, farmerName: '' });
                                    }
                                }}
                                className={`w-full border rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 ${errors.farmerName ? 'border-red-500' : ''
                                    }`}
                            />
                            {errors.farmerName && (
                                <p className="text-red-500 text-xs mt-1">{errors.farmerName}</p>
                            )}
                        </div>

                        <div className="w-1/2">
                            <label className="block text-gray-700 font-medium mb-1">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter 10-digit phone number"
                                value={farmerPhone}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setFarmerPhone(value);
                                    if (errors.farmerPhone) {
                                        setErrors({ ...errors, farmerPhone: '' });
                                    }
                                }}
                                maxLength={10}
                                className={`w-full border rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 ${errors.farmerPhone ? 'border-red-500' : ''
                                    }`}
                            />
                            {errors.farmerPhone && (
                                <p className="text-red-500 text-xs mt-1">{errors.farmerPhone}</p>
                            )}
                            {farmerPhone && farmerPhone.length === 10 && !errors.farmerPhone && (
                                <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Valid phone number
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                >
                    <Save size={20} className="mr-2" />
                    {isEditMode ? 'Update Product' : 'Create Product'}
                </button>
            </form>
        </div>
    );
};

export default ProductEditPage;
