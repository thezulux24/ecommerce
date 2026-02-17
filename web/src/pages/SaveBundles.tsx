import { useState, useEffect } from 'react';
import axios from 'axios';
import { Zap, Crown, Flame, ChevronRight, Package, Loader2, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const API_BASE = 'http://localhost:3000';

export const SaveBundles = () => {
    const [bundles, setBundles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBundle, setSelectedBundle] = useState<any>(null);
    const { addToCart } = useCart();

    const handleAddToCart = (bundle: any) => {
        addToCart(bundle, 1);
    };

    useEffect(() => {
        axios.get(`${API_BASE}/bundles`)
            .then(res => setBundles(res.data))
            .catch(err => console.error('Error fetching bundles:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background text-white flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-white pt-32 pb-20">
            <div className="container mx-auto px-6">
                <div className="mb-20">
                    <div className="flex items-center gap-2 text-primary mb-4 font-bold tracking-[0.3em] uppercase text-xs">
                        <span className="h-px w-8 bg-primary" /> Eficiencia Máxima
                    </div>
                    <h1 className="text-6xl md:text-8xl font-display italic uppercase leading-[0.85] tracking-tighter">
                        Packs de <span className="text-primary font-black">Ahorro</span>
                    </h1>
                    <p className="mt-8 text-gray-400 max-w-2xl font-medium text-lg leading-relaxed uppercase italic">Combinaciones estratégicas diseñadas por expertos para maximizar tus resultados y minimizar tu inversión.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {bundles.length > 0 ? bundles.map((bundle) => {
                        // Determine icons based on name or keywords as a fallback
                        let Icon = Package;
                        if (bundle.name.toLowerCase().includes('hipertrofia')) Icon = Crown;
                        else if (bundle.name.toLowerCase().includes('corte') || bundle.name.toLowerCase().includes('burn')) Icon = Flame;
                        else if (bundle.name.toLowerCase().includes('fuerza') || bundle.name.toLowerCase().includes('pre-')) Icon = Zap;

                        return (
                            <div key={bundle.id} className="group relative flex flex-col p-10 rounded-[40px] border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-primary/20 transition-all overflow-hidden cursor-pointer">
                                {bundle.image ? (
                                    <div className="w-full h-48 rounded-3xl overflow-hidden mb-8 border border-white/5">
                                        <img src={bundle.image} alt={bundle.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mb-10 border border-white/5">
                                        <Icon className="text-primary" size={32} />
                                    </div>
                                )}

                                <h3 className="text-3xl font-display uppercase italic text-white mb-4 group-hover:text-primary transition-colors">{bundle.name}</h3>

                                {bundle.features && bundle.features.length > 0 ? (
                                    <ul className="mb-10 space-y-3">
                                        {bundle.features.map((feature: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-3 text-[10px] text-gray-400 uppercase font-bold tracking-widest leading-none">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-0.5" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest leading-relaxed mb-10 line-clamp-3">{bundle.description}</p>
                                )}

                                <div className="mt-auto pt-10 border-t border-white/5 flex items-center justify-between">
                                    <div>
                                        {bundle.oldPrice && <p className="text-gray-600 line-through text-xs font-bold uppercase tracking-widest mb-1 italic">${bundle.oldPrice}</p>}
                                        <p className="text-3xl font-display font-black text-white italic tracking-tighter leading-none">${bundle.price}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedBundle(bundle)}
                                            className="bg-white/5 text-white p-3 rounded-2xl hover:bg-white/10 transition-all active:scale-95 group/btn"
                                            title="Ver productos incluidos"
                                        >
                                            <Info size={18} className="group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => handleAddToCart(bundle)}
                                            className="bg-primary text-black px-6 py-3 rounded-2xl font-display font-bold uppercase tracking-widest text-[10px] italic hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                                        >
                                            Inyectar Arsenal
                                        </button>
                                    </div>
                                </div>

                                {bundle.oldPrice && (
                                    <div className="absolute top-10 right-10 bg-red-600 text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest italic">
                                        Ahorro {Math.round((1 - bundle.price / bundle.oldPrice) * 100)}%
                                    </div>
                                )}
                            </div>
                        );
                    }) : (
                        <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-[40px]">
                            <p className="text-gray-500 uppercase font-black tracking-widest italic">No hay packs disponibles en este momento. Vuelve pronto.</p>
                        </div>
                    )}
                </div>

                <div className="mt-24 p-12 rounded-[50px] border border-dashed border-white/10 text-center max-w-4xl mx-auto">
                    <h4 className="text-2xl font-display italic uppercase mb-4">¿Buscas algo <span className="text-primary">Personalizado</span>?</h4>
                    <p className="text-gray-500 uppercase font-black tracking-widest text-xs mb-8">Contáctanos por WhatsApp y armamos un stack a tu medida con descuento.</p>
                    <a href="https://wa.me/..." className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-10 py-5 rounded-3xl font-display font-bold uppercase tracking-[0.2em] italic hover:bg-primary hover:text-black transition-all group">
                        Hablar con un Experto <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </a>
                </div>
            </div>

            {/* Bundle Detail Modal */}
            <AnimatePresence>
                {selectedBundle && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
                        onClick={() => setSelectedBundle(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-[40px] overflow-hidden relative shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedBundle(null)}
                                className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="p-10">
                                <div className="flex items-center gap-3 text-primary mb-4 font-bold tracking-[0.3em] uppercase text-[10px]">
                                    <Package size={14} /> Contenido del Arsenal
                                </div>
                                <h3 className="text-4xl font-display uppercase italic text-white mb-2 leading-none">{selectedBundle.name}</h3>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-10">{selectedBundle.products?.length} Productos Elite Seleccionados</p>

                                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar mb-10">
                                    {selectedBundle.products?.map((item: any) => (
                                        <div key={item.id} className="flex gap-6 items-center p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group/item">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black border border-white/10">
                                                <img
                                                    src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/150'}
                                                    className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all"
                                                    alt={item.product?.name}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-1">{item.product?.name}</h4>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none line-clamp-1">{item.product?.description?.substring(0, 60)}...</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-10 border-t border-white/5">
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Precio Total Pack</p>
                                        <p className="text-3xl font-display font-black text-primary italic tracking-tighter">${selectedBundle.price}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleAddToCart(selectedBundle);
                                            setSelectedBundle(null);
                                        }}
                                        className="bg-primary text-black px-10 py-5 rounded-2xl font-display font-bold uppercase tracking-widest text-xs italic hover:scale-105 active:scale-95 transition-all shadow-lg"
                                    >
                                        Añadir al Carrito
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
