import React from 'react';
import { motion } from 'framer-motion';
import { Plane, ShoppingBag, Radio, Users, Compass, ExternalLink } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

interface EcosystemItem {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

export default function OwaEcosystem() {
  const isMobile = useIsMobile();
  const ecosystemItems: EcosystemItem[] = [
    {
      title: "OWA TRAVEL",
      subtitle: "LOGÍSTICA Y TURISMO DEPORTIVO",
      description: "Viajes grupales organizados a las travesías más espectaculares. Traslados, hospedaje y acompañamiento técnico para que solo te preocupes por nadar.",
      icon: <Plane className="w-8 h-8 transition-transform duration-500 group-hover:rotate-6" />,
      link: "#travel"
    },
    {
      title: "OWA STORE",
      subtitle: "EQUIPAMIENTO DE ALTO RENDIMIENTO",
      description: "La tienda oficial con productos exclusivos: gorras de silicona, remeras de secado rápido, camperas impermeables y boyas de seguridad de alta visibilidad.",
      icon: <ShoppingBag className="w-8 h-8 transition-transform duration-500 group-hover:scale-11" />,
      link: "#store"
    },
    {
      title: "OWA PDA",
      subtitle: "CRONOMETRAJE & ASISTENCIA EN VIVO",
      description: "Plataforma de seguimiento y seguridad activa por chip RFID. Visualización de tiempos en vivo para familiares y estadísticas avanzadas para el atleta.",
      icon: <Radio className="w-8 h-8 transition-transform duration-500 group-hover:animate-pulse" />,
      link: "#pda"
    },
    {
      title: "OWA TEAM",
      subtitle: "ENTRENAMIENTO GRUPAL Y COMUNIDAD",
      description: "Nuestra red de clubes de natación de aguas abiertas. Planes de entrenamiento mensuales, clínicas presenciales y comunidad activa de nadadores.",
      icon: <Users className="w-8 h-8 transition-transform duration-500 group-hover:translate-x-1" />,
      link: "#team"
    },
    {
      title: "OWA CAMPS",
      subtitle: "CLÍNICAS DE PERFECCIONAMIENTO",
      description: "Campamentos inmersivos de fin de semana en escenarios naturales. Perfeccionamiento de táctica, técnica de boyado, largadas y orientación.",
      icon: <Compass className="w-8 h-8 transition-transform duration-500 group-hover:spin" />,
      link: "#camps"
    }
  ];

  return (
    <section id="ecosystem" className="py-24 relative overflow-hidden bg-gradient-to-b from-owa-dark to-owa-deep">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(91,197,242,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-sans font-bold tracking-widest text-owa-sky uppercase bg-owa-sky/10 border border-owa-sky/20 px-3 py-1 rounded-full">
              Ecosistema Integrado
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white uppercase mt-4 leading-none">
              MÁS ALLÁ DE <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-owa-sky to-white">LA LÍNEA DE META</span>
            </h2>
          </div>
          <p className="text-gray-400 font-sans text-base sm:text-lg max-w-sm md:text-right">
            Creamos un ecosistema digital y logístico completo para potenciar cada aspecto de tu preparación y vivencia en el agua.
          </p>
        </div>

        {/* Ecosystem Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ecosystemItems.map((item, idx) => {
            // Apply asymmetric spans to give an exciting premium grid vibe
            const isWide = idx === 0 || idx === 3;
            
            return (
              <motion.div
                key={idx}
                initial={isMobile ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "200px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={`group relative rounded-3xl p-8 bg-white/[0.02] border border-white/5 hover:bg-owa-sky hover:border-owa-sky transition-all duration-500 flex flex-col justify-between h-[300px] overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-owa-sky/10 ${
                  isWide ? "lg:col-span-2" : "lg:col-span-1"
                }`}
              >
                {/* Decorative background light water ring */}
                <div className="absolute -right-24 -bottom-24 w-48 h-48 rounded-full border-4 border-white/5 group-hover:border-owa-blue/10 group-hover:scale-125 transition-all duration-700 pointer-events-none" />
                
                {/* Icon & Title Group */}
                <div className="flex justify-between items-start">
                  <div className="text-owa-sky group-hover:text-owa-blue transition-colors duration-500 bg-white/5 p-4 rounded-2xl group-hover:bg-owa-blue/10">
                    {item.icon}
                  </div>
                  <ExternalLink size={18} className="text-gray-600 group-hover:text-owa-blue/60 transition-colors duration-500" />
                </div>

                {/* Subtitle & Title */}
                <div className="mt-6">
                  <span className="text-[10px] font-sans font-bold tracking-widest text-owa-sky group-hover:text-owa-blue/80 transition-colors duration-500 block mb-1">
                    {item.subtitle}
                  </span>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white group-hover:text-owa-deep transition-colors duration-500 uppercase tracking-tight">
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-400 group-hover:text-owa-deep/80 transition-colors duration-500 font-sans text-xs sm:text-sm leading-relaxed mt-3">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
