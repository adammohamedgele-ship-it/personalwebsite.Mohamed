import React, { useState, useEffect } from 'react';
import { Moon, Sun, Globe, Download, Menu, X, Pencil, Check, Zap, Palette, Lock, Shield, LogOut } from 'lucide-react';
import { Language } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenResume: () => void;
  onOpenDesignCustomizer?: () => void;
  onOpenAdminLogin?: () => void;
  onOpenAdminDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  darkMode,
  onToggleDarkMode,
  onOpenResume,
  onOpenDesignCustomizer,
  onOpenAdminLogin,
  onOpenAdminDashboard,
}) => {
  const { isEditMode, toggleEditMode, data, currentScheme, isAdminLoggedIn, logoutAdmin } = usePortfolio();
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'certs', 'projects', 'education', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', id: 'home', label: 'Home' },
    { href: '#about', id: 'about', label: 'About' },
    { href: '#skills', id: 'skills', label: 'Skills' },
    { href: '#certs', id: 'certs', label: 'Certs' },
    { href: '#projects', id: 'projects', label: 'Projects' },
    { href: '#education', id: 'education', label: 'Education' },
    { href: '#contact', id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#080711]/85 backdrop-blur-md border-b border-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Avatar Initials Badge + Name (Matching Screenshot 2) */}
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 via-pink-600 to-rose-500 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-purple-500/30">
            MA
          </div>
          <span className="font-bold text-sm sm:text-base text-white tracking-tight group-hover:text-pink-400 transition-colors">
            {data.personalInfo.fullName}
          </span>
        </a>

        {/* Center: Nav links in pill container */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#121124]/90 p-1 rounded-full border border-purple-900/30">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-900/60 text-purple-200 border border-purple-500/40 shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* OWNER AUTHENTICATED: Show Admin Studio & Live-Edit Toggle */}
          {isAdminLoggedIn ? (
            <>
              {onOpenAdminDashboard && (
                <button
                  onClick={onOpenAdminDashboard}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-pink-600 hover:bg-pink-500 text-white shadow-md shadow-pink-500/25 transition-all"
                  title="Admin Dashboard öffnen"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin Studio</span>
                </button>
              )}

              <button
                onClick={toggleEditMode}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  isEditMode
                    ? 'bg-[#1a1733] border-pink-500 text-pink-300'
                    : 'border-purple-900/40 bg-[#121124] text-neutral-300 hover:text-white'
                }`}
                title="Inhalte direkt anpassen"
              >
                {isEditMode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Pencil className="w-3.5 h-3.5 text-pink-400" />}
                <span className="hidden md:inline">
                  {isEditMode ? 'Live-Edit an' : 'Live-Edit'}
                </span>
              </button>

              <button
                onClick={logoutAdmin}
                className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition-colors"
                title="Abmelden"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            /* PUBLIC VISITOR: Discreet Owner Sign In Button */
            onOpenAdminLogin && (
              <button
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-purple-900/30 bg-[#121124]/60 text-neutral-400 hover:text-white hover:border-purple-700 transition-colors"
                title="Inhaber-Login für Mohamed Mohamed Adam"
              >
                <Lock className="w-3 h-3 text-purple-400" />
                <span className="hidden sm:inline">Inhaber</span>
              </button>
            )
          )}

          {/* Design & Layout Customizer Trigger */}
          {onOpenDesignCustomizer && (
            <button
              onClick={onOpenDesignCustomizer}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-purple-900/40 bg-[#121124] text-neutral-300 hover:text-white hover:border-pink-500/50 transition-all"
              title={language === 'de' ? 'Design & Layout Vorschau' : 'Customize Design & Layout'}
            >
              <Palette className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden sm:inline">Design</span>
            </button>
          )}

          {/* Language Switcher Pill (EN | DE) */}
          <div className="flex items-center bg-[#121124] border border-purple-900/30 rounded-full p-0.5 text-xs font-semibold">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded-full transition-colors ${
                language === 'en'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('de')}
              className={`px-2 py-0.5 rounded-full transition-colors ${
                language === 'de'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              DE
            </button>
          </div>

          {/* Theme Indicator / Toggle (Moon, Zap, Sun pill) */}
          <button
            onClick={onToggleDarkMode}
            className="flex items-center gap-1 bg-[#121124] border border-purple-900/30 rounded-full px-2 py-1 text-neutral-400 hover:text-white transition-colors"
            title="Dark mode is on"
          >
            <Moon className="w-3.5 h-3.5 text-purple-400" />
            <Zap className="w-3 h-3 text-neutral-600" />
            <Sun className="w-3.5 h-3.5 text-neutral-600" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 text-neutral-300 hover:text-white rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-purple-900/30 bg-[#0d0c1d]/98 backdrop-blur-xl px-4 pt-3 pb-6 shadow-2xl">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === link.id
                    ? 'bg-purple-900/50 text-white border border-purple-500/30'
                    : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 mt-2 border-t border-neutral-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl"
              >
                <Download className="w-4 h-4" />
                <span>Download CV (DE/EN)</span>
              </button>

              {isAdminLoggedIn ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdminDashboard?.();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-pink-600 rounded-xl"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Studio</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdminLogin?.();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-neutral-300 bg-neutral-800 rounded-xl"
                >
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Inhaber-Login (Admin)</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
