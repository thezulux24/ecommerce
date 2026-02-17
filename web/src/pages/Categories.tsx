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
                                    className="group relative h-64 flex flex-col justify-end p-10 rounded-[40px] border border-white/5 bg-white/5 hover:bg-white/10 overflow-hidden transition-all active:scale-95"
                                >
                                    <div className="absolute top-10 right-10 p-4 bg-primary/10 rounded-2xl border border-primary/20 text-primary group-hover:bg-primary group-hover:text-black transition-all">
                                        <LayoutGrid size={24} />
                                    </div>

                                    <h3 className="text-3xl font-display uppercase italic text-white group-hover:text-primary transition-colors">{cat.name}</h3>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                                        Ver Productos <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </p>

                                    {/* Decoration */}
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
