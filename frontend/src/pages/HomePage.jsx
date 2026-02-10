import { useState, useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { ArrowRight } from 'lucide-react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = [
        { name: 'All', icon: '🧺' },
        { name: 'Vegetables', icon: '🥕' },
        { name: 'Fruits', icon: '🍎' },
        { name: 'Dairy', icon: '🥛' },
        { name: 'Grains', icon: '🌾' },
        { name: 'Snacks', icon: '🍪' }
    ];

    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const { data } = await axios.get(`${apiUrl}/products?keyword=${keyword}`);

                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [keyword]);

    // GSAP Animations
    useEffect(() => {
        if (loading) return;

        const ctx = gsap.context(() => {
            // Hero Animation (On Load)
            const tl = gsap.timeline();
            tl.from('.hero-content > *', {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out'
            })
                .from('.hero-image', {
                    scale: 0.8,
                    opacity: 0,
                    duration: 1.2,
                    ease: 'elastic.out(1, 0.7)'
                }, '-=0.8');

            // Category Filter Chips (Scroll Trigger)
            // Category Filter Chips (Scroll Trigger) removed to ensure visibility

        });

        return () => ctx.revert();
    }, [loading]);

    const filteredProducts = useMemo(() => {
        if (activeCategory === 'All') return products;
        return products.filter(product =>
            product.category?.toLowerCase() === activeCategory.toLowerCase()
        );
    }, [activeCategory, products]);

    // Dynamic Animations (Products & Popular)
    useEffect(() => {
        if (loading) return;

        const ctx = gsap.context(() => {
            // Popular Products (only if visible)
            // Removed animations to ensure visibility

            // Latest Products Title
            gsap.from('.latest-title', {
                x: -50,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out'
            });

            // Product Grid Animation (Simple fade-in for smooth filtering)
            gsap.fromTo('.product-card-anim',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out', clearProps: 'all' }
            );
        });

        // Refresh ScrollTrigger to ensure positions are accurate after layout change
        ScrollTrigger.refresh();

        return () => ctx.revert();
    }, [loading, activeCategory, filteredProducts]);

    if (loading) return <Loader />;
    if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

    return (
        <div>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 mb-10 flex flex-col md:flex-row items-center justify-between shadow-sm relative overflow-hidden">
                <div className="hero-content md:w-1/2 mb-8 md:mb-0 z-10">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">100% Organic & Fresh</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                        Farm Fresh <br />
                        <span className="text-green-600">Groceries</span>
                    </h1>
                    <p className="text-gray-600 mb-8 text-lg max-w-md">
                        Order fresh vegetables, fruits, and groceries online and get them delivered to your doorstep within minutes.
                    </p>
                    <button
                        onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition font-medium shadow-lg shadow-green-200 flex items-center group"
                    >
                        Shop Now <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
                <div className="hero-image md:w-1/2 flex justify-center z-10 relative">
                    <div className="w-64 h-64 md:w-80 md:h-80 relative">
                        <img
                            src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                            alt="Fresh Vegetables"
                            className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white"
                        />
                        <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-xl shadow-lg animate-bounce">
                            <span className="text-2xl">🥬</span>
                        </div>
                        <div className="absolute -top-4 -left-4 bg-white p-3 rounded-xl shadow-lg">
                            <span className="text-2xl">🍎</span>
                        </div>
                    </div>
                </div>
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-200 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-200 opacity-20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>


            {/* Category Filter Section */}
            <div id="products-section" className="mb-10">
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`group flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 shadow-sm hover:shadow-lg ${activeCategory === cat.name
                                ? 'bg-green-600 text-white scale-105 shadow-green-200'
                                : 'bg-white text-gray-600 border border-gray-100 hover:bg-green-50 hover:text-green-700 hover:scale-105 hover:border-green-200'
                                } category-chip`}
                        >
                            <span className={`text-xl transition-transform duration-300 group-hover:scale-125 ${activeCategory === cat.name ? 'scale-110' : ''}`}>
                                {cat.icon}
                            </span>
                            <span>{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Popular Products Section */}
            {!keyword && activeCategory === 'All' && (
                <div className="mb-12 popular-section">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center popular-title">
                        Popular Products <span className="ml-3 text-sm font-normal text-green-600 bg-green-50 px-3 py-1 rounded-full">Top Rated</span>
                    </h2>
                    <PopularProducts />
                </div>
            )}

            {/* Products Grid */}
            <div className="flex items-center justify-between mb-8 latest-section">
                <h2 className="text-3xl font-bold text-gray-800 latest-title">
                    {activeCategory === 'All' ? 'Latest Products' : `${activeCategory}`}
                </h2>
                <div className="hidden md:block h-1 flex-1 bg-gray-100 ml-6 rounded-full"></div>
                <span className="text-gray-500 text-sm ml-4">{filteredProducts.length} items</span>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 text-lg">No products found for {activeCategory}.</p>
                    <button
                        onClick={() => setActiveCategory('All')}
                        className="mt-4 text-green-600 hover:underline"
                    >
                        View all products
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product._id} className="product-card-anim">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const PopularProducts = () => {
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const { data } = await axios.get(`${apiUrl}/products/top`);

                setTopProducts(data);
                setLoading(false);
            } catch (error) {

                setLoading(false);
            }
        };
        fetchTopProducts();
    }, []);

    if (loading) return <div className="animate-pulse h-64 bg-gray-100 rounded-xl"></div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {topProducts.map((product) => (
                <div key={product._id} className="popular-product-card">
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
};

export default HomePage;
