// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { I18nWrapper } from './components/providers/I18nWrapperNew';
import { LanguageRouter } from './components/routing/LanguageRouter';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Projects } from './components/sections/Projects';
import { Skills } from './components/sections/Skills';
import { Contact } from './components/sections/Contact';

const HomePage: React.FC = () => (
  <div className="min-h-screen">
    <Hero />
    <Projects />
    <Skills />
    <Contact />
  </div>
);

// Language-specific wrapper component
const LanguagePage: React.FC = () => {
  return <HomePage />;
};

function App() {
  return (
    <I18nWrapper>
      <ThemeProvider>
        <Router>
          <div className="App">
            <LanguageRouter />
            <Header />
            <main>
              <Routes>
                {/* Root redirect to default language */}
                <Route path="/" element={<Navigate to="/es" replace />} />
                
                {/* Language-specific routes */}
                <Route path="/es" element={<LanguagePage />} />
                <Route path="/en" element={<LanguagePage />} />
                
                {/* Fallback for any other route */}
                <Route path="*" element={<Navigate to="/es" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </I18nWrapper>
  );
}

export default App;