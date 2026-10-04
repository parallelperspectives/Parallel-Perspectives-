/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EditorProvider } from './context/EditorContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { QuoteBanner } from './components/QuoteBanner';
import { FoundersStory } from './components/FoundersStory';
import { FeaturedGrid } from './components/FeaturedGrid';
import { FlipbookSection } from './components/FlipbookSection';
import { Issue02Teaser } from './components/Issue02Teaser';
import { Footer } from './components/Footer';
import { PhotoLightbox } from './components/PhotoLightbox';

export default function App() {
  return (
    <EditorProvider>
      <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white flex flex-col justify-between">
        <Header />
        <main className="flex-1">
          <Hero />
          <QuoteBanner />
          <FoundersStory />
          <FeaturedGrid />
          <FlipbookSection />
          <Issue02Teaser />
        </main>
        <Footer />
        <PhotoLightbox />
      </div>
    </EditorProvider>
  );
}
