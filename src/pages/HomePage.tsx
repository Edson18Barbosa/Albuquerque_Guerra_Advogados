import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { PracticeAreas } from '../components/PracticeAreas';
import { ValuesTriad } from '../components/ValuesTriad';
import { MissionVision } from '../components/MissionVision';
import { Workflow } from '../components/Workflow';
import { Team } from '../components/Team';
import { EventsSection } from '../components/EventsSection';
import { Gallery } from '../components/Gallery';
import { FinalCTA } from '../components/FinalCTA';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#101616] text-[#F6F3EC] flex flex-col selection:bg-[#D8CBB3] selection:text-[#101616]">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <About />
        <PracticeAreas />
        <ValuesTriad />
        <MissionVision />
        <Workflow />
        <Team />
        <EventsSection />
        <Gallery />
        <FinalCTA />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};
