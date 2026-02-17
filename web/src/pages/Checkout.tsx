import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, MapPin, Lock, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { formatCOP } from '../utils/formatters';

const API_BASE = 'http://localhost:3000';

type PaymentMethod = 'pse' | 'card';

interface CheckoutFormData {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    apartment: string;
    city: string;
    department: string;
    phone: string;
    paymentMethod: PaymentMethod;
}

interface SavedAddress {
    id: string;
    street: string;
    city: string;
    state: string;
    phone?: string | null;
    fullName?: string | null;
}

interface OrderCreateResponse {
    id: string;
    totalAmount: number | string;
    createdAt?: string;
}

interface SaleModalData {
    orderId: string;
    saleCode: string;
    totalAmount: number;
    paymentMethodLabel: string;
    createdAt: string;
}

interface SaleModalState {
    open: boolean;
    data: SaleModalData | null;
}

export const Checkout = () => {
    const { cart, total, itemCount, clearCart } = useCart();
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [saleModal, setSaleModal] = useState<SaleModalState>({ open: false, data: null });
    const [formData, setFormData] = useState<CheckoutFormData>({
        email: user?.email || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        address: '',
        apartment: '',
        city: '',
        department: '',
        phone: '',
        paymentMethod: 'pse'
    });

    useEffect(() => {
        if (token) {
            axios.get<SavedAddress[]>(`${API_BASE}/users/me/addresses`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => setSavedAddresses(res.data))
                .catch(err => console.error('Error fetching addresses:', err));
        }
    }, [token]);

    const selectSavedAddress = (addr: SavedAddress) => {
        setFormData(prev => ({
            ...prev,
            address: addr.street,
            city: addr.city,
            department: addr.state,
            phone: addr.phone || prev.phone,
            firstName: addr.fullName?.split(' ')[0] || prev.firstName,
            lastName: addr.fullName?.split(' ').slice(1).join(' ') || prev.lastName,
        }));
    };

    const shippingCost = total >= 250000 ? 0 : 12000;
    const finalTotal = total + shippingCost;

    const getPaymentMethodLabel = (method: PaymentMethod): string => {
        return method === 'card' ? 'Tarjeta de Credito' : 'PSE / Debito Bancario';
    };

    const formatSaleDate = (isoDate: string): string => {
        const date = new Date(isoDate);
        if (Number.isNaN(date.getTime())) {
            return new Date().toLocaleString('es-CO');
        }

        return date.toLocaleString('es-CO', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleComplete = async () => {
        if (!token) {
            alert('Por favor inicia sesion para completar tu pedido.');
            navigate('/login', { state: { from: '/checkout' } });
            return;
        }

        if (!formData.address || !formData.city || !formData.phone) {
            alert('Por favor completa todos los campos de envio.');
            return;
        }

        setLoading(true);
        try {
            // Sincronizar el carrito de localStorage con el backend primero
            await axios.post(`${API_BASE}/cart/sync`, {
                items: cart.map(item => ({
                    productId: item.isBundle ? null : item.id,
                    bundleId: item.isBundle ? item.id : null,
                    quantity: item.quantity
                }))
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const orderResponse = await axios.post<OrderCreateResponse>(`${API_BASE}/orders`, {
                addressData: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    address: formData.address,
                    city: formData.city,
                    department: formData.department,
                    phone: formData.phone,
                }
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const createdOrder = orderResponse.data;
            const orderId = createdOrder.id;
            const createdAt = createdOrder.createdAt || new Date().toISOString();

            clearCart();
            setSaleModal({
                open: true,
                data: {
                    orderId,
                    saleCode: `#${orderId.split('-')[0].toUpperCase()}`,
                    totalAmount: Number(createdOrder.totalAmount),
                    paymentMethodLabel: getPaymentMethodLabel(formData.paymentMethod),
                    createdAt
                }
            });
        } catch (error: unknown) {
            console.error('Checkout error:', error);
            const errorMessage =
                axios.isAxiosError(error) && typeof error.response?.data?.message === 'string'
                    ? error.response.data.message
                    : 'Error al procesar el pedido';

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (itemCount === 0 && !saleModal.open) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
            <h2 className="text-4xl font-display uppercase italic mb-8">No hay nada para procesar</h2>
            <Link to="/products" className="text-primary font-bold border-b border-primary italic">Volver al Arsenal</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] pt-10 pb-24 text-white">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Left: Forms */}
                    <div>
                        <Link to="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-12 uppercase text-[10px] font-bold tracking-[0.2em]">
                            <ArrowLeft size={14} /> Volver al Carrito
                        </Link>

                        <div className="flex gap-4 mb-12">
                            {[1, 2].map(i => (
                                <div key={i} className={`h-1.5 flex-1 rounded-full ${step >= i ? 'bg-primary' : 'bg-white/5'}`} />
                            ))}
                        </div>

                        {step === 1 && (
                            <div className="space-y-10">
                                <div>
                                    <h2 className="text-4xl font-display italic uppercase mb-8">Informacion de <span className="text-primary">Contacto</span></h2>
                                    <input
                                        type="email"
                                        placeholder="CORREO ELECTRONICO"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-primary focus:outline-none font-bold placeholder:text-gray-700 text-sm"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-4xl font-display italic uppercase mb-8">Direccion de <span className="text-primary">Envio</span></h2>

                                    {savedAddresses.length > 0 && (
                                        <div className="mb-10 space-y-4">
                                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-4">Direcciones Guardadas</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {savedAddresses.map((addr) => (
                                                    <button
                                                        key={addr.id}
                                                        onClick={() => selectSavedAddress(addr)}
                                                        className={`text-left p-4 rounded-2xl border transition-all ${formData.address === addr.street
                                                            ? 'bg-primary/5 border-primary shadow-[0_0_20px_rgba(204,255,0,0.1)]'
                                                            : 'bg-white/5 border-white/5 hover:border-white/20'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <Clock size={14} className="text-primary mt-0.5" />
                                                            <div>
                                                                <p className="text-[10px] font-bold text-white uppercase italic truncate w-full">{addr.street}</p>
                                                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{addr.city}, {addr.state}</p>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="relative py-6">
                                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                                                <div className="relative flex justify-center text-[9px] uppercase font-bold tracking-[0.3em]"><span className="bg-[#050505] px-4 text-gray-600 italic">O ingresa una nueva</span></div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="text"
                                            placeholder="NOMBRE"
                                            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-primary focus:outline-none font-bold placeholder:text-gray-700 text-sm"
                                            value={formData.firstName}
                                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="APELLIDO"
                                            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-primary focus:outline-none font-bold placeholder:text-gray-700 text-sm"
                                            value={formData.lastName}
                                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="DIRECCION (EJ: CALLE 100 # 15-20)"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-primary focus:outline-none font-bold placeholder:text-gray-700 text-sm mb-4"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="text"
                                            placeholder="CIUDAD"
                                            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-primary focus:outline-none font-bold placeholder:text-gray-700 text-sm"
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="DEPARTAMENTO"
                                            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-primary focus:outline-none font-bold placeholder:text-gray-700 text-sm"
                                            value={formData.department}
                                            onChange={e => setFormData({ ...formData, department: e.target.value })}
                                        />
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="TELEFONO / CELULAR"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-primary focus:outline-none font-bold placeholder:text-gray-700 text-sm"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full bg-primary text-black py-6 rounded-2xl font-display font-bold uppercase tracking-[0.2em] italic hover:shadow-[0_0_40px_rgba(204,255,0,0.3)] transition-all"
                                >
                                    Continuar al Pago
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-10">
                                <h2 className="text-4xl font-display italic uppercase">Finalizar <span className="text-primary">Transaccion</span></h2>

                                <div className="space-y-4">
                                    <label className={`flex items-center justify-between p-6 rounded-2xl border cursor-pointer transition-all ${formData.paymentMethod === 'pse' ? 'bg-primary/5 border-primary shadow-lg' : 'bg-white/5 border-white/10'}`}>
                                        <div className="flex items-center gap-4">
                                            <input type="radio" name="pay" checked={formData.paymentMethod === 'pse'} onChange={() => setFormData({ ...formData, paymentMethod: 'pse' })} className="accent-primary" />
                                            <span className="font-bold text-sm uppercase tracking-widest italic leading-none">PSE / Debito Bancario</span>
                                        </div>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/Pse_logo.png" className="h-6" alt="PSE" />
                                    </label>

                                    <label className={`flex items-center justify-between p-6 rounded-2xl border cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'bg-primary/5 border-primary shadow-lg' : 'bg-white/5 border-white/10'}`}>
                                        <div className="flex items-center gap-4">
                                            <input type="radio" name="pay" checked={formData.paymentMethod === 'card'} onChange={() => setFormData({ ...formData, paymentMethod: 'card' })} className="accent-primary" />
                                            <span className="font-bold text-sm uppercase tracking-widest italic leading-none">Tarjeta de Credito</span>
                                        </div>
                                        <div className="flex gap-4 items-center">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-2 opacity-50" alt="Visa" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4 opacity-50" alt="Mastercard" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" className="h-4 opacity-50" alt="Amex" />
                                        </div>
                                    </label>
                                </div>

                                <div className="p-8 bg-black border border-white/10 rounded-3xl">
                                    <div className="flex items-center gap-3 text-primary mb-4">
                                        <Lock size={16} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest italic">Pago 100% Seguro</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 uppercase tracking-widest font-bold leading-relaxed">
                                        Seras redirigido a la pasarela de pagos oficial (Wompi/PayU) para completar tu transaccion de forma segura. Apex Labs no almacena tus datos bancarios.
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => setStep(1)} className="flex-1 border border-white/10 text-white py-6 rounded-2xl font-display font-bold uppercase tracking-[0.2em] italic">Atras</button>
                                    <button
                                        onClick={handleComplete}
                                        disabled={loading}
                                        className={`flex-[2] bg-primary text-black py-6 rounded-2xl font-display font-bold uppercase tracking-[0.2em] italic hover:shadow-[0_0_40px_rgba(204,255,0,0.3)] transition-all flex items-center justify-center gap-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? 'Procesando...' : 'Pagar Ahora'} <CheckCircle size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Summary */}
                    <div className="lg:pl-10">
                        <div className="bg-[#111] border border-white/5 rounded-[40px] p-10 lg:sticky lg:top-10 shadow-3xl">
                            <h3 className="text-2xl font-display italic uppercase mb-8 border-b border-white/5 pb-6">Resumen de <span className="text-primary">Arsenal</span></h3>

                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar mb-10">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/5 relative">
                                            <img src={item.image} className="w-full h-full object-cover grayscale" alt="" />
                                            <span className="absolute -top-1 -right-1 bg-primary text-black text-[9px] font-black h-5 w-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white leading-tight mb-1">{item.name}</h4>
                                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Suplemento Elite</p>
                                        </div>
                                        <span className="text-sm font-display italic text-white">{formatCOP(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-white/5">
                                <div className="flex justify-between text-[11px] uppercase font-bold tracking-widest">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-white">{formatCOP(total)}</span>
                                </div>
                                <div className="flex justify-between text-[11px] uppercase font-bold tracking-widest text-green-500">
                                    <span>Envio Nacional</span>
                                    <span>{shippingCost === 0 ? 'GRATIS' : formatCOP(shippingCost)}</span>
                                </div>
                                <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                                    <span className="text-xl font-display uppercase italic text-white">Total Final</span>
                                    <div className="text-right">
                                        <p className="text-4xl font-display text-primary italic leading-none">{formatCOP(finalTotal)}</p>
                                        <p className="text-[9px] text-gray-700 font-bold uppercase tracking-widest mt-1 italic">IVA 19% Incluido</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <ShieldCheck className="text-primary" size={20} />
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-white tracking-widest italic leading-none mb-1">Proteccion al Atleta</p>
                                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Garantia de devolucion 30 dias</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <MapPin className="text-primary" size={20} />
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-white tracking-widest italic leading-none mb-1">Origen Colombia</p>
                                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Despachos inmediatos desde Cali</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {saleModal.open && saleModal.data && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.92, opacity: 0, y: 20 }}
                            className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[36px] overflow-hidden shadow-[0_0_50px_rgba(204,255,0,0.14)]"
                        >
                            <div className="p-8 md:p-10 border-b border-white/10">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                                    <CheckCircle size={30} className="text-primary" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">Venta Confirmada</p>
                                <h2 className="text-4xl md:text-5xl font-display uppercase italic leading-none">
                                    Codigo <span className="text-primary">{saleModal.data.saleCode}</span>
                                </h2>
                                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">ID Completo de Venta</p>
                                <p className="font-mono text-xs text-gray-300 break-all mt-1">{saleModal.data.orderId}</p>
                            </div>

                            <div className="p-8 md:p-10 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                        <p className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-500 mb-2">Total</p>
                                        <p className="text-xl font-display italic text-primary">{formatCOP(saleModal.data.totalAmount)}</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                        <p className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-500 mb-2">Pago</p>
                                        <p className="text-xs font-bold uppercase tracking-widest text-white leading-tight">{saleModal.data.paymentMethodLabel}</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                        <p className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-500 mb-2">Fecha</p>
                                        <p className="text-xs font-bold uppercase tracking-widest text-white">{formatSaleDate(saleModal.data.createdAt)}</p>
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => navigate('/my-orders')}
                                        className="flex-1 bg-primary text-black py-4 rounded-2xl font-display font-bold uppercase tracking-[0.2em] italic hover:shadow-[0_0_35px_rgba(204,255,0,0.25)] transition-all"
                                    >
                                        Ver mis pedidos
                                    </button>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="flex-1 border border-white/15 text-white py-4 rounded-2xl font-display font-bold uppercase tracking-[0.2em] italic hover:border-white/30 transition-colors"
                                    >
                                        Volver al inicio
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
