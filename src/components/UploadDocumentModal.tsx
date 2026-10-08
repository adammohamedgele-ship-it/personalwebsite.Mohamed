import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { CertificationItem, Language } from '../types';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const { addCertification } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [titleDe, setTitleDe] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [issuer, setIssuer] = useState('');
  const [categoryBadge, setCategoryBadge] = useState('Zertifikat');
  const [issuedDate, setIssuedDate] = useState('');
  const [descriptionDe, setDescriptionDe] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');

  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'pdf' | 'document'>('image');
  const [fileError, setFileError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);

    // Limit to reasonable size for browser local storage (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError(language === 'de' ? 'Datei ist zu groß (max. 5 MB)' : 'File is too large (max 5MB)');
      return;
    }

    setFileName(file.name);
    const isPdf = file.type.includes('pdf');
    setFileType(isPdf ? 'pdf' : 'image');

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFileDataUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleDe.trim()) return;

    const newCert: Omit<CertificationItem, 'id'> = {
      title: {
        de: titleDe.trim(),
        en: titleEn.trim() || titleDe.trim(),
      },
      issuer: issuer.trim() || 'Hamburg',
      categoryBadge: categoryBadge.trim() || 'Zertifikat',
      accentColor: '#10b981',
      description: {
        de: descriptionDe.trim() || titleDe.trim(),
        en: descriptionEn.trim() || titleEn.trim() || titleDe.trim(),
      },
      issuedDate: issuedDate.trim() || new Date().getFullYear().toString(),
      documentUrl: fileDataUrl || undefined,
      fileName: fileName || undefined,
      fileType: fileType,
    };

    addCertification(newCert);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setTitleDe('');
    setTitleEn('');
    setIssuer('');
    setCategoryBadge('Zertifikat');
    setIssuedDate('');
    setDescriptionDe('');
    setDescriptionEn('');
    setFileDataUrl(null);
    setFileName(null);
    setFileError(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl border border-purple-900/40 bg-[#121124] text-white p-6 sm:p-7 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-purple-900/30">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-pink-400" />
              <span>
                {language === 'de'
                  ? 'Zertifikat / Dokument hochladen'
                  : 'Upload Certificate or Document'}
              </span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              {language === 'de'
                ? 'Laden Sie Zeugnisse, Zertifikate, Bestätigungen oder Ausweise als Bild oder PDF hoch.'
                : 'Upload diplomas, language certificates, or credential scans as an image or PDF.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* File Upload Drop Area */}
          <div>
            <label className="block text-neutral-300 font-semibold mb-1.5">
              {language === 'de' ? 'Datei auswählen (Bild oder PDF)' : 'Select File (Image or PDF)'}
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                fileDataUrl
                  ? 'border-emerald-500/60 bg-emerald-950/20'
                  : 'border-purple-800 hover:border-pink-500/60 bg-[#0d0c1d] hover:bg-[#141228]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              {fileDataUrl ? (
                <div className="flex flex-col items-center gap-2">
                  {fileType === 'pdf' ? (
                    <FileText className="w-10 h-10 text-emerald-400" />
                  ) : (
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-emerald-500/40 relative">
                      <img src={fileDataUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>{fileName}</span>
                  </div>
                  <span className="text-[11px] text-neutral-400 underline hover:text-white">
                    {language === 'de' ? 'Anderes Dokument wählen' : 'Choose different file'}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-purple-950/70 border border-purple-800 flex items-center justify-center text-pink-400">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white">
                      {language === 'de' ? 'Hier klicken zum Auswählen' : 'Click to select document'}
                    </span>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      JPG, PNG, WebP oder PDF (max. 5 MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {fileError && (
              <div className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{fileError}</span>
              </div>
            )}
          </div>

          {/* Title Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                {language === 'de' ? 'Titel / Bezeichnung (Deutsch)' : 'Title (German)'} *
              </label>
              <input
                type="text"
                required
                placeholder="z.B. DTZ B1 Sprachzertifikat"
                value={titleDe}
                onChange={(e) => setTitleDe(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0a0916] border border-purple-900/50 text-white placeholder:text-neutral-500 focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                {language === 'de' ? 'Titel / Bezeichnung (Englisch)' : 'Title (English)'}
              </label>
              <input
                type="text"
                placeholder="e.g. DTZ B1 Language Certificate"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0a0916] border border-purple-900/50 text-white placeholder:text-neutral-500 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Issuer & Date & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                {language === 'de' ? 'Aussteller / Institution' : 'Issuer'}
              </label>
              <input
                type="text"
                placeholder="z.B. BAMF, AWO, Schulbehörde"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0a0916] border border-purple-900/50 text-white placeholder:text-neutral-500 focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                {language === 'de' ? 'Kategorie-Label' : 'Category Badge'}
              </label>
              <input
                type="text"
                placeholder="Zertifikat, Zeugnis, Nachweis"
                value={categoryBadge}
                onChange={(e) => setCategoryBadge(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0a0916] border border-purple-900/50 text-white placeholder:text-neutral-500 focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                {language === 'de' ? 'Datum / Zeitraum' : 'Date / Year'}
              </label>
              <input
                type="text"
                placeholder="z.B. Sep 2025"
                value={issuedDate}
                onChange={(e) => setIssuedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0a0916] border border-purple-900/50 text-white placeholder:text-neutral-500 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              {language === 'de' ? 'Kurzbeschreibung (Deutsch)' : 'Short Description (German)'}
            </label>
            <textarea
              rows={2}
              placeholder="Kurze Zusammenfassung des Dokuments..."
              value={descriptionDe}
              onChange={(e) => setDescriptionDe(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#0a0916] border border-purple-900/50 text-white placeholder:text-neutral-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-purple-900/30 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-lg transition-colors"
            >
              {language === 'de' ? 'Abbrechen' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-lg shadow-md shadow-pink-500/25 flex items-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'de' ? 'Dokument speichern' : 'Save Document'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
