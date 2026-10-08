import React, { useState, useRef } from 'react';
import { Download, Mail, MapPin, ArrowRight, Github, Linkedin, ChevronDown, Pencil, Camera, Trash2, Upload, Award } from 'lucide-react';
import { Language } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { EditPersonalInfoModal } from './EditPersonalInfoModal';
import { COLOR_SCHEMES } from '../theme/themeConfig';

interface HeroProps {
  language: Language;
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ language, onOpenResume }) => {
  const { data, isEditMode, uploadAvatar, removeAvatar, activeDesign } = usePortfolio();
  const personalInfo = data.personalInfo;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const currentScheme = COLOR_SCHEMES.find((s) => s.id === activeDesign.colorScheme) || COLOR_SCHEMES[0];
  const isExecutive = activeDesign.layoutStyle === 'executive-linear';

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        uploadAvatar(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <section id="home" className="min-h-screen pt-28 pb-16 flex flex-col justify-between relative bg-tech-grid overflow-hidden">
      {/* Background radial ambient lights dynamically colored */}
      <div className={`absolute top-1/4 left-0 w-96 h-96 ${currentScheme.heroAmbientA} rounded-full blur-3xl pointer-events-none`} />
      <div className={`absolute top-1/3 right-10 w-96 h-96 ${currentScheme.heroAmbientB} rounded-full blur-3xl pointer-events-none`} />

      {/* Hidden Avatar File Input */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarFileChange}
        className="hidden"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1 flex items-center my-auto">
        <div className={`w-full ${isExecutive ? 'flex flex-col items-center text-center max-w-4xl mx-auto' : 'grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center'}`}>
          
          {/* Executive Layout: Avatar at Top Centered */}
          {isExecutive && (
            <div className="mb-8 relative group">
              <div className={`p-1 rounded-full bg-gradient-to-tr ${currentScheme.ringGlow} glow-avatar-ring w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center`}>
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0e0c1f] relative flex items-center justify-center border-4 border-[#080711]">
                  {personalInfo.avatarUrl ? (
                    <img src={personalInfo.avatarUrl} alt={personalInfo.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center text-3xl font-extrabold text-white">
                      MA
                    </div>
                  )}

                  {/* Edit Mode Camera Overlay */}
                  {isEditMode && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1.5 backdrop-blur-xs">
                      <button
                        onClick={() => avatarInputRef.current?.click()}
                        className="px-2.5 py-1 text-[11px] font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-full flex items-center gap-1 shadow-md"
                      >
                        <Camera className="w-3 h-3" />
                        <span>{personalInfo.avatarUrl ? 'Foto ändern' : 'Foto hochladen'}</span>
                      </button>
                      {personalInfo.avatarUrl && (
                        <button
                          onClick={removeAvatar}
                          className="text-[10px] text-rose-300 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                          <span>Foto entfernen</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Typography & CTAs */}
          <div className={`${isExecutive ? 'flex flex-col items-center z-10' : 'lg:col-span-7 flex flex-col items-start z-10'}`}>
            {isEditMode && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-lg shadow-lg shadow-pink-500/25 transition-all"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>{language === 'de' ? 'Profil bearbeiten' : 'Edit Profile'}</span>
              </button>
            )}

            {/* Availability Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121124] border border-purple-900/40 text-xs text-neutral-300 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium">{personalInfo.availability[language]}</span>
            </div>

            {/* Giant Title: Mohamed in White + Adam in Dynamic Gradient */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-2 leading-[1.1]">
              Mohamed{' '}
              <span className={`bg-gradient-to-r ${currentScheme.gradientText} bg-clip-text text-transparent`}>
                Adam
              </span>
            </h1>

            {/* Role Subtitle */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-300 mt-1 mb-4">
              {personalInfo.headline[language]}
            </h2>

            {/* Description Paragraph */}
            <p className={`text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl mb-3 ${isExecutive ? 'mx-auto' : ''}`}>
              {personalInfo.bioShort[language]}
            </p>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-400 mb-8 font-medium">
              <MapPin className={`w-4 h-4 ${currentScheme.accentText}`} />
              <span>{personalInfo.city}</span>
            </div>

            {/* 3 Action Buttons */}
            <div className={`flex flex-wrap items-center gap-3 sm:gap-4 mb-8 ${isExecutive ? 'justify-center' : ''}`}>
              <a
                href="#projects"
                className={`px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r ${currentScheme.gradientButton} hover:opacity-95 rounded-xl shadow-lg shadow-pink-500/20 transition-all flex items-center justify-center whitespace-nowrap`}
              >
                {language === 'de' ? 'Projekte ansehen' : 'View My Projects'}
              </a>

              <a
                href="#contact"
                className="px-6 py-3 text-sm font-semibold text-white bg-[#121124] hover:bg-[#1a1930] border border-neutral-700/80 rounded-xl transition-all flex items-center justify-center whitespace-nowrap"
              >
                {language === 'de' ? 'Kontakt aufnehmen' : 'Get In Touch'}
              </a>

              <button
                onClick={onOpenResume}
                className="px-6 py-3 text-sm font-semibold text-white bg-[#121124] hover:bg-[#1a1930] border border-neutral-700/80 rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Download className={`w-4 h-4 ${currentScheme.accentText}`} />
                <span>Download CV (DE/EN)</span>
              </button>
            </div>

            {/* Social Icons Row */}
            <div className={`flex items-center gap-3 ${isExecutive ? 'justify-center' : ''}`}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#121124] border border-neutral-800 hover:border-purple-500/60 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#121124] border border-neutral-800 hover:border-purple-500/60 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${personalInfo.email}`}
                className="w-10 h-10 rounded-xl bg-[#121124] border border-neutral-800 hover:border-purple-500/60 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                title="E-Mail"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Split / Default Layout: Circular Avatar Frame with Neon Glow */}
          {!isExecutive && (
            <div className="lg:col-span-5 flex justify-center lg:justify-end z-10">
              <div className="relative group">
                {/* Outer Radiant Glowing Ring */}
                <div className={`p-1 rounded-full bg-gradient-to-tr ${currentScheme.ringGlow} glow-avatar-ring w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center transition-all`}>
                  {/* Inside Image Frame */}
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#0e0c1f] relative flex items-center justify-center border-4 border-[#080711]">
                    {/* If custom photo uploaded, display it! */}
                    {personalInfo.avatarUrl ? (
                      <div className="w-full h-full relative">
                        <img
                          src={personalInfo.avatarUrl}
                          alt={personalInfo.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      /* Styled Workplace Visual Matching Photo */
                      <div className="w-full h-full relative bg-neutral-900 flex items-center justify-center">
                        <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
                          <rect width="400" height="400" fill="#f8fafc" />
                          <line x1="0" y1="260" x2="400" y2="260" stroke="#e2e8f0" strokeWidth="3" />
                          <rect x="0" y="270" width="400" height="130" fill="#f1f5f9" />
                          <rect x="0" y="270" width="400" height="8" fill="#cbd5e1" />
                          <rect x="40" y="230" width="22" height="22" rx="3" fill="#ffffff" stroke="#cbd5e1" />
                          <circle cx="51" cy="238" r="2" fill="#94a3b8" />
                          <circle cx="51" cy="244" r="2" fill="#94a3b8" />
                          <rect x="70" y="160" width="130" height="90" rx="4" fill="#0f172a" />
                          <rect x="75" y="165" width="120" height="80" rx="2" fill="#020617" />
                          <line x1="85" y1="180" x2="140" y2="180" stroke="#38bdf8" strokeWidth="2" />
                          <line x1="85" y1="190" x2="160" y2="190" stroke="#818cf8" strokeWidth="2" />
                          <line x1="85" y1="200" x2="120" y2="200" stroke="#34d399" strokeWidth="2" />
                          <rect x="130" y="250" width="10" height="24" fill="#334155" />
                          <ellipse cx="135" cy="274" rx="28" ry="4" fill="#1e293b" />
                          <rect x="70" y="278" width="110" height="16" rx="2" fill="#1e293b" />
                          <ellipse cx="195" cy="285" rx="6" ry="10" fill="#334155" />
                          <path d="M220 400 L220 280 Q220 235 270 230 Q320 235 320 280 L320 400 Z" fill="#0f172a" />
                          <path d="M255 230 L270 248 L285 230 Z" fill="#1e293b" />
                          <line x1="270" y1="248" x2="270" y2="275" stroke="#cbd5e1" strokeWidth="2" />
                          <rect x="256" y="200" width="28" height="35" rx="4" fill="#8d5b4c" />
                          <ellipse cx="270" cy="180" rx="30" ry="38" fill="#9c6644" />
                          <path d="M240 160 C238 135 250 120 270 120 C290 120 302 135 300 160 C306 148 300 130 285 125 C270 122 255 125 240 160 Z" fill="#1c1917" />
                          <ellipse cx="270" cy="145" rx="32" ry="20" fill="#1c1917" />
                          <circle cx="245" cy="150" r="12" fill="#1c1917" />
                          <circle cx="295" cy="150" r="12" fill="#1c1917" />
                          <circle cx="270" cy="138" r="16" fill="#1c1917" />
                          <ellipse cx="258" cy="178" rx="4" ry="2.5" fill="#1c1917" />
                          <ellipse cx="282" cy="178" rx="4" ry="2.5" fill="#1c1917" />
                          <path d="M252 172 Q258 169 264 172" stroke="#1c1917" strokeWidth="2" fill="none" />
                          <path d="M276 172 Q282 169 288 172" stroke="#1c1917" strokeWidth="2" fill="none" />
                          <path d="M270 178 L268 188 L273 189" stroke="#78350f" strokeWidth="1.5" fill="none" />
                          <path d="M263 198 Q270 202 277 198" stroke="#522504" strokeWidth="2" fill="none" />
                          <ellipse cx="270" cy="205" rx="5" ry="3" fill="#1c1917" opacity="0.6" />
                        </svg>
                      </div>
                    )}

                    {/* Camera Photo Upload Button in Edit Mode */}
                    {isEditMode && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 backdrop-blur-xs opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => avatarInputRef.current?.click()}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-full flex items-center gap-1.5 shadow-lg"
                        >
                          <Camera className="w-4 h-4" />
                          <span>{personalInfo.avatarUrl ? (language === 'de' ? 'Foto ändern' : 'Change Photo') : (language === 'de' ? 'Foto hochladen' : 'Upload Photo')}</span>
                        </button>
                        {personalInfo.avatarUrl && (
                          <button
                            onClick={removeAvatar}
                            className="px-2.5 py-1 text-[11px] text-rose-300 hover:text-white hover:bg-rose-950/60 rounded-md flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>{language === 'de' ? 'Entfernen' : 'Remove'}</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Subtle Overlay Badge */}
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-[#121124]/90 border border-purple-500/40 text-[10px] text-purple-200 font-semibold backdrop-blur-md">
                      Mohamed Adam
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="flex flex-col items-center justify-center text-center pb-4 text-neutral-500 text-xs font-semibold tracking-wider select-none">
        <span className="uppercase text-[11px] tracking-widest text-neutral-400">SCROLL</span>
        <ChevronDown className="w-4 h-4 text-neutral-400 animate-bounce mt-1" />
      </div>

      <EditPersonalInfoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        language={language}
      />
    </section>
  );
};

