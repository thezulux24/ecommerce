import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, MapPin, Lock, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatCOP } from '../utils/formatters';

const API_BASE = 'http://localhost:3000';

export const Checkout = () => {
    const { cart, total, itemCount, clearCart } = useCart();
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [formData, setFormData] = useState({
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
            axios.get(`${API_BASE}/users/me/addresses`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => setSavedAddresses(res.data))
                .catch(err => console.error('Error fetching addresses:', err));
        }
    }, [token]);

    const selectSavedAddress = (addr: any) => {
        setFormData({
            ...formData,
            address: addr.street,
            city: addr.city,
            department: addr.state,
            phone: addr.phone || formData.phone,
            firstName: addr.fullName?.split(' ')[0] || formData.firstName,
            lastName: addr.fullName?.split(' ').slice(1).join(' ') || formData.lastName,
        });
    };

    const shippingCost = total >= 250000 ? 0 : 12000;
    const finalTotal = total + shippingCost;

    const handleComplete = async () => {
        if (!token) {
            alert('Por favor inicia sesión para completar tu pedido.');
            navigate('/login', { state: { from: '/checkout' } });
            return;
        }

        if (!formData.address || !formData.city || !formData.phone) {
            alert('Por favor completa todos los campos de envío.');
            return;
        }

        setLoading(true);
        try {
            // Sincronizar el carrito de localStorage con el backend primero
            await axios.post('http://localhost:3000/cart/sync', {
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

            await axios.post('http://localhost:3000/orders', {
                addressData: formData
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Simulamos éxito inmediato como pidió el usuario
            alert('¡ORDEN RECIBIDA! Tu pago ha sido procesado (Simulación). El Arsenal está en camino.');
            clearCart();
            setStep(3); // Podríamos ir a un paso de "Gracias"
            setTimeout(() => navigate('/'), 3000);
        } catch (error: any) {
            console.error('Checkout error:', error);
            alert(error.response?.data?.message || 'Error al procesar el pedido');
        } finally {
            setLoading(false);
        }
    };

    if (itemCount === 0) return (
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
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-1.5 flex-1 rounded-full ${step >= i ? 'bg-primary' : 'bg-white/5'}`} />
                            ))}
                        </div>

                        {step === 1 && (
                            <div className="space-y-10">
                                <div>
                                    <h2 className="text-4xl font-display italic uppercase mb-8">Información de <span className="text-primary">Contacto</span></h2>
                                    <input
                                        type="email"
                                        placeholder="CORREO ELECTRÓNICO"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-primary focus:outline-none font-bold placeholder:text-gray-700 text-sm"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-4xl font-display italic uppercase mb-8">Dirección de <span className="text-primary">Envío</span></h2>

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
                                        placeholder="DIRECCIÓN (EJ: CALLE 100 # 15-20)"
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
                                        placeholder="TELÉFONO / CELULAR"
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
                                <h2 className="text-4xl font-display italic uppercase">Finalizar <span className="text-primary">Transacción</span></h2>

                                <div className="space-y-4">
                                    <label className={`flex items-center justify-between p-6 rounded-2xl border cursor-pointer transition-all ${formData.paymentMethod === 'pse' ? 'bg-primary/5 border-primary shadow-lg' : 'bg-white/5 border-white/10'}`}>
                                        <div className="flex items-center gap-4">
                                            <input type="radio" name="pay" checked={formData.paymentMethod === 'pse'} onChange={() => setFormData({ ...formData, paymentMethod: 'pse' })} className="accent-primary" />
                                            <span className="font-bold text-sm uppercase tracking-widest italic leading-none">PSE / Débito Bancario</span>
                                        </div>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/Pse_logo.png" className="h-6" alt="PSE" />
                                    </label>

                                    <label className={`flex items-center justify-between p-6 rounded-2xl border cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'bg-primary/5 border-primary shadow-lg' : 'bg-white/5 border-white/10'}`}>
                                        <div className="flex items-center gap-4">
                                            <input type="radio" name="pay" checked={formData.paymentMethod === 'card'} onChange={() => setFormData({ ...formData, paymentMethod: 'card' })} className="accent-primary" />
                                            <span className="font-bold text-sm uppercase tracking-widest italic leading-none">Tarjeta de Crédito</span>
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
                                        Serás redirigido a la pasarela de pagos oficial (Wompi/PayU) para completar tu transacción de forma segura. Apex Labs no almacena tus datos bancarios.
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => setStep(1)} className="flex-1 border border-white/10 text-white py-6 rounded-2xl font-display font-bold uppercase tracking-[0.2em] italic">Atrás</button>
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

                        {step === 3 && (
                            <div className="text-center py-20 space-y-8 animate-in fade-in zoom-in duration-500">
                                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20 shadow-[0_0_50px_rgba(204,255,0,0.2)]">
                                    <CheckCircle size={60} className="text-primary" />
                                </div>
                                <h2 className="text-6xl font-display italic uppercase leading-tight">Arsenal <span className="text-primary">Confirmado</span></h2>
                                <p className="text-gray-500 uppercase font-bold tracking-[0.2em] text-sm">Tu pedido ha sido procesado con éxito. <br /> Recibirás un correo con los detalles.</p>
                                <div className="pt-10">
                                    <Link to="/" className="text-primary font-bold border-b border-primary/50 hover:border-primary transition-all pb-1 uppercase italic tracking-widest text-xs">Volver al Inicio</Link>
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
                                    <span>Envío Nacional 🚛</span>
                                    <span>{shippingCost === 0 ? "GRATIS" : formatCOP(shippingCost)}</span>
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
                                        <p className="text-[10px] font-black uppercase text-white tracking-widest italic leading-none mb-1">Protección al Atleta</p>
                                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Garantía de devolución 30 días</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <MapPin className="text-primary" size={20} />
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-white tracking-widest italic leading-none mb-1">Origen Colombia 🇨🇴</p>
                                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Despachos inmediatos desde Cali</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
