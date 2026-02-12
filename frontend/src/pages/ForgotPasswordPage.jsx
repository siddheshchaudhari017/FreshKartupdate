import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, Loader } from 'lucide-react';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await axios.post(`${apiUrl}/auth/forgotpassword`, { email });
            setSuccess(true);
            toast.success('Email sent successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[60vh] px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <Link to="/login" className="inline-flex items-center text-gray-500 hover:text-green-600 mb-6 transition-colors">
                    <ArrowLeft size={18} className="mr-2" /> Back to Login
                </Link>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                        <Mail size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Forgot Password?</h1>
                    <p className="text-gray-500 mt-2">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {success ? (
                    <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-center">
                        <p>Check your email for the reset link.</p>
                        <p className="text-sm mt-2 text-green-600">Note: For this demo, check the server console logs.</p>
                    </div>
                ) : (
                    <form onSubmit={submitHandler}>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2 uppercase tracking-wide" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow shadow-sm"
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-transform transform active:scale-95 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? <Loader className="animate-spin mr-2" size={20} /> : 'Send Reset Link'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
