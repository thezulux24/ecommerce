import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Layers,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    Bell,
    Search
} from 'lucide-react';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Package, label: 'Products', path: '/admin/products' },
        { icon: Layers, label: 'Categories', path: '/admin/categories' },
        { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
        { icon: Users, label: 'Customers', path: '/admin/customers' },
    ];

    return (
        <div className="flex h-screen bg-[#F0F2F5]">
            {/* Sidebar */}
            <aside className="w-64 bg-primary text-white flex flex-col">
                <div className="p-8">
                    <div className="text-xl font-display font-bold tracking-tighter">ONLINESTORE <span className="text-[10px] bg-accent px-2 py-1 rounded ml-2">ADMIN</span></div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button className="flex items-center space-x-3 px-4 py-3 w-full text-gray-400 hover:text-white transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    <div className="flex items-center space-x-6">
                        <button className="relative p-2 text-gray-400 hover:text-primary transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center space-x-3 border-l pl-6">
                            <div className="text-right">
                                <p className="text-sm font-bold">Admin User</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Manager</p>
                            </div>
                            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};
