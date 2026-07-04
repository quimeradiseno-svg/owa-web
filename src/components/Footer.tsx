import { Mail, Send, ArrowUp } from 'lucide-react';
import logo from '../assets/Logo_web_3.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contacto" className="bg-owa-deep relative overflow-hidden pt-24 pb-12 border-t border-white/5">
      {/* Visual background lights */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-owa-blue/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          
          {/* Brand Col (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <a href="#" className="flex items-center">
              <img src={logo} alt="OWA Logo" className="h-12 w-auto" />
            </a>


            <p className="text-gray-400 font-sans text-sm leading-relaxed max-w-sm">
              Organización líder en eventos y competencias de natación de aguas abiertas en Argentina. Llevamos a los atletas a desafiar la naturaleza de forma segura y épica.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              <a href="https://www.instagram.com/owargentina/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-owa-sky hover:bg-white/10 hover:border-owa-sky/20 transition-all cursor-pointer">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://www.facebook.com/OpenWaterArgentina/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-owa-sky hover:bg-white/10 hover:border-owa-sky/20 transition-all cursor-pointer">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://www.youtube.com/@openwaterargentina7389" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-owa-sky hover:bg-white/10 hover:border-owa-sky/20 transition-all cursor-pointer">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>

          </div>

          {/* Quick Links (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="font-display font-bold text-xs tracking-widest text-white uppercase mb-2">Compite</h4>
            <a href="#calendar" className="text-gray-400 hover:text-owa-sky text-sm transition-colors">Calendario 26/27</a>
            <a href="#categories" className="text-gray-400 hover:text-owa-sky text-sm transition-colors">Categorías</a>
            <a href="#resultados" className="text-gray-400 hover:text-owa-sky text-sm transition-colors">Resultados & Ranking</a>
            <a href="#store" className="text-gray-400 hover:text-owa-sky text-sm transition-colors">OWA Store</a>
          </div>

          {/* Rules & Corporate Links (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="font-display font-bold text-xs tracking-widest text-white uppercase mb-2">Reglamento</h4>
            <a href="#reglamento" className="text-gray-400 hover:text-owa-sky text-sm transition-colors">Reglamento General</a>
            <a href="#seguridad" className="text-gray-400 hover:text-owa-sky text-sm transition-colors">Seguridad Médica</a>
            <a href="#travesia-rosa" className="text-gray-400 hover:text-owa-sky text-sm transition-colors">Travesía Rosa</a>
            <a href="#preguntas" className="text-gray-400 hover:text-owa-sky text-sm transition-colors">FAQs</a>
          </div>

          {/* Newsletter / Contact Form (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h4 className="font-display font-bold text-xs tracking-widest text-white uppercase mb-2">Mantente Desafiante</h4>
            <p className="text-gray-400 font-sans text-xs sm:text-sm">
              Suscríbete al newsletter oficial de OWA para recibir novedades de inscripciones, descuentos y cronogramas.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl font-sans text-sm text-white placeholder-gray-500 focus:outline-none focus:border-owa-sky/40 transition-colors"
                />
              </div>
              <button 
                type="submit"
                className="p-3 bg-owa-sky hover:bg-[#4ab4e1] text-owa-deep rounded-xl transition-all shadow-md shadow-owa-sky/10 flex items-center justify-center cursor-pointer"
              >
                <Send size={16} />
              </button>
            </form>
            {/* Contact details */}
            <div className="flex flex-col gap-2 mt-2">
              <a href="mailto:OpenWaterArgentina@gmail.com" className="flex items-center gap-2 text-gray-400 hover:text-owa-sky text-sm transition-colors">
                <Mail size={14} className="text-owa-sky" />
                <span>OpenWaterArgentina@gmail.com</span>
              </a>
            </div>
          </div>

        </div>

        {/* Big Watermark Typography Banner */}
        <div className="py-12 select-none border-b border-white/5 flex items-center justify-center text-center overflow-hidden">
          <h2 className="font-display font-black text-6xl sm:text-8xl md:text-9xl tracking-tighter text-white/[0.02] bg-clip-text bg-gradient-to-b from-white/[0.03] to-transparent uppercase leading-none w-full">
            EL AGUA NOS UNE
          </h2>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-gray-500 font-sans text-[11px] text-center sm:text-left leading-relaxed">
            &copy; {currentYear} Open Water Argentina (OWA). Todos los derechos reservados.<br />
            Diseñado y desarrollado con estética de alto rendimiento deportivo.
          </div>
          
          {/* Scroll to Top */}
          <button
            onClick={handleScrollTop}
            className="p-3 rounded-full bg-white/5 border border-white/5 text-gray-400 hover:text-owa-sky hover:bg-white/10 hover:border-owa-sky/20 transition-all flex items-center justify-center cursor-pointer shadow-lg"
            title="Volver Arriba"
          >
            <ArrowUp size={16} />
          </button>
        </div>

      </div>
    </footer>
  );
}
