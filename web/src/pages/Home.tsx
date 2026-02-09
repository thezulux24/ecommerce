import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Zap, ShieldCheck, Activity, ArrowRight, Truck, CreditCard, MessageCircle
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

const API_BASE = 'http://localhost:3000';
const heroImage = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop";

export const Home = () => {
    const [bestSellers, setBestSellers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const res = await axios.get(`${API_BASE}/products`);
                // Simulamos "más vendidos" con los primeros 4
                setBestSellers(res.data.slice(0, 4));
            } catch (err) {
                console.error('Error fetching best sellers:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBestSellers();
    }, []);

    return (
        <div className="bg-background">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-10 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={heroImage} className="w-full h-full object-cover grayscale brightness-[0.3]" alt="Hero" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <div className="flex items-center gap-3 mb-6 bg-primary/10 w-fit px-4 py-1.5 rounded-full border border-primary/20 backdrop-blur-sm">
                            <Zap size={14} className="text-primary" fill="currentColor" />
                            <span className="text-primary font-display uppercase tracking-[0.2em] text-[10px] font-bold italic">Suplementación de Grado Militar</span>
                        </div>

                        <h1 className="text-7xl md:text-[120px] font-display uppercase leading-[0.85] mb-8 italic tracking-tighter">
                            Combustible <br /> <span className="text-primary">Elite</span> Para <br /> Atletas
                        </h1>

                        <p className="text-lg text-gray-400 mb-12 max-w-xl font-medium leading-relaxed uppercase tracking-wide">
                            Seleccionamos la mejor suplementación de alto rendimiento. Fórmulas puras para llevar tu cuerpo más allá de su umbral biológico.
                        </p>

                        <div className="flex flex-wrap gap-6 mb-16">
                            <Link to="/products" className="bg-primary text-black px-10 py-5 font-display font-bold uppercase tracking-[0.2em] hover:shadow-[0_0_40px_rgba(204,255,0,0.5)] transition-all flex items-center gap-4 italic group active:scale-95">
                                Ver Catálogo <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <a href="https://wa.me/573000000000?text=Hola,%20quiero%20asesoria%20personalizada" target="_blank" rel="noreferrer" className="px-10 py-5 border border-white/20 uppercase font-display font-bold tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center gap-3 italic">
                                <MessageCircle size={18} /> Asesoría Expertos
                            </a>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/5 opacity-60">
                            <div className="flex items-center gap-3">
                                <Truck size={20} className="text-primary" />
                                <span className="text-[10px] uppercase font-bold tracking-widest text-white">Envío Nacional</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={20} className="text-primary" />
                                <span className="text-[10px] uppercase font-bold tracking-widest text-white">Garantía Apex</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CreditCard size={20} className="text-primary" />
                                <span className="text-[10px] uppercase font-bold tracking-widest text-white">Paga con PSE</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Activity size={20} className="text-primary" />
                                <span className="text-[10px] uppercase font-bold tracking-widest text-white">100% Original</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* High Performance Features */}
            <div className="bg-primary py-5 border-y border-black/10">
                <div className="flex overflow-hidden whitespace-nowrap">
                    <motion.div
                        animate={{ x: [0, -1000] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="flex items-center gap-20 text-black font-display uppercase font-black tracking-[0.3em] px-6 text-sm italic"
                    >
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-20">
                                <span>Envíos a toda Colombia</span>
                                <span className="text-2xl">•</span>
                                <span>Compra Segura PSE / Nequi</span>
                                <span className="text-2xl">•</span>
                                <span>Asesoría Profesional</span>
                                <span className="text-2xl">•</span>
                                <span>Resultados Garantizados</span>
                                <span className="text-2xl">•</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* "Más Vendidos" Section */}
            <section className="py-32 px-6 bg-black">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div>
                            <div className="flex items-center gap-2 text-primary mb-4 font-bold tracking-[0.3em] uppercase text-xs">
                                <span className="h-px w-8 bg-primary" /> Top del Arsenal
                            </div>
                            <h2 className="text-6xl font-display italic uppercase mb-6 leading-none tracking-tighter">Más <span className="text-primary">Vendidos</span></h2>
                            <p className="text-gray-400 text-lg max-w-md font-medium">Los favoritos de nuestra comunidad de alto rendimiento en Colombia.</p>
                        </div>
                        <Link to="/products" className="text-primary uppercase font-display font-bold tracking-[0.2em] border-b-2 border-primary/20 pb-3 hover:border-primary transition-all text-sm italic">Ver Todo el Arsenal</Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="h-[500px] bg-white/5 rounded-[30px] animate-pulse border border-white/5" />
                            ))
                        ) : (
                            bestSellers.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Product Category Grid */}
            <section className="py-32 px-6 bg-background relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />

                <div className="container mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-2 text-primary mb-4 font-bold tracking-[0.3em] uppercase text-xs">
                                <span className="h-px w-8 bg-primary" /> Arsenal de Entrenamiento
                            </div>
                            <h2 className="text-6xl md:text-8xl font-display italic uppercase mb-6 leading-none tracking-tighter">Entrena Con <span className="text-primary">Propósito</span></h2>
                            <p className="text-gray-400 text-lg max-w-md font-medium">No busques suplementos, busca objetivos. Selecciona tu meta y nosotros te damos la fórmula para alcanzarla.</p>
                        </div>
                        <Link to="/products" className="text-primary uppercase font-display font-bold tracking-[0.2em] border-b-2 border-primary/20 pb-3 hover:border-primary transition-all text-sm italic">Ver Por Categoría</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Ganar masa muscular', icon: <Activity size={40} />, desc: 'Proteínas y Aminoácidos', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800' },
                            { name: 'Mejorar rendimiento', icon: <Zap size={40} />, desc: 'Pre-entrenos y Energía', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800' },
                            { name: 'Definición Extrema', icon: <ShieldCheck size={40} />, desc: 'Quemadores y Control', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800' },
                        ].map((cat, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -15 }}
                                className="group relative h-[600px] rounded-[40px] overflow-hidden border border-white/5 cursor-pointer"
                            >
                                <img src={cat.img} className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:scale-110 group-hover:brightness-75 transition-all duration-1000 ease-out" alt={cat.name} />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-10 pt-32">
                                    <div className="text-primary mb-6 transform group-hover:scale-110 transition-transform duration-500">{cat.icon}</div>
                                    <h3 className="text-4xl font-display uppercase mb-3 italic tracking-tight">{cat.name}</h3>
                                    <p className="text-xs text-gray-400 uppercase tracking-[0.3em] font-bold mb-8">{cat.desc}</p>
                                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                        Explorar Categoría <ArrowRight size={14} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
