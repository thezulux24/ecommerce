import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, User, Heart, ArrowRight } from 'lucide-react';

const homeImage = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000&auto=format&fit=crop";

export const Home = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-muted">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="text-2xl font-display font-bold tracking-tighter">ONLINESTORE</div>

                    <div className="hidden md:flex items-center space-x-10 text-sm font-medium uppercase tracking-widest">
                        <a href="#" className="hover:text-accent transition-colors">Home</a>
                        <a href="#" className="hover:text-accent transition-colors">Shop</a>
                        <a href="#" className="hover:text-accent transition-colors">Product</a>
                        <a href="#" className="hover:text-accent transition-colors">Blog</a>
                        <a href="#" className="hover:text-accent transition-colors">Featured</a>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Search className="w-5 h-5 cursor-pointer hover:text-accent transition-colors" />
                        <User className="w-5 h-5 cursor-pointer hover:text-accent transition-colors" />
                        <div className="relative cursor-pointer hover:text-accent transition-colors">
                            <Heart className="w-5 h-5" />
                            <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
                        </div>
                        <div className="relative cursor-pointer hover:text-accent transition-colors">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden pt-20">
                <div className="absolute inset-x-6 inset-y-10 rounded-3xl overflow-hidden">
                    <img
                        src={homeImage}
                        alt="Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>

                <div className="relative text-center text-white px-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-6xl md:text-8xl font-display font-light mb-8 leading-tight"
                    >
                        The Art of Modern<br />Interior Living
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <button className="bg-white text-primary px-10 py-4 rounded-full font-medium hover:bg-accent hover:text-white transition-all duration-300 flex items-center mx-auto space-x-2">
                            <span>EXPLORE NOW</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Features Bar */}
            <section className="py-12 border-b border-muted bg-white">
                <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center uppercase tracking-widest text-[10px] font-bold text-gray-400">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-10 h-10 border border-muted rounded-full flex items-center justify-center">🚢</div>
                        <p>Free Shipping Over $50</p>
                    </div>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-10 h-10 border border-muted rounded-full flex items-center justify-center">🛡️</div>
                        <p>Quality Assurance</p>
                    </div>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-10 h-10 border border-muted rounded-full flex items-center justify-center">🔄</div>
                        <p>Return within 14 days</p>
                    </div>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-10 h-10 border border-muted rounded-full flex items-center justify-center">💬</div>
                        <p>Support 24/7</p>
                    </div>
                </div>
            </section>

            {/* Categories Grid (Aesthetics from image) */}
            <section className="py-24 container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
                    <div className="md:col-span-1 border border-muted rounded-2xl overflow-hidden relative group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Bathroom" />
                        <div className="absolute bottom-6 left-6 text-white text-2xl font-display">Bathroom</div>
                    </div>
                    <div className="md:col-span-1 border border-muted rounded-2xl overflow-hidden relative group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Chair" />
                        <div className="absolute bottom-6 left-6 text-white text-2xl font-display">Chair</div>
                    </div>
                    <div className="md:col-span-1 border border-muted rounded-2xl overflow-hidden relative group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Decor" />
                        <div className="absolute bottom-6 left-6 text-white text-2xl font-display">Decor</div>
                    </div>
                    <div className="md:col-span-1 border border-muted rounded-2xl overflow-hidden relative group cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1507473885765-e6ed03ac1b11?q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Lamp" />
                        <div className="absolute bottom-6 left-6 text-white text-2xl font-display">Lamp</div>
                    </div>
                </div>
            </section>
            {/* Bestseller Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex items-end justify-between mb-16">
                        <div>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-accent mb-2 block">Our Selection</span>
                            <h2 className="text-4xl font-display">Bestsellers</h2>
                        </div>
                        <button className="text-sm font-bold border-b-2 border-primary pb-1 hover:text-accent hover:border-accent transition-all">VIEW ALL</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-[4/5] bg-[#F4F4F4] rounded-2xl overflow-hidden mb-6">
                                    {i === 1 && <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] px-2 py-1 rounded-md">-10%</span>}
                                    {i === 3 && <span className="absolute top-4 left-4 bg-black text-white text-[10px] px-2 py-1 rounded-md uppercase">Out of stock</span>}

                                    <img
                                        src={`https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800&auto=format&fit=crop`}
                                        alt="Product"
                                        className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                                    />

                                    <div className="absolute inset-x-4 bottom-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
                                        <button className="w-full bg-primary text-white py-3 rounded-xl font-medium text-sm flex items-center justify-center space-x-2">
                                            <ShoppingBag className="w-4 h-4" />
                                            <span>ADD TO CART</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Collection</p>
                                    <h3 className="font-medium text-lg mb-1">Product Name {i}</h3>
                                    <p className="font-display font-bold text-accent">$299.00</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-primary text-white pt-24 pb-12">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                        <div className="md:col-span-1">
                            <div className="text-3xl font-display font-bold tracking-tighter mb-8">ONLINESTORE</div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-8">
                                Providing modern interior solutions for contemporary living spaces since 2024.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-display text-lg mb-8">Shop</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">All Products</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Categories</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-display text-lg mb-8">Support</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Return & Refund</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-display text-lg mb-8">Newsletter</h4>
                            <p className="text-gray-400 text-sm mb-6">Stay updated on our latest collections.</p>
                            <div className="flex border-b border-gray-700 pb-2">
                                <input type="email" placeholder="Your email address" className="bg-transparent border-none text-white text-sm focus:outline-none w-full" />
                                <button className="text-accent uppercase text-xs font-bold tracking-widest">Join</button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-gray-800 flex flex-col md:row items-center justify-between text-[10px] text-gray-500 uppercase tracking-[0.2em]">
                        <p>© 2024 OnlineStore. All rights reserved.</p>
                        <div className="flex space-x-6 mt-6 md:mt-0">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
