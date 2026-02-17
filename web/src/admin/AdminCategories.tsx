import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Folder, X, Zap, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ImageUpload } from '../components/ImageUpload';

const API_BASE = 'http://localhost:3000';

export const AdminCategories = () => {
    const { token } = useAuth();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        id: undefined as string | undefined,
        name: '',
        slug: '',
        description: '',
        image: '',
    });

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_BASE}/categories`);
            setCategories(res.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;
        try {
            await axios.delete(`${API_BASE}/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCategories();
        } catch (err) {
            alert('Error al eliminar categoría');
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
                await axios.patch(`${API_BASE}/categories/${formData.id}`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_BASE}/categories`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setIsModalOpen(false);
            setFormData({ id: undefined, name: '', slug: '', description: '', image: '' });
            fetchCategories();
        } catch (err) {
            alert('Error al procesar categoría');
        }
    };

    const handleEdit = (category: any) => {
        setFormData({
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            image: category.image || '',
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-black uppercase italic tracking-tighter">Categorías de <span className="text-primary">Misión</span></h1>
                    <p className="text-gray-400 text-sm">Define los objetivos para tus atletas</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-black text-primary px-6 py-3 rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all flex items-center space-x-2 border border-primary/20 italic"
                >
                    <Plus className="w-4 h-4" />
                    <span className="uppercase tracking-widest">Nueva Categoría</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-10 text-center animate-pulse text-gray-400">Escaneando sectores...</div>
                ) : categories.map((cat) => (
                    <div key={cat.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-accent/30 transition-all group relative">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-accent/10 transition-colors">
                                <Folder className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
                            </div>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(cat)} className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(cat.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <h3 className="text-xl font-display font-bold mb-1 uppercase italic tracking-tight">{cat.name}</h3>
                        <p className="text-gray-400 text-xs mb-4">{cat.description || 'Sin descripción'}</p>
                        <div className="flex items-center space-x-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            <span>{cat.products?.length || 0} Productos</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>{cat.children?.length || 0} Subcategorías</span>
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
                                <h2 className="text-3xl font-display font-bold text-primary italic uppercase tracking-tighter">{formData.id ? 'Editar' : 'Nueva'} Categoría</h2>
                                <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] mt-1 font-bold">{formData.id ? 'Modifica el objetivo de entrenamiento' : 'Define un nuevo objetivo de entrenamiento'}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mb-2 px-1">Nombre de Categoría</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-white placeholder:text-gray-700"
                                    placeholder="Ej: MASA MUSCULAR"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mb-2 px-1">Descripción</label>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-24 text-white placeholder:text-gray-700 resize-none"
                                    placeholder="Describe el propósito de esta categoría..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mb-4 px-1 flex items-center gap-2">
                                    <Camera size={14} className="text-primary" /> Imagen de Categoría
                                </label>
                                <ImageUpload
                                    currentImage={formData.image}
                                    onUploadComplete={(url) => setFormData({ ...formData, image: url })}
                                />
                            </div>

                            <div className="pt-6">
                                <button type="submit" className="w-full bg-primary text-black py-5 rounded-2xl font-display font-bold uppercase tracking-[0.2em] transition-all hover:shadow-[0_0_40px_rgba(204,255,0,0.5)] flex items-center justify-center gap-3 italic">
                                    <Zap size={20} fill="black" /> {formData.id ? 'Actualizar' : 'Desplegar'} Categoría
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
