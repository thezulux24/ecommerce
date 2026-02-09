import React from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Users,
    ShoppingBag,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
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
        <p className="text-2xl font-display font-bold italic">{value}</p>
    </motion.div>
);

export const Dashboard = () => {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-black uppercase italic tracking-tighter">Panel de <span className="text-primary">Control</span></h1>
                    <p className="text-gray-400 text-sm">Resumen de rendimiento de Apex Labs</p>
                </div>
                <button className="bg-black text-primary px-6 py-3 rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all border border-primary/20 italic uppercase tracking-widest">
                    Descargar Reporte
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Ventas Totales" value="$12,450.00" change="+12.5%" trend="up" icon={TrendingUp} />
                <StatCard title="Pedidos Totales" value="156" change="+8.2%" trend="up" icon={ShoppingBag} />
                <StatCard title="Nuevos Atletas" value="48" change="+18.4%" trend="up" icon={Users} />
                <StatCard title="Tasa de Conversión" value="3.2%" change="-1.5%" trend="down" icon={CreditCard} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders Placeholder */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-display font-bold italic uppercase mb-6 border-l-4 border-primary pl-4">Pedidos Recientes</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer group">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center font-bold text-[10px] text-primary italic border border-primary/20">
                                        #ORD-{1000 + i}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-tight">Juan Pérez</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Hace 2 mins</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold">$299.00</p>
                                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Completado</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Low Stock Alerts Placeholder */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-display font-bold italic uppercase mb-6 border-l-4 border-primary pl-4">Alertas de Inventario</h2>
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-red-50/50 rounded-xl border border-dashed border-red-200">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-black rounded-lg overflow-hidden border border-white/10">
                                        <img src="https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=100" className="w-full h-full object-cover grayscale" alt="Product" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-tight">Whey Protein v{i}</p>
                                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Solo quedan 2</p>
                                    </div>
                                </div>
                                <button className="text-[10px] font-bold text-black bg-primary px-3 py-1 rounded uppercase tracking-widest italic shadow-[0_0_10px_rgba(204,255,0,0.2)]">REPONER</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
