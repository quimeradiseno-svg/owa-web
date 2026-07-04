import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Trophy } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

interface RaceCardProps {
  title: string;
  tagline: string;
  date: string;
  location: string;
  image: string;
  badge: string;
  id: string;
}

function RaceCard({ title, tagline, date, location, image, badge, id }: RaceCardProps) {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "200px" }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -8 }}
      className="relative group h-[400px] rounded-3xl overflow-hidden glassmorphism flex flex-col justify-end p-8 border transition-all duration-500 shadow-2xl hover:border-owa-blue/40 border-white/5 shadow-owa-blue/5 hover:shadow-owa-blue/15"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-[0.4] group-hover:brightness-[0.45]"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-owa-deep via-owa-deep/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-tr from-owa-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div className="px-3.5 py-1.5 rounded-full border text-[10px] font-display font-black tracking-widest uppercase bg-owa-blue/20 text-white border-owa-blue/40">
            {badge}
          </div>
          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-300 text-owa-sky">
            <Trophy size={20} />
          </div>
        </div>

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
            <Link to={`/evento/${id}`} className="mt-3 w-full py-2.5 bg-white/10 hover:bg-owa-blue hover:text-white text-white text-center font-display font-bold uppercase text-xs tracking-widest rounded-xl transition-all border border-white/10 hover:border-owa-blue">
              Detalles
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function GrandPrix() {
  const races = [
    {
      id: "gp-1",
      title: "Fecha 1 Grand Prix",
      tagline: "Grand Prix",
      date: "Por confirmar",
      location: "Por confirmar",
      badge: "Próximamente",
      image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "gp-2",
      title: "Fecha 2 Grand Prix",
      tagline: "Grand Prix",
      date: "Por confirmar",
      location: "Por confirmar",
      badge: "Próximamente",
      image: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "gp-3",
      title: "Fecha 3 Grand Prix",
      tagline: "Grand Prix",
      date: "Por confirmar",
      location: "Por confirmar",
      badge: "Próximamente",
      image: "https://images.unsplash.com/photo-1508215885820-4585e56135c8?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "gp-4",
      title: "Fecha 4 Grand Prix",
      tagline: "Grand Prix",
      date: "Por confirmar",
      location: "Por confirmar",
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
        <span className="text-xs font-sans font-bold tracking-widest text-white uppercase bg-owa-blue/20 border border-owa-blue/40 px-3 py-1 rounded-full mb-4 inline-block">
          Alto Rendimiento
        </span>
        <h1 className="font-display font-black text-4xl md:text-6xl text-white uppercase tracking-wider mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-owa-blue to-owa-sky">GRAND PRIX</span> OWA
        </h1>
        <p className="text-gray-300 font-sans text-lg max-w-2xl mx-auto leading-relaxed">
          El máximo nivel de competencia nacional. Un formato diseñado para nadadores de élite y master competitivos que buscan liderar el ranking y consagrarse campeones.
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
