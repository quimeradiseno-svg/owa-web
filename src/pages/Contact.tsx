import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';

const Instagram = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

export default function Contact() {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Contacto */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
                    <a href="https://www.instagram.com/owargentina/" target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:text-owa-sky transition-colors">@owargentina</a>
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
