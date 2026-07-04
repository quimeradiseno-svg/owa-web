import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Nosotros from './pages/Nosotros';
import Circuito from './pages/Circuito';
import GrandPrix from './pages/GrandPrix';
import Challenge from './pages/Challenge';
import RaceDetail from './pages/RaceDetail';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="bg-owa-deep text-white min-h-screen selection:bg-owa-sky/30 selection:text-white">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/circuito" element={<Circuito />} />
          <Route path="/grand-prix" element={<GrandPrix />} />
          <Route path="/challenge" element={<Challenge />} />
          <Route path="/evento/:id" element={<RaceDetail />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
