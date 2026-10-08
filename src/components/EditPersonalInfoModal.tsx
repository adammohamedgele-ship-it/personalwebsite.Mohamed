import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Language, PersonalInfo } from '../types';

interface EditPersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const EditPersonalInfoModal: React.FC<EditPersonalInfoModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const { data, updatePersonalInfo } = usePortfolio();
  const [formData, setFormData] = useState<PersonalInfo>(data.personalInfo);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePersonalInfo(formData);
    onClose();
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
              {language === 'de' ? 'Persönliche Angaben & Header bearbeiten' : 'Edit Personal Info & Header'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {language === 'de'
                ? 'Passen Sie Ihren Namen, Titel, Kontakt und Kurzbiografie an.'
                : 'Customize your name, target title, contact details, and summary bio.'}
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
          {/* Avatar Photo Upload section */}
          <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-[#0d0c1d] border border-neutral-200 dark:border-purple-900/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-pink-500/60 bg-neutral-800 shrink-0 flex items-center justify-center">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-base">MA</span>
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                  {language === 'de' ? 'Profilfoto / Bewerbungsbild' : 'Profile Photo'}
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {formData.avatarUrl
                    ? (language === 'de' ? 'Eigenes Foto aktiv' : 'Custom photo active')
                    : (language === 'de' ? 'Standard-Grafik aktiv' : 'Default illustration active')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs transition-colors shadow-xs">
                {formData.avatarUrl ? (language === 'de' ? 'Foto ändern' : 'Change') : (language === 'de' ? 'Foto hochladen' : 'Upload')}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const dataUrl = ev.target?.result as string;
                      if (dataUrl) {
                        setFormData({ ...formData, avatarUrl: dataUrl });
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>

              {formData.avatarUrl && (
                <button
                  type="button"
                  onClick={() => {
                    const copy = { ...formData };
                    delete copy.avatarUrl;
                    setFormData(copy);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-rose-500 text-xs"
                >
                  {language === 'de' ? 'Entfernen' : 'Remove'}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'de' ? 'Vollständiger Name' : 'Full Name'}
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'de' ? 'Rufname / Kurzname' : 'Short Name'}
              </label>
              <input
                type="text"
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'de' ? 'Titel / Profil (Deutsch)' : 'Title / Profile (German)'}
              </label>
              <input
                type="text"
                value={formData.headline.de}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    headline: { ...formData.headline, de: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'de' ? 'Titel / Profil (Englisch)' : 'Title / Profile (English)'}
              </label>
              <input
                type="text"
                value={formData.headline.en}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    headline: { ...formData.headline, en: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                E-Mail
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'de' ? 'Telefon' : 'Phone'}
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'de' ? 'Anschrift' : 'Address'}
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'de' ? 'Führerschein' : 'Driver License'}
              </label>
              <input
                type="text"
                value={formData.driverLicense.de}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    driverLicense: { ...formData.driverLicense, de: e.target.value, en: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {language === 'de' ? 'Kurzbeschreibung (Deutsch)' : 'Short Bio (German)'}
            </label>
            <textarea
              rows={3}
              value={formData.bioShort.de}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bioShort: { ...formData.bioShort, de: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {language === 'de' ? 'Kurzbeschreibung (Englisch)' : 'Short Bio (English)'}
            </label>
            <textarea
              rows={3}
              value={formData.bioShort.en}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bioShort: { ...formData.bioShort, en: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'de' ? 'Verfügbarkeit / Status' : 'Availability / Status'}
              </label>
              <input
                type="text"
                value={formData.availability.de}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availability: { de: e.target.value, en: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'de' ? 'Hobbys (kommagetrennt)' : 'Hobbies (comma-separated)'}
              </label>
              <input
                type="text"
                value={formData.hobbies.de.join(', ')}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                  setFormData({
                    ...formData,
                    hobbies: { de: arr, en: arr },
                  });
                }}
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2">
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
              <span>{language === 'de' ? 'Speichern' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
