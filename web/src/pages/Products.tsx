import { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductCard } from '../components/ProductCard';
import { Filter, X, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'http://localhost:3000';

interface FilterSidebarProps {
    categories: any[];
    brands: any[];
    filters: any;
    onFilterChange: (name: string, value: string) => void;
    onClearFilters: () => void;
}

const FilterSidebar = ({ categories, brands, filters, onFilterChange, onClearFilters }: FilterSidebarProps) => {
    // Local state for text inputs to allow smooth typing without immediate re-renders of the parent's intensive logic
    const [localSearch, setLocalSearch] = useState(filters.search);
    const [localMin, setLocalMin] = useState(filters.minPrice);
    const [localMax, setLocalMax] = useState(filters.maxPrice);

    // Sync local state when external filters change (e.g. on clear)
    useEffect(() => {
        setLocalSearch(filters.search);
        setLocalMin(filters.minPrice);
        setLocalMax(filters.maxPrice);
    }, [filters.search, filters.minPrice, filters.maxPrice]);

    // Debounce updates to the parent state
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== filters.search) onFilterChange('search', localSearch);
        }, 500);
        return () => clearTimeout(timer);
    }, [localSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (localMin !== filters.minPrice) onFilterChange('minPrice', localMin);
            if (localMax !== filters.maxPrice) onFilterChange('maxPrice', localMax);
        }, 500);
        return () => clearTimeout(timer);
    }, [localMin, localMax]);

    return (
        <div className="space-y-10">
            {/* Search */}
            <div>
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-6 flex items-center gap-2">
                    <span className="h-px w-4 bg-primary" /> Buscar Producto
                </h4>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        type="text"
                        placeholder="Nombre, beneficio..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary placeholder:text-gray-600 transition-colors pointer-events-auto"
                    />
                </div>
            </div>

            {/* Categories */}
            <div>
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-6 flex items-center gap-2">
                    <span className="h-px w-4 bg-primary" /> Categorías
                </h4>
                <div className="grid gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => onFilterChange('category', filters.category === cat.slug ? '' : cat.slug)}
                            className={`flex items-center justify-between group px-4 py-3 rounded-xl transition-all ${filters.category === cat.slug ? 'bg-primary text-black font-bold' : 'hover:bg-white/5 text-gray-400'}`}
                        >
                            <span className="text-sm uppercase tracking-wide">{cat.name}</span>
                            <ChevronRight size={14} className={`${filters.category === cat.slug ? 'text-black' : 'text-gray-600'} group-hover:translate-x-1 transition-transform`} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Brands */}
            <div>
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-6 flex items-center gap-2">
                    <span className="h-px w-4 bg-primary" /> Marcas
                </h4>
                <div className="flex flex-wrap gap-2">
                    {brands.map(brand => (
                        <button
                            key={brand.id}
                            onClick={() => onFilterChange('brand', filters.brand === brand.slug ? '' : brand.slug)}
                            className={`px-4 py-2 rounded-full border text-[10px] uppercase font-bold tracking-widest transition-all ${filters.brand === brand.slug ? 'bg-white text-black border-white' : 'border-white/10 text-gray-400 hover:border-white/40'}`}
                        >
                            {brand.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-6 flex items-center gap-2">
                    <span className="h-px w-4 bg-primary" /> Rango de Precios
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="number"
                        placeholder="Min"
                        value={localMin}
                        onChange={(e) => setLocalMin(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-primary transition-colors"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={localMax}
                        onChange={(e) => setLocalMax(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-primary transition-colors"
                    />
                </div>
            </div>

            {/* Clear All */}
            <button
                onClick={onClearFilters}
                className="w-full py-4 rounded-2xl border border-white/10 text-xs uppercase font-bold tracking-[0.2em] text-gray-400 hover:bg-white/5 transition-all text-center"
            >
                Limpiar Filtros
            </button>
        </div>
    );
};

export const Products = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const [filters, setFilters] = useState({
        category: '',
        brand: '',
        minPrice: '',
        maxPrice: '',
        search: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, brandsRes] = await Promise.all([
                    axios.get(`${API_BASE}/categories`),
                    axios.get(`${API_BASE}/brands`)
                ]);
                setCategories(categoriesRes.data);
                setBrands(brandsRes.data);
            } catch (err) {
                console.error('Error fetching filter data:', err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (filters.category) params.append('category', filters.category);
                if (filters.brand) params.append('brand', filters.brand);
                if (filters.minPrice) params.append('minPrice', filters.minPrice);
                if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
                if (filters.search) params.append('search', filters.search);

                const res = await axios.get(`${API_BASE}/products?${params.toString()}`);
                setProducts(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filters]);

    const handleFilterChange = (name: string, value: string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            brand: '',
            minPrice: '',
            maxPrice: '',
            search: ''
        });
    };

    return (
        <div className="min-h-screen bg-background text-white pt-24 pb-20">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <div className="flex items-center gap-2 text-primary mb-4 font-bold tracking-[0.3em] uppercase text-xs">
                            <span className="h-px w-8 bg-primary" /> Distribuidor Oficial Colombia
                        </div>
                        <h1 className="text-6xl md:text-8xl font-display italic uppercase leading-[0.85] tracking-tighter">
                            Nuestro <span className="text-primary font-black">Arsenal</span>
                        </h1>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setShowMobileFilters(true)}
                        className="md:hidden flex items-center gap-4 bg-primary text-black px-8 py-4 rounded-2xl font-display font-bold uppercase tracking-widest text-xs active:scale-95 transition-all"
                    >
                        <Filter size={18} /> Filtrar
                    </button>
                </div>

                <div className="flex gap-16">
                    {/* PC Sidebar */}
                    <aside className="hidden md:block w-72 shrink-0 sticky top-32 h-fit">
                        <FilterSidebar
                            categories={categories}
                            brands={brands}
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={clearFilters}
                        />
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {loading ? (
                                Array(6).fill(0).map((_, i) => (
                                    <div key={i} className="h-[550px] bg-white/5 rounded-[40px] animate-pulse border border-white/5" />
                                ))
                            ) : products.length > 0 ? (
                                products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <div className="col-span-full py-32 text-center border-2 border-dashed border-white/5 rounded-[40px]">
                                    <X size={48} className="mx-auto text-gray-600 mb-6" />
                                    <h3 className="text-3xl font-display uppercase italic text-gray-500 mb-2">Sin Resultados</h3>
                                    <p className="text-gray-600">No encontramos productos con los filtros seleccionados.</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
                {showMobileFilters && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMobileFilters(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full max-w-sm bg-background border-l border-white/10 z-[101] p-10 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <h2 className="text-3xl font-display uppercase italic italic">Filtros</h2>
                                <button onClick={() => setShowMobileFilters(false)} className="text-white">
                                    <X size={24} />
                                </button>
                            </div>
                            <FilterSidebar
                                categories={categories}
                                brands={brands}
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onClearFilters={clearFilters}
                            />
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="w-full bg-primary text-black py-5 mt-10 rounded-2xl font-display font-bold uppercase tracking-[0.2em] italic"
                            >
                                Aplicar Filtros
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
