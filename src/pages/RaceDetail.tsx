import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, MapPin, Clock, FileText } from 'lucide-react';
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
    <div className="bg-[#0b1021] min-h-screen font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.5]"
          style={{ backgroundImage: `url('${race.image}')` }}
        />
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1021]/60 via-transparent to-[#0b1021]" />
        
        {/* Top left return button */}
        <Link to="/circuito" className="absolute top-28 left-6 md:left-12 flex items-center gap-2 text-white/70 hover:text-white transition-colors z-20">
          <ChevronLeft size={20} />
          <span className="text-sm font-semibold tracking-wider uppercase">Volver</span>
        </Link>

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-white uppercase tracking-tighter mb-4 leading-none">
              {race.title}
            </h1>
            <div className="flex items-center gap-4 text-xl md:text-2xl text-white/90 font-light mb-2">
              <span>{race.subtitleDistances}</span>
            </div>
            
            <div className="flex items-center gap-3 mb-8">
              {/* Fake logo placeholder or arena text */}
              <div className="px-2 py-1 bg-white/10 rounded border border-white/20 text-white font-bold text-sm flex items-center gap-1">
                <div className="w-4 h-4 bg-white mask-hexagon" /> 
                {race.badge}
              </div>
            </div>

            <button className="px-8 py-3 bg-[#4ab4e1] hover:bg-[#399bc5] text-owa-deep font-display font-black text-sm tracking-widest uppercase rounded-full transition-transform hover:scale-105 shadow-xl shadow-owa-sky/20">
              STARTING LIST
            </button>
          </motion.div>
        </div>

        {/* Wave separator at the bottom (CSS clip-path or SVG) */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,130.83,120.22,192,105.46,238.13,94.34,281.9,78.23,321.39,56.44Z" fill="#090e1f"></path>
          </svg>
        </div>
      </section>

      {/* 2. Info Bar (Dark Section) */}
      <section className="bg-[#090e1f] py-12 border-b-2 border-owa-sky/20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          {/* Left: Code Circle */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full border-2 border-owa-sky flex items-center justify-center bg-owa-blue/10 shadow-[0_0_15px_rgba(74,180,225,0.3)]">
              {/* Icon resembling a wave */}
              <svg className="w-10 h-10 text-owa-sky" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h4l3-9 5 18 3-9h5" />
              </svg>
            </div>
            <span className="font-display font-black text-2xl text-white tracking-widest">{race.code}</span>
          </div>

          {/* Center: Date & Location */}
          <div className="flex flex-col items-center">
            <h2 className="font-display font-black text-3xl md:text-4xl text-white mb-2">{race.date}</h2>
            <p className="font-sans text-lg text-gray-300">{race.location}</p>
          </div>

          {/* Right: Logos */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full border-2 border-owa-sky flex items-center justify-center bg-owa-blue/10">
              <svg className="w-10 h-10 text-owa-sky" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <span className="font-display font-black text-sm text-white tracking-widest">OWA CIRCUITO</span>
          </div>
        </div>
      </section>

      {/* 3. Distances Blocks */}
      <div>
        {race.distances.map((dist, idx) => {
          const isDark = idx % 2 !== 0;
          return (
            <section 
              key={dist.id}
              className={`py-16 px-6 ${isDark ? 'bg-[#181d31] text-white' : 'bg-[#f8f9fa] text-owa-deep'}`}
            >
              <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16">
                
                {/* Distance Title block */}
                <div className="w-full md:w-1/3 text-center md:text-left flex flex-col justify-center">
                  <h3 className="font-display font-black text-xl tracking-widest uppercase mb-1">
                    {dist.type}
                  </h3>
                  <div className="font-display font-black text-6xl md:text-8xl leading-none">
                    {dist.distance}
                  </div>
                </div>

                {/* Description text */}
                <div className="w-full md:w-2/3 flex flex-col gap-4 text-sm md:text-base font-medium leading-relaxed">
                  {dist.description.map((paragraph, pIdx) => (
                    <p key={pIdx} className="flex items-start gap-2">
                      <span className="text-owa-sky mt-1 text-xs">◆</span>
                      <span>{paragraph}</span>
                    </p>
                  ))}
                  
                  {dist.hasMap && (
                    <div className="mt-4">
                      <a href="#" className={`font-bold hover:underline ${isDark ? 'text-owa-sky' : 'text-owa-blue'}`}>
                        Ver mapa {dist.distance}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* 4. Cronograma (Light blue) */}
      <section className="bg-[#bce6ec] py-16 text-center border-t-4 border-owa-sky/30">
        <div className="flex flex-col items-center justify-center gap-3">
          <Clock size={40} className="text-[#090e1f]" />
          <h2 className="font-display font-black text-3xl text-[#090e1f] tracking-widest uppercase">CRONOGRAMA</h2>
          <a href={race.scheduleLink} className="text-[#090e1f] font-bold text-sm hover:underline">Ver cronograma</a>
        </div>
      </section>

      {/* 5. Info Turística (Purple/Darker Blue) */}
      <section className="bg-[#3e4370] py-16 text-center text-white relative">
        <div className="max-w-3xl mx-auto px-6 flex flex-col items-center justify-center gap-4">
          <MapPin size={32} className="text-white/80" />
          <h2 className="font-display font-black text-2xl tracking-widest uppercase">INFORMACIÓN TURÍSTICA</h2>
          <p className="font-sans text-sm md:text-base text-white/90">
            {race.tourismInfo || "Descubre los atractivos turísticos, alojamientos y gastronomía que la ciudad tiene para ofrecer a los nadadores y sus familias."}
          </p>
          <a href="#" className="font-bold text-sm hover:underline mt-2">Ver Más</a>
        </div>
      </section>

      {/* 6. Hashtag Banner */}
      <section className="bg-[#060913] py-6 text-center">
        <h3 className="font-display font-bold text-lg text-white">
          Publica en instagram con el <span className="text-owa-sky">{race.hashtag}</span>
        </h3>
      </section>

      {/* 7. Reglamento Button */}
      <section className="bg-[#0b1021] py-12 flex justify-center border-t border-white/5">
        <a 
          href={race.rulesLink}
          className="px-8 py-3 bg-white text-owa-deep font-display font-bold text-sm tracking-widest uppercase rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <FileText size={16} />
          Reglamento
        </a>
      </section>

    </div>
  );
}
