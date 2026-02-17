import React, { useState } from 'react';
import axios from 'axios';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ImageUploadProps {
    onUploadComplete: (url: string) => void;
    currentImage?: string;
    label?: string;
}

const API_BASE = 'http://localhost:3000';

export const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadComplete, currentImage, label }) => {
    const { token } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset state
        setError(null);
        setUploading(true);

        // Preview locally
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to server
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post(`${API_BASE}/uploads`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            onUploadComplete(res.data.url);
        } catch (err: any) {
            setError('Error al subir imagen. Intenta de nuevo.');
            setPreview(currentImage || null);
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    const removePreview = () => {
        setPreview(null);
        onUploadComplete('');
    };

    return (
        <div className="space-y-4">
            {label && <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest block">{label}</label>}

            <div className="relative group">
                {preview ? (
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <label className="cursor-pointer bg-white text-black px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                                Cambiar
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </label>
                            <button
                                onClick={removePreview}
                                className="bg-red-600 text-white p-2 rounded-xl hover:scale-110 transition-transform"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {uploading && (
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                <Loader2 className="animate-spin text-primary" size={32} />
                            </div>
                        )}
                        {!uploading && !error && (
                            <div className="absolute top-4 right-4 bg-primary text-black p-1 rounded-full">
                                <CheckCircle size={16} />
                            </div>
                        )}
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full aspect-video rounded-3xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-10 h-10 text-gray-500 mb-4 group-hover:text-primary group-hover:scale-110 transition-all" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">Subir Imagen</p>
                            <p className="text-[8px] text-gray-600 uppercase mt-2">JPG, PNG o WEBP (Máx 5MB)</p>
                        </div>
                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                )}
            </div>

            {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest italic">{error}</p>}
        </div>
    );
};
