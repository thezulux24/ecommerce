import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, Truck, CheckCircle, X, ChevronRight, MapPin, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCOP } from '../utils/formatters';

const API_BASE = 'http://localhost:3000';

const statusMap: Record<string, { label: string, color: string, icon: any, step: number }> = {
    'PENDING': { label: 'PENDIENTE', color: 'text-yellow-500', icon: Clock, step: 1 },
    'PROCESSING': { label: 'PROCESANDO', color: 'text-blue-500', icon: Clock, step: 2 },
    'SHIPPED': { label: 'ENVIADO', color: 'text-primary', icon: Truck, step: 3 },
    'DELIVERED': { label: 'ENTREGADO', color: 'text-green-500', icon: CheckCircle, step: 4 },
    'CANCELLED': { label: 'CANCELADO', color: 'text-red-500', icon: X, step: 0 },
};

export const MyOrders = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

    // Filters & Pagination
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${API_BASE}/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(res.data);
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    const toggleExpand = (orderId: string) => {
        const newExpanded = new Set(expandedOrders);
        if (newExpanded.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedOrders(newExpanded);
    };

    // Apply Filters
    const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        if (startDate && orderDate < new Date(startDate)) return false;
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (orderDate > end) return false;
        }
        return true;
    });

    // Apply Pagination
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-white pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-5xl">
                <header className="mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-primary mb-4 font-bold tracking-[0.3em] uppercase text-xs">
                                <span className="h-px w-8 bg-primary" /> Historial de Combate
                            </div>
                            <h1 className="text-5xl md:text-7xl font-display italic uppercase tracking-tighter leading-none mb-4">
                                Mis <span className="text-primary font-black">Pedidos</span>
                            </h1>
                            <p className="text-gray-500 text-sm font-medium">Sigue el rastro de tu arsenal de suplementación de élite.</p>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 w-full md:w-auto">
                            <div className="flex-1 md:flex-none">
                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Desde</p>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                                    className="bg-black border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold uppercase text-gray-300 focus:border-primary transition-colors w-full"
                                />
                            </div>
                            <div className="flex-1 md:flex-none">
                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Hasta</p>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                                    className="bg-black border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold uppercase text-gray-300 focus:border-primary transition-colors w-full"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {filteredOrders.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/2">
                        <Package size={48} className="mx-auto text-gray-700 mb-6" />
                        <h3 className="text-2xl font-display uppercase italic text-gray-400">Sin Pedidos Coincidentes</h3>
                        <p className="text-gray-600 mt-2 mb-8">No encontramos registros para los criterios seleccionados.</p>
                        {(startDate || endDate) && (
                            <button
                                onClick={() => { setStartDate(''); setEndDate(''); setCurrentPage(1); }}
                                className="text-primary font-black uppercase text-[10px] tracking-widest hover:underline"
                            >
                                Limpiar Filtros
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {currentOrders.map((order, idx) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`bg-white/5 border rounded-[32px] overflow-hidden transition-all duration-300 ${expandedOrders.has(order.id) ? 'border-primary/40 ring-1 ring-primary/20 bg-white/10' : 'border-white/10 hover:border-white/20'}`}
                            >
                                {/* Header (Always visible) */}
                                <div
                                    onClick={() => toggleExpand(order.id)}
                                    className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${expandedOrders.has(order.id) ? 'bg-primary border-primary text-black' : 'bg-black border-white/10 text-primary'}`}>
                                            <Package size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">ID PEDIDO</p>
                                            <p className="text-sm font-mono font-bold text-white uppercase">#{order.id.split('-')[0]}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3 md:gap-6 items-center w-full md:w-auto">
                                        <div className="flex-1 md:flex-none">
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">FECHA</p>
                                            <p className="text-xs font-bold">{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                        <div className="flex-1 md:flex-none">
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">TOTAL</p>
                                            <p className="text-xs font-bold text-primary italic">{formatCOP(Number(order.totalAmount))}</p>
                                        </div>
                                        <div className={`px-4 py-2 rounded-xl border font-black tracking-widest text-[9px] ${statusMap[order.status]?.color.replace('text-', 'bg-')}/10 ${statusMap[order.status]?.color} border-current/20`}>
                                            {order.status}
                                        </div>
                                        <div className={`transform transition-transform duration-300 ml-auto md:ml-0 ${expandedOrders.has(order.id) ? 'rotate-90 text-primary' : 'text-gray-600'}`}>
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </div>

                                {/* Details (Collapsible) */}
                                <AnimatePresence>
                                    {expandedOrders.has(order.id) && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="border-t border-white/10"
                                        >
                                            <div className="p-8 space-y-8">
                                                {/* Info Grid */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] flex items-center gap-2">
                                                            <MapPin size={14} className="text-primary" /> Dirección de Envío
                                                        </h4>
                                                        <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                                                            <p className="text-white font-bold mb-1 italic uppercase text-sm">{order.shippingAddress?.fullName}</p>
                                                            <p className="text-xs text-gray-400 font-medium">{order.shippingAddress?.street}</p>
                                                            <p className="text-xs text-gray-400 font-medium">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                                                            <p className="text-xs text-gray-400 font-medium">{order.shippingAddress?.country}</p>
                                                            <p className="text-primary/60 mt-2 font-black italic tracking-widest uppercase text-[10px]">Apex Elite Logistics</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] flex items-center gap-2">
                                                            <Truck size={14} className="text-primary" /> Seguimiento
                                                        </h4>
                                                        {order.trackingNumber ? (
                                                            <div className="bg-black/40 border border-primary/20 p-6 rounded-2xl relative overflow-hidden group/guia">
                                                                <div className="absolute top-0 right-0 p-3">
                                                                    <ExternalLink size={16} className="text-primary/40 group-hover/guia:text-primary transition-colors" />
                                                                </div>
                                                                <p className="text-[9px] text-primary/80 font-bold uppercase tracking-widest mb-2">Número de Guía</p>
                                                                <p className="text-2xl font-mono font-bold tracking-tighter text-white">{order.trackingNumber}</p>
                                                            </div>
                                                        ) : (
                                                            <div className="bg-white/2 border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                                                                <Clock className="text-gray-600" size={20} />
                                                                <p className="text-xs text-gray-500 italic font-medium leading-relaxed">Preparando despacho. La guía estará disponible una vez sea recogida por la transportadora.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Items List */}
                                                <div className="space-y-4">
                                                    <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Contenido del Arsenal</h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {order.items.map((item: any) => (
                                                            <div key={item.id} className="flex items-center gap-4 bg-black/30 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                                                <div className="w-14 h-14 bg-black rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                                                                    <img
                                                                        src={item.product ? (item.product.images?.[0]?.url || 'https://via.placeholder.com/300') : (item.bundle?.image || 'https://via.placeholder.com/300')}
                                                                        className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                                                                        alt=""
                                                                    />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-black uppercase tracking-widest leading-none mb-1.5 truncate">
                                                                        {item.product ? item.product.name : item.bundle?.name}
                                                                    </p>
                                                                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest italic">
                                                                        Arsenal: {item.quantity} Uni | {formatCOP(Number(item.price))}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-12 flex justify-center items-center gap-8">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="text-xs font-black uppercase tracking-widest disabled:text-gray-700 hover:text-primary transition-colors flex items-center gap-2 group"
                        >
                            <ChevronRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Anterior
                        </button>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                            Página <span className="text-white">{currentPage}</span> / {totalPages}
                        </span>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="text-xs font-black uppercase tracking-widest disabled:text-gray-700 hover:text-primary transition-colors flex items-center gap-2 group"
                        >
                            Siguiente <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
