import React, { useState, useEffect } from 'react';
import { X, Check, Trash2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Language, SkillItem } from '../types';

interface EditSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryIndex: number;
  skillIndex?: number | null;
  skillItem?: SkillItem | null;
  language: Language;
}

export const EditSkillModal: React.FC<EditSkillModalProps> = ({
  isOpen,
  onClose,
  categoryIndex,
  skillIndex,
  skillItem,
  language,
}) => {
  const { addSkill, updateSkill, deleteSkill, data } = usePortfolio();
  const isEditing = skillIndex !== null && skillIndex !== undefined && !!skillItem;

  const [formData, setFormData] = useState<SkillItem>({
    name: '',
    level: 'Fundiert',
    context: { de: '', en: '' },
  });

  useEffect(() => {
    if (skillItem) {
      setFormData({
        name: skillItem.name,
        level: skillItem.level,
        context: { ...skillItem.context },
      });
    } else {
      setFormData({
        name: '',
        level: 'Fundiert',
        context: { de: '', en: '' },
      });
    }
  }, [skillItem, isOpen]);

  if (!isOpen) return null;

  const categoryName = data.skillCategories[categoryIndex]?.title[language] || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && skillIndex !== null && skillIndex !== undefined) {
      updateSkill(categoryIndex, skillIndex, formData);
    } else {
      addSkill(categoryIndex, formData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (isEditing && skillIndex !== null && skillIndex !== undefined) {
      if (window.confirm(language === 'de' ? 'Diese Kompetenz löschen?' : 'Delete this skill?')) {
        deleteSkill(categoryIndex, skillIndex);
        onClose();
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              {isEditing
                ? language === 'de'
                  ? 'Kompetenz bearbeiten'
                  : 'Edit Skill'
                : language === 'de'
                ? 'Kompetenz hinzufügen'
                : 'Add Skill'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {language === 'de' ? `Kategorie: ${categoryName}` : `Category: ${categoryName}`}
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
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {language === 'de' ? 'Name der Fähigkeit *' : 'Skill Name *'}
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="z.B. PC-Montage & Hardware-Setup"
              className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {language === 'de' ? 'Niveau / Status' : 'Proficiency Level'}
            </label>
            <input
              type="text"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              placeholder="z.B. Praxiserprobt, Fundiert, Sicher"
              className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {language === 'de' ? 'Praxis-Kontext (Deutsch)' : 'Context (German)'}
            </label>
            <textarea
              rows={2}
              value={formData.context.de}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  context: { ...formData.context, de: e.target.value, en: e.target.value },
                })
              }
              placeholder="Kurze Erläuterung der praktischen Anwendung..."
              className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
            />
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
