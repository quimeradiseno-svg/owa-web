import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Trophy, Flame } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';


interface CategoryCardProps {
  title: string;
  tagline: string;
  description: string;
  image: string;
  badge: string;
  icon: ReactNode;
  themeColor: string; // sky, blue, gold
  features: string[];
  link?: string;
}


function CategoryCard({ title, tagline, description, image, badge, icon, themeColor, features, link }: CategoryCardProps) {
  const isMobile = useIsMobile();
  // Styles based on themeColor
  const themeStyles = {
    sky: {
      border: 'hover:border-owa-sky/40 border-white/5',
      badgeBg: 'bg-owa-sky/10 text-owa-sky border-owa-sky/20',
      accentText: 'text-owa-sky',
      glow: 'shadow-owa-sky/5 hover:shadow-owa-sky/15',
    },
    blue: {
      border: 'hover:border-owa-blue/60 border-white/5',
      badgeBg: 'bg-owa-blue/20 text-white border-owa-blue/40',
      accentText: 'text-owa-sky',
      glow: 'shadow-owa-blue/5 hover:shadow-owa-blue/15',
    },
    gold: {
      border: 'hover:border-owa-gold/40 border-white/5',
      badgeBg: 'bg-owa-gold/10 text-owa-gold border-owa-gold/20',
      accentText: 'text-owa-gold',
      glow: 'shadow-owa-gold/5 hover:shadow-owa-gold/15',
    }
  }[themeColor as 'sky' | 'blue' | 'gold'];

  const Card = (
    <motion.div
      initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "200px" }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -8 }}
      className={`relative group h-[520px] rounded-3xl overflow-hidden glassmorphism flex flex-col justify-end p-8 border transition-all duration-500 shadow-2xl ${themeStyles.border} ${themeStyles.glow}`}
    >
      {/* Background Image with Zoom */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-[0.4] group-hover:brightness-[0.45]"
        style={{ backgroundImage: `url('${image}')` }}
      />
      
      {/* Dynamic Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-owa-deep via-owa-deep/70 to-transparent" />
      {themeColor === 'gold' && (
        <div className="absolute inset-0 bg-gradient-to-tr from-owa-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
      {themeColor === 'sky' && (
        <div className="absolute inset-0 bg-gradient-to-tr from-owa-sky/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Top Header */}
        <div className="flex justify-between items-start">
          <div className={`px-3.5 py-1.5 rounded-full border text-[10px] font-display font-black tracking-widest uppercase ${themeStyles.badgeBg}`}>
            {badge}
          </div>
          <div className={`p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-300 ${themeStyles.accentText}`}>
            {icon}
          </div>
        </div>

        {/* Bottom text info */}
        <div className="mt-auto">
          <span className={`text-[10px] font-sans font-bold tracking-widest uppercase mb-1 block ${themeStyles.accentText}`}>
            {tagline}
          </span>
          <h3 className="font-display font-black text-3xl tracking-tight text-white uppercase mb-3">
            {title}
          </h3>
          <p className="text-gray-300 font-sans font-normal text-sm leading-relaxed mb-6">
            {description}
          </p>
          
          {/* Features bullet list */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
            {features.map((feat, idx) => (
              <span key={idx} className="text-[10px] font-sans font-medium text-gray-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                {feat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return link ? <Link to={link} className="block">{Card}</Link> : Card;
}

export default function RaceCategories() {
  const isMobile = useIsMobile();
  const categories = [
    {
      title: "Circuito OWA",
      tagline: "Dinámico y Accesible",
      badge: "Etapas Regulares",
      description: "La esencia de las aguas abiertas. Carreras dinámicas en lagunas y ríos calmos, diseñadas para nadadores que buscan superarse o dar sus primeros pasos en esta disciplina.",
      image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=800&auto=format&fit=crop",
      icon: <Flame size={20} />,
      themeColor: "sky",
      features: ["1.5K / 3K / 4K", "Aguas Tranquilas", "Apto Principiantes", "Premiación General"],
      link: "/circuito"
    },
    {
      title: "Grand Prix",
      tagline: "Élite y Competitivo",
      badge: "Alto Rendimiento",
      description: "El máximo nivel de competencia nacional. Un formato diseñado para nadadores de élite y master competitivos que buscan liderar el ranking y consagrarse campeones.",
      image: "https://images.unsplash.com/photo-1508215885820-4585e56135c8?q=80&w=800&auto=format&fit=crop",
      icon: <Trophy size={20} />,
      themeColor: "blue",
      features: ["5K / 10K Olímpica", "Boyado Técnico", "Puntaje Doble", "Categorías por Edad"],
      link: "/grand-prix"
    },
    {
      title: "OWA Challenge",
      tagline: "Épico, Oscuro e Indómito",
      badge: "Distancia Extrema",
      description: "Desafíos extremos de ultradistancia (SNP70, PAC41, BVT21, RDP40). Cruzar lagos glaciares andinos y bajar ríos caudalosos. Solo para quienes conquistan lo imposible.",
      image: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=800&auto=format&fit=crop",
      icon: <Target size={20} />,
      themeColor: "gold",
      features: ["21K a 70K Ultratravesía", "Clima Extremo", "Seguimiento Satelital", "Finisher Medal Premium"],
      link: "/challenge"
    }
  ];

  return (
    <section id="categories" className="py-24 relative overflow-hidden bg-gradient-to-b from-owa-deep to-owa-dark">
      {/* Decorative Blur Bubble */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-owa-blue/15 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-sans font-bold tracking-widest text-owa-sky uppercase bg-owa-sky/10 border border-owa-sky/20 px-3 py-1 rounded-full"
          >
            Modalidades de Competencia
          </motion.span>
          <motion.h2 
            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white uppercase mt-4 mb-6 leading-none"
          >
            ELIGE TU PRÓXIMO <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-owa-sky to-owa-blue">CAMPO DE BATALLA</span>
          </motion.h2>
          <motion.p 
            initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 font-sans text-base sm:text-lg"
          >
            Dividimos nuestros eventos según su exigencia técnica y física. Encuentra la distancia y el entorno que despierten tu instinto.
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <CategoryCard key={idx} {...cat} />
          ))}
        </div>

      </div>
    </section>
  );
}
