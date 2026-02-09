import { ArrowLeft, Shield, Scale, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Legal = () => {
    return (
        <div className="min-h-screen bg-background pt-20 pb-32">
            <div className="container mx-auto px-6 max-w-4xl">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-16 uppercase text-[10px] font-bold tracking-[0.2em]">
                    <ArrowLeft size={14} /> Volver al Inicio
                </Link>

                <h1 className="text-6xl md:text-8xl font-display italic uppercase mb-20 tracking-tighter">Políticas <span className="text-primary">Legales</span></h1>

                <div className="space-y-24">
                    {/* Habeas Data */}
                    <section id="habeas-data">
                        <div className="flex items-center gap-4 mb-8">
                            <Shield className="text-primary" size={32} />
                            <h2 className="text-3xl font-display uppercase italic tracking-tight">Habeas <span className="text-primary">Data</span></h2>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-[40px] p-10 space-y-6 text-gray-400 text-sm leading-relaxed font-medium">
                            <p>En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013, <strong>Apex Labs Colombia</strong> informa que los datos personales recolectados a través de nuestro portal serán tratados de manera segura y confidencial.</p>
                            <p>Tus datos serán utilizados exclusivamente para:</p>
                            <ul className="list-disc pl-5 space-y-2 text-white">
                                <li>Procesamiento y envío de pedidos nacionales.</li>
                                <li>Comunicación sobre el estado de tu arsenal.</li>
                                <li>Envío de ofertas exclusivas y lanzamientos de nuevas fórmulas (siempre que lo autorices).</li>
                            </ul>
                            <p>Como titular de los datos, tienes derecho a conocer, actualizar y rectificar tu información en cualquier momento a través de nuestro correo oficial o el botón de WhatsApp.</p>
                        </div>
                    </section>

                    {/* Derecho de Retracto */}
                    <section id="retracto">
                        <div className="flex items-center gap-4 mb-8">
                            <Scale className="text-primary" size={32} />
                            <h2 className="text-3xl font-display uppercase italic tracking-tight">Derecho de <span className="text-primary">Retracto</span></h2>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-[40px] p-10 space-y-6 text-gray-400 text-sm leading-relaxed font-medium">
                            <p>De acuerdo con el Estatuto del Consumidor (Ley 1480 de 2011), tienes un plazo de <strong>cinco (5) días hábiles</strong> contados a partir de la entrega del producto para ejercer el derecho de retracto.</p>
                            <p className="text-red-400 font-bold uppercase tracking-widest text-[10px]">IMPORTANTE:</p>
                            <p>Para productos de suplementación deportiva, el derecho de retracto solo aplica si:</p>
                            <ul className="list-disc pl-5 space-y-2 text-white">
                                <li>El producto mantiene su sello de seguridad ORIGINAL e INTACTO.</li>
                                <li>No presenta signos de manipulación o apertura.</li>
                                <li>El empaque se encuentra en perfectas condiciones.</li>
                            </ul>
                            <p>Los costos de transporte y demás que conlleve la devolución del bien serán cubiertos por el consumidor.</p>
                        </div>
                    </section>

                    {/* PQRS */}
                    <section id="pqrs">
                        <div className="flex items-center gap-4 mb-8">
                            <HelpCircle className="text-primary" size={32} />
                            <h2 className="text-3xl font-display uppercase italic tracking-tight">Peticiones, Quejas y <span className="text-primary">Reclamos</span></h2>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-[40px] p-10 space-y-8 text-gray-400 text-sm leading-relaxed font-medium">
                            <p>En Apex Labs trabajamos para que tu experiencia sea de élite. Si tienes alguna inconformidad, puedes radicar tu solicitud directamente por nuestros canales oficiales.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-black border border-white/10 rounded-2xl">
                                    <p className="text-[10px] uppercase font-black text-white tracking-widest mb-2 italic">Canal Digital</p>
                                    <p className="text-primary font-bold">soporte@apexlabs.com.co</p>
                                </div>
                                <div className="p-6 bg-black border border-white/10 rounded-2xl text-green-500">
                                    <p className="text-[10px] uppercase font-black text-white tracking-widest mb-2 italic">WhatsApp Directo</p>
                                    <p className="font-bold">+57 322 XXX XXXX</p>
                                </div>
                            </div>
                            <p>Tiempo estimado de respuesta: <strong>24 a 48 horas hábiles</strong>.</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
