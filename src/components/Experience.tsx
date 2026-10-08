import React, { useState } from 'react';
import { Briefcase, GraduationCap, Award, Calendar, MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { Language, ExperienceItem } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { EditExperienceModal } from './EditExperienceModal';

interface ExperienceProps {
  language: Language;
}

export const Experience: React.FC<ExperienceProps> = ({ language }) => {
  const { data, isEditMode, deleteExperience, currentScheme } = usePortfolio();
  const [filter, setFilter] = useState<'all' | 'work' | 'education'>('all');
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredExperiences = data.experiences.filter((exp) => {
    if (filter === 'all') return true;
    if (filter === 'work') return exp.type === 'work';
    if (filter === 'education') return exp.type === 'education' || exp.type === 'course';
    return true;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ExperienceItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <section id="experience" className="py-16 md:py-24 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/30 relative">
      <span id="education" className="absolute -top-20" aria-hidden="true" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${currentScheme.accentText}`}>
              {language === 'de' ? 'Beruflicher Werdegang & Bildung' : 'Career & Education Timeline'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white [text-wrap:balance]">
              {language === 'de'
                ? 'Schulischer Weg, IT-Praktikum und praktische Erfahrungen'
                : 'Education, practical IT internships, and professional roles'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isEditMode && (
              <button
                onClick={handleOpenAdd}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r ${currentScheme.gradientButton} hover:opacity-95 rounded-md transition-all shadow-xs`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'de' ? 'Station hinzufügen' : 'Add Milestone'}</span>
              </button>
            )}

            {/* Interactive Filter Tabs (Zero-Pill discipline: clean segmented control) */}
            <div className="inline-flex p-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shrink-0">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  filter === 'all'
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {language === 'de' ? 'Alle Stationen' : 'All Milestones'}
              </button>
              <button
                onClick={() => setFilter('work')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  filter === 'work'
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {language === 'de' ? 'Praxis & Arbeit' : 'Work & Practice'}
              </button>
              <button
                onClick={() => setFilter('education')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  filter === 'education'
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {language === 'de' ? 'Schule & Kurse' : 'School & Courses'}
              </button>
            </div>
          </div>
        </div>

        {/* Timeline List */}
        <div className="space-y-6">
          {filteredExperiences.map((exp) => (
            <div
              key={exp.id}
              className={`p-6 rounded-xl border bg-white dark:bg-neutral-900 shadow-xs transition-all ${
                isEditMode
                  ? 'border-neutral-300 dark:border-neutral-700 hover:border-sky-500/50'
                  : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                      {exp.role[language]}
                    </h3>
                    {isEditMode && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(exp)}
                          className="p-1 text-neutral-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                          title={language === 'de' ? 'Station bearbeiten' : 'Edit Milestone'}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(language === 'de' ? `Station „${exp.role[language]}“ wirklich löschen?` : `Delete milestone „${exp.role[language]}“?`)) {
                              deleteExperience(exp.id);
                            }
                          }}
                          className="p-1 text-neutral-400 hover:text-rose-500 transition-colors"
                          title={language === 'de' ? 'Station entfernen' : 'Delete Milestone'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Clean unboxed metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {exp.organization}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{exp.location}</span>
                  </div>
                </div>

                {/* Tabular Numerals Period */}
                <div className="text-xs font-mono tabular-nums text-neutral-500 dark:text-neutral-400 shrink-0">
                  {exp.period}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed">
                {exp.description[language]}
              </p>

              {/* Highlights */}
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3">
                <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono mb-2">
                  {language === 'de' ? 'Schwerpunkte & Tätigkeiten' : 'Key Responsibilities & Highlights'}
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                  {exp.highlights[language].map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-sky-600 dark:text-sky-400 font-bold shrink-0">›</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EditExperienceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        experienceItem={editingItem}
        language={language}
      />
    </section>
  );
};
