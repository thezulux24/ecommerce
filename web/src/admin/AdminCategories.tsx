import React from 'react';
import { Plus, Edit2, Trash2, Folder, ChevronRight } from 'lucide-react';

export const AdminCategories = () => {
    const categories = [
        { id: 1, name: 'Furniture', products: 24, subcategories: 4 },
        { id: 2, name: 'Lighting', products: 12, subcategories: 2 },
        { id: 3, name: 'Living Room', products: 45, subcategories: 6 },
        { id: 4, name: 'Bathroom', products: 8, subcategories: 1 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-display font-bold">Categories</h1>
                <button className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-accent transition-all flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>New Category</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-accent/30 transition-all group">
                        <div className="flex items-start justify-between mb-6">
                            <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-accent/10 transition-colors">
                                <Folder className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
                            </div>
                            <div className="flex space-x-2">
                                <button className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <h3 className="text-xl font-display font-bold mb-2">{cat.name}</h3>
                        <div className="flex items-center space-x-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            <span>{cat.products} Products</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>{cat.subcategories} Subcategories</span>
                        </div>
                        <button className="mt-6 w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl text-xs font-bold hover:bg-accent hover:text-white transition-all group/btn">
                            <span>MANAGE CATEGORY</span>
                            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
