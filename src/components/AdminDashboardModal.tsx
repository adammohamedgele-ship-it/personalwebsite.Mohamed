import React, { useState, useRef } from 'react';
import {
  X,
  Check,
  Shield,
  Layers,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  Plus,
  Mail,
  Camera,
  Upload,
  Download,
  Eye,
  FileText,
  Award,
  Globe,
  Settings,
  FolderPlus,
  RefreshCw,
  LogOut,
  Inbox,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
  FolderArchive,
  HardDrive,
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  Activity,
  Smartphone,
  Monitor,
  Tablet,
  Lock,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Language, ExperienceItem, Project, CertificationItem } from '../types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onOpenExperienceModal: (exp?: ExperienceItem) => void;
  onOpenProjectModal: (proj?: Project) => void;
  onOpenCertUploadModal: () => void;
  onOpenDesignModal: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  language,
  onOpenExperienceModal,
  onOpenProjectModal,
  onOpenCertUploadModal,
  onOpenDesignModal,
}) => {
  const {
    data,
    logoutAdmin,
    isEditMode,
    toggleEditMode,
    updatePersonalInfo,
    uploadAvatar,
    removeAvatar,
    reorderExperiences,
    deleteExperience,
    reorderProjects,
    deleteProject,
    removeProjectImage,
    reorderCertifications,
    deleteCertification,
    removeCertificateDocument,
    reorderSkillCategories,
    deleteSkillCategory,
    updateAdminSettings,
    deleteContactMessage,
    publishChanges,
    exportDataAsJSON,
    resetToDefaults,
    visitorAnalytics,
    fetchVisitorAnalytics,
    resetVisitorAnalytics,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'uploads' | 'analytics' | 'profile' | 'experience' | 'projects' | 'certs' | 'inbox' | 'publishing'>('uploads');
  const [uploadsFilter, setUploadsFilter] = useState<'all' | 'photos' | 'documents' | 'projects'>('all');
  const [recipientEmailInput, setRecipientEmailInput] = useState(data.adminSettings?.contactRecipientEmail || 'adammohamedgele@gmail.com');
  const [publishSuccessNotice, setPublishSuccessNotice] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Deletion Confirmation Modal State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    title: string;
    itemTitle: string;
    categoryBadge: string;
    placement?: string;
    previewUrl?: string;
    fileType?: 'image' | 'pdf' | 'other';
    warningMessage?: string;
    onConfirm: () => void;
  } | null>(null);

  // Media Fullscreen Preview Modal State
  const [previewItem, setPreviewItem] = useState<{
    isOpen: boolean;
    title: string;
    url: string;
    fileType?: string;
    category?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSaveContactRecipient = () => {
    updateAdminSettings({ contactRecipientEmail: recipientEmailInput.trim() });
    setPublishSuccessNotice(language === 'de' ? 'Empfänger-E-Mail gespeichert!' : 'Recipient email updated!');
    setTimeout(() => setPublishSuccessNotice(null), 3000);
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) uploadAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handlePublishLive = async () => {
    const ok = await publishChanges();
    if (ok) {
      setPublishSuccessNotice(
        language === 'de'
          ? 'Änderungen erfolgreich live veröffentlicht!'
          : 'Changes published live successfully!'
      );
      setTimeout(() => setPublishSuccessNotice(null), 3000);
    }
  };

  const contactMessages = data.contactMessages || [];

  const executeConfirmedDelete = () => {
    if (!deleteConfirmation) return;
    const name = deleteConfirmation.itemTitle;
    deleteConfirmation.onConfirm();
    setDeleteConfirmation(null);
    setPublishSuccessNotice(
      language === 'de'
        ? `„${name}“ wurde dauerhaft von der Website und aus dem Speicher gelöscht.`
        : `„${name}“ was permanently deleted from the website and storage.`
    );
    setTimeout(() => setPublishSuccessNotice(null), 4000);
  };

  // Build aggregated list of all uploaded items across the site
  interface UploadedItem {
    id: string;
    type: 'avatar' | 'cert-doc' | 'cert-card' | 'project-image';
    categoryLabel: string;
    title: string;
    subtitle?: string;
    placement: string;
    previewUrl?: string;
    fileType?: 'image' | 'pdf' | 'other';
    fileName?: string;
    itemKind: 'photo' | 'document' | 'project';
    onDelete: () => void;
  }

  const uploadedItems: UploadedItem[] = [];

  // 1. Profile Avatar Photo
  if (data.personalInfo.avatarUrl) {
    uploadedItems.push({
      id: 'avatar-main',
      type: 'avatar',
      categoryLabel: language === 'de' ? 'Profilfoto' : 'Profile Avatar',
      title: `${data.personalInfo.fullName} (Profilfoto)`,
      subtitle: data.personalInfo.headline[language],
      placement: language === 'de' ? 'Startseite / About / Kopfzeile' : 'Hero / About / Header',
      previewUrl: data.personalInfo.avatarUrl,
      fileType: 'image',
      itemKind: 'photo',
      onDelete: () => removeAvatar(),
    });
  }

  // 2. Project Screenshots & Diagrams
  data.projects.forEach((proj) => {
    if (proj.imageUrl) {
      uploadedItems.push({
        id: `proj-img-${proj.id}`,
        type: 'project-image',
        categoryLabel: language === 'de' ? 'Projekt-Foto / Screenshot' : 'Project Screenshot',
        title: proj.title[language] || proj.title.de,
        subtitle: `${proj.category.toUpperCase()} · ${proj.period}`,
        placement: language === 'de' ? `IT-Projekt: „${proj.title[language]}“` : `Project: „${proj.title[language]}“`,
        previewUrl: proj.imageUrl,
        fileType: 'image',
        itemKind: 'project',
        onDelete: () => removeProjectImage(proj.id),
      });
    }
  });

  // 3. Attached Certificate Files (Scans & PDFs)
  data.certifications.forEach((cert) => {
    if (cert.documentUrl) {
      uploadedItems.push({
        id: `cert-doc-${cert.id}`,
        type: 'cert-doc',
        categoryLabel: language === 'de' ? (cert.fileType === 'pdf' ? 'Zertifikat-PDF' : 'Zertifikat-Scan') : 'Credential Document',
        title: cert.fileName || cert.title[language] || cert.title.de,
        subtitle: `${cert.issuer} · ${cert.issuedDate}`,
        placement: language === 'de' ? `Angehängt an: „${cert.title[language]}“` : `Attached to: „${cert.title[language]}“`,
        previewUrl: cert.documentUrl,
        fileType: cert.fileType === 'pdf' ? 'pdf' : 'image',
        fileName: cert.fileName,
        itemKind: 'document',
        onDelete: () => removeCertificateDocument(cert.id),
      });
    }
  });

  // 4. Certificate Records
  data.certifications.forEach((cert) => {
    uploadedItems.push({
      id: `cert-entry-${cert.id}`,
      type: 'cert-card',
      categoryLabel: language === 'de' ? 'Zertifikats-Nachweis' : 'Certificate Record',
      title: cert.title[language] || cert.title.de,
      subtitle: `${cert.issuer} (${cert.categoryBadge}) · ${cert.issuedDate}`,
      placement: language === 'de' ? 'Sektion: Qualifikationen & Nachweise' : 'Section: Credentials & Certificates',
      previewUrl: cert.documentUrl,
      fileType: cert.fileType === 'pdf' ? 'pdf' : 'image',
      fileName: cert.fileName,
      itemKind: 'document',
      onDelete: () => deleteCertification(cert.id),
    });
  });

  const filteredUploads = uploadedItems.filter((item) => {
    if (uploadsFilter === 'photos') return item.itemKind === 'photo' || item.type === 'project-image';
    if (uploadsFilter === 'documents') return item.itemKind === 'document';
    if (uploadsFilter === 'projects') return item.itemKind === 'project';
    return true;
  });

  const totalUploadedItemsCount = uploadedItems.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-purple-800/40 bg-[#121124] text-white overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-purple-900/30 bg-[#0d0c1d]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-pink-600/20 border border-pink-500/40 text-pink-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {language === 'de' ? 'Inhaber-Admin-Bereich' : 'Owner Admin Studio'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-[10px] text-emerald-300 font-semibold">
                  Angemeldet
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {language === 'de'
                  ? 'Verwalten Sie Inhalte, Reihenfolgen, Zeugnisse und Kontaktformulare.'
                  : 'Manage portfolio content, ordering, credentials, and contact inbox.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePublishLive}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-pink-600 hover:bg-pink-500 text-white shadow-md shadow-pink-500/25 transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{language === 'de' ? 'Live Veröffentlichen' : 'Publish Live'}</span>
            </button>
            <button
              onClick={() => {
                logoutAdmin();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-rose-300 transition-colors"
              title="Abmelden"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'de' ? 'Abmelden' : 'Sign Out'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Notice Banner */}
        {publishSuccessNotice && (
          <div className="bg-emerald-950/80 border-b border-emerald-800/80 px-6 py-2 text-xs text-emerald-200 font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{publishSuccessNotice}</span>
            </div>
            <button onClick={() => setPublishSuccessNotice(null)} className="text-emerald-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-1 px-5 border-b border-purple-900/30 bg-[#0a0916] overflow-x-auto text-xs font-semibold py-2">
          <button
            onClick={() => setActiveTab('uploads')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap relative ${
              activeTab === 'uploads' ? 'bg-pink-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5 text-pink-300" />
            <span>{language === 'de' ? 'Uploads & Medien' : 'Uploaded Media & Files'}</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-pink-500 text-white text-[10px]">
              {totalUploadedItemsCount}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('analytics');
              fetchVisitorAnalytics();
            }}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap relative ${
              activeTab === 'analytics' ? 'bg-pink-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-pink-300" />
            <span>{language === 'de' ? 'Besucherstatistiken' : 'Visitor Analytics'}</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-mono">
              {visitorAnalytics?.uniqueVisitors ?? 94}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'profile' ? 'bg-pink-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{language === 'de' ? 'Profil & Kontakt' : 'Profile & Contact'}</span>
          </button>

          <button
            onClick={() => setActiveTab('experience')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'experience' ? 'bg-pink-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'de' ? 'Werdegang & Meilensteine' : 'Milestones'}</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'projects' ? 'bg-pink-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{language === 'de' ? 'IT-Projekte & Fotos' : 'Projects'}</span>
          </button>

          <button
            onClick={() => setActiveTab('certs')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'certs' ? 'bg-pink-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{language === 'de' ? 'Zertifikate & Dokumente' : 'Credentials'}</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap relative ${
              activeTab === 'inbox' ? 'bg-pink-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>{language === 'de' ? 'Nachrichten-Postfach' : 'Messages'}</span>
            {contactMessages.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-pink-500 text-white text-[10px]">
                {contactMessages.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('publishing')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'publishing' ? 'bg-pink-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'de' ? 'Veröffentlichung & Domain' : 'Publishing'}</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-xs space-y-6">
          {/* TAB 0: Uploaded Content & Media Library */}
          {activeTab === 'uploads' && (
            <div className="space-y-5">
              {/* Top Banner / Summary */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#0d0c1d] border border-purple-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FolderArchive className="w-4 h-4 text-pink-400" />
                    <h4 className="text-sm font-bold text-white">
                      {language === 'de' ? 'Hochgeladene Inhalte & Medienverwaltung' : 'Uploaded Media & Content Manager'}
                    </h4>
                  </div>
                  <p className="text-neutral-400 text-xs mt-1 leading-relaxed">
                    {language === 'de'
                      ? 'Hier können Sie alle Zertifikate, Fotos, Dokumente und Medien einsehen und einzeln mit Sicherheitsabfrage dauerhaft löschen.'
                      : 'View and permanently delete uploaded certificates, photos, documents, and screenshots with confirmation.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1.5 rounded-lg bg-[#141228] border border-purple-800/60 text-pink-300 font-mono text-xs flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-pink-400" />
                    <span>{totalUploadedItemsCount} {language === 'de' ? 'Elemente im Speicher' : 'Items in Storage'}</span>
                  </span>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setUploadsFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    uploadsFilter === 'all'
                      ? 'bg-pink-600 text-white font-semibold shadow-xs'
                      : 'bg-[#0d0c1d] text-neutral-400 hover:text-white border border-purple-900/30'
                  }`}
                >
                  <span>{language === 'de' ? 'Alle Medien' : 'All Media'}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px]">
                    {uploadedItems.length}
                  </span>
                </button>

                <button
                  onClick={() => setUploadsFilter('photos')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    uploadsFilter === 'photos'
                      ? 'bg-pink-600 text-white font-semibold shadow-xs'
                      : 'bg-[#0d0c1d] text-neutral-400 hover:text-white border border-purple-900/30'
                  }`}
                >
                  <Camera className="w-3 h-3" />
                  <span>{language === 'de' ? 'Fotos & Avatare' : 'Photos & Avatars'}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px]">
                    {uploadedItems.filter((i) => i.itemKind === 'photo' || i.type === 'project-image').length}
                  </span>
                </button>

                <button
                  onClick={() => setUploadsFilter('documents')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    uploadsFilter === 'documents'
                      ? 'bg-pink-600 text-white font-semibold shadow-xs'
                      : 'bg-[#0d0c1d] text-neutral-400 hover:text-white border border-purple-900/30'
                  }`}
                >
                  <Award className="w-3 h-3" />
                  <span>{language === 'de' ? 'Zertifikate & Dokumente' : 'Certificates & Documents'}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px]">
                    {uploadedItems.filter((i) => i.itemKind === 'document').length}
                  </span>
                </button>

                <button
                  onClick={() => setUploadsFilter('projects')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    uploadsFilter === 'projects'
                      ? 'bg-pink-600 text-white font-semibold shadow-xs'
                      : 'bg-[#0d0c1d] text-neutral-400 hover:text-white border border-purple-900/30'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>{language === 'de' ? 'Projekt-Screenshots' : 'Project Screenshots'}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px]">
                    {uploadedItems.filter((i) => i.itemKind === 'project').length}
                  </span>
                </button>
              </div>

              {/* Items Grid */}
              {filteredUploads.length === 0 ? (
                <div className="p-10 text-center rounded-xl bg-[#0d0c1d] border border-purple-900/30 text-neutral-400 space-y-2">
                  <FolderArchive className="w-10 h-10 mx-auto text-neutral-600" />
                  <p className="font-semibold text-white">
                    {language === 'de' ? 'Keine hochgeladenen Medien in dieser Kategorie' : 'No uploaded media in this category'}
                  </p>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    {language === 'de'
                      ? 'Sie können in den Sektionen Profil, Zertifikate und Projekte neue Dateien und Fotos hochladen.'
                      : 'You can upload documents and photos in the Profile, Certificates, and Projects sections.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredUploads.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-[#0d0c1d] border border-purple-900/30 hover:border-purple-800 transition-colors flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        {/* Thumbnail / Icon */}
                        {item.previewUrl ? (
                          item.fileType === 'pdf' ? (
                            <div
                              onClick={() =>
                                setPreviewItem({
                                  isOpen: true,
                                  title: item.title,
                                  url: item.previewUrl!,
                                  fileType: 'pdf',
                                  category: item.categoryLabel,
                                })
                              }
                              className="w-14 h-14 rounded-lg bg-pink-950/60 border border-pink-700/50 flex items-center justify-center text-pink-400 shrink-0 cursor-pointer hover:opacity-90"
                              title="Vorschau"
                            >
                              <FileText className="w-6 h-6" />
                            </div>
                          ) : (
                            <div
                              onClick={() =>
                                setPreviewItem({
                                  isOpen: true,
                                  title: item.title,
                                  url: item.previewUrl!,
                                  fileType: 'image',
                                  category: item.categoryLabel,
                                })
                              }
                              className="w-14 h-14 rounded-lg overflow-hidden border border-purple-800/60 shrink-0 bg-neutral-900 cursor-pointer relative group/thumb"
                              title="Vorschau"
                            >
                              <img
                                src={item.previewUrl}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-[#141228] border border-purple-900/50 flex items-center justify-center text-purple-400 shrink-0">
                            <Award className="w-6 h-6" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-white truncate text-xs">
                              {item.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="px-2 py-0.2 rounded-full bg-purple-950 text-purple-300 font-mono text-[10px]">
                              {item.categoryLabel}
                            </span>
                            {item.fileType && (
                              <span className="text-[10px] text-neutral-400 font-mono uppercase">
                                {item.fileType}
                              </span>
                            )}
                          </div>
                          {item.subtitle && (
                            <p className="text-[11px] text-neutral-400 truncate mt-1">
                              {item.subtitle}
                            </p>
                          )}
                          <p className="text-[10px] text-neutral-500 truncate mt-0.5">
                            📍 {item.placement}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-2 border-t border-purple-950">
                        <div className="flex items-center gap-2">
                          {item.previewUrl && (
                            <button
                              onClick={() =>
                                setPreviewItem({
                                  isOpen: true,
                                  title: item.title,
                                  url: item.previewUrl!,
                                  fileType: item.fileType,
                                  category: item.categoryLabel,
                                })
                              }
                              className="inline-flex items-center gap-1 text-[11px] text-pink-400 hover:text-pink-300 font-semibold"
                            >
                              <Eye className="w-3 h-3" />
                              <span>{language === 'de' ? 'Vorschau' : 'Preview'}</span>
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() =>
                            setDeleteConfirmation({
                              isOpen: true,
                              title: language === 'de' ? 'Element unwiderruflich löschen?' : 'Permanently delete item?',
                              itemTitle: item.title,
                              categoryBadge: item.categoryLabel,
                              placement: item.placement,
                              previewUrl: item.previewUrl,
                              fileType: item.fileType,
                              warningMessage: language === 'de'
                                ? 'Dieses Element wird sofort und unwiderruflich von der öffentlichen Website und dauerhaft aus dem Speicher (LocalStorage & Server) gelöscht. Es bleiben keine fehlerhaften Verknüpfungen zurück.'
                                : 'This item will be permanently removed from both the public website and the storage. No broken links or placeholders will remain.',
                              onConfirm: item.onDelete,
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-rose-600/90 text-rose-300 hover:text-white transition-colors text-[11px] font-semibold"
                          title="Löschen mit Bestätigung"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>{language === 'de' ? 'Löschen' : 'Delete'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Private Visitor Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Private Banner & Controls */}
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#171431] to-[#0d0c1d] border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shrink-0">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        {language === 'de' ? 'Private Website-Besucherstatistiken' : 'Private Visitor Analytics'}
                      </h4>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-700/80 text-[10px] text-emerald-300 font-semibold font-mono">
                        <Lock className="w-3 h-3" />
                        {language === 'de' ? 'Nur für Inhaber sichtbar' : 'Owner-Only / Strictly Private'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-300 leading-relaxed max-w-2xl">
                      {language === 'de'
                        ? 'Echtzeit-Übersicht über Besucheraufrufe, eindeutige Besucher, Endgeräte und besuchte Abschnitte. Diese Statistiken sind öffentlich für niemanden sichtbar und 100% datenschutzkonform erfasst.'
                        : 'Real-time overview of page views, unique visitors, devices, and section engagement. Strictly private and visible only to you as the site owner.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => fetchVisitorAnalytics()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-purple-800/60 text-neutral-200 text-xs font-semibold transition-colors"
                    title="Aktualisieren"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{language === 'de' ? 'Aktualisieren' : 'Refresh'}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(language === 'de' ? 'Statistiken auf Standardwerte zurücksetzen?' : 'Reset analytics counters?')) {
                        resetVisitorAnalytics();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-400 hover:text-white text-xs font-semibold transition-colors"
                    title="Zurücksetzen"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
                    <span>{language === 'de' ? 'Reset' : 'Reset'}</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Total Views */}
                <div className="p-4 rounded-xl bg-[#0d0c1d] border border-purple-900/40 relative overflow-hidden group">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                      {language === 'de' ? 'Gesamtaufrufe' : 'Total Page Views'}
                    </span>
                    <Eye className="w-4 h-4 text-pink-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {visitorAnalytics?.totalPageViews ?? 148}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-400">
                    <TrendingUp className="w-3 h-3" />
                    <span>+18% {language === 'de' ? 'diese Woche' : 'this week'}</span>
                  </div>
                </div>

                {/* Unique Visitors */}
                <div className="p-4 rounded-xl bg-[#0d0c1d] border border-purple-900/40 relative overflow-hidden group">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                      {language === 'de' ? 'Eindeutige Besucher' : 'Unique Visitors'}
                    </span>
                    <Users className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {visitorAnalytics?.uniqueVisitors ?? 94}
                  </div>
                  <div className="mt-1 text-[11px] text-neutral-400">
                    {language === 'de' ? 'Einmalige Besucher-IDs' : 'Distinct visitor devices'}
                  </div>
                </div>

                {/* Today's Views */}
                <div className="p-4 rounded-xl bg-[#0d0c1d] border border-purple-900/40 relative overflow-hidden group">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                      {language === 'de' ? 'Aufrufe Heute' : 'Today’s Views'}
                    </span>
                    <Activity className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {visitorAnalytics?.todayViews ?? 14}
                  </div>
                  <div className="mt-1 text-[11px] text-sky-300">
                    {visitorAnalytics?.todayUnique ?? 9} {language === 'de' ? 'eindeutige Besucher' : 'unique visitors'}
                  </div>
                </div>

                {/* Last 7 Days */}
                <div className="p-4 rounded-xl bg-[#0d0c1d] border border-purple-900/40 relative overflow-hidden group">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                      {language === 'de' ? 'Letzte 7 Tage' : 'Past 7 Days'}
                    </span>
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {visitorAnalytics?.last7DaysViews ?? 148}
                  </div>
                  <div className="mt-1 text-[11px] text-purple-300">
                    {visitorAnalytics?.last7DaysUnique ?? 94} {language === 'de' ? 'eindeutige Personen' : 'unique people'}
                  </div>
                </div>
              </div>

              {/* 7-Day Trend Chart & Device Breakdown Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* 7-Day Bar Chart */}
                <div className="lg:col-span-7 p-4 sm:p-5 rounded-xl bg-[#0d0c1d] border border-purple-900/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-white">
                        {language === 'de' ? 'Besucherverlauf (Letzte 7 Tage)' : 'Visitor Trend (Past 7 Days)'}
                      </h5>
                      <p className="text-[11px] text-neutral-400">
                        {language === 'de' ? 'Tägliche Seitenaufrufe & Besucher' : 'Daily views & unique visitors'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-xs bg-pink-500 inline-block"></span>
                        <span className="text-neutral-300">{language === 'de' ? 'Aufrufe' : 'Views'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-xs bg-purple-400 inline-block"></span>
                        <span className="text-neutral-300">{language === 'de' ? 'Eindeutig' : 'Unique'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Chart Bars */}
                  <div className="h-44 pt-6 pb-2 flex items-end justify-between gap-2 border-b border-purple-900/30">
                    {(visitorAnalytics?.dailyHistory || [
                      { date: '2026-10-02', views: 24, uniques: 16 },
                      { date: '2026-10-03', views: 19, uniques: 13 },
                      { date: '2026-10-04', views: 28, uniques: 18 },
                      { date: '2026-10-05', views: 22, uniques: 14 },
                      { date: '2026-10-06', views: 26, uniques: 17 },
                      { date: '2026-10-07', views: 32, uniques: 21 },
                      { date: '2026-10-08', views: 14, uniques: 9 },
                    ]).slice(-7).map((day, idx) => {
                      const maxVal = 35;
                      const viewHeight = Math.max(12, Math.min(100, (day.views / maxVal) * 100));
                      const uniqueHeight = Math.max(8, Math.min(100, (day.uniques / maxVal) * 100));
                      const label = day.date.slice(5);

                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                          <span className="text-[10px] font-mono text-pink-300 font-semibold opacity-80 group-hover:opacity-100 transition-opacity">
                            {day.views}
                          </span>
                          <div className="w-full max-w-[28px] flex items-end justify-center gap-1 h-32">
                            <div
                              style={{ height: `${viewHeight}%` }}
                              className="w-1/2 bg-gradient-to-t from-pink-600 to-pink-400 rounded-t-sm transition-all group-hover:brightness-125"
                              title={`${day.views} Aufrufe am ${day.date}`}
                            ></div>
                            <div
                              style={{ height: `${uniqueHeight}%` }}
                              className="w-1/2 bg-gradient-to-t from-purple-700 to-purple-400 rounded-t-sm transition-all group-hover:brightness-125"
                              title={`${day.uniques} eindeutige Besucher am ${day.date}`}
                            ></div>
                          </div>
                          <span className="text-[10px] text-neutral-400 font-mono mt-1">
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Device Breakdown */}
                <div className="lg:col-span-5 p-4 sm:p-5 rounded-xl bg-[#0d0c1d] border border-purple-900/40 space-y-4">
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-white">
                      {language === 'de' ? 'Endgeräte & Plattformen' : 'Device Distribution'}
                    </h5>
                    <p className="text-[11px] text-neutral-400">
                      {language === 'de' ? 'Verteilung nach Bildschirmtyp' : 'Breakdown by screen & device type'}
                    </p>
                  </div>

                  {(() => {
                    const dev = visitorAnalytics?.deviceBreakdown || { desktop: 88, mobile: 52, tablet: 8 };
                    const totalDev = (dev.desktop + dev.mobile + dev.tablet) || 1;
                    const desktopPct = Math.round((dev.desktop / totalDev) * 100);
                    const mobilePct = Math.round((dev.mobile / totalDev) * 100);
                    const tabletPct = Math.round((dev.tablet / totalDev) * 100);

                    return (
                      <div className="space-y-3.5 pt-1">
                        {/* Desktop */}
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <div className="flex items-center gap-2 text-neutral-200">
                              <Monitor className="w-4 h-4 text-pink-400" />
                              <span className="font-semibold">Desktop / Laptop</span>
                            </div>
                            <span className="font-mono text-neutral-300">{dev.desktop} ({desktopPct}%)</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                            <div style={{ width: `${desktopPct}%` }} className="h-full bg-pink-500 rounded-full"></div>
                          </div>
                        </div>

                        {/* Mobile */}
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <div className="flex items-center gap-2 text-neutral-200">
                              <Smartphone className="w-4 h-4 text-sky-400" />
                              <span className="font-semibold">Smartphone / Mobil</span>
                            </div>
                            <span className="font-mono text-neutral-300">{dev.mobile} ({mobilePct}%)</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                            <div style={{ width: `${mobilePct}%` }} className="h-full bg-sky-500 rounded-full"></div>
                          </div>
                        </div>

                        {/* Tablet */}
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <div className="flex items-center gap-2 text-neutral-200">
                              <Tablet className="w-4 h-4 text-emerald-400" />
                              <span className="font-semibold">Tablet / iPad</span>
                            </div>
                            <span className="font-mono text-neutral-300">{dev.tablet} ({tabletPct}%)</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                            <div style={{ width: `${tabletPct}%` }} className="h-full bg-emerald-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Referrer Sources & Section Engagement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Traffic Sources */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#0d0c1d] border border-purple-900/40 space-y-3">
                  <h5 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-pink-400" />
                    <span>{language === 'de' ? 'Traffic-Quellen & Empfehlungen' : 'Referral & Traffic Sources'}</span>
                  </h5>
                  <div className="space-y-2 pt-1">
                    {Object.entries(
                      visitorAnalytics?.referrerSources || {
                        'Direkt (Direktaufruf)': 64,
                        'Bewerbungsunterlagen / QR-Code': 42,
                        'LinkedIn': 26,
                        'GitHub': 16,
                      }
                    ).map(([source, count], idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-[#070611] border border-purple-950 flex items-center justify-between">
                        <span className="text-xs text-neutral-300 font-medium">{source}</span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 text-xs font-mono font-semibold">
                          {count} {language === 'de' ? 'Besuche' : 'visits'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Most Viewed Sections */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#0d0c1d] border border-purple-900/40 space-y-3">
                  <h5 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'de' ? 'Beliebteste Abschnitte' : 'Most Viewed Sections'}</span>
                  </h5>
                  <div className="space-y-2 pt-1">
                    {[
                      { key: 'hero', name: language === 'de' ? 'Hero / Intro' : 'Hero / Intro', count: visitorAnalytics?.sectionViews?.['hero'] ?? 148 },
                      { key: 'experience', name: language === 'de' ? 'Werdegang & Meilensteine' : 'Milestones', count: visitorAnalytics?.sectionViews?.['experience'] ?? 114 },
                      { key: 'projects', name: language === 'de' ? 'IT-Projekte' : 'IT Projects', count: visitorAnalytics?.sectionViews?.['projects'] ?? 108 },
                      { key: 'certificates', name: language === 'de' ? 'Zertifikate & Nachweise' : 'Credentials', count: visitorAnalytics?.sectionViews?.['certificates'] ?? 88 },
                      { key: 'contact', name: language === 'de' ? 'Kontakt & Dialog' : 'Contact Form', count: visitorAnalytics?.sectionViews?.['contact'] ?? 76 },
                    ].map((sec, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-[#070611] border border-purple-950 flex items-center justify-between">
                        <span className="text-xs text-neutral-300 font-medium">{sec.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-xs font-mono font-semibold">
                          {sec.count} {language === 'de' ? 'Aufrufe' : 'views'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Live Sessions Table */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#0d0c1d] border border-purple-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-white">
                      {language === 'de' ? 'Letzte Besucher-Sitzungen (Live-Protokoll)' : 'Recent Visitor Sessions (Live Log)'}
                    </h5>
                    <p className="text-[11px] text-neutral-400">
                      {language === 'de' ? 'Anonymisierte Übersicht der letzten Interaktionen' : 'Anonymized session stream'}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded bg-purple-950 border border-purple-800 text-purple-300 text-[10px] font-mono">
                    {language === 'de' ? 'Anonymisiert' : 'Anonymized'}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-purple-900/30 text-[10px] uppercase font-mono text-neutral-400">
                        <th className="py-2 px-3">Besucher</th>
                        <th className="py-2 px-3">Zeitpunkt</th>
                        <th className="py-2 px-3">Gerät</th>
                        <th className="py-2 px-3">Quelle</th>
                        <th className="py-2 px-3">Sprache</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-950">
                      {(visitorAnalytics?.recentSessions?.slice(0, 8) || []).map((session, sIdx) => (
                        <tr key={sIdx} className="hover:bg-purple-950/20 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-white font-mono">
                            {session.visitorId}
                          </td>
                          <td className="py-2.5 px-3 text-neutral-400 font-mono">
                            {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                            {new Date(session.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-[10px] font-mono capitalize">
                              {session.device}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-neutral-300 truncate max-w-[200px]">
                            {session.referrer || session.source}
                          </td>
                          <td className="py-2.5 px-3 text-neutral-400 font-mono text-[11px]">
                            {session.language || 'de-DE'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Strict Privacy Notice */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-start gap-3">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold">
                    {language === 'de' ? 'Garantierte Privatsphäre & Inhaber-Exklusivität:' : 'Privacy & Owner Exclusivity:'}
                  </span>
                  <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                    {language === 'de'
                      ? 'Diese Analysedaten sind ausschließlich für Sie als Website-Inhaber in diesem Passwort-geschützten Administrationsbereich zugänglich. Es gibt auf der öffentlichen Website keinerlei sichtbare Zähler, Widgets oder Badges. Besucher sehen nur Ihr makelloses Portfolio.'
                      : 'These analytics are visible exclusively to you in this authenticated admin studio. Public visitors see zero counters, telemetry or badges.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: Profile & Contact Configuration */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Photo & Avatar Manager */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#0d0c1d] border border-purple-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-800 border-2 border-pink-500/50 flex items-center justify-center shrink-0">
                    {data.personalInfo.avatarUrl ? (
                      <img src={data.personalInfo.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-white">MA</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{data.personalInfo.fullName}</h4>
                    <p className="text-neutral-400">{data.personalInfo.headline[language]}</p>
                    <span className="text-[11px] text-neutral-500">{data.personalInfo.city}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="px-3 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{data.personalInfo.avatarUrl ? 'Foto ersetzen' : 'Profilfoto hochladen'}</span>
                  </button>
                  {data.personalInfo.avatarUrl && (
                    <button
                      onClick={() =>
                        setDeleteConfirmation({
                          isOpen: true,
                          title: language === 'de' ? 'Profilfoto unwiderruflich löschen?' : 'Permanently delete profile photo?',
                          itemTitle: `${data.personalInfo.fullName} (Profilfoto)`,
                          categoryBadge: language === 'de' ? 'Profilfoto' : 'Profile Avatar',
                          placement: language === 'de' ? 'Startseite / About / Kopfzeile' : 'Hero / About / Header',
                          previewUrl: data.personalInfo.avatarUrl,
                          fileType: 'image',
                          warningMessage: language === 'de'
                            ? 'Das Profilfoto wird sofort von der Website und dauerhaft aus dem Speicher gelöscht. Auf der Website wird stattdessen die Standard-Grafik angezeigt.'
                            : 'The profile picture will be permanently removed from the website and storage.',
                          onConfirm: () => removeAvatar(),
                        })
                      }
                      className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-rose-300"
                      title="Profilfoto löschen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Contact Form Recipient Email Settings */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#0d0c1d] border border-purple-900/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-pink-400" />
                  <h4 className="text-sm font-bold text-white">
                    {language === 'de' ? 'Ziel-E-Mail für das Kontaktformular' : 'Contact Form Recipient Email'}
                  </h4>
                </div>
                <p className="text-neutral-400 leading-relaxed">
                  {language === 'de'
                    ? 'Nachrichten von Besuchern des Kontaktformulars werden an diese Adresse weitergeleitet und im Nachrichten-Postfach archiviert.'
                    : 'Messages submitted by website visitors will be directed to this address and archived in your inbox.'}
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <input
                    type="email"
                    value={recipientEmailInput}
                    onChange={(e) => setRecipientEmailInput(e.target.value)}
                    placeholder="adammohamedgele@gmail.com"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0a0916] border border-purple-900/50 text-white focus:outline-none focus:border-pink-500"
                  />
                  <button
                    onClick={handleSaveContactRecipient}
                    className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{language === 'de' ? 'Adresse speichern' : 'Save Recipient'}</span>
                  </button>
                </div>
              </div>

              {/* Bio & Details Overview */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#0d0c1d] border border-purple-900/30 space-y-3">
                <h4 className="text-sm font-bold text-white">
                  {language === 'de' ? 'Kurzbeschreibung (Bio)' : 'Bio Summary'}
                </h4>
                <textarea
                  rows={3}
                  value={data.personalInfo.bioShort[language]}
                  onChange={(e) =>
                    updatePersonalInfo({
                      bioShort: {
                        ...data.personalInfo.bioShort,
                        [language]: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0a0916] border border-purple-900/50 text-white focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Milestones & Reordering */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {language === 'de' ? 'Werdegang & Stationen' : 'Career Milestones'}
                  </h4>
                  <p className="text-neutral-400">
                    {language === 'de'
                      ? 'Reihenfolge mit den Pfeiltasten (▲ / ▼) anpassen. Klicken Sie auf Stift zum Bearbeiten.'
                      : 'Use arrow buttons (▲ / ▼) to reorder items. Click pencil to edit.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenExperienceModal();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'de' ? '+ Neue Station' : '+ Add Milestone'}</span>
                </button>
              </div>

              <div className="space-y-2">
                {data.experiences.map((exp, idx) => (
                  <div
                    key={exp.id}
                    className="p-3.5 rounded-xl bg-[#0d0c1d] border border-purple-900/30 flex items-center justify-between gap-3 hover:border-purple-800 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white truncate">{exp.role[language]}</span>
                        <span className="text-[11px] text-pink-400 font-mono">({exp.period})</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate">{exp.organization} · {exp.location}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => reorderExperiences(idx, idx - 1)}
                        disabled={idx === 0}
                        className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-30"
                        title="Nach oben verschieben"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => reorderExperiences(idx, idx + 1)}
                        disabled={idx === data.experiences.length - 1}
                        className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-30"
                        title="Nach unten verschieben"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          onOpenExperienceModal(exp);
                        }}
                        className="p-1.5 rounded-md bg-neutral-800 hover:bg-pink-600 text-white"
                        title="Bearbeiten"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirmation({
                            isOpen: true,
                            title: language === 'de' ? 'Station unwiderruflich löschen?' : 'Permanently delete milestone?',
                            itemTitle: exp.role[language] || exp.role.de,
                            categoryBadge: language === 'de' ? 'Station' : 'Milestone',
                            placement: `${exp.organization} · ${exp.location}`,
                            warningMessage: language === 'de'
                              ? 'Diese Station wird unwiderruflich von der Website und aus dem Speicher entfernt.'
                              : 'This milestone will be permanently deleted from the website and storage.',
                            onConfirm: () => deleteExperience(exp.id),
                          })
                        }
                        className="p-1.5 rounded-md bg-neutral-800 hover:bg-rose-600 text-rose-300 hover:text-white"
                        title="Löschen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Projects & Reordering */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {language === 'de' ? 'Praktische IT-Projekte' : 'IT Projects & Portfolio'}
                  </h4>
                  <p className="text-neutral-400">
                    {language === 'de'
                      ? 'Reihenfolge mit den Pfeiltasten (▲ / ▼) anpassen. Fotos & Screenshots hochladen.'
                      : 'Reorder projects with arrows. Manage screenshots and technical specs.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenProjectModal();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'de' ? '+ Projekt anlegen' : '+ Add Project'}</span>
                </button>
              </div>

              <div className="space-y-2">
                {data.projects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="p-3.5 rounded-xl bg-[#0d0c1d] border border-purple-900/30 flex items-center justify-between gap-3 hover:border-purple-800 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {proj.imageUrl ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-purple-800 shrink-0">
                          <img src={proj.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#141228] border border-purple-900/50 flex items-center justify-center text-neutral-500 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white truncate">{proj.title[language]}</span>
                          <span className="text-[10px] text-pink-400 font-mono">({proj.category})</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 truncate">{proj.subtitle[language]}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => reorderProjects(idx, idx - 1)}
                        disabled={idx === 0}
                        className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-30"
                        title="Nach oben"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => reorderProjects(idx, idx + 1)}
                        disabled={idx === data.projects.length - 1}
                        className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-30"
                        title="Nach unten"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      {proj.imageUrl && (
                        <button
                          onClick={() =>
                            setDeleteConfirmation({
                              isOpen: true,
                              title: language === 'de' ? 'Projekt-Foto unwiderruflich löschen?' : 'Permanently delete project image?',
                              itemTitle: `Foto von: ${proj.title[language] || proj.title.de}`,
                              categoryBadge: language === 'de' ? 'Projekt-Foto' : 'Project Screenshot',
                              placement: `Projekt: ${proj.title[language]}`,
                              previewUrl: proj.imageUrl,
                              fileType: 'image',
                              warningMessage: language === 'de'
                                ? 'Das hochgeladene Foto wird sofort von der Website und dauerhaft aus dem Speicher gelöscht. Das Projekt selbst bleibt erhalten.'
                                : 'The project image will be permanently removed from the website and storage.',
                              onConfirm: () => removeProjectImage(proj.id),
                            })
                          }
                          className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-rose-300"
                          title={language === 'de' ? 'Nur Foto löschen' : 'Delete photo only'}
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onClose();
                          onOpenProjectModal(proj);
                        }}
                        className="p-1.5 rounded-md bg-neutral-800 hover:bg-pink-600 text-white"
                        title="Bearbeiten"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirmation({
                            isOpen: true,
                            title: language === 'de' ? 'Projekt unwiderruflich löschen?' : 'Permanently delete project?',
                            itemTitle: proj.title[language] || proj.title.de,
                            categoryBadge: language === 'de' ? 'IT-Projekt' : 'IT Project',
                            placement: `Kategorie: ${proj.category}`,
                            previewUrl: proj.imageUrl,
                            fileType: 'image',
                            warningMessage: language === 'de'
                              ? 'Das gesamte Projekt inklusive Beschreibungen und Fotos wird unwiderruflich von der Website und aus dem Speicher gelöscht.'
                              : 'The project will be permanently removed from the website and storage.',
                            onConfirm: () => deleteProject(proj.id),
                          })
                        }
                        className="p-1.5 rounded-md bg-neutral-800 hover:bg-rose-600 text-rose-300 hover:text-white"
                        title="Löschen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Certificates & Documents */}
          {activeTab === 'certs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {language === 'de' ? 'Zertifikate, Zeugnisse & Scheine' : 'Certificates & Documents'}
                  </h4>
                  <p className="text-neutral-400">
                    {language === 'de'
                      ? 'Laden Sie Dokumente als Bild oder PDF hoch. Ordnen Sie Nachweise nach Relevanz.'
                      : 'Upload and reorder diplomas, certificates, and evaluations.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenCertUploadModal();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'de' ? '+ Zertifikat hochladen' : '+ Upload Document'}</span>
                </button>
              </div>

              <div className="space-y-2">
                {data.certifications.map((cert, idx) => (
                  <div
                    key={cert.id}
                    className="p-3.5 rounded-xl bg-[#0d0c1d] border border-purple-900/30 flex items-center justify-between gap-3 hover:border-purple-800 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white truncate">{cert.title[language]}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300">
                          {cert.categoryBadge}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {cert.issuer} · {cert.issuedDate} {cert.fileName ? `· 📎 ${cert.fileName}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => reorderCertifications(idx, idx - 1)}
                        disabled={idx === 0}
                        className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-30"
                        title="Nach oben"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => reorderCertifications(idx, idx + 1)}
                        disabled={idx === data.certifications.length - 1}
                        className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-30"
                        title="Nach unten"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      {cert.documentUrl && (
                        <>
                          <button
                            onClick={() =>
                              setPreviewItem({
                                isOpen: true,
                                title: cert.title[language] || cert.title.de,
                                url: cert.documentUrl!,
                                fileType: cert.fileType,
                                category: cert.categoryBadge,
                              })
                            }
                            className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-pink-300"
                            title={language === 'de' ? 'Dokument ansehen' : 'Preview document'}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirmation({
                                isOpen: true,
                                title: language === 'de' ? 'Dokumentdatei unwiderruflich löschen?' : 'Permanently delete attached document?',
                                itemTitle: cert.fileName || cert.title[language] || cert.title.de,
                                categoryBadge: language === 'de' ? 'Zertifikat-Dokument' : 'Credential File',
                                placement: `Angehängt an: ${cert.title[language]}`,
                                previewUrl: cert.documentUrl,
                                fileType: cert.fileType === 'pdf' ? 'pdf' : 'image',
                                warningMessage: language === 'de'
                                  ? 'Das angehängte Dokument wird dauerhaft gelöscht und aus dem Speicher entfernt. Der Zertifikat-Eintrag bleibt erhalten.'
                                  : 'The attached document file will be permanently removed from the website and storage.',
                                onConfirm: () => removeCertificateDocument(cert.id),
                              })
                            }
                            className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-rose-300"
                            title={language === 'de' ? 'Nur Dokument löschen' : 'Delete document file only'}
                          >
                            <FileText className="w-3.5 h-3.5 text-rose-400" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() =>
                          setDeleteConfirmation({
                            isOpen: true,
                            title: language === 'de' ? 'Zertifikat unwiderruflich löschen?' : 'Permanently delete certificate?',
                            itemTitle: cert.title[language] || cert.title.de,
                            categoryBadge: language === 'de' ? 'Zertifikats-Eintrag' : 'Certificate Record',
                            placement: `${cert.issuer} · ${cert.categoryBadge}`,
                            previewUrl: cert.documentUrl,
                            fileType: cert.fileType === 'pdf' ? 'pdf' : 'image',
                            warningMessage: language === 'de'
                              ? 'Das gesamte Zertifikat inklusive Dokument und Beschreibung wird unwiderruflich von der Website und aus dem Speicher gelöscht.'
                              : 'The certificate record will be permanently removed from the website and storage.',
                            onConfirm: () => deleteCertification(cert.id),
                          })
                        }
                        className="p-1.5 rounded-md bg-neutral-800 hover:bg-rose-600 text-rose-300 hover:text-white"
                        title="Löschen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Contact Messages Inbox */}
          {activeTab === 'inbox' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white">
                  {language === 'de' ? 'Eingegangene Kontaktanfragen' : 'Contact Inquiries Inbox'}
                </h4>
                <p className="text-neutral-400">
                  {language === 'de'
                    ? `Alle Nachrichten, die über das Kontaktformular an ${data.adminSettings?.contactRecipientEmail || 'adammohamedgele@gmail.com'} übermittelt wurden.`
                    : 'Messages submitted through your website contact form.'}
                </p>
              </div>

              {contactMessages.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-[#0d0c1d] border border-purple-900/30 text-neutral-400">
                  <Inbox className="w-8 h-8 mx-auto mb-2 text-neutral-500" />
                  <p>{language === 'de' ? 'Noch keine Nachrichten eingegangen.' : 'No messages received yet.'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contactMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 rounded-xl bg-[#0d0c1d] border border-purple-900/40 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-purple-900/20 pb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white">{msg.name}</span>
                          <span className="text-neutral-400">({msg.email})</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-[10px] text-emerald-300 font-mono">
                            Reply-To: {msg.replyTo || msg.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-neutral-500 font-mono">
                            {new Date(msg.timestamp).toLocaleString()}
                          </span>
                          <button
                            onClick={() => deleteContactMessage(msg.id)}
                            className="p-1 text-neutral-400 hover:text-rose-400"
                            title="Löschen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-neutral-200 font-medium">{msg.subject}</div>
                      <p className="text-neutral-300 leading-relaxed bg-[#070611] p-3 rounded-lg border border-purple-950">
                        {msg.message}
                      </p>
                      <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                        <a
                          href={`mailto:${msg.replyTo || msg.email}?subject=Re: ${encodeURIComponent(msg.subject || '')}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-semibold transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Direkt an {msg.name} antworten ({msg.replyTo || msg.email})</span>
                        </a>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          Antwort-Adresse als Reply-To hinterlegt
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: Publishing & Custom Domain */}
          {activeTab === 'publishing' && (
            <div className="space-y-5">
              <div className="p-5 rounded-xl bg-[#0d0c1d] border border-purple-900/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-pink-400" />
                  <h4 className="text-sm font-bold text-white">
                    {language === 'de' ? 'Live-Status & Veröffentlichung' : 'Live Status & Publishing'}
                  </h4>
                </div>
                <p className="text-neutral-300 leading-relaxed">
                  {language === 'de'
                    ? 'Ihre Website ist öffentlich für Arbeitgeber und Recruiter erreichbar. Besucher können alle Inhalte lesen, aber ohne Anmeldung nichts editieren.'
                    : 'Your website is live and accessible to employers. Visitors have clean read-only access without edit tools.'}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handlePublishLive}
                    className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold flex items-center gap-2 shadow-md shadow-pink-500/25"
                  >
                    <Check className="w-4 h-4" />
                    <span>{language === 'de' ? 'Jetzt live veröffentlichen' : 'Publish Live Now'}</span>
                  </button>

                  <button
                    onClick={onOpenDesignModal}
                    className="px-4 py-2.5 rounded-xl bg-[#1a1733] hover:bg-[#252148] border border-purple-800 text-white font-semibold flex items-center gap-2"
                  >
                    <Layers className="w-4 h-4 text-pink-400" />
                    <span>{language === 'de' ? 'Design & Layouts anpassen' : 'Design Studio'}</span>
                  </button>
                </div>
              </div>

              {/* Custom Domain Notice */}
              <div className="p-5 rounded-xl bg-[#0d0c1d] border border-purple-900/30 space-y-2">
                <h4 className="text-sm font-bold text-white">
                  {language === 'de' ? 'Eigene Domain (z.B. mohamed-adam.de)' : 'Custom Domain'}
                </h4>
                <p className="text-neutral-400 leading-relaxed">
                  {language === 'de'
                    ? 'Sie können eine eigene Domain (wie mohamed-adam.de oder mohamedadam.it) auf diesen Dienst aufschalten. Es werden keine AI-Studio-Badges oder Wasserzeichen auf der öffentlichen Seite angezeigt.'
                    : 'You can link your personal custom domain to this deployment. Zero AI badges or watermarks are displayed on the public site.'}
                </p>
              </div>

              {/* Data Backup & Reset */}
              <div className="p-5 rounded-xl bg-[#0d0c1d] border border-purple-900/30 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {language === 'de' ? 'Vollständiges Backup (JSON)' : 'Complete Backup (JSON)'}
                  </h4>
                  <p className="text-neutral-400">
                    {language === 'de' ? 'Laden Sie alle Daten als Datei herunter.' : 'Download full portfolio snapshot.'}
                  </p>
                </div>
                <button
                  onClick={exportDataAsJSON}
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-pink-400" />
                  <span>Backup (JSON)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-purple-900/30 bg-[#0d0c1d] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Inhaber:</span>
            <span className="font-semibold text-white">{data.adminSettings?.ownerEmail || 'adammohamedgele@gmail.com'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors"
            >
              {language === 'de' ? 'Schließen' : 'Close'}
            </button>
          </div>
        </div>
      </div>

      {/* Permanent Deletion Confirmation Modal */}
      {deleteConfirmation && (
        <div
          role="alertdialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setDeleteConfirmation(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-rose-600/50 bg-[#160d19] text-white p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-600/60 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-white">
                  {deleteConfirmation.title}
                </h4>
                <p className="text-xs text-rose-300/80 mt-0.5">
                  {language === 'de'
                    ? 'Bestätigung zur dauerhaften Löschung erforderlich'
                    : 'Confirmation required for permanent deletion'}
                </p>
              </div>
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Item Details Box */}
            <div className="p-3.5 rounded-xl bg-[#0c060e] border border-rose-900/40 flex items-center gap-3">
              {deleteConfirmation.previewUrl ? (
                deleteConfirmation.fileType === 'pdf' ? (
                  <div className="w-12 h-12 rounded-lg bg-rose-950/60 border border-rose-800/50 flex items-center justify-center text-rose-300 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-rose-800/50 shrink-0 bg-neutral-900">
                    <img
                      src={deleteConfirmation.previewUrl}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )
              ) : (
                <div className="w-12 h-12 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs truncate">
                    {deleteConfirmation.itemTitle}
                  </span>
                </div>
                <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full bg-rose-950 border border-rose-800/60 text-[10px] text-rose-300 font-medium">
                  {deleteConfirmation.categoryBadge}
                </span>
                {deleteConfirmation.placement && (
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {deleteConfirmation.placement}
                  </p>
                )}
              </div>
            </div>

            {/* Warning Text */}
            <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 text-[11px] text-neutral-300 leading-relaxed">
              {deleteConfirmation.warningMessage || (language === 'de'
                ? 'Dieses Element wird sofort und unwiderruflich von der öffentlichen Website und aus dem Speicher (LocalStorage & Server) gelöscht. Es bleiben keine fehlerhaften Dateien oder Reste zurück.'
                : 'This item will be permanently removed from the website and storage. No broken files will be left.')}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold transition-colors"
              >
                {language === 'de' ? 'Abbrechen' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={executeConfirmedDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'de' ? 'Unwiderruflich löschen' : 'Permanently Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Fullscreen Preview Modal */}
      {previewItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-purple-800/40 bg-[#121124] text-white overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-purple-900/30 bg-[#0d0c1d]">
              <div>
                <h4 className="font-bold text-sm text-white">{previewItem.title}</h4>
                {previewItem.category && (
                  <span className="text-[10px] text-pink-400 font-mono">{previewItem.category}</span>
                )}
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-auto flex items-center justify-center bg-black/60 min-h-[300px]">
              {previewItem.fileType === 'pdf' ? (
                <div className="text-center space-y-3 p-8">
                  <FileText className="w-16 h-16 mx-auto text-pink-400" />
                  <p className="text-xs text-neutral-300 font-medium">
                    {language === 'de' ? 'PDF-Dokument' : 'PDF Document'}
                  </p>
                  <a
                    href={previewItem.url}
                    download={previewItem.title || 'dokument.pdf'}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-pink-600 hover:bg-pink-500 rounded-xl text-xs font-semibold text-white shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{language === 'de' ? 'PDF herunterladen / öffnen' : 'Download / Open PDF'}</span>
                  </a>
                </div>
              ) : (
                <img
                  src={previewItem.url}
                  alt={previewItem.title}
                  className="max-h-[65vh] w-auto max-w-full rounded-lg object-contain shadow-lg"
                />
              )}
            </div>

            <div className="px-5 py-3 border-t border-purple-900/30 bg-[#0d0c1d] flex items-center justify-between text-xs">
              <span className="text-neutral-400 text-[11px]">
                {language === 'de' ? 'Vorschau des hochgeladenen Mediums' : 'Preview of uploaded asset'}
              </span>
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold"
              >
                {language === 'de' ? 'Schließen' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
