import React, { useState, useEffect } from 'react';
import { Language, ExperienceItem, Project } from './types';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Certificates } from './components/Certificates';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { EditToolbar } from './components/EditToolbar';
import { DesignCustomizerModal } from './components/DesignCustomizerModal';
import { UploadDocumentModal } from './components/UploadDocumentModal';
import { ImportContentModal } from './components/ImportContentModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { EditExperienceModal } from './components/EditExperienceModal';
import { EditProjectModal } from './components/EditProjectModal';

function MainContent({
  language,
  setLanguage,
  darkMode,
  toggleDarkMode,
  isResumeOpen,
  setIsResumeOpen,
}: {
  language: Language;
  setLanguage: (l: Language) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isResumeOpen: boolean;
  setIsResumeOpen: (open: boolean) => void;
}) {
  const { activeDesign, trackVisit } = usePortfolio();
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [isImportContentModalOpen, setIsImportContentModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Section engagement tracking for private visitor analytics
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    const sections = ['hero', 'about', 'skills', 'projects', 'certificates', 'experience', 'contact'];
    const observedSet = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id && !observedSet.has(id)) {
              observedSet.add(id);
              trackVisit(id);
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    sections.forEach((secId) => {
      const el = document.getElementById(secId);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeDesign.layoutStyle]);

  // Experience and Project modal states triggered from AdminDashboard
  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Layout architecture based on user's active choice
  const renderLayoutContent = () => {
    switch (activeDesign.layoutStyle) {
      case 'showcase-grid':
        // Highlight certificates, credentials, and visual portfolio upfront
        return (
          <>
            <Hero language={language} onOpenResume={() => setIsResumeOpen(true)} />
            <About language={language} />
            <Certificates language={language} />
            <Projects language={language} />
            <Skills language={language} />
            <Experience language={language} />
            <Contact language={language} />
          </>
        );

      case 'executive-linear':
        // Linear career and education timeline first
        return (
          <>
            <Hero language={language} onOpenResume={() => setIsResumeOpen(true)} />
            <About language={language} />
            <Experience language={language} />
            <Skills language={language} />
            <Certificates language={language} />
            <Projects language={language} />
            <Contact language={language} />
          </>
        );

      case 'split-bento':
      default:
        // Balanced split hero, technical skills, projects, and credentials
        return (
          <>
            <Hero language={language} onOpenResume={() => setIsResumeOpen(true)} />
            <About language={language} />
            <Skills language={language} />
            <Projects language={language} />
            <Certificates language={language} />
            <Experience language={language} />
            <Contact language={language} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors duration-200">
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenDesignCustomizer={() => setIsDesignModalOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

      <main className="flex-1">
        {renderLayoutContent()}
      </main>

      <Footer
        language={language}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        language={language}
      />

      <DesignCustomizerModal
        isOpen={isDesignModalOpen}
        onClose={() => setIsDesignModalOpen(false)}
        language={language}
      />

      <UploadDocumentModal
        isOpen={isUploadDocModalOpen}
        onClose={() => setIsUploadDocModalOpen(false)}
        language={language}
      />

      <ImportContentModal
        isOpen={isImportContentModalOpen}
        onClose={() => setIsImportContentModalOpen(false)}
        language={language}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        language={language}
      />

      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        language={language}
        onOpenExperienceModal={(exp) => {
          setEditingExperience(exp || null);
          setIsExperienceModalOpen(true);
        }}
        onOpenProjectModal={(proj) => {
          setEditingProject(proj || null);
          setIsProjectModalOpen(true);
        }}
        onOpenCertUploadModal={() => setIsUploadDocModalOpen(true)}
        onOpenDesignModal={() => setIsDesignModalOpen(true)}
      />

      <EditExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={() => {
          setIsExperienceModalOpen(false);
          setEditingExperience(null);
        }}
        experienceItem={editingExperience}
        language={language}
      />

      <EditProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setEditingProject(null);
        }}
        project={editingProject}
        language={language}
      />

      <EditToolbar
        language={language}
        onOpenDesignCustomizer={() => setIsDesignModalOpen(true)}
        onOpenUploadDocument={() => setIsUploadDocModalOpen(true)}
        onOpenImportContent={() => setIsImportContentModalOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('portfolio_lang');
    return (saved === 'en' || saved === 'de') ? saved : 'de';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('portfolio_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isResumeOpen, setIsResumeOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('portfolio_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('portfolio_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('portfolio_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <PortfolioProvider>
      <MainContent
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        isResumeOpen={isResumeOpen}
        setIsResumeOpen={setIsResumeOpen}
      />
    </PortfolioProvider>
  );
}
