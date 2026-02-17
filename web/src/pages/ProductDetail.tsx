import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
    ShoppingBag, Star, ShieldCheck, Truck, Zap,
    ArrowLeft, Plus, Minus, CreditCard, CheckCircle, X, AlertTriangle, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCOP } from '../utils/formatters';
import { useCart } from '../context/CartContext';

const API_BASE = 'http://localhost:3000';

export const ProductDetail = () => {
    const { slug } = useParams();
    const { addToCart, total } = useCart();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showStockModal, setShowStockModal] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${API_BASE}/products/${slug}`);
                setProduct(res.data);
            } catch (err) {
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
            <h2 className="text-4xl font-display uppercase italic mb-8">Fórmula no encontrada</h2>
            <Link to="/products" className="text-primary font-bold uppercase tracking-widest border-b border-primary pb-2 italic">Volver al Arsenal</Link>
        </div>
    );

    const getStockBadge = () => {
        if (product.stock === 0) return (
            <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded uppercase tracking-[0.2em] italic shadow-2xl flex items-center gap-2">
                <AlertCircle size={12} /> Stock Agotado
            </span>
        );
        if (product.stock <= 10) return (
            <span className="bg-orange-500 text-black text-[10px] font-black px-3 py-1.5 rounded uppercase tracking-[0.2em] italic shadow-2xl flex items-center gap-2">
                <AlertTriangle size={12} /> Últimas Unidades
            </span>
        );
        return (
            <span className="bg-primary text-black text-[10px] font-black px-3 py-1.5 rounded uppercase tracking-[0.2em] italic shadow-2xl flex items-center gap-2">
                <CheckCircle size={12} /> En Stock
            </span>
        );
    };

    const shippingThreshold = 150000;
    const remainingForFreeShipping = Math.max(0, shippingThreshold - total);

    return (
        <div className="min-h-screen bg-background pt-10 pb-24">
            <div className="container mx-auto px-6">
                <Link to="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-12 uppercase text-[10px] font-bold tracking-[0.2em] group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver al Arsenal
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Media Gallery */}
                    <div className="space-y-6">
                        <div className="aspect-square rounded-[40px] overflow-hidden bg-[#111] border border-white/5 relative group shadow-2xl">
                            <img
                                src={product.images?.[selectedImage]?.url || 'https://via.placeholder.com/800x800?text=Apex+Labs'}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt={product.name}
                            />
                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                {getStockBadge()}
                                <span className="bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-[0.2em] border border-white/10 italic">
                                    {product.brand?.name || 'Apex Labs Original'}
                                </span>
                            </div>
                        </div>

                        {product.images?.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img: any, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-primary shadow-[0_0_20px_rgba(204,255,0,0.3)] opacity-100' : 'border-white/5 opacity-50 hover:opacity-100'}`}
                                    >
                                        <img src={img.url} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-primary bg-primary/10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-primary/20 italic">
                                {product.category?.name || 'Suplemento Elite'}
                            </span>
                            <div className="flex items-center gap-1 text-primary">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                                <span className="text-gray-500 text-[10px] font-bold ml-2 tracking-widest">(48 Reseñas)</span>
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-display uppercase italic leading-none mb-8 tracking-tighter italic">
                            {product.name}
                        </h1>

                        <p className="text-gray-400 text-lg mb-12 leading-relaxed font-medium">
                            {product.description || "Potencia tus entrenamientos con la fórmula más avanzada de Apex Labs. Pureza garantizada, resultados de élite para atletas que no aceptan menos que el máximo rendimiento."}
                        </p>

                        <div className="bg-[#111] border border-white/5 rounded-[30px] p-8 mb-12 shadow-2xl">
                            <div className="flex items-end gap-4 mb-8">
                                <span className="text-5xl font-display text-white italic tracking-tighter">{formatCOP(Number(product.price))}</span>
                                <span className="text-xl text-gray-600 line-through font-bold mb-1">{formatCOP(Number(product.price) * 1.2)}</span>
                                <span className="bg-red-500/10 text-red-500 text-[10px] font-black px-3 py-1.5 rounded uppercase tracking-[0.2em] mb-2 border border-red-500/20 italic shadow-lg">-20% HOY</span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <div className="h-12 md:h-16 bg-[#181818] rounded-2xl border border-white/5 flex items-center px-2">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-12 text-center font-display text-xl text-white">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        if (product.stock === 0) {
                                            setShowStockModal(true);
                                        } else {
                                            addToCart(product, quantity);
                                        }
                                    }}
                                    disabled={product.stock === 0}
                                    className={`flex-1 h-12 md:h-16 rounded-2xl font-display font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 italic active:scale-95 ${product.stock === 0 ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50' : 'bg-primary text-black hover:shadow-[0_0_40px_rgba(204,255,0,0.4)]'}`}
                                >
                                    <ShoppingBag size={20} /> {product.stock === 0 ? 'Stock Agotado' : 'Añadir al Arsenal'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/10">
                                        <Truck size={18} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-white tracking-widest italic leading-none mb-1">Envío Express 🇨🇴</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Entrega en 24-48h hábiles</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/10">
                                        <ShieldCheck size={18} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-white tracking-widest italic leading-none mb-1">Garantía Apex</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">100% Original Sellado</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Badges */}
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 mb-12">
                            <div className="flex items-center gap-3 mb-5">
                                <CreditCard size={18} className="text-primary" />
                                <span className="text-[10px] uppercase font-black tracking-[0.2em] italic text-white">Métodos de Pago Seguros</span>
                            </div>
                            <div className="grid grid-cols-2 sm:flex sm:items-center gap-8 grayscale opacity-60">
                                <div className="flex items-center gap-2">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/Pse_logo.png" className="h-6 object-contain" alt="PSE" />
                                    <span className="text-[8px] font-black text-white uppercase opacity-40">PSE</span>
                                </div>
                                <span className="hidden sm:block bg-white/10 h-4 w-px" />
                                <div className="flex items-center gap-3">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-2.5 object-contain" alt="Visa" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4 object-contain" alt="Mastercard" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" className="h-4 object-contain" alt="Amex" />
                                </div>
                                <span className="hidden sm:block bg-white/10 h-4 w-px" />
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-white italic tracking-tighter">NEQUI</span>
                                    <span className="text-[10px] font-black text-white italic tracking-tighter">DAVIPLATA</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] italic ${product.stock === 0 ? 'text-red-500' : 'text-green-500'}`}>
                                <CheckCircle size={16} /> {product.stock === 0 ? 'Stock agotado' : `${product.stock} unidades disponibles`}
                            </div>
                            {remainingForFreeShipping > 0 ? (
                                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary italic">
                                    <Zap size={16} fill="currentColor" /> ¡Súmale {formatCOP(remainingForFreeShipping)} más y el envío es GRATIS!
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-green-500 italic">
                                    <Truck size={16} /> ¡Tienes ENVÍO GRATIS en este pedido!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stock Exhausted Modal */}
            <AnimatePresence>
                {showStockModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowStockModal(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-[40px] p-10 text-center overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
                            <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-600/20">
                                <AlertCircle size={40} className="text-red-500" />
                            </div>
                            <h3 className="text-3xl font-display uppercase italic text-white mb-4 tracking-tight">Suministros Agotados</h3>
                            <p className="text-gray-400 text-sm font-medium leading-relaxed mb-10 uppercase tracking-widest">
                                Esta fórmula ha sido un éxito total y se encuentra agotada temporalmente. Estamos reabasteciendo nuestro arsenal para que no pierdas el ritmo.
                            </p>
                            <button
                                onClick={() => setShowStockModal(false)}
                                className="w-full bg-white text-black py-5 rounded-2xl font-display font-bold uppercase tracking-widest italic hover:bg-primary transition-colors active:scale-95"
                            >
                                Entendido, Guerrero
                            </button>
                            <button
                                onClick={() => setShowStockModal(false)}
                                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
