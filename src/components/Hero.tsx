import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronDown, Award } from 'lucide-react';

export default function Hero() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation variables
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  const line1 = "EL AGUA NOS UNE";
  const line2 = "DESAFÍA TU NATURALEZA";

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, damping: 12, stiffness: 200 }
    }
  };


  return (
    <div id="nosotros" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Media: Image for mobile, Video for desktop */}
      {isMobile ? (
        <img
          src="https://images.unsplash.com/photo-1519315901367-f34f815b6719?q=80&w=1200&auto=format&fit=crop"
          alt="Nadadores en aguas abiertas"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-transform duration-10000 hover:scale-105"
        />
      ) : (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-transform duration-10000 hover:scale-105"
          src="https://vjs.zencdn.net/v/oceans.mp4"
        />
      )}

      
      {/* Dynamic Overlay with Gradient to simulate deep water */}
      <div className="absolute inset-0 bg-gradient-to-b from-owa-deep/90 via-owa-blue/50 to-owa-deep" />

      {/* Decorative Wave-like lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-owa-sky/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-owa-blue/20 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-owa-sky/30 bg-owa-blue/30 backdrop-blur-md mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-owa-sky animate-ping" />
            <span className="font-sans text-xs font-semibold tracking-widest text-owa-sky uppercase">Inscripciones Abiertas Temporada 26/27</span>
          </motion.div>

          {/* Letter by Letter Title */}
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-8xl tracking-tighter text-white uppercase select-none leading-[0.9] mb-4">
            <span className="block mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400">
              {line1.split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="inline-block"
                  style={{ marginRight: char === " " ? "15px" : "2px" }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-owa-sky via-[#7ad3fb] to-owa-blue drop-shadow-md">
              {line2.split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="inline-block"
                  style={{ marginRight: char === " " ? "15px" : "2px" }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-gray-300 font-sans font-normal text-base sm:text-xl leading-relaxed tracking-wide mb-10 text-center"
          >
            El circuito de natación en aguas abiertas más desafiante y prestigioso de Argentina. Aguas bravas, lagos glaciares y ríos indómitos te esperan.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md sm:max-w-none"
          >
            <a href="#calendar" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 bg-owa-sky hover:bg-[#4ab4e1] text-owa-deep font-display font-black text-sm tracking-widest uppercase rounded-xl transition-all duration-300 shadow-xl shadow-owa-sky/20 flex items-center justify-center gap-3 cursor-pointer"
              >
                <Calendar size={18} />
                Calendario 26/27
              </motion.button>
            </a>
            <a href="#categories" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, translateY: -2, backgroundColor: 'rgba(255,255,255,0.05)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 border-2 border-white/20 hover:border-owa-sky/50 text-white font-display font-black text-sm tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
              >
                <Award size={18} />
                Ver Categorías
              </motion.button>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
        <span className="font-sans text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2 select-none">Deslizar para explorar</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-owa-sky cursor-pointer"
        >
          <a href="#categories">
            <ChevronDown size={28} />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
