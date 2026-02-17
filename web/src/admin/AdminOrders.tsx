import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Eye, RefreshCw, CheckCircle, Truck, XCircle, Clock, MapPin, User, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCOP } from '../utils/formatters';

const API_BASE = 'http://localhost:3000';

const statusMap: Record<string, { label: string, color: string, icon: any }> = {
    'PENDING': { label: 'PENDIENTE', color: 'bg-yellow-500/10 text-yellow-500', icon: Clock },
    'PROCESSING': { label: 'PROCESANDO', color: 'bg-blue-500/10 text-blue-500', icon: RefreshCw },
    'SHIPPED': { label: 'ENVIADO', color: 'bg-primary/10 text-primary', icon: Truck },
    'DELIVERED': { label: 'ENTREGADO', color: 'bg-green-500/10 text-green-500', icon: CheckCircle },
    'CANCELLED': { label: 'CANCELADO', color: 'bg-red-500/10 text-red-500', icon: XCircle },
};

export const AdminOrders = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [trackingNumber, setTrackingNumber] = useState('');

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_BASE}/orders/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string, trackingNum?: string) => {
        if (newStatus === 'SHIPPED' && !trackingNum && !selectedOrder?.trackingNumber) {
            alert('Por favor, ingresa el número de guía para marcar el pedido como enviado.');
            return;
        }

        try {
            await axios.patch(`${API_BASE}/orders/${orderId}/status`, {
                status: newStatus,
                trackingNumber: trackingNum
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchOrders();
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({
                    ...selectedOrder,
                    status: newStatus,
                    trackingNumber: trackingNum || selectedOrder.trackingNumber
                });
            }
            setTrackingNumber('');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al actualizar estado');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-black uppercase italic tracking-tighter">Control de <span className="text-primary">Despachos</span></h1>
                    <p className="text-gray-400 text-sm">Gestiona el flujo de munición para tus atletas</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por ID, Email o Nombre..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                            <tr>
                                <th className="px-6 py-4">ID Pedido / Fecha</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Artículos</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 italic">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-10 text-center animate-pulse text-gray-400 uppercase font-bold tracking-widest">Sincronizando con el centro de mando...</td></tr>
                            ) : filteredOrders.map((order) => {
                                const StatusIcon = statusMap[order.status]?.icon || Clock;
                                return (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-black uppercase tracking-tight font-mono">#{order.id.split('-')[0]}</span>
                                                <span className="text-[10px] text-gray-400 font-bold">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-primary text-xs font-bold italic">
                                                    {order.user?.firstName?.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-black uppercase">{order.user?.firstName} {order.user?.lastName}</span>
                                                    <span className="text-[9px] text-gray-400 font-bold tracking-wider">{order.user?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">
                                            {order.items.length} {order.items.length === 1 ? 'Producto' : 'Productos'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-black underline decoration-primary decoration-4 underline-offset-4 tracking-tighter italic">
                                            {formatCOP(Number(order.totalAmount))}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black tracking-[0.15em] uppercase border border-transparent ${statusMap[order.status]?.color}`}>
                                                    <StatusIcon size={12} />
                                                    {statusMap[order.status]?.label}
                                                </span>
                                                {order.trackingNumber && (
                                                    <span className="text-[8px] font-mono text-gray-400 font-bold uppercase text-center">#{order.trackingNumber}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 text-gray-400 hover:text-primary hover:bg-black rounded-lg transition-all border border-transparent hover:border-primary/20"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                    <div className="bg-black w-full max-w-4xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(204,255,0,0.15)] relative border border-white/10 text-white flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                                    <Clock className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-display font-bold text-white italic uppercase tracking-tighter leading-none">Detalles del <span className="text-primary">Pedido</span></h2>
                                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">ID: {selectedOrder.id}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Left: Items & Total */}
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                                            <Package size={14} className="text-primary" /> Arsenal de Productos
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedOrder.items.map((item: any) => (
                                                <div key={item.id} className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-primary/20 transition-all">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-black flex-shrink-0">
                                                        <img src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/100'} className="w-full h-full object-cover grayscale" alt="" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[10px] font-black uppercase text-white tracking-widest mb-0.5 leading-tight">{item.product?.name}</p>
                                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest uppercase italic">Cant: {item.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-bold text-primary font-display italic">{formatCOP(Number(item.price))}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest italic">Total Arsenal</span>
                                            <span className="text-4xl font-display font-black text-primary italic tracking-tighter leading-none">{formatCOP(Number(selectedOrder.totalAmount))}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Customer & Shipping */}
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                                            <User size={14} className="text-primary" /> Información del Atleta
                                        </h3>
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-2">
                                            <p className="text-sm font-bold uppercase italic text-white">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                                            <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">{selectedOrder.user?.email}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                                            <MapPin size={14} className="text-primary" /> Coordenadas de Envío
                                        </h3>
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-2">
                                            <p className="text-xs font-bold uppercase italic text-white leading-relaxed">{selectedOrder.shippingAddress?.street}</p>
                                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}
                                            </p>
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest border-t border-white/5 pt-2 mt-2 italic flex items-center gap-2">
                                                <Truck size={12} /> COLOMBIA ELITE DELIVERY
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                                            <RefreshCw size={14} className="text-primary" /> Actualizar Estado
                                        </h3>

                                        {((selectedOrder.status === 'SHIPPED' || selectedOrder.status === 'PROCESSING')) && (
                                            <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5 mb-4">
                                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest italic flex items-center gap-2">
                                                    <Truck size={12} className="text-primary" /> Guía de Rastreo (Requerida para ENVIADO)
                                                </p>
                                                <input
                                                    type="text"
                                                    placeholder="NÚMERO DE GUÍA (EJ: ENV123456)"
                                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs font-bold focus:border-primary focus:outline-none placeholder:text-gray-700"
                                                    value={trackingNumber || selectedOrder.trackingNumber || ''}
                                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                                />
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-2">
                                            {Object.entries(statusMap).map(([key, value]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => handleStatusUpdate(selectedOrder.id, key, key === 'SHIPPED' ? trackingNumber : undefined)}
                                                    className={`px-3 py-3 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${selectedOrder.status === key
                                                        ? value.color.replace('/10', '/30') + ' border border-current shadow-lg shadow-white/5'
                                                        : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'
                                                        }`}
                                                >
                                                    <value.icon size={12} />
                                                    {value.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
