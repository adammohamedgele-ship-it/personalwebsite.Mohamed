import React, { useState, useRef } from 'react';
import { Award, Briefcase, GraduationCap, Car, Mail, Phone, MapPin, Github, Linkedin, Pencil, Plus, Trash2, Camera, Upload } from 'lucide-react';
import { Language } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { EditPersonalInfoModal } from './EditPersonalInfoModal';

interface AboutProps {
  language: Language;
}

export const About: React.FC<AboutProps> = ({ language }) => {
  const { data, isEditMode, uploadAvatar, currentScheme } = usePortfolio();
  const personalInfo = data.personalInfo;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <section id="about" className="py-20 bg-[#080711] relative border-b border-purple-900/20">
      {/* Hidden Avatar input */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarFile}
        className="hidden"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About Me
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mt-2">
            {language === 'de'
              ? 'Profil, praktischer Werdegang und Motivation für die Systemintegration.'
              : 'Profile, practical background, and focus on system integration.'}
          </p>
          <div className={`w-16 h-1 bg-gradient-to-r ${currentScheme.gradientButton} rounded-full mx-auto mt-4`} />
        </div>

        {/* 2-Column Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Card: Profile & Bio */}
          <div className="lg:col-span-7 bg-[#121124] border border-purple-900/30 rounded-2xl p-7 sm:p-8 flex flex-col justify-between relative shadow-xl">
            {isEditMode && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute top-4 right-4 px-2.5 py-1 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-lg shadow-sm flex items-center gap-1"
              >
                <Pencil className="w-3 h-3" />
                <span>{language === 'de' ? 'Bearbeiten' : 'Edit Bio'}</span>
              </button>
            )}

            <div>
              {/* Profile Badge in Top-Left */}
              <div className="flex items-center gap-3.5 mb-6">
                <div
                  onClick={() => isEditMode && avatarInputRef.current?.click()}
                  className={`w-14 h-14 rounded-xl overflow-hidden bg-neutral-800 border border-purple-500/30 flex items-center justify-center shrink-0 relative group/avatar ${
                    isEditMode ? 'cursor-pointer hover:border-pink-500' : ''
                  }`}
                  title={isEditMode ? (language === 'de' ? 'Klicken um Foto zu ändern' : 'Click to change photo') : undefined}
                >
                  {personalInfo.avatarUrl ? (
                    <img src={personalInfo.avatarUrl} alt={personalInfo.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-700 via-pink-600 to-rose-500 flex items-center justify-center text-white font-bold text-base">
                      MA
                    </div>
                  )}

                  {isEditMode && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {personalInfo.fullName}
                  </h3>
                  <div className="text-xs text-neutral-300 font-medium">
                    {personalInfo.headline[language]}
                  </div>
                  <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                    <MapPin className={`w-3 h-3 ${currentScheme.accentText}`} />
                    <span>{personalInfo.city}</span>
                  </div>
                </div>
              </div>

              {/* Bio Paragraphs */}
              <div className="text-neutral-300 text-xs sm:text-sm leading-relaxed space-y-3 mb-6">
                <p>
                  {personalInfo.bioShort[language]}
                </p>
                <p>
                  {language === 'de'
                    ? 'Zu meinen praktischen Kenntnissen gehören die Einrichtung von PC-Arbeitsplätzen, Hardware-Wartung, Netzwerkgrundlagen (LAN/WLAN, IPv4) und Anwendersupport.'
                    : 'My practical skills include workstation setup, hardware maintenance, networking fundamentals (LAN/Wi-Fi, IPv4), and user support.'}
                </p>
              </div>

              {/* Green Availability Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0d0c1d] border border-purple-900/40 text-xs text-neutral-300 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{personalInfo.availability[language]}</span>
              </div>
            </div>

            {/* Bottom Contact & Social Row */}
            <div className="pt-4 border-t border-purple-900/20 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300">
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-1.5 hover:text-pink-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-purple-400" />
                  <span>{personalInfo.email}</span>
                </a>
                <a
                  href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-1.5 hover:text-pink-400 transition-colors tabular-nums"
                >
                  <Phone className="w-3.5 h-3.5 text-purple-400" />
                  <span>{personalInfo.phone}</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-[#0d0c1d] border border-neutral-800 text-neutral-300 hover:text-white hover:border-purple-500/50 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Github className="w-3 h-3" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-[#0d0c1d] border border-neutral-800 text-neutral-300 hover:text-white hover:border-purple-500/50 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Linkedin className="w-3 h-3" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Card: AT A GLANCE matching Screenshot 6 */}
          <div className="lg:col-span-5 bg-[#121124] border border-purple-900/30 rounded-2xl p-7 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-6">
                AT A GLANCE
              </div>

              <div className="space-y-4">
                {/* Metric 1 */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-[#0d0c1d] border border-purple-900/20">
                  <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-700/40 text-purple-300 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-white">{data.certifications.length}</div>
                    <div className="text-xs text-neutral-400">
                      {language === 'de' ? 'Zertifikate & Nachweise' : 'Certificates & Credentials'}
                    </div>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-[#0d0c1d] border border-purple-900/20">
                  <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-700/40 text-purple-300 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-white">{data.projects.length}</div>
                    <div className="text-xs text-neutral-400">
                      {language === 'de' ? 'Praxisnahe IT-Projekte' : 'Practical IT Projects'}
                    </div>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-[#0d0c1d] border border-purple-900/20">
                  <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-700/40 text-purple-300 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-white">B1</div>
                    <div className="text-xs text-neutral-400">
                      {language === 'de' ? 'Deutsch Sprachzertifikat (DTZ)' : 'German Level (DTZ Certified)'}
                    </div>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-[#0d0c1d] border border-purple-900/20">
                  <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-700/40 text-purple-300 flex items-center justify-center shrink-0">
                    <Car className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-white">Klasse B</div>
                    <div className="text-xs text-neutral-400">
                      {language === 'de' ? 'Führerschein (PKW)' : 'Driver\'s License Class B'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-purple-900/20 text-xs text-neutral-400 flex items-center justify-between">
              <span>{language === 'de' ? 'Wohnhaft in Hamburg (22525)' : 'Resident in Hamburg, Germany'}</span>
              <span className="text-emerald-400 font-medium">● Sofort verfügbar</span>
            </div>
          </div>
        </div>
      </div>

      <EditPersonalInfoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        language={language}
      />
    </section>
  );
};
