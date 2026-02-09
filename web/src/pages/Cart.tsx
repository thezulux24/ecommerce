import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { formatCOP } from '../utils/formatters';

export const Cart = () => {
    const { cart, removeFromCart, updateQuantity, total, itemCount } = useCart();
    const freeShippingThreshold = 250000;
    const progress = Math.min((total / freeShippingThreshold) * 100, 100);

    if (itemCount === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
                <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-10 border border-white/5 shadow-2xl">
                    <ShoppingBag size={48} className="text-gray-700" />
                </div>
                <h2 className="text-5xl font-display uppercase italic mb-4 tracking-tighter">Tu arsenal está <span className="text-primary">vacío</span></h2>
                <p className="text-gray-500 mb-12 text-center max-w-md font-medium">No has añadido combustible para tus entrenamientos. Explora nuestro catálogo y empieza hoy.</p>
                <Link to="/products" className="bg-primary text-black px-12 py-5 rounded-2xl font-display font-bold uppercase tracking-[0.2em] hover:shadow-[0_0_40px_rgba(204,255,0,0.4)] transition-all flex items-center gap-4 italic active:scale-95">
                    Explorar Productos <ArrowRight size={20} />
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-10 pb-24">
            <div className="container mx-auto px-6">
                <h1 className="text-6xl md:text-8xl font-display italic uppercase mb-16 tracking-tighter">Mi <span className="text-primary">Arsenal</span></h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Free Shipping Progress */}
                        <div className="bg-[#111] border border-white/5 rounded-3xl p-8 mb-4 shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-white">
                                    {total >= freeShippingThreshold
                                        ? "¡FELICIDADES! TIENES ENVÍO GRATIS 🇨🇴"
                                        : `TE FALTAN ${formatCOP(freeShippingThreshold - total)} PARA ENVÍO GRATIS`}
                                </p>
                                <Truck size={18} className={total >= freeShippingThreshold ? "text-primary" : "text-gray-600"} />
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-primary shadow-[0_0_15px_rgba(204,255,0,0.5)]"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {cart.map((item) => (
                                <div key={item.id} className="group bg-[#111] border border-white/5 rounded-[30px] p-6 flex flex-col sm:flex-row items-center gap-8 hover:border-primary/20 transition-all shadow-xl">
                                    <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-black border border-white/5">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                    </div>

                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-xl font-display uppercase italic text-white mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-4">Fórmula Elite / Colombia</p>
                                        <div className="text-xl font-display text-primary italic">{formatCOP(item.price)}</div>
                                    </div>

                                    <div className="flex items-center bg-black border border-white/10 rounded-2xl p-1.5 h-12">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-10 text-center font-display text-lg text-white">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-gray-700 hover:text-red-500 transition-colors p-4"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#111] border border-white/5 rounded-[40px] p-10 sticky top-28 shadow-2xl">
                            <h2 className="text-3xl font-display uppercase italic mb-8 border-b border-white/5 pb-6">Resumen</h2>

                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between text-sm uppercase font-bold tracking-widest">
                                    <span className="text-gray-500">Subtotal ({itemCount} items)</span>
                                    <span className="text-white">{formatCOP(total)}</span>
                                </div>
                                <div className="flex justify-between text-sm uppercase font-bold tracking-widest">
                                    <span className="text-gray-500">Envío Estimado</span>
                                    <span className="text-green-500">{total >= freeShippingThreshold ? "GRATIS" : formatCOP(12000)}</span>
                                </div>
                                <div className="pt-6 border-t border-white/5 flex justify-between">
                                    <span className="text-xl font-display uppercase italic text-white leading-none">Total</span>
                                    <div className="text-right">
                                        <p className="text-3xl font-display text-primary italic leading-none mb-1">{formatCOP(total + (total >= freeShippingThreshold ? 0 : 12000))}</p>
                                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">IVA incluido (19%)</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-white text-black py-6 rounded-2xl font-display font-bold uppercase tracking-[0.2em] hover:bg-primary transition-all flex items-center justify-center gap-4 italic shadow-xl active:scale-95">
                                Finalizar Pedido <ArrowRight size={20} />
                            </button>

                            <div className="mt-12 space-y-6 pt-8 border-t border-white/5">
                                <div className="flex items-center gap-4 opacity-40">
                                    <ShieldCheck size={18} className="text-primary" />
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-white leading-tight">Transacción Encriptada 256-bit SSL</p>
                                </div>
                                <div className="flex items-center gap-6 grayscale opacity-30 h-4">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/Pse_logo.png" className="h-full object-contain" alt="PSE" />
                                    <span className="text-[9px] font-black text-white italic">NEQUI</span>
                                    <span className="text-[9px] font-black text-white italic">DAVIPLATA</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
