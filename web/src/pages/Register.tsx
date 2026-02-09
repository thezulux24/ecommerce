import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, ArrowRight, Mail, Lock, User, AlertCircle } from 'lucide-react';

export const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const { register, error } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10">
                    <Link to="/" className="text-4xl font-display uppercase tracking-widest text-primary italic mb-6 inline-block">
                        Apex<span className="text-white">Labs</span>
                    </Link>
                    <h1 className="text-3xl font-display uppercase tracking-wider mb-2">Comienza tu Evolución</h1>
                    <p className="text-muted-foreground">Únete a la élite del rendimiento</p>
                </div>

                <div className="card-premium">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3 text-red-500 text-sm mb-4">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-2">Nombre</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 px-10 py-3 focus:border-primary outline-none transition-colors text-sm"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-2">Apellido</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 px-4 py-3 focus:border-primary outline-none transition-colors text-sm"
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 px-10 py-3 focus:border-primary outline-none transition-colors text-sm"
                                    placeholder="atleta@pro.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-2">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 px-10 py-3 focus:border-primary outline-none transition-colors text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full group mt-4 py-4"
                        >
                            {loading ? 'Procesando...' : (
                                <>
                                    Crear Cuenta <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-8 border-t border-white/5">
                        <p className="text-sm text-muted-foreground mb-4 italic">¿Ya eres parte del equipo?</p>
                        <Link
                            to="/login"
                            className="text-white uppercase font-display tracking-widest text-sm hover:text-primary transition-colors inline-flex items-center gap-2"
                        >
                            Inicia Sesión <Zap size={14} className="text-primary" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
