import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE = 'http://localhost:3000';

export const Brands = () => {
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE}/brands`)
            .then(res => setBrands(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-background text-white pt-32 pb-20">
            <div className="container mx-auto px-6">
                <div className="mb-16 text-center">
                    <div className="flex items-center justify-center gap-2 text-primary mb-4 font-bold tracking-[0.3em] uppercase text-xs">
                        <span className="h-px w-8 bg-primary" /> Alianzas de Élite
                    </div>
                    <h1 className="text-6xl md:text-8xl font-display italic uppercase leading-[0.85] tracking-tighter mb-4">
                        Marcas <span className="text-primary font-black">Autorizadas</span>
                    </h1>
                    <p className="text-gray-500 uppercase font-black tracking-[0.5em] text-[10px] italic">Solo lo mejor para tu arsenal</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-64 bg-white/5 rounded-[40px] animate-pulse border border-white/5" />
                        ))
                    ) : (
                        brands.map((brand, i) => (
                            <motion.div
                                key={brand.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link
                                    to={`/supplements?brand=${brand.slug}`}
                                    className="group relative h-64 p-10 rounded-[40px] border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all flex flex-col items-center justify-center text-center overflow-hidden shadow-xl"
                                >
                                    {/* Brand Logo/Image Container */}
                                    <div className="w-full h-full flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110">
                                        {brand.logo ? (
                                            <img src={brand.logo} alt={brand.name} className="max-w-[80%] max-h-[80%] object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                                        ) : (
                                            <Shield className="text-gray-700 group-hover:text-primary transition-colors" size={64} />
                                        )}
                                    </div>

                                    <div className="absolute bottom-10 left-0 right-0">
                                        <h3 className="text-sm font-black uppercase tracking-[0.4em] text-gray-500 group-hover:text-primary transition-colors">{brand.name}</h3>
                                    </div>

                                    {/* Premium Border Effect */}
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-[40px] transition-colors pointer-events-none" />
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
