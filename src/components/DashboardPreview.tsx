import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Heart, ChevronRight, Users, Star } from 'lucide-react';


interface AthleteRank {
  rank: number;
  name: string;
  club: string;
  points: number;
  races: number;
}

interface TeamRank {
  rank: number;
  name: string;
  points: number;
  members: number;
}

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<'gp-men' | 'gp-women' | 'teams'>('gp-men');

  const menStandings: AthleteRank[] = [
    { rank: 1, name: "Federico Grabich", club: "Club Universitario", points: 2850, races: 6 },
    { rank: 2, name: "Lucas Cocha", club: "San Francisco Swimmers", points: 2600, races: 6 },
    { rank: 3, name: "Ivo Cassini", club: "CAON MDP", points: 2450, races: 5 },
    { rank: 4, name: "Santiago Arteta", club: "Municipalidad de Córdoba", points: 2100, races: 5 },
  ];

  const womenStandings: AthleteRank[] = [
    { rank: 1, name: "Cecilia Biagioli", club: "Club Belgrano Córdoba", points: 3000, races: 6 },
    { rank: 2, name: "Pilar Geijo", club: "River Plate Swim", points: 2750, races: 6 },
    { rank: 3, name: "Julia Sebastian", club: "Regatas de Santa Fe", points: 2300, races: 5 },
    { rank: 4, name: "Candela Giordanino", club: "Club Gimnasia y Esgrima", points: 2150, races: 5 },
  ];

  const teamStandings: TeamRank[] = [
    { rank: 1, name: "CAON MDP (Mar del Plata)", points: 8400, members: 42 },
    { rank: 2, name: "Club Belgrano Córdoba", points: 7950, members: 38 },
    { rank: 3, name: "River Plate Swim Team", points: 6800, members: 31 },
    { rank: 4, name: "San Francisco Swimmers", points: 5900, members: 24 },
  ];

  return (
    <section id="resultados" className="py-24 relative overflow-hidden bg-gradient-to-b from-owa-deep to-owa-dark">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-owa-blue/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-pink-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="mb-16 max-w-3xl">
          <span className="text-xs font-sans font-bold tracking-widest text-owa-sky uppercase bg-owa-sky/10 border border-owa-sky/20 px-3 py-1 rounded-full">
            Resultados & RSE
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white uppercase mt-4 mb-4 leading-none">
            MÉTRICAS DE ÉLITE <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-owa-sky to-white">Y ACCIÓN SOCIAL</span>
          </h2>
          <p className="text-gray-400 font-sans text-base">
            Sigue la tabla de posiciones en tiempo real y conoce cómo nadamos juntos por una causa que nos une a todos.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Column 1: Live Results Dashboard (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between glassmorphism rounded-3xl p-6 sm:p-8 border border-white/5 shadow-2xl relative">
            <div>
              {/* Dashboard Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-owa-sky/10 text-owa-sky border border-owa-sky/15">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight">Ranking GP 26/27</h3>
                    <p className="text-[11px] font-sans text-gray-400">Actualizado hace unos instantes</p>
                  </div>
                </div>
                
                {/* Micro Live Indicator */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[9px] font-sans font-bold tracking-widest text-emerald-400 uppercase">Live</span>
                </div>
              </div>

              {/* Dashboard Sub-Tabs */}
              <div className="flex gap-2 mb-6 bg-white/[0.03] p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setActiveTab('gp-men')}
                  className={`flex-1 py-2 rounded-lg font-display font-bold text-[10px] sm:text-xs tracking-wider uppercase transition-all cursor-pointer ${
                    activeTab === 'gp-men' ? 'bg-owa-sky text-owa-deep' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  GP Masculino
                </button>
                <button
                  onClick={() => setActiveTab('gp-women')}
                  className={`flex-1 py-2 rounded-lg font-display font-bold text-[10px] sm:text-xs tracking-wider uppercase transition-all cursor-pointer ${
                    activeTab === 'gp-women' ? 'bg-owa-sky text-owa-deep' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  GP Femenino
                </button>
                <button
                  onClick={() => setActiveTab('teams')}
                  className={`flex-1 py-2 rounded-lg font-display font-bold text-[10px] sm:text-xs tracking-wider uppercase transition-all cursor-pointer ${
                    activeTab === 'teams' ? 'bg-owa-sky text-owa-deep' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Equipos
                </button>
              </div>

              {/* Standings Table Rendering */}
              <div className="overflow-x-auto">
                <AnimatePresence mode="wait">
                  <motion.table
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="w-full text-left"
                  >
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] font-sans font-bold text-gray-500 uppercase tracking-widest">
                        <th className="pb-3 w-12 text-center">Pos</th>
                        <th className="pb-3">Nombre / Entidad</th>
                        {activeTab !== 'teams' && <th className="pb-3 text-center">Etapas</th>}
                        <th className="pb-3 text-right">Puntaje</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {activeTab === 'gp-men' && menStandings.map((athlete) => (
                        <tr key={athlete.rank} className="group/row hover:bg-white/[0.01]">
                          <td className="py-4 text-center font-display font-black text-sm text-gray-400 group-hover/row:text-owa-sky">
                            #{athlete.rank}
                          </td>
                          <td className="py-4">
                            <div className="font-display font-extrabold text-sm text-white">{athlete.name}</div>
                            <div className="font-sans text-[10px] text-gray-400 mt-0.5">{athlete.club}</div>
                          </td>
                          <td className="py-4 text-center font-sans text-xs text-gray-300">
                            {athlete.races}
                          </td>
                          <td className="py-4 text-right font-display font-black text-sm text-owa-sky">
                            {athlete.points} pts
                          </td>
                        </tr>
                      ))}

                      {activeTab === 'gp-women' && womenStandings.map((athlete) => (
                        <tr key={athlete.rank} className="group/row hover:bg-white/[0.01]">
                          <td className="py-4 text-center font-display font-black text-sm text-gray-400 group-hover/row:text-owa-sky">
                            #{athlete.rank}
                          </td>
                          <td className="py-4">
                            <div className="font-display font-extrabold text-sm text-white">{athlete.name}</div>
                            <div className="font-sans text-[10px] text-gray-400 mt-0.5">{athlete.club}</div>
                          </td>
                          <td className="py-4 text-center font-sans text-xs text-gray-300">
                            {athlete.races}
                          </td>
                          <td className="py-4 text-right font-display font-black text-sm text-owa-sky">
                            {athlete.points} pts
                          </td>
                        </tr>
                      ))}

                      {activeTab === 'teams' && teamStandings.map((team) => (
                        <tr key={team.rank} className="group/row hover:bg-white/[0.01]">
                          <td className="py-4 text-center font-display font-black text-sm text-gray-400 group-hover/row:text-owa-sky">
                            #{team.rank}
                          </td>
                          <td className="py-4">
                            <div className="font-display font-extrabold text-sm text-white">{team.name}</div>
                            <div className="font-sans text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                              <Users size={10} />
                              <span>{team.members} atletas inscriptos</span>
                            </div>
                          </td>
                          <td className="py-4 text-right font-display font-black text-sm text-owa-sky">
                            {team.points} pts
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </motion.table>
                </AnimatePresence>
              </div>
            </div>

            {/* Dashboard Footer Action */}
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="font-sans text-xs text-gray-400">¿Quieres ver el desglose completo del ranking?</span>
              <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-display font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer">
                Ver Resultados Completos
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Column 2: RSE Travesía Rosa (5 Cols) */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-end p-8 border border-pink-500/10 min-h-[450px]">
            {/* Background Image of sunset open water */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] hover:scale-105 filter brightness-[0.3]"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=800&auto=format&fit=crop')` }}
            />
            {/* Pink / Violet deep Ocean Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-owa-deep via-owa-deep/90 to-pink-900/15" />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col h-full justify-between">
              
              {/* Pink Ribbon Icon Header */}
              <div className="flex justify-between items-start">
                <div className="px-3.5 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400 text-[10px] font-display font-black tracking-widest uppercase">
                  Compromiso Social
                </div>
                <div className="p-3.5 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                  <Heart size={20} className="fill-pink-500/30 animate-pulse" />
                </div>
              </div>

              {/* RSE Details */}
              <div className="mt-auto pt-16">
                <span className="text-[10px] font-sans font-bold tracking-widest text-pink-400 uppercase block mb-1">
                  Iniciativa de Solidaridad
                </span>
                <h3 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight mb-4 leading-none">
                  TRAVESÍA ROSA
                </h3>
                <p className="text-gray-300 font-sans text-sm leading-relaxed mb-6">
                  Nadar por la vida. Bajo este lema, OWA impulsa cruces colectivos y solidarios de natación para concientizar sobre la detección temprana del cáncer de mama. Cada brazada apoya el financiamiento de mamografías gratuitas y el soporte psicológico de pacientes en recuperación.
                </p>

                {/* Travesía Rosa Metric Badge */}
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 mb-6">
                  <div className="p-2 bg-pink-500/20 rounded-xl text-pink-400">
                    <Star size={16} className="fill-pink-400/20" />
                  </div>
                  <div>
                    <div className="font-display font-black text-sm text-white">+$2.4M Recaudados</div>
                    <div className="font-sans text-[10px] text-gray-400">Destinados a Fundaciones Oncológicas en 2024</div>
                  </div>
                </div>

                <button className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white font-display font-black text-xs tracking-widest uppercase rounded-xl transition-all duration-300 shadow-xl shadow-pink-500/10 flex items-center justify-center gap-2 cursor-pointer">
                  Sumarme a Travesía Rosa
                  <Heart size={14} className="fill-white" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
