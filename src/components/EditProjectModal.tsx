import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project, Language } from '../types';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  language: Language;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  language,
}) => {
  const { addProject, updateProject, deleteProject } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!project;

  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    title: { de: '', en: '' },
    subtitle: { de: '', en: '' },
    category: 'network',
    period: '',
    summary: { de: '', en: '' },
    challenge: { de: '', en: '' },
    solution: { de: '', en: '' },
    keyOutcomes: { de: [''], en: [''] },
    technologies: [],
    featured: false,
    imageUrl: '',
  });

  const [techString, setTechString] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        title: { ...project.title },
        subtitle: { ...project.subtitle },
        category: project.category,
        period: project.period,
        summary: { ...project.summary },
        challenge: { ...project.challenge },
        solution: { ...project.solution },
        keyOutcomes: {
          de: [...project.keyOutcomes.de],
          en: [...project.keyOutcomes.en],
        },
        technologies: [...project.technologies],
        featured: !!project.featured,
        imageUrl: project.imageUrl || '',
      });
      setTechString(project.technologies.join(', '));
    } else {
      setFormData({
        title: { de: '', en: '' },
        subtitle: { de: '', en: '' },
        category: 'network',
        period: '2026',
        summary: { de: '', en: '' },
        challenge: { de: '', en: '' },
        solution: { de: '', en: '' },
        keyOutcomes: { de: [''], en: [''] },
        technologies: [],
        featured: false,
        imageUrl: '',
      });
      setTechString('');
    }
  }, [project, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(language === 'de' ? 'Das Bild ist zu groß (max. 5 MB).' : 'Image is too large (max 5MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const techs = techString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const cleanDeOutcomes = formData.keyOutcomes.de.filter((o) => o.trim().length > 0);
    const cleanEnOutcomes = formData.keyOutcomes.en.filter((o) => o.trim().length > 0);

    const dataToSave = {
      ...formData,
      technologies: techs.length ? techs : ['IT Systemintegration'],
      keyOutcomes: {
        de: cleanDeOutcomes.length ? cleanDeOutcomes : ['Erfolgreich implementiert'],
        en: cleanEnOutcomes.length ? cleanEnOutcomes : ['Successfully implemented'],
      },
    };

    if (isEditing && project) {
      updateProject(project.id, { ...dataToSave, id: project.id });
    } else {
      addProject(dataToSave);
    }
    onClose();
  };

  const handleDelete = () => {
    if (project && window.confirm(language === 'de' ? 'Dieses Projekt wirklich löschen?' : 'Delete this project?')) {
      deleteProject(project.id);
      onClose();
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
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              {isEditing
                ? language === 'de'
                  ? 'IT-Projekt bearbeiten'
                  : 'Edit IT Project'
                : language === 'de'
                ? 'Neues IT-Projekt anlegen'
                : 'Create New IT Project'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {language === 'de'
                ? 'Erfassen Sie technische Spezifikationen, Herausforderungen und Ergebnisse.'
                : 'Configure project specifications, architecture, challenge, and key results.'}
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
                {language === 'de' ? 'Projekttitel (Deutsch) *' : 'Project Title (German) *'}
              </label>
              <input
                type="text"
                required
                value={formData.title.de}
                onChange={(e) =>
                  setFormData({ ...formData, title: { ...formData.title, de: e.target.value } })
                }
                placeholder="z.B. SOHO-Netzwerk-Architektur & Heim-Lab"
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'de' ? 'Kategorie' : 'Category'}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              >
                <option value="network">network (Netzwerk)</option>
                <option value="support">support (Support & Rollout)</option>
                <option value="systems">systems (Hardware & Diagnose)</option>
                <option value="virtualization">virtualization (Virtualisierung)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'de' ? 'Projekttitel (Englisch)' : 'Project Title (English)'}
              </label>
              <input
                type="text"
                value={formData.title.en}
                onChange={(e) =>
                  setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })
                }
                placeholder="e.g. SOHO Network Architecture & Home Lab"
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'de' ? 'Zeitraum' : 'Period'}
              </label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="z.B. 2025 – 2026"
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {language === 'de' ? 'Kurze Zusammenfassung' : 'Summary'}
            </label>
            <textarea
              rows={2}
              value={formData.summary.de}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  summary: { ...formData.summary, de: e.target.value, en: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {language === 'de' ? 'Herausforderung / Problemstellung' : 'Challenge'}
            </label>
            <textarea
              rows={2}
              value={formData.challenge.de}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  challenge: { ...formData.challenge, de: e.target.value, en: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {language === 'de' ? 'Technische Lösung' : 'Solution'}
            </label>
            <textarea
              rows={2}
              value={formData.solution.de}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  solution: { ...formData.solution, de: e.target.value, en: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {language === 'de' ? 'Technologien (durch Kommas getrennt)' : 'Technologies (comma-separated)'}
            </label>
            <input
              type="text"
              value={techString}
              onChange={(e) => setTechString(e.target.value)}
              placeholder="z.B. IPv4 Subnetting, DHCP, DNS, Cat 6, Windows 11"
              className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
            />
          </div>

          {/* Project Screenshot / Photo Upload */}
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {language === 'de' ? 'Projekt-Foto / Screenshot / Diagramm' : 'Project Photo / Screenshot / Diagram'}
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-sky-500" />
                <span>{language === 'de' ? 'Foto / Screenshot hochladen' : 'Upload Photo / Screenshot'}</span>
              </button>

              {formData.imageUrl && (
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-md overflow-hidden border border-neutral-300 dark:border-neutral-700 relative">
                    <img src={formData.imageUrl} alt="Project Preview" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, imageUrl: '' }))}
                    className="text-xs text-rose-500 hover:underline"
                  >
                    {language === 'de' ? 'Entfernen' : 'Remove'}
                  </button>
                </div>
              )}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              {language === 'de'
                ? 'Laden Sie ein Foto Ihrer Verkabelung, Ihres Test-Labs, Terminal-Screenshots oder Netzwerk-Diagramms hoch.'
                : 'Upload a photo of your cabling, home lab setup, terminal output, or topology diagram.'}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="proj-featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded-sm border-neutral-300 text-sky-600 focus:ring-sky-500"
            />
            <label htmlFor="proj-featured" className="text-neutral-700 dark:text-neutral-300 font-medium">
              {language === 'de' ? 'Als hervorgehobenes Projekt markieren' : 'Mark as featured project'}
            </label>
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
