import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="bg-green-600 text-white p-2 rounded-lg">
                                <span className="text-xl font-bold">F</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-800">FreshKart</span>
                        </Link>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            Delivering farm-fresh organic vegetables, fruits, and dairy directly from local farmers to your table within 24 hours.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                                <a key={index} href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all duration-300">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            {['Home', 'About Us', 'Shop', 'Cart', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-500 hover:text-green-600 transition-colors flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Contact Us</h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Address</h4>
                                    <p className="text-gray-500 text-sm">123 Green Earth Avenue, Organic City, Nature State, 560001</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Phone</h4>
                                    <p className="text-gray-500 text-sm">+91 98765 43210</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Email</h4>
                                    <p className="text-gray-500 text-sm">hello@freshkart.com</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Newsletter</h3>
                        <p className="text-gray-500 mb-6">Subscribe to get daily updates on new products and special offers.</p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-gray-50 border border-gray-100 rounded-full py-3 px-6 pr-12 text-gray-600 focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-300 transition-all"
                            />
                            <button className="absolute right-1 top-1 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors shadow-lg shadow-green-200">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">We prioritize your privacy.</p>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} <span className="font-bold text-gray-800">FreshKart</span>. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-green-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-green-600 transition-colors">Terms of Service</a>
                    </div>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                        Made by siddhesh chaudhari & Aaditya jadhav <span className="text-red-500">❤️</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
