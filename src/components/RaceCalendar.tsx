import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, ArrowUpRight } from 'lucide-react';

interface RaceEvent {
  date: string;
  code: string;
  name: string;
  location: string;
  categories: ('Circuito' | 'Grand Prix' | 'Challenge')[];
  status: 'Abierta' | 'Próximamente' | 'Cerrada';
}

export default function RaceCalendar() {
  const [activeFilter, setActiveFilter] = useState<'Todos' | 'Circuito' | 'Grand Prix' | 'Challenge'>('Todos');

  const events: RaceEvent[] = [
    {
      date: "13/12/2026",
      code: "LBC",
      name: "Cruce del Lago Nahuel Huapi",
      location: "San Carlos de Bariloche, Río Negro",
      categories: ["Circuito", "Grand Prix"],
      status: "Abierta"
    },
    {
      date: "20/12/2026",
      code: "VOB",
      name: "Vuelta de Obligado Histórica",
      location: "San Pedro, Buenos Aires",
      categories: ["Circuito", "Grand Prix"],
      status: "Abierta"
    },
    {
      date: "21/12/2026",
      code: "SPD",
      name: "San Pedro Sprint Aguas Abiertas",
      location: "San Pedro, Buenos Aires",
      categories: ["Circuito"],
      status: "Abierta"
    },
    {
      date: "22/12/2026",
      code: "SNP70",
      name: "Challenge San Nicolás - Vuelta de Obligado 70K",
      location: "San Nicolás / San Pedro, Buenos Aires",
      categories: ["Challenge"],
      status: "Abierta"
    },
    {
      date: "17/01/2027",
      code: "PNR",
      name: "Cruce Río Paraná - Desafío Costanera",
      location: "Paraná, Entre Ríos",
      categories: ["Circuito"],
      status: "Próximamente"
    },
    {
      date: "03-13/02/27 & 10-20/03/27",
      code: "RDP40",
      name: "Cruce del Río de la Plata 40K (Edición Histórica)",
      location: "Colonia (ROU) a Punta Lara (ARG)",
      categories: ["Challenge"],
      status: "Próximamente"
    },
    {
      date: "17/02/2027",
      code: "NHL",
      name: "Nahuel Huapi Lake GP (Copa Élite)",
      location: "Villa La Angostura, Neuquén",
      categories: ["Grand Prix"],
      status: "Próximamente"
    },
    {
      date: "21/02/2027",
      code: "VHU",
      name: "Cruce Villa Huapi",
      location: "Lago Nahuel Huapi, Dina Huapi",
      categories: ["Circuito"],
      status: "Próximamente"
    },
    {
      date: "21/03/2027",
      code: "ISC",
      name: "Glaciar Challenge Isla Solitaria",
      location: "Lago Argentino, El Calafate, Santa Cruz",
      categories: ["Grand Prix"],
      status: "Próximamente"
    },
    {
      date: "22/03/2027",
      code: "CLN",
      name: "Cruce de las Colonias",
      location: "Colón, Entre Ríos",
      categories: ["Circuito"],
      status: "Próximamente"
    },
    {
      date: "12/04/2027",
      code: "PAD",
      name: "Puerto Madryn Ocean Extreme",
      location: "Golfo Nuevo, Puerto Madryn, Chubut",
      categories: ["Circuito"],
      status: "Próximamente"
    }
  ];

  // Filtering Logic
  const filteredEvents = events.filter(event => {
    if (activeFilter === 'Todos') return true;
    return event.categories.includes(activeFilter);
  });

  const getCategoryBadgeClass = (category: string) => {
    switch(category) {
      case 'Circuito':
        return 'border-owa-sky/30 bg-owa-sky/10 text-owa-sky';
      case 'Grand Prix':
        return 'border-owa-blue/40 bg-owa-blue/20 text-white';
      case 'Challenge':
        return 'border-owa-gold/30 bg-owa-gold/10 text-owa-gold';
      default:
        return 'border-gray-500/20 bg-gray-500/10 text-gray-400';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'Abierta':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Próximamente':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Cerrada':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <section id="calendar" className="py-24 bg-owa-deep relative overflow-hidden">
      {/* Background ambient water glow */}
      <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-owa-blue/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-sans font-bold tracking-widest text-owa-sky uppercase bg-owa-sky/10 border border-owa-sky/20 px-3 py-1 rounded-full">
            Calendario Oficial 26/27
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white uppercase mt-4 mb-6 leading-none">
            PRÓXIMAS <span className="text-transparent bg-clip-text bg-gradient-to-r from-owa-sky to-white">COMPETENCIAS</span>
          </h2>
          <p className="text-gray-400 font-sans text-base sm:text-lg">
            Elige tu distancia, planifica tu viaje y desafía los espejos de agua más espectaculares del país.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12">
          {(['Todos', 'Circuito', 'Grand Prix', 'Challenge'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-xl font-display font-bold text-xs tracking-wider uppercase transition-all duration-300 border cursor-pointer ${
                activeFilter === filter
                  ? 'bg-owa-sky text-owa-deep border-owa-sky shadow-lg shadow-owa-sky/15'
                  : 'bg-white/5 text-gray-300 border-white/5 hover:border-white/10 hover:bg-white/10'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Calendar Entries */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.code}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="group relative glassmorphism rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-white/5 hover:border-owa-sky/20 transition-all duration-300 hover:shadow-2xl hover:shadow-owa-blue/5"
              >
                {/* Highlight Hover Line */}
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-owa-sky rounded-l-2xl scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />

                {/* Left Block: Date & Code */}
                <div className="flex items-center gap-6">
                  {/* Date Column */}
                  <div className="flex flex-col justify-center min-w-[130px]">
                    <div className="flex items-center gap-2 text-owa-sky mb-1">
                      <Calendar size={14} />
                      <span className="font-sans font-bold text-xs uppercase tracking-wider">Fecha</span>
                    </div>
                    <span className="font-display font-black text-lg text-white">
                      {event.date}
                    </span>
                  </div>

                  {/* Code Badge */}
                  <div className="h-12 w-20 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 font-display font-black text-lg text-white group-hover:bg-owa-sky group-hover:text-owa-deep transition-all duration-300 select-none">
                    {event.code}
                  </div>
                </div>

                {/* Center Block: Name & Location */}
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase group-hover:text-owa-sky transition-colors duration-300">
                    {event.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-gray-400 mt-1.5">
                    <MapPin size={14} className="text-gray-500" />
                    <span className="font-sans text-xs sm:text-sm">{event.location}</span>
                  </div>
                </div>

                {/* Right Block: Badges & CTA */}
                <div className="flex flex-wrap sm:flex-nowrap items-center lg:justify-end gap-4 min-w-[280px]">
                  {/* Category Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {event.categories.map((cat) => (
                      <span
                        key={cat}
                        className={`px-2.5 py-1 rounded-md border text-[9px] font-sans font-semibold tracking-wider uppercase ${getCategoryBadgeClass(cat)}`}
                      >
                        {cat}
                      </span>
                    ))}
                    <span className={`px-2.5 py-1 rounded-md border text-[9px] font-sans font-semibold tracking-wider uppercase ${getStatusBadgeClass(event.status)}`}>
                      {event.status}
                    </span>
                  </div>

                  {/* Inscribirse Button */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-display font-black text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      event.status === 'Abierta'
                        ? 'bg-owa-sky text-owa-deep hover:bg-[#4ab4e1] shadow-lg shadow-owa-sky/10'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5 hover:border-white/10'
                    }`}
                  >
                    {event.status === 'Abierta' ? 'Inscribirse' : 'Detalles'}
                    <ArrowUpRight size={14} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
