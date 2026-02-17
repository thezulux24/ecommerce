import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Mail, Calendar, Shield, MoreVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:3000';

export const AdminCustomers = () => {
    const { token } = useAuth();
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCustomers = async () => {
        try {
            const res = await axios.get(`${API_BASE}/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCustomers(res.data);
        } catch (err) {
            console.error('Error fetching customers:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(customer =>
        (customer.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-black uppercase italic tracking-tighter">Base de <span className="text-primary">Atletas</span></h1>
                    <p className="text-gray-400 text-sm">Gestiona la comunidad de Apex Labs</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por email o nombre..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                            <tr>
                                <th className="px-6 py-4">Atleta</th>
                                <th className="px-6 py-4">Rol</th>
                                <th className="px-6 py-4">Fecha de Registro</th>
                                <th className="px-6 py-4">ID de Usuario</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 italic">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-10 text-center animate-pulse text-gray-400 uppercase font-bold tracking-widest">Escaneando base de datos...</td></tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400 uppercase font-bold tracking-widest">No se encontraron atletas en el laboratorio</td></tr>
                            ) : filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-primary font-bold border border-primary/20 italic">
                                                {customer.firstName?.charAt(0) || '?'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-black uppercase tracking-tight">{customer.firstName || 'Sin Nombre'} {customer.lastName || ''}</span>
                                                <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                                                    <Mail size={10} /> {customer.email}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${customer.role === 'ADMIN'
                                            ? 'bg-primary/10 text-primary border-primary/20'
                                            : 'bg-gray-100 text-gray-400 border-gray-200'
                                            }`}>
                                            <Shield size={10} />
                                            {customer.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                                            <Calendar size={12} className="text-primary" />
                                            {new Date(customer.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[10px] font-mono text-gray-400 font-bold uppercase tracking-tighter">
                                        {customer.id}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-gray-300 hover:text-black transition-colors">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
