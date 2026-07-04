import { motion } from 'framer-motion';
import { MapPin, Calendar, Flame } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

interface RaceCardProps {
  title: string;
  tagline: string;
  date: string;
  location: string;
  image: string;
  badge: string;
}

function RaceCard({ title, tagline, date, location, image, badge }: RaceCardProps) {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "200px" }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -8 }}
      className="relative group h-[400px] rounded-3xl overflow-hidden glassmorphism flex flex-col justify-end p-8 border transition-all duration-500 shadow-2xl hover:border-owa-sky/40 border-white/5 shadow-owa-sky/5 hover:shadow-owa-sky/15"
    >
      {/* Background Image with Zoom */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-[0.4] group-hover:brightness-[0.45]"
        style={{ backgroundImage: `url('${image}')` }}
      />
      
      {/* Dynamic Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-owa-deep via-owa-deep/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-tr from-owa-sky/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Top Header */}
        <div className="flex justify-between items-start">
          <div className="px-3.5 py-1.5 rounded-full border text-[10px] font-display font-black tracking-widest uppercase bg-owa-sky/10 text-owa-sky border-owa-sky/20">
            {badge}
          </div>
          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-300 text-owa-sky">
            <Flame size={20} />
          </div>
        </div>

        {/* Bottom text info */}
        <div className="mt-auto">
          <span className="text-[10px] font-sans font-bold tracking-widest uppercase mb-2 block text-owa-sky">
            {tagline}
          </span>
          <h3 className="font-display font-black text-2xl tracking-tight text-white uppercase mb-3">
            {title}
          </h3>
          
          <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-gray-300 font-sans text-sm">
              <Calendar size={14} className="text-owa-sky" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 font-sans text-sm">
              <MapPin size={14} className="text-owa-sky" />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Circuito() {
  const races = [
    {
      title: "Cruce del Lago Nahuel Huapi",
      tagline: "Circuito LBC",
      date: "13/12/2026",
      location: "San Carlos de Bariloche, Río Negro",
      badge: "Abierta",
      image: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Vuelta de Obligado Histórica",
      tagline: "Circuito VOB",
      date: "20/12/2026",
      location: "San Pedro, Buenos Aires",
      badge: "Abierta",
      image: "https://images.unsplash.com/photo-1508215885820-4585e56135c8?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "San Pedro Sprint",
      tagline: "Circuito SPD",
      date: "21/12/2026",
      location: "San Pedro, Buenos Aires",
      badge: "Abierta",
      image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Cruce Río Paraná",
      tagline: "Circuito PNR",
      date: "17/01/2027",
      location: "Paraná, Entre Ríos",
      badge: "Próximamente",
      image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <span className="text-xs font-sans font-bold tracking-widest text-owa-sky uppercase bg-owa-sky/10 border border-owa-sky/20 px-3 py-1 rounded-full mb-4 inline-block">
          Etapas Regulares
        </span>
        <h1 className="font-display font-black text-4xl md:text-6xl text-white uppercase tracking-wider mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-owa-sky to-white">CIRCUITO</span> OWA
        </h1>
        <p className="text-gray-300 font-sans text-lg max-w-2xl mx-auto leading-relaxed">
          La esencia de las aguas abiertas. Carreras dinámicas en lagunas y ríos calmos, diseñadas para nadadores que buscan superarse o dar sus primeros pasos.
        </p>
      </motion.section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {races.map((race, idx) => (
          <RaceCard key={idx} {...race} />
        ))}
      </div>
    </div>
  );
}
