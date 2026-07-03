import Navigation from './components/Navigation';
import Hero from './components/Hero';

import RaceCategories from './components/RaceCategories';
import OwaEcosystem from './components/OwaEcosystem';
import RaceCalendar from './components/RaceCalendar';
import DashboardPreview from './components/DashboardPreview';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-owa-deep text-white min-h-screen selection:bg-owa-sky/30 selection:text-white">
      {/* Sticky Navigation Bar */}
      <Navigation />

      {/* Hero Section */}
      <Hero />

      {/* Categories Cards Section */}
      <RaceCategories />

      {/* OWA Ecosystem Grid */}
      <OwaEcosystem />

      {/* Interactive Race Calendar */}
      <RaceCalendar />

      {/* Results Standing and Social Initiative RSE */}
      <DashboardPreview />

      {/* Footer Details */}
      <Footer />
    </div>
  );
}

export default App;
