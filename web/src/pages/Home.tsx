import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Search, User, Zap, ShieldCheck, Activity, ArrowRight, Instagram, Twitter, Facebook, LogOut } from 'lucide-react';

const heroImage = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop";

export const Home = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link to="/" className="text-3xl font-display uppercase tracking-widest text-primary italic">
                            Apex<span className="text-white">Labs</span>
                        </Link>
                        <div className="hidden md:flex items-center gap-8 uppercase font-display text-sm tracking-widest">
                            <a href="#" className="hover:text-primary transition-colors">Rendimiento</a>
                            <a href="#" className="hover:text-primary transition-colors">Recuperación</a>
                            <a href="#" className="hover:text-primary transition-colors">Bienestar</a>
                            <a href="#" className="hover:text-primary transition-colors">Packs</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="hover:text-primary transition-colors"><Search size={22} /></button>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-primary italic">Hola, {user.firstName}</span>
                                <button onClick={logout} className="hover:text-primary transition-colors"><LogOut size={22} /></button>
                            </div>
                        ) : (
                            <Link to="/login" className="hover:text-primary transition-colors"><User size={22} /></Link>
                        )}

                        <button className="relative hover:text-primary transition-colors">
                            <ShoppingBag size={22} />
                            <span className="absolute -top-2 -right-2 bg-primary text-black text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">0</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative h-screen flex items-center pt-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={heroImage} className="w-full h-full object-cover grayscale brightness-[0.4]" alt="Hero" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <h2 className="text-primary font-display uppercase tracking-[0.3em] mb-4 text-glow italic">Supera Tus Límites</h2>
                        <h1 className="text-7xl md:text-9xl font-display uppercase leading-none mb-8">
                            Combustible <br /> <span className="text-primary italic">Elite</span> Para <br /> Atletas
                        </h1>
                        <p className="text-xl text-muted-foreground mb-12 max-w-xl font-light leading-relaxed">
                            Diseñado para humanos de alto rendimiento. Fórmulas respaldadas por la ciencia para llevar tu cuerpo más allá de su umbral natural.
                        </p>
                        <div className="flex flex-wrap gap-6">
                            <button className="btn-primary group">
                                Ver Todos Los Productos <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-8 py-3 border border-white/20 uppercase font-display tracking-widest hover:bg-white hover:text-black transition-all">
                                Packs Exclusivos
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Vertical Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 border-l border-primary/30 h-24" />
            </section>

            {/* Features Bar */}
            <div className="bg-primary py-4">
                <div className="flex overflow-hidden whitespace-nowrap">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-12 text-black font-display uppercase font-bold tracking-[0.2em] px-6">
                            <span>Envío global gratuito</span>
                            <span className="text-xl opacity-20">•</span>
                            <span>Garantía de devolución</span>
                            <span className="text-xl opacity-20">•</span>
                            <span>Probado en laboratorio</span>
                            <span className="text-xl opacity-20">•</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Category Grid */}
            <section className="py-24 px-6 bg-black">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div>
                            <h2 className="text-5xl font-display italic uppercase mb-4">Selecciona Tu <span className="text-primary">Objetivo</span></h2>
                            <p className="text-muted-foreground max-w-md">Alcanza tus metas con precisión mediante nuestras formulaciones especializadas.</p>
                        </div>
                        <button className="text-primary uppercase font-display tracking-widest border-b border-primary/30 pb-2 hover:border-primary transition-all">Ver Todos Los Laboratorios</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[
                            { name: 'Ganar masa muscular', icon: <Activity size={40} />, desc: 'Proteínas y Aminoácidos', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800' },
                            { name: 'Mejorar rendimiento', icon: <Zap size={40} />, desc: 'Energía y Resistencia', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800' },
                            { name: 'Perder grasa', icon: <ShieldCheck size={40} />, desc: 'Definición y Metabolismo', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800' },
                        ].map((cat, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="card-premium h-[500px] flex flex-col justify-end group cursor-pointer"
                            >
                                <img src={cat.img} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700" alt={cat.name} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                <div className="relative z-10">
                                    <div className="text-primary mb-4 italic">{cat.icon}</div>
                                    <h3 className="text-3xl font-display uppercase mb-2">{cat.name}</h3>
                                    <p className="text-sm text-muted-foreground uppercase tracking-widest mb-6">{cat.desc}</p>
                                    <div className="h-1 w-12 bg-primary group-hover:w-full transition-all duration-300" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-muted border-t border-white/5 py-20 px-6">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
                    <div className="col-span-2">
                        <Link to="/" className="text-4xl font-display uppercase tracking-widest text-primary italic mb-8 block">
                            Apex<span className="text-white">Labs</span>
                        </Link>
                        <p className="text-muted-foreground max-w-sm mb-10 text-lg">
                            Fundado por atletas de élite para individuos de alto rendimiento. No nos conformamos con lo "suficiente".
                        </p>
                        <div className="flex gap-6">
                            <Instagram className="hover:text-primary cursor-pointer transition-colors" />
                            <Twitter className="hover:text-primary cursor-pointer transition-colors" />
                            <Facebook className="hover:text-primary cursor-pointer transition-colors" />
                        </div>
                    </div>
                    <div>
                        <h4 className="font-display uppercase tracking-widest text-white mb-8">Navegación</h4>
                        <ul className="space-y-4 text-muted-foreground uppercase text-xs tracking-widest">
                            <li><a href="#" className="hover:text-primary">Suplementos</a></li>
                            <li><a href="#" className="hover:text-primary">Accesorios</a></li>
                            <li><a href="#" className="hover:text-primary">Artículos</a></li>
                            <li><a href="#" className="hover:text-primary">Programa Pro</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-display uppercase tracking-widest text-white mb-8">Soporte</h4>
                        <ul className="space-y-4 text-muted-foreground uppercase text-xs tracking-widest">
                            <li><a href="#" className="hover:text-primary">Estado del Pedido</a></li>
                            <li><a href="#" className="hover:text-primary">Información de Envío</a></li>
                            <li><a href="#" className="hover:text-primary">FAQ</a></li>
                            <li><a href="#" className="hover:text-primary">Contacto</a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
};
