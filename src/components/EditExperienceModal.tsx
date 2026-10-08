import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, Plus } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ExperienceItem, Language } from '../types';

interface EditExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experienceItem?: ExperienceItem | null;
  language: Language;
}

export const EditExperienceModal: React.FC<EditExperienceModalProps> = ({
  isOpen,
  onClose,
  experienceItem,
  language,
}) => {
  const { addExperience, updateExperience, deleteExperience } = usePortfolio();

  const isEditing = !!experienceItem;

  const [formData, setFormData] = useState<Omit<ExperienceItem, 'id'>>({
    period: '',
    role: { de: '', en: '' },
    organization: '',
    location: '',
    type: 'work',
    description: { de: '', en: '' },
    highlights: { de: [''], en: [''] },
  });

  useEffect(() => {
    if (experienceItem) {
      setFormData({
        period: experienceItem.period,
        role: { ...experienceItem.role },
        organization: experienceItem.organization,
        location: experienceItem.location,
        type: experienceItem.type,
        description: { ...experienceItem.description },
        highlights: {
          de: experienceItem.highlights.de.length ? [...experienceItem.highlights.de] : [''],
          en: experienceItem.highlights.en.length ? [...experienceItem.highlights.en] : [''],
        },
      });
    } else {
      setFormData({
        period: '',
        role: { de: '', en: '' },
        organization: '',
        location: 'Hamburg',
        type: 'work',
        description: { de: '', en: '' },
        highlights: { de: [''], en: [''] },
      });
    }
  }, [experienceItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHighlightsDe = formData.highlights.de.filter((h) => h.trim().length > 0);
    const cleanHighlightsEn = formData.highlights.en.filter((h) => h.trim().length > 0);

    const dataToSave = {
      ...formData,
      highlights: {
        de: cleanHighlightsDe.length ? cleanHighlightsDe : ['Erfolgreich abgeschlossen'],
        en: cleanHighlightsEn.length ? cleanHighlightsEn : ['Successfully completed'],
      },
    };

    if (isEditing && experienceItem) {
      updateExperience(experienceItem.id, { ...dataToSave, id: experienceItem.id });
    } else {
      addExperience(dataToSave);
    }
    onClose();
  };

  const handleDelete = () => {
    if (experienceItem && window.confirm(language === 'de' ? 'Diesen Eintrag wirklich löschen?' : 'Delete this entry?')) {
      deleteExperience(experienceItem.id);
      onClose();
    }
  };

  const handleAddHighlight = () => {
    setFormData({
      ...formData,
      highlights: {
        de: [...formData.highlights.de, ''],
        en: [...formData.highlights.en, ''],
      },
    });
  };

  const handleHighlightChange = (lang: 'de' | 'en', index: number, value: string) => {
    const list = [...formData.highlights[lang]];
    list[index] = value;
    setFormData({
      ...formData,
      highlights: {
        ...formData.highlights,
        [lang]: list,
      },
    });
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: {
        de: formData.highlights.de.filter((_, i) => i !== index),
        en: formData.highlights.en.filter((_, i) => i !== index),
      },
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              {isEditing
                ? language === 'de'
                  ? 'Station im Werdegang bearbeiten'
                  : 'Edit Milestone'
                : language === 'de'
                ? 'Neue Station hinzufügen'
                : 'Add New Milestone'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {language === 'de'
                ? 'Details zu Ausbildung, Praktikum, Schule oder Berufserfahrung anpassen.'
                : 'Configure educational, vocational, or internship milestones.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'de' ? 'Organisation / Betrieb / Schule *' : 'Organization / Employer *'}
              </label>
              <input
                type="text"
                required
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="z.B. AWO Landesverband Hamburg"
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'de' ? 'Kategorie' : 'Type'}
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              >
                <option value="work">{language === 'de' ? 'Praxis / Arbeit' : 'Work / Practice'}</option>
                <option value="education">{language === 'de' ? 'Schule / Ausbildung' : 'Education'}</option>
                <option value="course">{language === 'de' ? 'Kurs / Zertifikat' : 'Course'}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'de' ? 'Rolle / Position (Deutsch) *' : 'Role / Title (German) *'}
              </label>
              <input
                type="text"
                required
                value={formData.role.de}
                onChange={(e) =>
                  setFormData({ ...formData, role: { ...formData.role, de: e.target.value } })
                }
                placeholder="z.B. Praktikant im Bereich Fachinformatik"
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'de' ? 'Rolle / Position (Englisch)' : 'Role / Title (English)'}
              </label>
              <input
                type="text"
                value={formData.role.en}
                onChange={(e) =>
                  setFormData({ ...formData, role: { ...formData.role, en: e.target.value } })
                }
                placeholder="e.g. IT Specialist Intern"
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'de' ? 'Zeitraum *' : 'Period / Date Range *'}
              </label>
              <input
                type="text"
                required
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="z.B. 20.08.2026 – 20.11.2026"
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'de' ? 'Standort' : 'Location'}
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="z.B. Hamburg"
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {language === 'de' ? 'Beschreibung (Deutsch)' : 'Description (German)'}
            </label>
            <textarea
              rows={2}
              value={formData.description.de}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: { ...formData.description, de: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {language === 'de' ? 'Beschreibung (Englisch)' : 'Description (English)'}
            </label>
            <textarea
              rows={2}
              value={formData.description.en}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: { ...formData.description, en: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
            />
          </div>

          {/* Highlights */}
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                {language === 'de' ? 'Stichpunkte & Schwerpunkte' : 'Key Highlights & Bullet Points'}
              </label>
              <button
                type="button"
                onClick={handleAddHighlight}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline"
              >
                <Plus className="w-3 h-3" />
                <span>{language === 'de' ? 'Punkt hinzufügen' : 'Add Point'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.highlights.de.map((highlightDe, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-bold text-sky-600 dark:text-sky-400">›</span>
                  <input
                    type="text"
                    value={highlightDe}
                    onChange={(e) => handleHighlightChange('de', idx, e.target.value)}
                    placeholder={language === 'de' ? 'Tätigkeit / Schwerpunkt' : 'Responsibility or task'}
                    className="flex-1 px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs"
                  />
                  {formData.highlights.de.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(idx)}
                      className="p-1.5 text-neutral-400 hover:text-rose-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'de' ? 'Löschen' : 'Delete'}</span>
              </button>
            ) : <div />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-md"
              >
                {language === 'de' ? 'Abbrechen' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-md"
              >
                <Check className="w-4 h-4" />
                <span>{language === 'de' ? 'Speichern' : 'Save'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
