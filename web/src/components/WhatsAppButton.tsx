import { MessageCircle } from 'lucide-react';

export const WhatsAppButton = () => {
    const phoneNumber = "573237607583"; // Placeholder para Colombia
    const message = "Hola Apex Labs, quiero más información sobre sus productos.";

    return (
        <a
            href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noreferrer"
            className="fixed bottom-8 right-8 z-[70] bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform active:scale-90 group"
        >
            <MessageCircle size={32} />
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                ¿Necesitas asesoría?
            </span>
        </a>
    );
};
