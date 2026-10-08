import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Check, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Language } from '../types';

interface ImportContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ImportContentModal: React.FC<ImportContentModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const { importDataFromJSON, updatePersonalInfo, addExperience, addSkill } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<'file' | 'paste'>('file');
  const [pastedText, setPastedText] = useState('');
  const [targetSection, setTargetSection] = useState<'bio' | 'experience' | 'skills' | 'json'>('bio');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      if (file.name.endsWith('.json')) {
        const success = importDataFromJSON(content);
        if (success) {
          setStatusMessage(language === 'de' ? 'Vollständiges Backup erfolgreich importiert!' : 'Full backup successfully imported!');
          setIsError(false);
          setTimeout(() => onClose(), 1200);
        } else {
          setStatusMessage(language === 'de' ? 'Fehler: Ungültiges JSON-Portfolio-Format' : 'Error: Invalid JSON portfolio format');
          setIsError(true);
        }
      } else {
        // Text / Markdown file
        setPastedText(content);
        setMode('paste');
        setStatusMessage(language === 'de' ? `Datei „${file.name}“ geladen. Wählen Sie den Zielbereich:` : `File „${file.name}“ loaded. Choose target:`);
        setIsError(false);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleApplyPastedText = () => {
    if (!pastedText.trim()) return;

    try {
      if (targetSection === 'bio') {
        updatePersonalInfo({
          bioShort: {
            de: pastedText.trim(),
            en: pastedText.trim(),
          },
        });
        setStatusMessage(language === 'de' ? 'Kurzbeschreibung erfolgreich aktualisiert!' : 'Bio successfully updated!');
        setIsError(false);
        setTimeout(() => onClose(), 1000);
      } else if (targetSection === 'experience') {
        addExperience({
          period: '2026',
          role: { de: pastedText.slice(0, 60), en: pastedText.slice(0, 60) },
          organization: 'Hamburg',
          location: 'Hamburg',
          type: 'work',
          description: { de: pastedText.trim(), en: pastedText.trim() },
          highlights: { de: [pastedText.slice(0, 80)], en: [pastedText.slice(0, 80)] },
        });
        setStatusMessage(language === 'de' ? 'Neue Station aus Text erstellt!' : 'New milestone created from text!');
        setIsError(false);
        setTimeout(() => onClose(), 1000);
      } else if (targetSection === 'skills') {
        const lines = pastedText.split('\n').map((l) => l.trim()).filter(Boolean);
        lines.forEach((line) => {
          addSkill(0, {
            name: line.replace(/^[•\-\*]\s*/, ''),
            level: 'Praktisch',
            context: { de: line, en: line },
          });
        });
        setStatusMessage(language === 'de' ? `${lines.length} Fähigkeiten hinzugefügt!` : `${lines.length} skills added!`);
        setIsError(false);
        setTimeout(() => onClose(), 1000);
      } else if (targetSection === 'json') {
        const success = importDataFromJSON(pastedText);
        if (success) {
          setStatusMessage(language === 'de' ? 'Portfolio erfolgreich aktualisiert!' : 'Portfolio updated successfully!');
          setIsError(false);
          setTimeout(() => onClose(), 1000);
        } else {
          setStatusMessage(language === 'de' ? 'Ungültiges JSON-Format' : 'Invalid JSON format');
          setIsError(true);
        }
      }
    } catch (e) {
      setStatusMessage(language === 'de' ? 'Fehler beim Verarbeiten' : 'Processing error');
      setIsError(true);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl border border-purple-800/40 bg-[#121124] text-white p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3 border-b border-purple-900/30">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-pink-400" />
              <span>{language === 'de' ? 'Text & Inhalte importieren' : 'Import Text & Content'}</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              {language === 'de'
                ? 'Laden Sie Textdateien hoch oder fügen Sie Absätze direkt in Ihre Website ein.'
                : 'Upload text files or paste snippets directly into sections.'}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-[#0a0916] rounded-xl border border-purple-900/40 text-xs">
          <button
            onClick={() => setMode('file')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
              mode === 'file'
                ? 'bg-pink-600 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {language === 'de' ? 'Datei hochladen (.txt, .md, .json)' : 'Upload File'}
          </button>
          <button
            onClick={() => setMode('paste')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
              mode === 'paste'
                ? 'bg-pink-600 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {language === 'de' ? 'Text direkt einfügen' : 'Paste Text'}
          </button>
        </div>

        {mode === 'file' ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-purple-800 hover:border-pink-500/60 rounded-xl p-8 text-center cursor-pointer bg-[#0d0c1d] hover:bg-[#141228] transition-all"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Upload className="w-10 h-10 text-pink-400 mx-auto mb-3" />
            <span className="text-xs font-bold text-white block">
              {language === 'de' ? 'Klicken Sie hier, um eine Datei auszuwählen' : 'Click to select a file'}
            </span>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Unterstützt Textdateien (.txt), Markdown (.md) und JSON-Backups
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                {language === 'de' ? 'Zielbereich auswählen:' : 'Target Section:'}
              </label>
              <select
                value={targetSection}
                onChange={(e) => setTargetSection(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#0a0916] border border-purple-800 text-white"
              >
                <option value="bio">{language === 'de' ? 'Kurzbeschreibung / Bio' : 'Short Bio'}</option>
                <option value="experience">{language === 'de' ? 'Als neue Station im Werdegang hinzufügen' : 'Add as new Experience milestone'}</option>
                <option value="skills">{language === 'de' ? 'Fähigkeiten-Liste (zeilenweise)' : 'Skills list (line by line)'}</option>
                <option value="json">{language === 'de' ? 'JSON-Konfiguration' : 'JSON Configuration'}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                {language === 'de' ? 'Text oder Inhalte hier einfügen:' : 'Paste text content here:'}
              </label>
              <textarea
                rows={6}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder={
                  targetSection === 'skills'
                    ? 'Windows 11\nLinux Bash\nLAN-Verkabelung'
                    : 'Text hier eingeben...'
                }
                className="w-full px-3 py-2 text-xs rounded-lg bg-[#0a0916] border border-purple-800 text-white placeholder:text-neutral-500 font-mono"
              />
            </div>

            <button
              onClick={handleApplyPastedText}
              disabled={!pastedText.trim()}
              className="w-full py-2 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 disabled:opacity-50 rounded-lg transition-all"
            >
              {language === 'de' ? 'In Website einfügen' : 'Apply to Website'}
            </button>
          </div>
        )}

        {statusMessage && (
          <div
            className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
              isError ? 'bg-rose-950/60 text-rose-300 border border-rose-800' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
            }`}
          >
            {isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
            <span>{statusMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
