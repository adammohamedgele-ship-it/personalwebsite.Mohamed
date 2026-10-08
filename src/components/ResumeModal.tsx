import React, { useState } from 'react';
import { Download, Printer, X, FileText, Check, Globe } from 'lucide-react';
import { Language } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
  language: initialLanguage,
}) => {
  const { data } = usePortfolio();
  const { personalInfo, experiences, skillCategories } = data;

  const [resumeLang, setResumeLang] = useState<Language>(initialLanguage);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const isDe = resumeLang === 'de';

    const experienceText = experiences
      .map(
        (exp) =>
          `${exp.period}\n${exp.role[resumeLang]} | ${exp.organization} (${exp.location})\n${exp.description[resumeLang]}\n${exp.highlights[
            resumeLang
          ]
            .map((h) => `- ${h}`)
            .join('\n')}\n`
      )
      .join('\n');

    const skillsText = skillCategories
      .map(
        (cat) =>
          `${cat.title[resumeLang].toUpperCase()}:\n` +
          cat.skills.map((s) => `• ${s.name} (${s.level}): ${s.context[resumeLang]}`).join('\n')
      )
      .join('\n\n');

    const textContent = isDe
      ? `LEBENSLAUF
============================================================
${personalInfo.fullName.toUpperCase()}
Bewerbungsprofil: ${personalInfo.headline.de}

KONTAKTDATEN
------------------------------------------------------------
Adresse:  ${personalInfo.location}
Telefon:  ${personalInfo.phone}
E-Mail:   ${personalInfo.email}

PERSÖNLICHE ANGABEN
------------------------------------------------------------
Geburtsdatum:       ${personalInfo.birthDate}
Geburtsort:         ${personalInfo.birthPlace}
Staatsangehörigkeit: ${personalInfo.nationality.de}
Familienstand:      ${personalInfo.maritalStatus.de}
Aufenthalt:         ${personalInfo.residenceSince.de}

SCHULE / AUSBILDUNG & PRAXIS
------------------------------------------------------------
${experienceText}

KENNTNISSE UND FÄHIGKEITEN
------------------------------------------------------------
• Führerschein: ${personalInfo.driverLicense.de}

${skillsText}

SPRACHKENNTNISSE
------------------------------------------------------------
${personalInfo.languages
  .map((l) => `• ${l.name.de}: ${l.level.de}`)
  .join('\n')}

HOBBYS
------------------------------------------------------------
${personalInfo.hobbies.de.join(' · ')}

Hamburg, ${new Date().toLocaleDateString('de-DE')}
${personalInfo.shortName}
`
      : `CURRICULUM VITAE
============================================================
${personalInfo.fullName.toUpperCase()}
Target Profile: ${personalInfo.headline.en}

CONTACT DETAILS
------------------------------------------------------------
Address:  ${personalInfo.location}
Phone:    ${personalInfo.phone}
Email:    ${personalInfo.email}

PERSONAL DETAILS
------------------------------------------------------------
Date of Birth:   ${personalInfo.birthDate}
Place of Birth:  ${personalInfo.birthPlace}
Nationality:     ${personalInfo.nationality.en}
Marital Status:  ${personalInfo.maritalStatus.en}
Residence:       ${personalInfo.residenceSince.en}

EDUCATION & PRACTICAL EXPERIENCE
------------------------------------------------------------
${experienceText}

SKILLS & COMPETENCIES
------------------------------------------------------------
• Driver's License: ${personalInfo.driverLicense.en}

${skillsText}

LANGUAGES
------------------------------------------------------------
${personalInfo.languages
  .map((l) => `• ${l.name.en}: ${l.level.en}`)
  .join('\n')}

INTERESTS
------------------------------------------------------------
${personalInfo.hobbies.en.join(' · ')}

Hamburg, Germany
${personalInfo.shortName}
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${personalInfo.fullName.replace(/\s+/g, '_')}_Lebenslauf_${resumeLang.toUpperCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/80 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Control Bar */}
        <div className="no-print flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
              {resumeLang === 'de' ? 'Lebenslauf (CV) Vorschau' : 'Resume (CV) Preview'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <div className="flex items-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-0.5">
              <button
                onClick={() => setResumeLang('de')}
                className={`px-2 py-1 text-[11px] font-semibold rounded-xs transition-colors ${
                  resumeLang === 'de'
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                DE
              </button>
              <button
                onClick={() => setResumeLang('en')}
                className={`px-2 py-1 text-[11px] font-semibold rounded-xs transition-colors ${
                  resumeLang === 'en'
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                EN
              </button>
            </div>

            {/* Print / Save as PDF Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-200/80 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-md transition-colors"
              title="Drucken oder als PDF speichern"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {resumeLang === 'de' ? 'Drucken / Als PDF sichern' : 'Print / Save PDF'}
              </span>
            </button>

            {/* Direct File Download Button */}
            <button
              onClick={handleDownloadText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors shadow-xs"
              title="Lebenslauf herunterladen"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{resumeLang === 'de' ? 'Gespeichert' : 'Saved'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{resumeLang === 'de' ? 'Datei herunterladen' : 'Download File'}</span>
                </>
              )}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close resume preview"
              className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable DIN A4 Document Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-neutral-100 dark:bg-neutral-950/60">
          <div
            id="printable-cv"
            className="max-w-[780px] mx-auto bg-white text-neutral-900 p-8 sm:p-12 shadow-sm rounded-lg border border-neutral-200 text-xs sm:text-sm font-sans"
          >
            {/* CV Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-neutral-900 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 uppercase">
                  {personalInfo.fullName}
                </h1>
                <div className="text-xs uppercase tracking-wider font-semibold text-neutral-600 mt-1">
                  {resumeLang === 'de'
                    ? `Bewerbungsprofil · ${personalInfo.headline.de}`
                    : `Candidate Profile · ${personalInfo.headline.en}`}
                </div>
              </div>

              <div className="text-right text-xs text-neutral-700 space-y-0.5 sm:self-start">
                <div className="font-semibold text-neutral-900">{personalInfo.city}</div>
                <div>{personalInfo.location}</div>
                <div className="font-mono tabular-nums">{personalInfo.phone}</div>
                <div className="text-sky-700">{personalInfo.email}</div>
              </div>
            </div>

            {/* 1. Persönliche Angaben */}
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-300 pb-1 mb-2.5">
                {resumeLang === 'de' ? 'Persönliche Angaben' : 'Personal Details'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 text-xs text-neutral-800">
                <div>
                  <span className="font-semibold text-neutral-950 inline-block w-36">
                    {resumeLang === 'de' ? 'Geburtsdatum:' : 'Date of Birth:'}
                  </span>{' '}
                  {personalInfo.birthDate}
                </div>
                <div>
                  <span className="font-semibold text-neutral-950 inline-block w-36">
                    {resumeLang === 'de' ? 'Geburtsort:' : 'Place of Birth:'}
                  </span>{' '}
                  {personalInfo.birthPlace}
                </div>
                <div>
                  <span className="font-semibold text-neutral-950 inline-block w-36">
                    {resumeLang === 'de' ? 'Staatsangehörigkeit:' : 'Nationality:'}
                  </span>{' '}
                  {personalInfo.nationality[resumeLang]}
                </div>
                <div>
                  <span className="font-semibold text-neutral-950 inline-block w-36">
                    {resumeLang === 'de' ? 'Familienstand:' : 'Marital Status:'}
                  </span>{' '}
                  {personalInfo.maritalStatus[resumeLang]}
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold text-neutral-950 inline-block w-36">
                    {resumeLang === 'de' ? 'Wohnsitz:' : 'Residence:'}
                  </span>{' '}
                  {personalInfo.residenceSince[resumeLang]}
                </div>
              </div>
            </div>

            {/* 2. Schule & Ausbildung */}
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-300 pb-1 mb-3">
                {resumeLang === 'de' ? 'Schule / Ausbildung & Praxis' : 'Education & Practical Roles'}
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="grid grid-cols-1 sm:grid-cols-12 gap-1 text-xs">
                    <div className="sm:col-span-4 font-mono font-medium text-neutral-600 tabular-nums">
                      {exp.period}
                    </div>
                    <div className="sm:col-span-8">
                      <div className="font-bold text-neutral-950">
                        {exp.role[resumeLang]} – {exp.organization}
                      </div>
                      <div className="text-neutral-700">
                        {exp.description[resumeLang]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Kenntnisse & Fähigkeiten */}
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-300 pb-1 mb-2.5">
                {resumeLang === 'de' ? 'Kenntnisse und Fähigkeiten' : 'Skills & Competencies'}
              </h2>
              <ul className="text-xs text-neutral-800 space-y-1">
                <li>• {personalInfo.driverLicense[resumeLang]}</li>
                {skillCategories.map((cat, idx) => (
                  <li key={idx}>
                    • <span className="font-semibold text-neutral-950">{cat.title[resumeLang]}:</span>{' '}
                    {cat.skills.map((s) => `${s.name} (${s.level})`).join(', ')}
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Sprachkenntnisse */}
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-300 pb-1 mb-2.5">
                {resumeLang === 'de' ? 'Sprachkenntnisse' : 'Language Skills'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-neutral-800">
                {personalInfo.languages.map((l, idx) => (
                  <div key={idx}>
                    <span className="font-semibold text-neutral-950">
                      {l.name[resumeLang]}:
                    </span>{' '}
                    {l.level[resumeLang]}
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Hobbys */}
            <div className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-300 pb-1 mb-2">
                {resumeLang === 'de' ? 'Hobbys & Interessen' : 'Hobbies & Interests'}
              </h2>
              <div className="text-xs text-neutral-800">
                {personalInfo.hobbies[resumeLang].join(' · ')}
              </div>
            </div>

            {/* Signature & Date */}
            <div className="pt-4 border-t border-neutral-200 flex justify-between items-end text-xs text-neutral-700">
              <div>
                <div>Hamburg, {new Date().toLocaleDateString('de-DE')}</div>
              </div>
              <div className="text-right font-medium italic text-neutral-900">
                {personalInfo.shortName}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="no-print px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex flex-wrap justify-between items-center gap-3">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {resumeLang === 'de'
              ? 'Tipp: „Drucken“ öffnet das Druckmenü Ihres Browsers, in dem Sie „Als PDF speichern“ wählen können.'
              : 'Tip: "Print" opens your browser print dialog where you can choose "Save as PDF".'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-md transition-colors"
            >
              {resumeLang === 'de' ? 'Drucken (A4)' : 'Print (A4)'}
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors"
            >
              {resumeLang === 'de' ? 'Fertig' : 'Done'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
