import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
    ShoppingBag, Search, User, Instagram, Twitter,
    Facebook, LogOut, Menu, X
} from 'lucide-react';
import { WhatsAppButton } from './WhatsAppButton';

const TopBar = () => {
    const messages = [
        "Envíos a toda Colombia 🇨🇴",
        "Paga seguro con PSE y Tarjeta",
        "Soporte experto por WhatsApp",
        "Garantía de calidad Apex Elite"
    ];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % messages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-primary text-black py-2 relative z-[60]">
            <div className="container mx-auto px-6 text-center h-4 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="text-[10px] uppercase font-bold tracking-[0.2em] italic"
                    >
                        {messages[index]}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    );
};

export const StoreLayout = ({ children }: { children: React.ReactNode }) => {
    const { user, logout } = useAuth();
    const { itemCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Suplementos', path: '/supplements' },
        { name: 'Categorías', path: '/categories' },
        { name: 'Marcas', path: '/brands' },
        { name: 'Packs Ahorro', path: '/save-bundles', highlight: true },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-black">
            <TopBar />

            {/* Navigation */}
            <nav className="sticky top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link to="/" className="text-3xl font-display uppercase tracking-widest text-primary italic">
                            Apex<span className="text-white">Labs</span>
                        </Link>
                        <div className="hidden lg:flex items-center gap-8 uppercase font-display text-[11px] tracking-[0.2em] font-bold">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`hover:text-primary transition-colors italic ${link.highlight ? 'text-primary' : ''}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 group focus-within:border-primary/50 transition-all">
                            <Search size={18} className="text-gray-500 group-focus-within:text-primary" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="bg-transparent border-none focus:ring-0 text-xs w-48 font-bold placeholder:text-gray-600 uppercase tracking-widest ml-2"
                            />
                        </div>

                        <div className="flex items-center gap-5 border-l border-white/10 pl-5">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-end hidden sm:flex">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-primary italic">Hola, {user.firstName}</span>
                                        {user.role === 'ADMIN' && (
                                            <Link to="/admin" className="text-[8px] uppercase font-bold text-white hover:text-primary transition-colors">Panel Control</Link>
                                        )}
                                    </div>
                                    <button onClick={logout} className="hover:text-primary transition-colors text-gray-400"><LogOut size={20} /></button>
                                </div>
                            ) : (
                                <Link to="/login" className="hover:text-primary transition-colors text-gray-400 flex items-center gap-2">
                                    <User size={20} />
                                    <span className="text-[10px] uppercase font-bold tracking-widest hidden sm:inline">Ingresar</span>
                                </Link>
                            )}

                            <Link to="/cart" className="relative hover:text-primary transition-colors text-white bg-white/5 p-2.5 rounded-full border border-white/10 group">
                                <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                                <span className="absolute -top-1 -right-1 bg-primary text-black text-[9px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-black shadow-lg">
                                    {itemCount}
                                </span>
                            </Link>

                            {/* Hamburger Menu Toggle */}
                            <button
                                className="lg:hidden text-white hover:text-primary transition-colors"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden bg-black border-t border-white/5 overflow-hidden"
                        >
                            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`text-2xl font-display uppercase tracking-widest font-bold italic ${link.highlight ? 'text-primary' : 'text-white'}`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <div className="mt-4 pt-8 border-t border-white/5 flex flex-col gap-4">
                                    {user && user.role === 'ADMIN' && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-xs uppercase tracking-widest font-bold text-primary"
                                        >
                                            Ir al Panel de Administración
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-black py-24 px-6 border-t border-white/5">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                        <div className="col-span-1 md:col-span-2">
                            <Link to="/" className="text-5xl font-display uppercase tracking-widest text-primary italic mb-8 block">
                                Apex<span className="text-white">Labs</span>
                            </Link>
                            <div className="text-gray-400 max-w-md mb-12 text-lg font-medium leading-relaxed">
                                <p className="mb-2">Distribuidor Oficial Colombia | NIT: 900.XXX.XXX-X</p>
                                <p className="text-sm font-bold uppercase tracking-widest text-gray-600">Cali, Colombia</p>
                            </div>
                            <div className="flex gap-8">
                                <Instagram className="hover:text-primary cursor-pointer transition-colors text-white" />
                                <Twitter className="hover:text-primary cursor-pointer transition-colors text-white" />
                                <Facebook className="hover:text-primary cursor-pointer transition-colors text-white" />
                            </div>
                        </div>

                        <div>
                            <h4 className="font-display uppercase tracking-[0.2em] text-white mb-10 text-xs font-bold bg-white/5 w-fit px-4 py-1.5 rounded-full border border-white/10">Ayuda</h4>
                            <ul className="space-y-5 text-gray-400 uppercase text-[10px] tracking-[0.2em] font-bold">
                                <li><a href="#" className="hover:text-primary transition-colors">Estado del Pedido</a></li>
                                <li><Link to="/legal#retracto" className="hover:text-primary transition-colors">Cambios y Retracto</Link></li>
                                <li><Link to="/legal#pqrs" className="hover:text-primary transition-colors">PQRS</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-display uppercase tracking-[0.2em] text-white mb-10 text-xs font-bold bg-white/5 w-fit px-4 py-1.5 rounded-full border border-white/10">Legal</h4>
                            <ul className="space-y-5 text-gray-400 uppercase text-[10px] tracking-[0.2em] font-bold">
                                <li><Link to="/legal#habeas-data" className="hover:text-primary transition-colors">Política Habeas Data</Link></li>
                                <li><Link to="/legal" className="hover:text-primary transition-colors">Términos de Servicio</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-[10px] uppercase font-bold text-gray-600 tracking-[0.3em]">
                            © {new Date().getFullYear()} Apex Labs Colombia.
                        </p>
                        <div className="flex items-center gap-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all h-6">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/Pse_logo.png" className="h-full object-contain" alt="PSE" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4 object-contain" alt="PayPal" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3 object-contain" alt="Visa" />
                        </div>
                    </div>
                </div>
            </footer>

            <WhatsAppButton />
        </div>
    );
};
