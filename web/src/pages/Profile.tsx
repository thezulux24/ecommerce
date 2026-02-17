import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, Save, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:3000';

export const Profile = () => {
    const { user, token, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        try {
            const updatePayload: any = {
                firstName: formData.firstName,
                lastName: formData.lastName,
            };

            if (formData.password) {
                updatePayload.password = formData.password;
            }

            await axios.patch(`${API_BASE}/users/me`, updatePayload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess(true);
            setFormData({ ...formData, password: '', confirmPassword: '' });
            alert('Perfil actualizado con éxito. Por favor, inicia sesión de nuevo si cambiaste tu contraseña.');
            if (formData.password) logout();
        } catch (err: any) {
            console.error('Update error:', err);
            setError(err.response?.data?.message || 'Error al actualizar el perfil');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-white pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-2xl">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-12 uppercase text-[10px] font-bold tracking-[0.2em]">
                    <ArrowLeft size={14} /> Volver al Inicio
                </Link>

                <div className="mb-12">
                    <div className="flex items-center gap-2 text-primary mb-4 font-bold tracking-[0.3em] uppercase text-xs">
                        <span className="h-px w-8 bg-primary" /> Gestión de Cuenta
                    </div>
                    <h1 className="text-5xl font-display italic uppercase leading-none tracking-tighter">Mi <span className="text-primary">Perfil</span></h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 bg-white/[0.02] border border-white/5 p-10 rounded-[40px] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold uppercase tracking-widest text-center italic">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-primary/10 border border-primary/20 text-primary rounded-2xl text-xs font-bold uppercase tracking-widest text-center italic flex items-center justify-center gap-2">
                            <CheckCircle size={14} /> Perfil Actualizado Exitosamente
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] ml-2">Nombre</label>
                            <div className="relative group">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:border-primary focus:outline-none font-bold text-sm transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] ml-2">Apellido</label>
                            <div className="relative group">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:border-primary focus:outline-none font-bold text-sm transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] ml-2">Email (No Editable)</label>
                        <div className="relative group opacity-50">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 font-bold text-sm cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 mt-8">
                        <h3 className="text-xl font-display uppercase italic mb-6">Cambiar <span className="text-primary">Contraseña</span></h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="password"
                                    placeholder="NUEVA CONTRASEÑA"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:border-primary focus:outline-none font-bold text-sm placeholder:text-gray-700 transition-all"
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="password"
                                    placeholder="CONFIRMAR"
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:border-primary focus:outline-none font-bold text-sm placeholder:text-gray-700 transition-all"
                                />
                            </div>
                        </div>
                        <p className="mt-4 text-[9px] uppercase font-bold text-gray-600 tracking-widest leading-relaxed ml-2 italic">Deja estos campos en blanco si no deseas cambiar tu contraseña.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-black py-6 rounded-2xl font-display font-bold uppercase tracking-[0.2em] italic hover:shadow-[0_0_40px_rgba(204,255,0,0.3)] transition-all flex items-center justify-center gap-4 group"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                Guardar Cambios <Save size={20} className="group-hover:scale-110 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-12 p-10 bg-black border border-white/5 rounded-[40px] text-center">
                    <p className="text-gray-500 uppercase font-black tracking-widest text-[10px] italic">Seguridad de la Cuenta</p>
                    <p className="text-sm text-gray-400 mt-2 uppercase font-bold tracking-widest leading-relaxed">Tu información está protegida bajo protocolos de encriptación militar Apex Elite.</p>
                </div>
            </div>
        </div>
    );
};
