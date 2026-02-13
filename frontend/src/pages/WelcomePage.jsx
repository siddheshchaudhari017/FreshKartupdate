import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const WelcomePage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial State
            gsap.set('.welcome-content', { opacity: 0, scale: 0.9 });
            gsap.set('.developer-text', { opacity: 0, y: 20 });
            gsap.set('.loading-bar', { width: '0%' });

            const tl = gsap.timeline({
                onComplete: () => {
                    navigate('/shop');
                }
            });

            // Animations
            tl.to('.welcome-content', {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: 'power3.out'
            })
                .to('.developer-text', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'back.out(1.7)'
                }, '-=0.5')
                .to('.loading-bar', {
                    width: '100%',
                    duration: 2, // 2 seconds loading time
                    ease: 'power1.inOut'
                });

        }, containerRef);

        return () => ctx.revert();
    }, [navigate]);

    return (
        <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
            {/* Background Decorations (GSAP animated via CSS class for now, or could be GSAP too) */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>

            <div className="welcome-content z-10 text-center max-w-2xl mx-auto backdrop-blur-md bg-white/40 p-12 rounded-3xl shadow-2xl border border-white/60">

                {/* Logo/Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-6xl filter drop-shadow-md">🥦</span>
                        <div className="absolute -right-1 -bottom-1 bg-green-100 p-2 rounded-full shadow-sm">
                            <span className="text-2xl">🍎</span>
                        </div>
                    </div>
                </div>

                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-2 tracking-tight">
                    <span className="text-green-600">FreshKart</span>
                </h1>

                <p className="text-xl text-gray-600 mb-8 font-light">
                    Freshness Delivered Daily
                </p>

                <div className="developer-text">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">Developed by</p>
                    <h2 className="text-2xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
                        Siddhesh Chaudhari & Aaditya Jadhav
                    </h2>
                </div>

                {/* Loading Bar */}
                <div className="mt-10 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div className="loading-bar bg-green-600 h-1.5 rounded-full shadow-[0_0_10px_rgba(22,163,74,0.5)]"></div>
                </div>
            </div>

        </div>
    );
};

export default WelcomePage;
