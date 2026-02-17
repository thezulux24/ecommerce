import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Tag, X, Zap, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ImageUpload } from '../components/ImageUpload';

const API_BASE = 'http://localhost:3000';

export const AdminBrands = () => {
    const { token } = useAuth();
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        id: undefined as string | undefined,
        name: '',
        slug: '',
        description: '',
        logo: '',
    });

    const fetchBrands = async () => {
        try {
            const res = await axios.get(`${API_BASE}/brands`);
            setBrands(res.data);
        } catch (err) {
            console.error('Error fetching brands:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de eliminar esta marca?')) return;
        try {
            await axios.delete(`${API_BASE}/brands/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBrands();
        } catch (err) {
            alert('Error al eliminar marca');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                slug: formData.slug || formData.name.toLowerCase().replace(/ /g, '-'),
            };

            if (formData.id) {
                await axios.patch(`${API_BASE}/brands/${formData.id}`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_BASE}/brands`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setIsModalOpen(false);
            setFormData({ id: undefined, name: '', slug: '', description: '', logo: '' });
            fetchBrands();
        } catch (err) {
            alert('Error al procesar marca');
        }
    };

    const handleEdit = (brand: any) => {
        setFormData({
            id: brand.id,
            name: brand.name,
            slug: brand.slug,
            description: brand.description || '',
            logo: brand.logo || '',
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-black uppercase italic tracking-tighter">Marcas de <span className="text-primary">Elite</span></h1>
                    <p className="text-gray-400 text-sm">Gestiona los sellos de calidad de Apex</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-black text-primary px-6 py-3 rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all flex items-center space-x-2 border border-primary/20 italic"
                >
                    <Plus className="w-4 h-4" />
                    <span className="uppercase tracking-widest">Nueva Marca</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-10 text-center animate-pulse text-gray-400">Escaneando laboratorios...</div>
                ) : brands.map((brand) => (
                    <div key={brand.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-accent/30 transition-all group relative">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-accent/10 transition-colors">
                                {brand.logo ? (
                                    <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <Tag className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
                                )}
                            </div>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(brand)} className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(brand.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <h3 className="text-xl font-display font-bold mb-1 uppercase italic tracking-tight">{brand.name}</h3>
                        <p className="text-gray-400 text-xs mb-4 line-clamp-2">{brand.description || 'Sin descripción'}</p>
                        <div className="flex items-center space-x-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            <span>{brand._count?.products || 0} Productos</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Creation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                    <div className="bg-black w-full max-w-xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(204,255,0,0.15)] relative border border-white/10 text-white">
                        <div className="p-8 flex items-center justify-between border-b border-white/5">
                            <div>
                                <h2 className="text-3xl font-display font-bold text-primary italic uppercase tracking-tighter">{formData.id ? 'Editar' : 'Nueva'} Marca</h2>
                                <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] mt-1 font-bold">{formData.id ? 'Modifica el sello de calidad' : 'Añade un nuevo sello al arsenal'}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mb-2 px-1">Nombre de la Marca</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-white placeholder:text-gray-700"
                                    placeholder="Ej: MUSCLE TECH"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mb-4 px-1 flex items-center gap-2">
                                    <Camera size={14} className="text-primary" /> Logo de la Marca
                                </label>
                                <ImageUpload
                                    currentImage={formData.logo}
                                    onUploadComplete={(url) => setFormData({ ...formData, logo: url })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mb-2 px-1">Descripción</label>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-24 text-white placeholder:text-gray-700 resize-none"
                                    placeholder="Historia o especialidad de la marca..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="pt-6">
                                <button type="submit" className="w-full bg-primary text-black py-5 rounded-2xl font-display font-bold uppercase tracking-[0.2em] transition-all hover:shadow-[0_0_40px_rgba(204,255,0,0.5)] flex items-center justify-center gap-3 italic">
                                    <Zap size={20} fill="black" /> {formData.id ? 'Actualizar' : 'Registrar'} Marca
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
