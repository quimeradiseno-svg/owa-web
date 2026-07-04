import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, MapPin, Clock, FileText, Compass, ExternalLink } from 'lucide-react';
import { racesData } from '../data/racesData';
import { useEffect } from 'react';

export default function RaceDetail() {
  const { id } = useParams<{ id: string }>();
  const race = id ? racesData[id] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!race) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-owa-deep">
        <div className="text-center">
          <h2 className="text-2xl text-white font-display mb-4">Evento no encontrado</h2>
          <Link to="/circuito" className="text-owa-sky hover:underline font-sans">Volver al Circuito</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-owa-deep min-h-screen font-sans relative overflow-hidden pb-24">
      
      {/* Background ambient water glow */}
      <div className="absolute top-1/4 -left-64 w-[800px] h-[800px] bg-owa-sky/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-[800px] h-[800px] bg-owa-blue/10 rounded-full blur-[140px] pointer-events-none" />

      {/* 1. Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear hover:scale-110 filter brightness-[0.4]"
          style={{ backgroundImage: `url('${race.image}')` }}
        />
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-owa-deep/80 via-transparent to-owa-deep" />
        
        {/* Top left return button */}
        <Link to="/circuito" className="absolute top-28 left-6 md:left-12 flex items-center gap-2 text-white/70 hover:text-white transition-colors z-20 group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold tracking-wider uppercase">Volver</span>
        </Link>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="px-4 py-1.5 rounded-full border text-[10px] sm:text-xs font-display font-black tracking-widest uppercase bg-owa-sky/10 text-owa-sky border-owa-sky/20 mb-6">
              {race.badge}
            </div>

            <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-white uppercase tracking-tighter mb-4 leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{race.title}</span>
            </h1>
            
            <div className="flex items-center gap-4 text-xl md:text-2xl text-owa-sky font-light mb-8">
              <span>{race.subtitleDistances}</span>
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-owa-sky hover:bg-[#4ab4e1] text-owa-deep font-display font-black text-sm tracking-widest uppercase rounded-xl transition-colors shadow-xl shadow-owa-sky/20"
            >
              STARTING LIST
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        
        {/* 2. Info Bar (Floating Glass Card) */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glassmorphism rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl mb-16 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4"
        >
          {/* Left: Code */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl border border-owa-sky/30 flex items-center justify-center bg-owa-sky/5 text-owa-sky">
              <Compass size={32} />
            </div>
            <span className="font-display font-black text-xl text-white tracking-widest">{race.code}</span>
          </div>

          {/* Center: Date & Location */}
          <div className="flex flex-col items-center text-center">
            <h2 className="font-display font-black text-3xl md:text-4xl text-white mb-2">{race.date}</h2>
            <div className="flex items-center gap-2 text-owa-sky">
              <MapPin size={18} />
              <p className="font-sans text-lg text-gray-300">{race.location}</p>
            </div>
          </div>

          {/* Right: Logos/Brand */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center bg-white/5 text-white">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <span className="font-display font-black text-xs text-gray-400 tracking-widest">CIRCUITO OWA</span>
          </div>
        </motion.section>

        {/* 3. Distances Blocks */}
        <div className="flex flex-col gap-6 mb-16">
          <h3 className="font-display font-black text-3xl text-white uppercase tracking-widest text-center mb-6">
            Distancias y Recorridos
          </h3>
          
          {race.distances.map((dist, idx) => (
            <motion.div 
              key={dist.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1 }}
              className="glassmorphism rounded-3xl p-8 border border-white/5 hover:border-owa-sky/30 transition-colors flex flex-col md:flex-row items-start gap-8 md:gap-12 group"
            >
              {/* Left Column: Distance */}
              <div className="w-full md:w-1/3 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-8">
                <h4 className="font-display font-bold text-sm tracking-widest uppercase text-owa-sky mb-2">
                  {dist.type}
                </h4>
                <div className="font-display font-black text-6xl md:text-8xl text-white leading-none group-hover:text-owa-sky transition-colors">
                  {dist.distance}
                </div>
              </div>

              {/* Right Column: Text */}
              <div className="w-full md:w-2/3 flex flex-col gap-4 text-sm md:text-base font-sans font-medium leading-relaxed text-gray-300">
                {dist.description.map((paragraph, pIdx) => (
                  <p key={pIdx} className="flex items-start gap-3">
                    <span className="text-owa-sky mt-1.5 text-[10px] shrink-0">◆</span>
                    <span>{paragraph}</span>
                  </p>
                ))}
                
                {dist.hasMap && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <a href="#" className="inline-flex items-center gap-2 text-owa-sky font-bold hover:text-white transition-colors">
                      <ExternalLink size={16} />
                      Ver mapa del recorrido
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 4. Bottom Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          
          {/* Cronograma Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glassmorphism rounded-3xl p-8 border border-white/5 flex flex-col items-center justify-center text-center gap-4 group hover:border-owa-blue/40 transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-owa-blue/10 flex items-center justify-center text-owa-blue group-hover:scale-110 transition-transform">
              <Clock size={32} />
            </div>
            <h4 className="font-display font-black text-2xl text-white tracking-widest uppercase">Cronograma</h4>
            <p className="text-gray-400 text-sm mb-2">Revisa los horarios de acreditación, charlas técnicas y largadas.</p>
            <a href={race.scheduleLink} className="px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/30 text-white text-xs font-bold tracking-widest uppercase transition-colors">
              Ver Cronograma
            </a>
          </motion.div>

          {/* Info Turistica Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glassmorphism rounded-3xl p-8 border border-white/5 flex flex-col items-center justify-center text-center gap-4 group hover:border-owa-sky/40 transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-owa-sky/10 flex items-center justify-center text-owa-sky group-hover:scale-110 transition-transform">
              <MapPin size={32} />
            </div>
            <h4 className="font-display font-black text-2xl text-white tracking-widest uppercase">Info Turística</h4>
            <p className="text-gray-400 text-sm mb-2">
              {race.tourismInfo || "Descubre alojamientos y atractivos locales."}
            </p>
            <a href="#" className="px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/30 text-white text-xs font-bold tracking-widest uppercase transition-colors">
              Ver Más
            </a>
          </motion.div>
        </div>

        {/* 5. Footer Actions */}
        <div className="flex flex-col items-center gap-6">
          <div className="text-center px-8 py-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="font-display font-bold text-lg text-white">
              Sube tus fotos a instagram con <span className="text-owa-sky">{race.hashtag}</span>
            </p>
          </div>
          
          <a 
            href={race.rulesLink}
            className="flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-display font-bold text-sm tracking-widest uppercase rounded-full transition-colors border border-white/20"
          >
            <FileText size={18} />
            Reglamento
          </a>
        </div>

      </div>
    </div>
  );
}
