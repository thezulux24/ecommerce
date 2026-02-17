import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ChevronRight, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE = 'http://localhost:3000';

export const Categories = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE}/categories`)
            .then(res => setCategories(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-background text-white pt-32 pb-20">
            <div className="container mx-auto px-6">
                <div className="mb-16">
                    <div className="flex items-center gap-2 text-primary mb-4 font-bold tracking-[0.3em] uppercase text-xs">
                        <span className="h-px w-8 bg-primary" /> Explora el Laboratorio
                    </div>
                    <h1 className="text-6xl md:text-8xl font-display italic uppercase leading-[0.85] tracking-tighter">
                        Nuestras <span className="text-primary font-black">Categorías</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-64 bg-white/5 rounded-[40px] animate-pulse border border-white/5" />
                        ))
                    ) : (
                        categories.map((cat, i) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link
                                    to={`/supplements?category=${cat.slug}`}
                                    className="group relative h-80 flex flex-col items-center justify-center p-10 rounded-[40px] border border-white/5 overflow-hidden transition-all active:scale-95 shadow-2xl"
                                >
                                    {/* Full Background Image */}
                                    <div className="absolute inset-0 z-0">
                                        <img
                                            src={cat.image || "/images/cat-placeholder.jpg"}
                                            alt={cat.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0"
                                        />
                                        {/* Overlay & Blur */}
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-all duration-500 group-hover:bg-black/40 group-hover:backdrop-blur-none" />
                                    </div>

                                    <div className="relative z-10 text-center">
                                        <h3 className="text-4xl font-display uppercase italic text-white group-hover:text-primary transition-colors tracking-tighter mb-2">{cat.name}</h3>
                                        <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            EXPLORAR <ChevronRight size={14} />
                                        </p>
                                    </div>

                                    {/* Icon Decoration */}
                                    <div className="absolute top-8 right-8 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-white z-10 group-hover:bg-primary group-hover:text-black transition-all">
                                        <LayoutGrid size={20} />
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
