import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, MoreVertical } from 'lucide-react';

export const AdminProducts = () => {
    const [products] = useState([
        { id: 1, name: 'Modern Chair', category: 'Furniture', price: 299, stock: 12, status: 'Active' },
        { id: 2, name: 'Designer Lamp', category: 'Lighting', price: 149, stock: 5, status: 'Low Stock' },
        { id: 3, name: 'Velvet Sofa', category: 'Living Room', price: 899, stock: 0, status: 'Out of Stock' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-display font-bold">Products</h1>
                <button className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-accent transition-all flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-accent" />
                    </div>
                    <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-primary">
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                    </button>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=100" className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <span className="text-sm font-bold">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                                <td className="px-6 py-4 text-sm font-bold">${product.price}</td>
                                <td className="px-6 py-4 text-sm font-bold">{product.stock}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest ${product.status === 'Active' ? 'bg-green-100 text-green-600' :
                                            product.status === 'Low Stock' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-gray-100">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-gray-100">
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
    );
};
