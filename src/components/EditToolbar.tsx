import React, { useRef, useState } from 'react';
import { Pencil, RotateCcw, Download, Upload, Check, X, AlertCircle, Palette, FileText, Award, Shield } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Language } from '../types';

interface EditToolbarProps {
  language: Language;
  onOpenDesignCustomizer?: () => void;
  onOpenUploadDocument?: () => void;
  onOpenImportContent?: () => void;
  onOpenAdminDashboard?: () => void;
}

export const EditToolbar: React.FC<EditToolbarProps> = ({
  language,
  onOpenDesignCustomizer,
  onOpenUploadDocument,
  onOpenImportContent,
  onOpenAdminDashboard,
}) => {
  const {
    isEditMode,
    toggleEditMode,
    resetToDefaults,
    exportDataAsJSON,
    importDataFromJSON,
    hasCustomChanges,
    currentScheme,
    publishChanges,
  } = usePortfolio();

  const [confirmReset, setConfirmReset] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isEditMode) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataFromJSON(content);
        if (success) {
          setImportNotice(language === 'de' ? 'Erfolgreich importiert!' : 'Import successful!');
        } else {
          setImportNotice(language === 'de' ? 'Ungültiges Dateiformat' : 'Invalid file format');
        }
        setTimeout(() => setImportNotice(null), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="no-print fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-50 max-w-xl animate-in slide-in-from-bottom-3 duration-200">
      <div className="p-3.5 sm:p-4 rounded-xl border border-neutral-700 bg-[#121124]/95 text-white shadow-2xl backdrop-blur-md flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
            </span>
            <span className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
              <Pencil className="w-3.5 h-3.5 text-pink-400" />
              {language === 'de' ? 'Live-Bearbeitungsmodus aktiv' : 'Live Edit Mode Active'}
            </span>
          </div>

          <button
            onClick={toggleEditMode}
            className="px-2.5 py-1 text-[11px] font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors flex items-center gap-1"
          >
            <span>{language === 'de' ? 'Vorschau / Beenden' : 'Done Editing'}</span>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>

        {/* Quick Creator / Studio Action Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 pb-0.5">
          {onOpenAdminDashboard && (
            <button
              onClick={onOpenAdminDashboard}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-[11px] font-semibold rounded-lg bg-pink-600 hover:bg-pink-500 text-white transition-all shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{language === 'de' ? 'Admin Studio' : 'Admin Studio'}</span>
            </button>
          )}

          <button
            onClick={onOpenDesignCustomizer}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-[11px] font-semibold rounded-lg bg-gradient-to-r from-purple-700 to-pink-600 hover:opacity-95 text-white transition-all shadow-sm"
          >
            <Palette className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{language === 'de' ? 'Design Studio' : 'Design Studio'}</span>
          </button>

          <button
            onClick={onOpenUploadDocument}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-[11px] font-semibold rounded-lg bg-[#1a1733] hover:bg-[#252148] border border-purple-800/60 text-white transition-all"
          >
            <Award className="w-3.5 h-3.5 text-pink-400 shrink-0" />
            <span className="truncate">{language === 'de' ? '+ Zertifikat' : '+ Certificate'}</span>
          </button>

          <button
            onClick={onOpenImportContent}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-[11px] font-semibold rounded-lg bg-[#1a1733] hover:bg-[#252148] border border-purple-800/60 text-white transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-pink-400 shrink-0" />
            <span className="truncate">{language === 'de' ? '+ Text / Import' : '+ Import Text'}</span>
          </button>
        </div>

        <p className="text-[11px] text-neutral-300 leading-snug">
          {language === 'de'
            ? 'Klicken Sie auf Stift-Icons (✏️) oder „+ Hinzufügen“, um Texte, Fotos und Zertifikate zu editieren.'
            : 'Click pencil icons (✏️) or "+ Add" to customize texts, photos, and certificates directly.'}
        </p>

        {importNotice && (
          <div className="text-[11px] font-semibold text-pink-300 bg-pink-950/70 p-1.5 rounded-md border border-pink-800 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{importNotice}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-800 text-[11px]">
          <div className="flex items-center gap-2">
            <button
              onClick={exportDataAsJSON}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-700 rounded-md transition-colors"
              title="Daten als JSON-Datei speichern"
            >
              <Download className="w-3 h-3 text-pink-400" />
              <span>{language === 'de' ? 'Backup (JSON)' : 'Backup (JSON)'}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-700 rounded-md transition-colors"
              title="Gespeichertes JSON-Backup wiederherstellen"
            >
              <Upload className="w-3 h-3 text-pink-400" />
              <span>{language === 'de' ? 'Wiederherstellen' : 'Restore'}</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>

          {/* Reset to CV Defaults */}
          {confirmReset ? (
            <div className="flex items-center gap-1.5 bg-rose-950/80 border border-rose-800 p-1 rounded-md">
              <span className="text-[10px] text-rose-200">
                {language === 'de' ? 'Sicher zurücksetzen?' : 'Reset to default CV?'}
              </span>
              <button
                onClick={() => {
                  resetToDefaults();
                  setConfirmReset(false);
                }}
                className="px-1.5 py-0.5 text-[10px] bg-rose-600 hover:bg-rose-500 text-white rounded-xs font-semibold"
              >
                {language === 'de' ? 'Ja' : 'Yes'}
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-1.5 py-0.5 text-[10px] bg-neutral-800 text-neutral-300 rounded-xs"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1 text-neutral-400 hover:text-rose-400 transition-colors"
              title="Auf Originaldaten aus dem hochgeladenen Lebenslauf zurücksetzen"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{language === 'de' ? 'Original-CV' : 'Default CV'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
