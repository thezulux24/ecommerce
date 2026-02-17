import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Package, X, Zap, Camera, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ImageUpload } from '../components/ImageUpload';

const API_BASE = 'http://localhost:3000';

export const AdminBundles = () => {
    const { token } = useAuth();
    const [bundles, setBundles] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        id: undefined as string | undefined,
        name: '',
        description: '',
        price: '',
        oldPrice: '',
        image: '',
        productIds: [] as string[],
        features: [''],
    });

    const fetchBundles = async () => {
        try {
            const res = await axios.get(`${API_BASE}/bundles`);
            setBundles(res.data);
        } catch (err) {
            console.error('Error fetching bundles:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${API_BASE}/products`);
            setProducts(res.data);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    useEffect(() => {
        fetchBundles();
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de eliminar este pack?')) return;
        try {
            await axios.delete(`${API_BASE}/bundles/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBundles();
        } catch (err) {
            alert('Error al eliminar pack');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.productIds.length === 0) {
            alert('Selecciona al menos un producto para el pack.');
            return;
        }

        try {
            const data = {
                ...formData,
                price: parseFloat(formData.price),
                oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : undefined,
                features: formData.features.filter(f => f.trim() !== ''),
            };

            if (formData.id) {
                await axios.patch(`${API_BASE}/bundles/${formData.id}`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_BASE}/bundles`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setIsModalOpen(false);
            setFormData({ id: undefined, name: '', description: '', price: '', oldPrice: '', image: '', productIds: [], features: [''] });
            fetchBundles();
        } catch (err) {
            alert('Error al procesar pack');
        }
    };

    const handleEdit = (bundle: any) => {
        setFormData({
            id: bundle.id,
            name: bundle.name,
            description: bundle.description || '',
            price: bundle.price.toString(),
            oldPrice: bundle.oldPrice ? bundle.oldPrice.toString() : '',
            image: bundle.image || '',
            productIds: bundle.products.map((bp: any) => bp.productId),
            features: bundle.features && bundle.features.length > 0 ? bundle.features : [''],
        });
        setIsModalOpen(true);
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    const addFeature = () => {
        setFormData({ ...formData, features: [...formData.features, ''] });
    };

    const removeFeature = (index: number) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData({ ...formData, features: newFeatures.length > 0 ? newFeatures : [''] });
    };

    const toggleProduct = (productId: string) => {
        setFormData(prev => ({
            ...prev,
            productIds: prev.productIds.includes(productId)
                ? prev.productIds.filter(id => id !== productId)
                : [...prev.productIds, productId]
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-black uppercase italic tracking-tighter">Packs de <span className="text-primary">Ahorro</span></h1>
                    <p className="text-gray-400 text-sm">Crea combinaciones explosivas con descuento</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-black text-primary px-6 py-3 rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all flex items-center space-x-2 border border-primary/20 italic"
                >
                    <Plus className="w-4 h-4" />
                    <span className="uppercase tracking-widest">Nuevo Pack</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-10 text-center animate-pulse text-gray-400">Escaneando bundles...</div>
                ) : bundles.map((bundle) => (
                    <div key={bundle.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group relative flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                <img src={bundle.image || 'https://via.placeholder.com/150?text=Pack'} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => handleEdit(bundle)} className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(bundle.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <h3 className="text-xl font-display font-bold mb-1 uppercase italic tracking-tight">{bundle.name}</h3>
                        <p className="text-gray-400 text-xs mb-4 flex-grow">{bundle.description || 'Sin descripción'}</p>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex -space-x-3">
                                {bundle.products.slice(0, 4).map((bp: any) => (
                                    <div key={bp.id} className="w-8 h-8 rounded-full border-2 border-white bg-black overflow-hidden shadow-sm">
                                        <img src={bp.product.images?.[0]?.url} className="w-full h-full object-cover" title={bp.product.name} />
                                    </div>
                                ))}
                                {bundle.products.length > 4 && (
                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-800 flex items-center justify-center text-[8px] font-bold text-white shadow-sm">
                                        +{bundle.products.length - 4}
                                    </div>
                                )}
                            </div>
                            <span className="text-[10px] uppercase font-black text-gray-300 tracking-widest">{bundle.products.length} Items</span>
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                            <div>
                                {bundle.oldPrice && <span className="text-[10px] text-gray-300 line-through font-bold">${bundle.oldPrice}</span>}
                                <div className="text-lg font-display font-black italic text-primary leading-none">${bundle.price}</div>
                            </div>
                            <div className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${bundle.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {bundle.isActive ? 'Activo' : 'Inactivo'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Creation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                    <div className="bg-black w-full max-w-4xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(204,255,0,0.15)] relative border border-white/10 text-white">
                        <div className="p-8 flex items-center justify-between border-b border-white/5">
                            <div>
                                <h2 className="text-3xl font-display font-bold text-primary italic uppercase tracking-tighter">{formData.id ? 'Editar' : 'Plan'} Maestro</h2>
                                <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] mt-1 font-bold">{formData.id ? 'Ajusta la oferta explosiva' : 'Configura una oferta irresistible'}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-2 gap-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mb-2 px-1">Título del Pack</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-white placeholder:text-gray-700"
                                        placeholder="Ej: PACK HIPERTROFIA ELITE"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mb-2 px-1">Estrategia / Descripción</label>
                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-24 text-white placeholder:text-gray-700 resize-none"
                                        placeholder="Por qué este pack es brutal..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mb-2 px-1">Precio Pack ($)</label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-white"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mb-2 px-1">Precio Normal ($)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-white"
                                            value={formData.oldPrice}
                                            onChange={e => setFormData({ ...formData, oldPrice: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mb-4 px-1 flex items-center gap-2">
                                        <Camera size={14} className="text-primary" /> Visual del Pack
                                    </label>
                                    <ImageUpload
                                        currentImage={formData.image}
                                        onUploadComplete={(url) => setFormData({ ...formData, image: url })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mb-2 px-1 flex items-center justify-between">
                                    <span>Seleccionar Arsenal ({formData.productIds.length})</span>
                                    {formData.productIds.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, productIds: [] })}
                                            className="text-primary hover:text-red-500 transition-colors"
                                        >Limpiar</button>
                                    )}
                                </label>
                                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                                    <div className="p-4 border-b border-white/5">
                                        <div className="relative">
                                            <Package size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input type="text" placeholder="Filtrar arsenal..." className="w-full bg-black/50 border-none rounded-lg pl-10 pr-4 py-2 text-xs font-bold focus:ring-1 focus:ring-primary" />
                                        </div>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2 space-y-2">
                                        {products.map(p => {
                                            const isSelected = formData.productIds.includes(p.id);
                                            return (
                                                <div
                                                    key={p.id}
                                                    onClick={() => toggleProduct(p.id)}
                                                    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all border ${isSelected ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-black overflow-hidden border border-white/5">
                                                        <img src={p.images?.[0]?.url} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="text-[10px] font-black uppercase text-white leading-tight">{p.name}</p>
                                                        <p className="text-[8px] uppercase text-gray-500 font-bold">${p.price}</p>
                                                    </div>
                                                    {isSelected && <Check size={16} className="text-primary" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                {/* Features */}
                                <div className="space-y-4 pt-6 mt-6 border-t border-white/5">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Características Destacadas</h4>
                                        <button type="button" onClick={addFeature} className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-lg hover:bg-primary hover:text-black transition-all uppercase tracking-tighter italic font-black">+ Añadir</button>
                                    </div>
                                    <div className="grid gap-4">
                                        {formData.features.map((feat, idx) => (
                                            <div key={idx} className="flex gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="Vantaja competitiva..."
                                                    value={feat}
                                                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm focus:border-primary transition-colors text-white"
                                                />
                                                <button type="button" onClick={() => removeFeature(idx)} className="p-4 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="w-full bg-primary text-black py-5 rounded-2xl font-display font-bold uppercase tracking-[0.2em] transition-all hover:shadow-[0_0_40px_rgba(204,255,0,0.5)] flex items-center justify-center gap-3 italic">
                                        <Zap size={20} fill="black" /> {formData.id ? 'Actualizar' : 'Desplegar'} Pack
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
