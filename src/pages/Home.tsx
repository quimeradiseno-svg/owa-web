import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import RaceCategories from '../components/RaceCategories';
import OwaEcosystem from '../components/OwaEcosystem';
import RaceCalendar from '../components/RaceCalendar';
import DashboardPreview from '../components/DashboardPreview';

export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash]);

  return (
    <>
      <Hero />
      <RaceCategories />
      <OwaEcosystem />
      <RaceCalendar />
      <DashboardPreview />
    </>
  );
}
