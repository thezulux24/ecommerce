import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    TrendingUp,
    Users,
    ShoppingBag,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    Download
} from 'lucide-react';
import { formatCOP } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:3000';

const StatCard = ({ title, value, change, icon: Icon, trend, isCurrency }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
        <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-black rounded-xl">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <div className={`flex items-center space-x-1 text-xs font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                <span>{change}</span>
                {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            </div>
        </div>
        <h3 className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">{title}</h3>
        <p className="text-2xl font-display font-bold italic text-black">{isCurrency ? formatCOP(value) : value}</p>
    </motion.div>
);

export const Dashboard = () => {
    const { token } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${API_BASE}/stats/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (err) {
                console.error('Error fetching dashboard stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    const handleDownloadReport = async () => {
        setDownloading(true);
        try {
            const res = await axios.get(`${API_BASE}/stats/report`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = res.data;
            if (data.length === 0) {
                alert('No hay datos para exportar');
                return;
            }

            // Convert to CSV
            const headers = Object.keys(data[0]);
            const csvRows = [
                headers.join(','),
                ...data.map((row: any) =>
                    headers.map(header => JSON.stringify(row[header])).join(',')
                )
            ];
            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', `reporte_apex_labs_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (err) {
            console.error('Error downloading report:', err);
        } finally {
            setDownloading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-primary" size={40} />
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-black uppercase italic tracking-tighter">Panel de <span className="text-primary">Control</span></h1>
                    <p className="text-gray-500 text-sm font-medium">Resumen de rendimiento de Apex Labs</p>
                </div>
                <button
                    onClick={handleDownloadReport}
                    disabled={downloading}
                    className="flex items-center gap-2 bg-black text-primary px-6 py-3 rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all border border-primary/20 italic uppercase tracking-widest disabled:opacity-50"
                >
                    {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    {downloading ? 'Generando...' : 'Descargar Reporte'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Ventas Totales" value={stats.totalSales} change="+12.5%" trend="up" icon={TrendingUp} isCurrency={true} />
                <StatCard title="Pedidos Totales" value={stats.totalOrders} change="+8.2%" trend="up" icon={ShoppingBag} />
                <StatCard title="Nuevos Atletas" value={stats.totalCustomers} change="+18.4%" trend="up" icon={Users} />
                <StatCard title="Tasa de Conversión" value={`${stats.conversionRate}%`} change="-1.5%" trend="down" icon={CreditCard} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-display font-bold italic uppercase mb-6 border-l-4 border-primary pl-4">Pedidos Recientes</h2>
                    <div className="space-y-4">
                        {stats.recentOrders.length > 0 ? stats.recentOrders.map((order: any) => (
                            <Link
                                to="/admin/orders"
                                state={{ selectedOrderId: order.id }}
                                key={order.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-primary/10 transition-all cursor-pointer group border border-transparent hover:border-primary/20 shadow-sm hover:shadow-md"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center font-bold text-[8px] text-primary italic border border-primary/20 px-1 text-center font-mono">
                                        #{order.id.slice(0, 8)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-tight text-black group-hover:text-primary transition-colors">{order.customer}</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-black">{formatCOP(order.amount)}</p>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${order.status === 'COMPLETED' ? 'text-green-500' : 'text-orange-500'}`}>{order.status}</p>
                                </div>
                            </Link>
                        )) : (
                            <p className="text-center py-10 text-gray-400 text-sm font-bold uppercase tracking-widest italic">No hay pedidos registrados</p>
                        )}
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-display font-bold italic uppercase mb-6 border-l-4 border-primary pl-4">Alertas de Inventario</h2>
                    <div className="space-y-4">
                        {stats.lowStockProducts.length > 0 ? stats.lowStockProducts.map((product: any) => (
                            <div key={product.id} className="flex items-center justify-between p-4 bg-red-50/50 rounded-xl border border-dashed border-red-200">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-black rounded-lg overflow-hidden border border-white/10">
                                        <img src={product.image || "https://via.placeholder.com/100"} className="w-full h-full object-cover grayscale" alt="Product" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-tight">{product.name}</p>
                                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">
                                            {product.stock === 0 ? 'Stock Agotado' : `Solo quedan ${product.stock}`}
                                        </p>
                                    </div>
                                </div>
                                <Link to={`/admin/products`} className="text-[10px] font-bold text-black bg-primary px-3 py-1 rounded uppercase tracking-widest italic shadow-[0_0_10px_rgba(204,255,0,0.2)]">REPONER</Link>
                            </div>
                        )) : (
                            <p className="text-center py-10 text-gray-400 text-sm font-bold uppercase tracking-widest italic">Inventario óptimo</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
