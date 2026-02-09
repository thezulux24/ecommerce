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
            <div className="p-3 bg-gray-50 rounded-xl">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <div className={`flex items-center space-x-1 text-xs font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                <span>{change}</span>
                {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            </div>
        </div>
        <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
        <p className="text-2xl font-display font-bold">{value}</p>
    </motion.div>
);

export const Dashboard = () => {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-display font-bold">Dashboard</h1>
                <button className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-accent transition-all">
                    Download Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Sales" value="$12,450.00" change="+12.5%" trend="up" icon={TrendingUp} />
                <StatCard title="Total Orders" value="156" change="+8.2%" trend="up" icon={ShoppingBag} />
                <StatCard title="New Customers" value="48" change="+18.4%" trend="up" icon={Users} />
                <StatCard title="Conversion Rate" value="3.2%" change="-1.5%" trend="down" icon={CreditCard} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders Placeholder */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-display mb-6">Recent Orders</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-accent/5 transition-colors cursor-pointer group">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-xs">
                                        #ORD-{1000 + i}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">John Doe</p>
                                        <p className="text-[10px] text-gray-400">2 mins ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold">$299.00</p>
                                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Completed</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Low Stock Alerts Placeholder */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-display mb-6">Inventory Alerts</h2>
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-200/30 rounded-xl border border-dashed border-gray-300">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-white rounded-lg overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=100" className="w-full h-full object-cover" alt="Product" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Modern Chair v{i}</p>
                                        <p className="text-[10px] text-red-500 font-bold">Only 2 left</p>
                                    </div>
                                </div>
                                <button className="text-[10px] font-bold text-accent border-b border-accent">RESTOCK</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
