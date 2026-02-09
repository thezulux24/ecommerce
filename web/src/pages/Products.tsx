import { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductCard } from '../components/ProductCard';
import { Filter } from 'lucide-react';

const API_BASE = 'http://localhost:3000';

export const Products = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${API_BASE}/products`);
                setProducts(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-background text-white pt-10 pb-20">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <div className="flex items-center gap-2 text-primary mb-4 font-bold tracking-[0.3em] uppercase text-xs">
                            <span className="h-px w-8 bg-primary" /> Distribuidor Oficial Colombia
                        </div>
                        <h1 className="text-6xl md:text-8xl font-display italic uppercase leading-none tracking-tighter">Nuestro <span className="text-primary">Arsenal</span></h1>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-6 py-3 cursor-pointer hover:bg-white/10 transition-colors">
                        <Filter size={18} className="text-primary" />
                        <span className="text-xs uppercase font-bold tracking-widest">Filtrar por Objetivo</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {loading ? (
                        Array(8).fill(0).map((_, i) => (
                            <div key={i} className="h-[500px] bg-white/5 rounded-[30px] animate-pulse border border-white/5" />
                        ))
                    ) : products.length > 0 ? (
                        products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <h3 className="text-2xl font-display uppercase italic text-gray-500">No se encontraron productos en el laboratorio</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
