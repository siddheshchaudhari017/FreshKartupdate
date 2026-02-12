import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { validateEmail, sanitizeInput } from '../utils/inputValidation';

import ReCAPTCHA from 'react-google-recaptcha';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const [lockTimeRemaining, setLockTimeRemaining] = useState(0);
    const [recaptchaToken, setRecaptchaToken] = useState(null);

    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = location.search ? location.search.split('=')[1] : '/';

    useEffect(() => {
        if (user) {
            navigate(redirect);
        }
    }, [navigate, user, redirect]);

    // Countdown timer for account lockout
    useEffect(() => {
        if (lockTimeRemaining > 0) {
            const timer = setTimeout(() => {
                setLockTimeRemaining(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (lockTimeRemaining === 0 && isLocked) {
            setIsLocked(false);
        }
    }, [lockTimeRemaining, isLocked]);

    const handleEmailBlur = () => {
        const error = validateEmail(email);
        setEmailError(error);
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        // Validate email
        const emailValidationError = validateEmail(email);
        if (emailValidationError) {
            setEmailError(emailValidationError);
            toast.error('Please enter a valid email address');
            return;
        }

        if (!password) {
            toast.error('Please enter your password');
            return;
        }

        if (!recaptchaToken) {
            toast.error('Please verify you are not a robot');
            return;
        }

        try {
            const sanitizedEmail = sanitizeInput(email);
            const response = await login(sanitizedEmail, password, recaptchaToken);

            // Check for email verification warning
            if (response?.emailVerifiedWarning) {
                toast('Please verify your email address', {
                    icon: '⚠️',
                    duration: 5000
                });
            }

            toast.success('Logged in successfully');
            navigate(redirect);
        } catch (err) {
            // Handle account lockout
            if (err.includes('locked')) {
                setIsLocked(true);
                // Extract minutes from error message if possible
                const match = err.match(/(\d+)\s+minutes?/);
                if (match) {
                    setLockTimeRemaining(parseInt(match[1]) * 60);
                }
            }
            toast.error(err);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign In</h1>

                {/* Account Locked Warning */}
                {isLocked && lockTimeRemaining > 0 && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-red-800">Account Temporarily Locked</h3>
                                <p className="text-xs text-red-600 mt-1">
                                    Too many failed login attempts. Please try again in{' '}
                                    <span className="font-bold">
                                        {Math.floor(lockTimeRemaining / 60)}:{(lockTimeRemaining % 60).toString().padStart(2, '0')}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={submitHandler}>
                    {/* Email Field */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            className={`shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${emailError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'
                                }`}
                            id="email"
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (emailError) setEmailError('');
                            }}
                            onBlur={handleEmailBlur}
                            disabled={isLocked}
                        />
                        {emailError && (
                            <p className="text-red-500 text-xs mt-1">{emailError}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLocked}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                disabled={isLocked}
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* CAPTCHA Widget */}
                    <div className="mb-6 flex justify-center">
                        <ReCAPTCHA
                            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                            onChange={(token) => setRecaptchaToken(token)}
                        />
                    </div>

                    {/* Forgot Password Link */}
                    <div className="flex items-center justify-between mb-6">
                        <Link
                            className="inline-block align-baseline font-bold text-sm text-green-600 hover:text-green-800"
                            to="/forgot-password"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        className={`w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition ${isLocked
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                        type="submit"
                        disabled={isLocked}
                    >
                        {isLocked ? 'Account Locked' : 'Sign In'}
                    </button>
                </form>
                {/* ... rest of component ... */}

                {/* Register Link */}
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        New Customer?{' '}
                        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-green-600 hover:text-green-800 font-semibold">
                            Register
                        </Link>
                    </p>
                </div>

                {/* Security Notice */}
                <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs text-blue-700">
                            Your account will be temporarily locked after 5 failed login attempts for security purposes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
