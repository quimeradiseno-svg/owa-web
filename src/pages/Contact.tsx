import { motion } from 'framer-motion';
import { Mail, Instagram, Linkedin, Send } from 'lucide-react';

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

export default function Contact() {
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

      {/* Contacto */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="glassmorphism rounded-3xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display font-black text-3xl md:text-5xl text-white mb-6 uppercase tracking-wider">
                Ponte en <span className="text-owa-sky">Contacto</span>
              </h2>
              <p className="text-gray-300 font-sans mb-8 leading-relaxed">
                ¿Tienes alguna duda sobre nuestras carreras o quieres ser parte de la experiencia OWA? Escríbenos y te responderemos a la brevedad.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-owa-sky/10 flex items-center justify-center text-owa-sky">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-sans">Email</p>
                    <p className="text-white font-medium">info@openwaterargentina.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-owa-sky/10 flex items-center justify-center text-owa-sky">
                    <Instagram size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-sans">Instagram</p>
                    <p className="text-white font-medium">@openwaterargentina</p>
                  </div>
                </div>
              </div>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300 font-sans">Nombre Completo</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-owa-sky focus:ring-1 focus:ring-owa-sky transition-all"
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300 font-sans">Email</label>
                  <input 
                    type="email" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-owa-sky focus:ring-1 focus:ring-owa-sky transition-all"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300 font-sans">Asunto</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-owa-sky focus:ring-1 focus:ring-owa-sky transition-all"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300 font-sans">Mensaje</label>
                <textarea 
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-owa-sky focus:ring-1 focus:ring-owa-sky transition-all resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(91, 197, 242, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-owa-sky text-owa-deep font-display font-bold text-sm tracking-wider uppercase rounded-xl hover:bg-[#4ab4e1] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={18} />
                Enviar Mensaje
              </motion.button>
            </form>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
