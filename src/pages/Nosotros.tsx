import { motion } from 'framer-motion';

const Instagram = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

const Linkedin = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect width="4" height="12" x="2" y="9"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const teamMembers = [
  {
    name: 'Nombre Apellido',
    role: 'Director General',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300',
    socials: {
      instagram: '#',
      linkedin: '#',
    }
  },
  {
    name: 'Nombre Apellido',
    role: 'Coordinadora Deportiva',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=300',
    socials: {
      instagram: '#',
      linkedin: '#',
    }
  },
  {
    name: 'Nombre Apellido',
    role: 'Logística y Operaciones',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300',
    socials: {
      instagram: '#',
      linkedin: '#',
    }
  }
];

export default function Nosotros() {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Acerca de OWA */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-24"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-display font-black text-4xl md:text-6xl text-white mb-6 uppercase tracking-wider">
            Acerca de <span className="text-owa-sky">OWA</span>
          </h1>
          <p className="text-lg text-gray-300 font-sans leading-relaxed">
            OWA, es el Circuito más amplio de Natación de Aguas Abiertas del país, destinado a todos los amantes de este deporte que quieran disfrutar con plena seguridad de cada evento y respetando el medio ambiente.
          </p>
          <p className="text-lg text-gray-300 font-sans leading-relaxed mt-4">
            En OWA, nos esforzamos día a día para ofrecerles a nuestros participantes los mejores desafíos, invitándolos a que se vayan superando.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Misión', desc: 'Inspirar a todas las personas, a que, con esfuerzo y sacrificio, será posible superarse.', icon: '🎯' },
            { title: 'Visión', desc: 'Difundir un nuevo concepto de competencias de aguas abiertas, en donde el compañerismo, el cuidado de nuestros atletas y del medio ambiente prime por sobre todo lo demás.', icon: '👁️' },
            { title: 'Espíritu', desc: '"Que nunca nadie te diga que no puedes cumplir tus sueños"', icon: '✨' },
            { title: 'Objetivo', desc: 'Brindarles a nuestros nadadores, eventos profesionales en escenarios únicos, cuidando cada detalle para que cada experiencia resulte inolvidable.', icon: '🏆' },
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glassmorphism p-8 rounded-3xl hover:bg-white/5 transition-colors"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-display font-bold text-2xl text-white mb-4 uppercase tracking-wider">{item.title}</h3>
              <p className="text-gray-300 font-sans">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Quiénes Somos */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-24"
      >
        <div className="text-center mb-16">
          <h2 className="font-display font-black text-3xl md:text-5xl text-white mb-4 uppercase tracking-wider">
            Quiénes <span className="text-owa-sky">Somos</span>
          </h2>
          <p className="text-gray-400 font-sans">El equipo detrás de cada brazada y cada desafío.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative"
            >
              <div className="glassmorphism p-6 rounded-3xl text-center overflow-hidden h-full flex flex-col justify-between">
                <div>
                  <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-owa-sky/30 group-hover:border-owa-sky transition-colors duration-500">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white uppercase tracking-wider">{member.name}</h3>
                  <p className="text-owa-sky font-sans text-sm mb-6">{member.role}</p>
                </div>
                <div className="flex justify-center gap-4 mt-auto">
                  {member.socials.instagram && (
                    <a href={member.socials.instagram} className="text-gray-400 hover:text-white hover:scale-110 transition-all">
                      <Instagram size={20} />
                    </a>
                  )}
                  {member.socials.linkedin && (
                    <a href={member.socials.linkedin} className="text-gray-400 hover:text-white hover:scale-110 transition-all">
                      <Linkedin size={20} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
