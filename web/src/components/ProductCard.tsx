import { ShoppingCart, Star } from 'lucide-react';
import { formatCOP } from '../utils/formatters';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
    product: any;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    return (
        <div className="group relative bg-[#111] border border-white/5 rounded-[30px] overflow-hidden hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
            <div className="relative aspect-[4/5] overflow-hidden">
                <img
                    src={product.images?.[0]?.url || 'https://via.placeholder.com/400x500?text=Apex+Labs'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-primary text-black text-[8px] font-black px-2 py-1 rounded uppercase tracking-[0.2em] italic shadow-lg">Más Vendido</span>
                    <span className="bg-black/80 backdrop-blur-sm text-white text-[8px] font-bold px-2 py-1 rounded uppercase tracking-[0.2em] border border-white/10 italic shadow-lg">Envío Nacional</span>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center gap-1 text-primary mb-3">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                    <span className="text-gray-500 text-[9px] font-bold ml-1 tracking-widest">(4.9)</span>
                </div>

                <h3 className="text-lg font-display uppercase tracking-tight mb-1 text-white group-hover:text-primary transition-colors italic line-clamp-1">{product.name}</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-5 line-clamp-1">{product.category?.name || 'Suplemento Elite'}</p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-600 line-through font-bold">{formatCOP(product.price * 1.2)}</span>
                        <span className="text-xl font-display text-white italic tracking-tighter">{formatCOP(product.price)}</span>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="bg-white/5 p-3 rounded-full border border-white/10 hover:bg-primary hover:text-black transition-all group/btn active:scale-90 relative z-20"
                    >
                        <ShoppingCart size={18} className="group-hover/btn:scale-110 transition-transform" />
                    </button>
                </div>
            </div>
            <Link to={`/product/${product.slug || product.id}`} className="absolute inset-0 z-10" />
        </div>
    );
};
