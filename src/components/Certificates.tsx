import React, { useState, useRef } from 'react';
import { Award, FileText, Download, ExternalLink, Plus, Trash2, Upload, Eye, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { CertificationItem, Language } from '../types';
import { UploadDocumentModal } from './UploadDocumentModal';

interface CertificatesProps {
  language: Language;
}

export const Certificates: React.FC<CertificatesProps> = ({ language }) => {
  const { data, isEditMode, deleteCertification, uploadCertificateDocument, removeCertificateDocument, currentScheme } = usePortfolio();
  const { certifications } = data;

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCertForView, setSelectedCertForView] = useState<CertificationItem | null>(null);
  const [targetCertIdForFile, setTargetCertIdForFile] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDirectFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetCertIdForFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      uploadCertificateDocument(targetCertIdForFile, dataUrl, file.name);
      setTargetCertIdForFile(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const triggerUploadForCert = (certId: string) => {
    setTargetCertIdForFile(certId);
    fileInputRef.current?.click();
  };

  return (
    <section id="certs" className="py-20 bg-[#080711] relative border-b border-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${currentScheme.accentText}`}>
              {language === 'de' ? 'Qualifikationen & Nachweise' : 'Credentials & Official Documents'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {language === 'de'
                ? 'Zertifikate, Zeugnisse & Dokumente'
                : 'Certificates, Diplomas & Document Uploads'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-xl">
              {language === 'de'
                ? 'Amtliche Gleichwertigkeitsbescheinigungen, Sprachzertifikate, Praktikumszeugnisse und Ausbildungsnachweise.'
                : 'Official certificates of equivalence, language diplomas, internship evaluations, and credentials.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isEditMode && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r ${currentScheme.gradientButton} hover:opacity-95 rounded-xl shadow-lg transition-all`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'de' ? '+ Zertifikat hochladen' : '+ Upload Document'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Hidden File Input for Direct Per-Card Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleDirectFileUpload}
          className="hidden"
        />

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => {
            const hasDocument = !!cert.documentUrl;

            return (
              <div
                key={cert.id}
                className="bg-[#121124] border border-purple-900/30 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:border-purple-800/50 transition-all group"
              >
                <div>
                  {/* Top Metadata */}
                  <div className="flex items-center justify-between gap-2 mb-3 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0d0c1d] border border-purple-900/40 text-purple-300 font-medium text-[11px]">
                      {cert.categoryBadge}
                    </span>
                    <span className="text-neutral-400 font-mono text-[11px] tabular-nums">
                      {cert.issuedDate}
                    </span>
                  </div>

                  {/* Title & Issuer */}
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-pink-300 transition-colors">
                    {cert.title[language]}
                  </h3>
                  <div className="text-xs text-neutral-400 font-medium mb-3">
                    {cert.issuer}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                    {cert.description[language]}
                  </p>

                  {/* Attached Document Preview Thumbnail */}
                  {hasDocument && (
                    <div
                      onClick={() => setSelectedCertForView(cert)}
                      className="mb-4 p-2.5 rounded-xl bg-[#0a0916] border border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {cert.fileType === 'pdf' ? (
                          <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-md overflow-hidden shrink-0 border border-emerald-500/20">
                            <img src={cert.documentUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-emerald-300 truncate block">
                            {cert.fileName || 'Dokument angehängt'}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            {language === 'de' ? 'Klicken zum Ansehen' : 'Click to preview'}
                          </span>
                        </div>
                      </div>
                      <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-purple-900/20 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {hasDocument ? (
                      <button
                        onClick={() => setSelectedCertForView(cert)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-400 hover:text-pink-300 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{language === 'de' ? 'Vorschau' : 'View File'}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                        <span>{language === 'de' ? 'Nachweisbar' : 'Verified'}</span>
                      </span>
                    )}
                  </div>

                  {isEditMode && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => triggerUploadForCert(cert.id)}
                        className="p-1.5 text-neutral-400 hover:text-pink-400 hover:bg-neutral-800 rounded-lg transition-colors text-xs flex items-center gap-1"
                        title={language === 'de' ? 'Datei / Foto hochladen' : 'Upload File'}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span className="text-[11px] hidden sm:inline">
                          {hasDocument ? (language === 'de' ? 'Tauschen' : 'Replace') : (language === 'de' ? 'Hochladen' : 'Upload')}
                        </span>
                      </button>
                      {hasDocument && (
                        <button
                          onClick={() => {
                            if (window.confirm(language === 'de' ? `Angehängtes Dokument von „${cert.title[language]}“ dauerhaft löschen?` : `Permanently delete document from „${cert.title[language]}“?`)) {
                              removeCertificateDocument(cert.id);
                            }
                          }}
                          className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors text-xs"
                          title={language === 'de' ? 'Nur Dokument löschen' : 'Delete document file'}
                        >
                          <FileText className="w-3.5 h-3.5 text-rose-400" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm(language === 'de' ? `Zertifikat „${cert.title[language]}“ löschen?` : `Delete certificate „${cert.title[language]}“?`)) {
                            deleteCertification(cert.id);
                          }
                        }}
                        className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                        title="Zertifikat löschen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Preview Modal for Uploaded Certificates */}
      {selectedCertForView && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setSelectedCertForView(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl border border-purple-800/40 bg-[#121124] text-white overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-purple-900/30 bg-[#0d0c1d]">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {selectedCertForView.title[language]}
                </h3>
                <span className="text-xs text-neutral-400">
                  {selectedCertForView.issuer} · {selectedCertForView.issuedDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {selectedCertForView.documentUrl && (
                  <a
                    href={selectedCertForView.documentUrl}
                    download={selectedCertForView.fileName || 'Zertifikat'}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                    title="Herunterladen"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => setSelectedCertForView(null)}
                  className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Content View */}
            <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center bg-[#070611]">
              {selectedCertForView.documentUrl ? (
                selectedCertForView.fileType === 'pdf' ? (
                  <iframe
                    src={selectedCertForView.documentUrl}
                    title="Certificate Document"
                    className="w-full h-[65vh] rounded-lg border border-purple-900/30"
                  />
                ) : (
                  <img
                    src={selectedCertForView.documentUrl}
                    alt={selectedCertForView.title[language]}
                    className="max-h-[70vh] max-w-full rounded-lg object-contain border border-purple-900/30 shadow-lg"
                  />
                )
              ) : (
                <div className="py-16 text-center text-neutral-400 text-sm">
                  <FileText className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                  <p>{language === 'de' ? 'Kein Dokumentendatei angehängt.' : 'No document file attached yet.'}</p>
                </div>
              )}
            </div>

            {/* Lightbox Footer */}
            <div className="px-5 py-3 border-t border-purple-900/30 bg-[#0d0c1d] flex items-center justify-between text-xs text-neutral-400">
              <span>{selectedCertForView.description[language]}</span>
              <button
                onClick={() => setSelectedCertForView(null)}
                className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg"
              >
                {language === 'de' ? 'Schließen' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        language={language}
      />
    </section>
  );
};
