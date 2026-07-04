import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Target } from 'lucide-react';
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
      className="relative group h-[400px] rounded-3xl overflow-hidden glassmorphism flex flex-col justify-end p-8 border transition-all duration-500 shadow-2xl hover:border-owa-gold/40 border-white/5 shadow-owa-gold/5 hover:shadow-owa-gold/15"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-[0.4] group-hover:brightness-[0.45]"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-owa-deep via-owa-deep/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-tr from-owa-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div className="px-3.5 py-1.5 rounded-full border text-[10px] font-display font-black tracking-widest uppercase bg-owa-gold/10 text-owa-gold border-owa-gold/20">
            {badge}
          </div>
          <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-300 text-owa-gold">
            <Target size={20} />
          </div>
        </div>

        <div className="mt-auto">
          <span className="text-[10px] font-sans font-bold tracking-widest uppercase mb-2 block text-owa-gold">
            {tagline}
          </span>
          <h3 className="font-display font-black text-2xl tracking-tight text-white uppercase mb-3">
            {title}
          </h3>
          
          <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-gray-300 font-sans text-sm">
              <Calendar size={14} className="text-owa-gold" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 font-sans text-sm">
              <MapPin size={14} className="text-owa-gold" />
              <span>{location}</span>
            </div>
            <Link to={`/evento/${id}`} className="mt-3 w-full py-2.5 bg-white/10 hover:bg-owa-gold hover:text-owa-deep text-white text-center font-display font-bold uppercase text-xs tracking-widest rounded-xl transition-all border border-white/10 hover:border-owa-gold">
              Detalles
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Challenge() {
  const races = [
    {
      id: "ch-1",
      title: "Desafío 1 Challenge",
      tagline: "Challenge",
      date: "Por confirmar",
      location: "Por confirmar",
      badge: "Extremo",
      image: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "ch-2",
      title: "Desafío 2 Challenge",
      tagline: "Challenge",
      date: "Por confirmar",
      location: "Por confirmar",
      badge: "Extremo",
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
        <span className="text-xs font-sans font-bold tracking-widest text-owa-gold uppercase bg-owa-gold/10 border border-owa-gold/20 px-3 py-1 rounded-full mb-4 inline-block">
          Distancia Extrema
        </span>
        <h1 className="font-display font-black text-4xl md:text-6xl text-white uppercase tracking-wider mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-owa-gold to-[#fbd38d]">OWA CHALLENGE</span>
        </h1>
        <p className="text-gray-300 font-sans text-lg max-w-2xl mx-auto leading-relaxed">
          Desafíos extremos de ultradistancia. Cruzar lagos glaciares andinos y bajar ríos caudalosos. Solo para quienes conquistan lo imposible.
        </p>
      </motion.section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {races.map((race, idx) => (
          <RaceCard key={idx} {...race} />
        ))}
      </div>
    </div>
  );
}
