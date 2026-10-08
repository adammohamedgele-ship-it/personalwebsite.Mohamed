import React from 'react';
import { ArrowUp, Mail, Phone, MapPin, Lock, Shield } from 'lucide-react';
import { Language } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

interface FooterProps {
  language: Language;
  onOpenResume: () => void;
  onOpenAdminLogin?: () => void;
  onOpenAdminDashboard?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onOpenResume,
  onOpenAdminLogin,
  onOpenAdminDashboard,
}) => {
  const { data, isAdminLoggedIn } = usePortfolio();
  const personalInfo = data.personalInfo;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 text-xs border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="text-sm font-bold text-neutral-900 dark:text-white">
              {personalInfo.fullName}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {language === 'de'
                ? 'Fachinformatik / Systemintegration · Hamburg'
                : 'IT Specialist / System Integration · Hamburg'}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <a href="#about" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              {language === 'de' ? 'Über mich' : 'About'}
            </a>
            <a href="#experience" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              {language === 'de' ? 'Werdegang' : 'Experience'}
            </a>
            <a href="#skills" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              {language === 'de' ? 'Kompetenzen' : 'Skills'}
            </a>
            <a href="#projects" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              {language === 'de' ? 'IT-Projekte' : 'Projects'}
            </a>
            <button
              onClick={onOpenResume}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-medium text-left"
            >
              {language === 'de' ? 'Lebenslauf (CV)' : 'Resume'}
            </button>
            <a href="#contact" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              {language === 'de' ? 'Kontakt' : 'Contact'}
            </a>

            {/* Owner portal trigger */}
            {isAdminLoggedIn ? (
              <button
                onClick={onOpenAdminDashboard}
                className="inline-flex items-center gap-1 text-pink-400 hover:text-pink-300 font-semibold transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Studio</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-300 transition-colors"
                title="Inhaber-Login für Mohamed Mohamed Adam"
              >
                <Lock className="w-3 h-3 text-neutral-500" />
                <span>Inhaber-Login</span>
              </button>
            )}
          </div>

          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 transition-colors shrink-0"
          >
            <span>{language === 'de' ? 'Nach oben' : 'Back to top'}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} {personalInfo.fullName} · Hamburg, Deutschland.
          </div>
          <div className="flex items-center gap-3">
            <span>{personalInfo.email}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{personalInfo.phone}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
