import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Search, X, Zap, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ImageUpload } from '../components/ImageUpload';

const API_BASE = 'http://localhost:3000';

export const AdminProducts = () => {
    const { token } = useAuth();
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        id: undefined as string | undefined,
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        brandId: '',
        images: [''],
    });

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${API_BASE}/products`);
            setProducts(res.data);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_BASE}/categories`);
            setCategories(res.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const fetchBrands = async () => {
        try {
            const res = await axios.get(`${API_BASE}/brands`);
            setBrands(res.data);
        } catch (err) {
            console.error('Error fetching brands:', err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchBrands();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            await axios.delete(`${API_BASE}/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts();
        } catch (err) {
            alert('Error al eliminar producto');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                images: formData.images.filter(url => url.trim() !== ''),
                slug: formData.name.toLowerCase().replace(/ /g, '-'),
            };

            if (formData.id) {
                await axios.patch(`${API_BASE}/products/${formData.id}`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_BASE}/products`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setIsModalOpen(false);
            setFormData({ id: undefined, name: '', description: '', price: '', stock: '', categoryId: '', brandId: '', images: [''] });
            fetchProducts();
        } catch (err) {
            alert('Error al procesar producto');
        }
    };

    const handleEdit = (product: any) => {
        setFormData({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            stock: product.stock.toString(),
            categoryId: product.categoryId,
            brandId: product.brandId || '',
            images: product.images.length > 0 ? product.images.map((img: any) => img.url) : [''],
        });
        setIsModalOpen(true);
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-black uppercase italic tracking-tighter">Inventario de <span className="text-primary">Apex</span></h1>
                    <p className="text-gray-400 text-sm">Gestiona el combustible para tus atletas</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-black text-primary px-6 py-3 rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all flex items-center space-x-2 border border-primary/20 italic"
                >
                    <Plus className="w-4 h-4" />
                    <span className="uppercase tracking-widest">Nuevo Producto</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Buscar productos..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-primary" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                            <tr>
                                <th className="px-6 py-4">Producto</th>
                                <th className="px-6 py-4">Marca</th>
                                <th className="px-6 py-4">Categoría</th>
                                <th className="px-6 py-4">Precio</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 italic">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-10 text-center animate-pulse text-gray-400">Escaneando laboratorios...</td></tr>
                            ) : products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-black rounded-lg overflow-hidden border border-gray-100">
                                                <img
                                                    src={product.images?.[0]?.url || 'https://via.placeholder.com/100?text=Apex'}
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all font-bold"
                                                    alt=""
                                                />
                                            </div>
                                            <span className="text-sm font-bold text-black uppercase tracking-tight">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-black uppercase tracking-widest italic">{product.brand?.name || 'Genérico'}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">{product.category?.name}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-black underline decoration-primary decoration-4 underline-offset-4">${product.price}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-black">{product.stock} <span className="text-[10px] text-gray-400 uppercase">unidades</span></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(product)} className="p-2 text-gray-400 hover:text-primary hover:bg-black rounded-lg transition-colors border border-transparent hover:border-primary/20">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Creation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                    <div className="bg-black w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(204,255,0,0.15)] relative border border-white/10 text-white">
                        <div className="bg-black p-8 flex items-center justify-between border-b border-white/5">
                            <div>
                                <h2 className="text-3xl font-display font-bold text-primary italic uppercase tracking-tighter">{formData.id ? 'Editar' : 'Nueva'} Fórmula</h2>
                                <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] mt-1 font-bold">{formData.id ? 'Modifica el combustible del arsenal' : 'Añade combustible al arsenal de Apex'}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mb-2 px-1">Nombre del Lab / Producto</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-white placeholder:text-gray-700"
                                        placeholder="Ej: ISO APEX WHEY"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mb-2 px-1">Especificaciones / Descripción</label>
                                    <textarea
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-24 text-white placeholder:text-gray-700 resize-none"
                                        placeholder="Detalla los beneficios de rendimiento..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mb-2 px-1">Valor Unitario ($)</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-white placeholder:text-gray-700"
                                        placeholder="49.99"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mb-2 px-1">Stock Disponible</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-white placeholder:text-gray-700"
                                        placeholder="100"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mb-2 px-1">Objetivo del Atleta</label>
                                    <select
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-white appearance-none cursor-pointer"
                                        value={formData.categoryId}
                                        onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                    >
                                        <option value="" className="bg-black">Selecciona un objetivo</option>
                                        {categories.map(c => <option key={c.id} value={c.id} className="bg-black">{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mb-2 px-1">Sello / Marca</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-white appearance-none cursor-pointer"
                                        value={formData.brandId}
                                        onChange={e => setFormData({ ...formData, brandId: e.target.value })}
                                    >
                                        <option value="" className="bg-black">Selecciona una marca</option>
                                        {brands.map(b => <option key={b.id} value={b.id} className="bg-black">{b.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mb-4 px-1 flex items-center gap-2">
                                        <Camera size={14} className="text-primary" /> Visuales del Producto
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {formData.images.map((url, idx) => (
                                            <ImageUpload
                                                key={idx}
                                                currentImage={url}
                                                onUploadComplete={(newUrl) => handleImageChange(idx, newUrl)}
                                                label={`Imagen ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                                        className="text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest mt-6 flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5"
                                    >
                                        + Añadir otro espacio de imagen
                                    </button>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button type="submit" className="w-full bg-primary text-black py-5 rounded-2xl font-display font-bold uppercase tracking-[0.2em] transition-all hover:shadow-[0_0_40px_rgba(204,255,0,0.5)] flex items-center justify-center gap-3 italic">
                                    <Zap size={20} fill="black" /> {formData.id ? 'Actualizar' : 'Iniciar'} Producción
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
