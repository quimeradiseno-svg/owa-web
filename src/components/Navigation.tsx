import { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from '../assets/Logo_web_3.png';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Grand Prix', href: '/#categories' },
    { name: 'Circuito', href: '/#categories' },
    { name: 'Challenge', href: '/#categories' },
    { name: 'Resultados', href: '/#resultados' },
    { name: 'OWA Ecosystem', href: '/#ecosystem' },
    { name: 'Contacto', href: '/contacto' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Navbar Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
        <div className="glassmorphism rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl backdrop-blur-md relative z-50">
          <Link to="/" className="flex items-center group">
            <img 
              src={logo} 
              alt="OWA Logo" 
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>


          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="font-sans font-medium text-sm text-gray-300 hover:text-owa-sky transition-colors duration-300 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-owa-sky after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link to="/#calendar" className="hidden sm:inline-block">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(91, 197, 242, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 bg-owa-sky hover:bg-[#4ab4e1] text-owa-deep font-display font-bold text-sm tracking-wider uppercase rounded-xl transition-all duration-300 shadow-lg shadow-owa-sky/10 flex items-center gap-2 cursor-pointer"
              >
                Próximas Carreras
                <ArrowRight size={16} />
              </motion.button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-3 -mr-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer active:scale-95 flex items-center justify-center min-w-[48px] min-h-[48px]"
              aria-label="Abrir menú"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-[90px] left-4 right-4 z-40"
          >
            <div className="glassmorphism rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="font-sans font-semibold text-base text-gray-200 hover:text-owa-sky transition-colors py-2 border-b border-white/5"
                >
                  {item.name}
                </Link>
              ))}
              <Link 
                to="/#calendar" 
                onClick={() => setIsOpen(false)}
                className="w-full mt-2"
              >
                <button className="w-full py-3 bg-owa-sky text-owa-deep font-display font-bold text-sm tracking-widest uppercase rounded-xl hover:bg-[#4ab4e1] transition-all flex items-center justify-center gap-2">
                  Próximas Carreras
                  <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
