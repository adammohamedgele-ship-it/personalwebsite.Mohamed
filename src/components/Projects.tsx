import React, { useState, useRef } from 'react';
import { Network, Server, Wrench, Shield, CheckCircle2, ExternalLink, X, ArrowRight, Laptop, Pencil, Plus, Trash2, Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { Language, Project } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { EditProjectModal } from './EditProjectModal';

interface ProjectsProps {
  language: Language;
}

export const Projects: React.FC<ProjectsProps> = ({ language }) => {
  const { data, isEditMode, deleteProject, uploadProjectImage, removeProjectImage, currentScheme } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [uploadTargetProjectId, setUploadTargetProjectId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCardImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTargetProjectId) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(language === 'de' ? 'Das Bild ist zu groß (max. 5 MB).' : 'Image is too large (max 5MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        uploadProjectImage(uploadTargetProjectId, dataUrl);
      }
      setUploadTargetProjectId(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const triggerUploadForProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadTargetProjectId(projectId);
    fileInputRef.current?.click();
  };

  const categories = [
    { id: 'all', label: language === 'de' ? 'Alle Projekte' : 'All Projects' },
    { id: 'network', label: language === 'de' ? 'Netzwerk & Infrastruktur' : 'Networking' },
    { id: 'support', label: language === 'de' ? 'Praxis-Rollout & Support' : 'Support & Rollout' },
    { id: 'virtualization', label: language === 'de' ? 'Virtualisierung & Labs' : 'Virtualization' },
    { id: 'systems', label: language === 'de' ? 'Hardware & Diagnose' : 'Hardware & Diagnostics' },
  ];

  const filteredProjects = data.projects.filter((project) => {
    if (activeCategory === 'all') return true;
    return project.category === activeCategory;
  });

  const handleOpenAdd = () => {
    setEditingProject(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (project: Project, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  return (
    <section id="projects" className="py-16 md:py-24 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-2">
              {language === 'de' ? 'Praktisches Portfolio' : 'Hands-on Project Portfolio'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white [text-wrap:balance]">
              {language === 'de'
                ? 'Praktische IT-Projekte, Rollouts und Test-Laboratorien'
                : 'Real-world IT deployments, rollouts, and test labs'}
            </h2>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
              {language === 'de'
                ? 'Ausgewählte Praxisfälle aus dem AWO-Praktikum und dem eigenständigen Aufbau von Netzwerken und Testumgebungen.'
                : 'Selected practical case studies from the AWO internship and self-directed networking architectures.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isEditMode && (
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'de' ? 'Projekt anlegen' : 'Add Project'}</span>
              </button>
            )}

            {/* Interactive Filter Control */}
            <div className="flex flex-wrap gap-1 p-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hidden File Input for Card Image Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleCardImageUpload}
          className="hidden"
        />

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`p-6 rounded-xl border bg-white dark:bg-neutral-900 shadow-xs transition-all flex flex-col justify-between ${
                isEditMode
                  ? 'border-neutral-300 dark:border-neutral-700 hover:border-sky-500/50'
                  : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <div>
                {/* Clean unboxed metadata header */}
                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold uppercase tracking-wider text-[11px] ${currentScheme.accentText}`}>
                      {project.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{project.period}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {project.featured && (
                      <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                        ★ {language === 'de' ? 'Hervorgehoben' : 'Featured'}
                      </span>
                    )}
                    {isEditMode && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => triggerUploadForProject(project.id, e)}
                          className="p-1 text-neutral-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                          title={language === 'de' ? 'Foto / Screenshot hochladen' : 'Upload photo'}
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                        {project.imageUrl && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(language === 'de' ? `Bild von „${project.title[language]}“ dauerhaft löschen?` : `Permanently delete image from „${project.title[language]}“?`)) {
                                removeProjectImage(project.id);
                              }
                            }}
                            className="p-1 text-neutral-400 hover:text-rose-500 transition-colors"
                            title={language === 'de' ? 'Nur Bild löschen' : 'Delete image only'}
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleOpenEdit(project, e)}
                          className="p-1 text-neutral-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                          title={language === 'de' ? 'Projekt bearbeiten' : 'Edit Project'}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(language === 'de' ? `Projekt „${project.title[language]}“ wirklich löschen?` : `Delete project „${project.title[language]}“?`)) {
                              deleteProject(project.id);
                            }
                          }}
                          className="p-1 text-neutral-400 hover:text-rose-500 transition-colors"
                          title={language === 'de' ? 'Projekt entfernen' : 'Delete Project'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Uploaded Project Image / Diagram */}
                {project.imageUrl && (
                  <div
                    onClick={() => setSelectedProject(project)}
                    className="mb-4 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 h-44 bg-neutral-950 cursor-pointer relative group/img"
                  >
                    <img
                      src={project.imageUrl}
                      alt={project.title[language]}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-[11px] font-semibold text-white flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>{language === 'de' ? 'Vollbild ansehen' : 'View Full Image'}</span>
                      </span>
                    </div>
                  </div>
                )}

                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1.5">
                  {project.title[language]}
                </h3>

                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-3">
                  {project.subtitle[language]}
                </p>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-5">
                  {project.summary[language]}
                </p>

                {/* Key Outcomes */}
                <div className="space-y-2 mb-6">
                  {project.keyOutcomes[language].slice(0, 2).map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies & Details Button */}
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 truncate">
                  {project.technologies.slice(0, 3).join(' · ')}
                  {project.technologies.length > 3 && ` +${project.technologies.length - 3}`}
                </div>

                <div className="flex items-center gap-3">
                  {isEditMode && (
                    <button
                      onClick={(e) => handleOpenEdit(project, e)}
                      className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-medium"
                    >
                      {language === 'de' ? 'Editieren' : 'Edit'}
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300 transition-colors whitespace-nowrap self-start sm:self-auto"
                  >
                    <span>{language === 'de' ? 'Fallstudie öffnen' : 'View Case Study'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                  <span className="font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider text-[11px]">
                    {selectedProject.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{selectedProject.period}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                  {selectedProject.title[language]}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  {selectedProject.subtitle[language]}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isEditMode && (
                  <button
                    onClick={() => {
                      const proj = selectedProject;
                      setSelectedProject(null);
                      handleOpenEdit(proj);
                    }}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-sky-600 transition-colors"
                    title="Bearbeiten"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setSelectedProject(null)}
                  aria-label="Close modal"
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 text-xs sm:text-sm">
              {selectedProject.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-950 max-h-72 flex items-center justify-center">
                  <img
                    src={selectedProject.imageUrl}
                    alt={selectedProject.title[language]}
                    className="w-full h-full object-contain max-h-72"
                  />
                </div>
              )}

              <div>
                <h4 className="font-bold text-neutral-900 dark:text-white mb-1.5">
                  {language === 'de' ? 'Ausgangssituation & Herausforderung' : 'Initial Challenge'}
                </h4>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {selectedProject.challenge[language]}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-neutral-900 dark:text-white mb-1.5">
                  {language === 'de' ? 'Technische Lösung & Umsetzung' : 'Technical Solution'}
                </h4>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {selectedProject.solution[language]}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-neutral-900 dark:text-white mb-2">
                  {language === 'de' ? 'Ergebnisse & Lernerfolg' : 'Key Outcomes & Takeaways'}
                </h4>
                <ul className="space-y-2">
                  {selectedProject.keyOutcomes[language].map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-neutral-900 dark:text-white mb-2">
                  {language === 'de' ? 'Eingesetzte Technologien & Werkzeuge' : 'Technologies & Tools Used'}
                </h4>
                <div className="text-xs font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-100/70 dark:bg-neutral-800/60 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                  {selectedProject.technologies.join(' · ')}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-md transition-colors"
              >
                {language === 'de' ? 'Schließen' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={editingProject}
        language={language}
      />
    </section>
  );
};
