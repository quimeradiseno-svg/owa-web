import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Contact from './pages/Contact';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-owa-deep text-white min-h-screen selection:bg-owa-sky/30 selection:text-white">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contacto" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
