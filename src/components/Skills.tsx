import React, { useState } from 'react';
import { Network, Monitor, Server, Headphones, Shield, Globe, Plus, X, Pencil, Check, Trash2, FolderPlus } from 'lucide-react';
import { Language, SkillItem } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

interface SkillsProps {
  language: Language;
}

export const Skills: React.FC<SkillsProps> = ({ language }) => {
  const { data, isEditMode, addSkill, deleteSkill, addSkillCategory, deleteSkillCategory, currentScheme } = usePortfolio();
  const { skillCategories } = data;

  const [addingCategoryIdx, setAddingCategoryIdx] = useState<number | null>(null);
  const [newSkillName, setNewSkillName] = useState('');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryNameDe, setNewCategoryNameDe] = useState('');
  const [newCategoryNameEn, setNewCategoryNameEn] = useState('');

  const getCategoryIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Network className="w-5 h-5 text-cyan-400" />;
      case 1:
        return <Monitor className="w-5 h-5 text-purple-400" />;
      case 2:
        return <Server className="w-5 h-5 text-indigo-400" />;
      case 3:
        return <Headphones className="w-5 h-5 text-emerald-400" />;
      case 4:
        return <Shield className="w-5 h-5 text-rose-400" />;
      default:
        return <Globe className="w-5 h-5 text-amber-400" />;
    }
  };

  const getCategoryIconBg = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-cyan-950/60 border-cyan-700/40';
      case 1:
        return 'bg-purple-950/60 border-purple-700/40';
      case 2:
        return 'bg-indigo-950/60 border-indigo-700/40';
      case 3:
        return 'bg-emerald-950/60 border-emerald-700/40';
      case 4:
        return 'bg-rose-950/60 border-rose-700/40';
      default:
        return 'bg-amber-950/60 border-amber-700/40';
    }
  };

  const handleSaveNewSkill = (catIdx: number) => {
    if (!newSkillName.trim()) {
      setAddingCategoryIdx(null);
      return;
    }
    addSkill(catIdx, {
      name: newSkillName.trim(),
      level: 'Fundiert',
      context: { de: newSkillName.trim(), en: newSkillName.trim() },
    });
    setNewSkillName('');
    setAddingCategoryIdx(null);
  };

  const handleSaveNewCategory = () => {
    if (!newCategoryNameDe.trim()) return;
    addSkillCategory({
      de: newCategoryNameDe.trim(),
      en: (newCategoryNameEn.trim() || newCategoryNameDe.trim()),
    });
    setNewCategoryNameDe('');
    setNewCategoryNameEn('');
    setIsAddingNewCategory(false);
  };

  return (
    <section id="skills" className="py-20 bg-[#080711] relative border-b border-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Technical Skills
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
            {language === 'de'
              ? 'Fachkompetenzen in Netzwerktechnik, Systemadministration, Hardware und IT-Support.'
              : 'Skillset spanning networking, systems administration, hardware, and IT support.'}
          </p>
          <div className={`w-16 h-1 bg-gradient-to-r ${currentScheme.gradientButton} rounded-full mx-auto mt-4`} />

          {isEditMode && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setIsAddingNewCategory(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-lg shadow-sm transition-all"
              >
                <FolderPlus className="w-4 h-4" />
                <span>{language === 'de' ? '+ Neue Kategorie hinzufügen' : '+ Add Skill Category'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal/Inline form for Adding New Category */}
        {isEditMode && isAddingNewCategory && (
          <div className="max-w-md mx-auto mb-8 p-4 rounded-xl bg-[#121124] border border-pink-500/50 shadow-xl text-left">
            <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
              <FolderPlus className="w-4 h-4 text-pink-400" />
              <span>{language === 'de' ? 'Neue Skill-Kategorie anlegen' : 'Create New Skill Category'}</span>
            </h4>
            <div className="space-y-2 mb-3">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-0.5">
                  {language === 'de' ? 'Kategorietitel (Deutsch)' : 'Category Title (German)'}
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder="z.B. IT-Sicherheit & Backups"
                  value={newCategoryNameDe}
                  onChange={(e) => setNewCategoryNameDe(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#0a0916] border border-purple-800 text-white focus:outline-none focus:border-pink-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-0.5">
                  {language === 'de' ? 'Kategorietitel (Englisch)' : 'Category Title (English)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. IT Security & Backups"
                  value={newCategoryNameEn}
                  onChange={(e) => setNewCategoryNameEn(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#0a0916] border border-purple-800 text-white focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsAddingNewCategory(false)}
                className="px-3 py-1 text-xs text-neutral-400 hover:text-white rounded-lg bg-neutral-800"
              >
                {language === 'de' ? 'Abbrechen' : 'Cancel'}
              </button>
              <button
                onClick={handleSaveNewCategory}
                className="px-3 py-1 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-lg"
              >
                {language === 'de' ? 'Kategorie erstellen' : 'Save Category'}
              </button>
            </div>
          </div>
        )}

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, catIdx) => (
            <div
              key={catIdx}
              className="bg-[#121124] border border-purple-900/30 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-lg hover:border-purple-800/50 transition-all"
            >
              <div>
                {/* Category Header with Icon in Rounded Square */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${getCategoryIconBg(catIdx)}`}>
                      {getCategoryIcon(catIdx)}
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {category.title[language]}
                    </h3>
                  </div>

                  {isEditMode && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setAddingCategoryIdx(catIdx);
                          setNewSkillName('');
                        }}
                        className="p-1 rounded-md text-pink-400 hover:text-white hover:bg-pink-600 transition-colors"
                        title={language === 'de' ? 'Fähigkeit hinzufügen' : 'Add Skill'}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(language === 'de' ? `Kategorie „${category.title[language]}“ entfernen?` : `Remove category „${category.title[language]}“?`)) {
                            deleteSkillCategory(catIdx);
                          }
                        }}
                        className="p-1 rounded-md text-neutral-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                        title={language === 'de' ? 'Kategorie löschen' : 'Delete Category'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Skill Chips matching Screenshot 7 */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {category.skills.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      className="px-3 py-1.5 rounded-lg bg-[#0d0c1d] border border-purple-900/30 text-xs font-medium text-neutral-200 flex items-center gap-1.5 group hover:border-purple-600/50 transition-colors"
                    >
                      <span>{skill.name}</span>
                      {isEditMode && (
                        <button
                          onClick={() => deleteSkill(catIdx, sIdx)}
                          className="text-neutral-500 hover:text-rose-400 p-0.5 rounded-xs"
                          title="Entfernen"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Inline Add Skill Input when in Edit Mode */}
                {isEditMode && addingCategoryIdx === catIdx && (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      autoFocus
                      placeholder={language === 'de' ? 'Neue Fähigkeit...' : 'New skill name...'}
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveNewSkill(catIdx);
                        if (e.key === 'Escape') setAddingCategoryIdx(null);
                      }}
                      className="flex-1 px-3 py-1 text-xs rounded-lg bg-[#0a0916] border border-purple-500 text-white placeholder:text-neutral-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveNewSkill(catIdx)}
                      className="px-2 py-1 text-xs bg-pink-600 hover:bg-pink-500 text-white rounded-lg font-semibold"
                    >
                      OK
                    </button>
                    <button
                      onClick={() => setAddingCategoryIdx(null)}
                      className="px-2 py-1 text-xs bg-neutral-800 text-neutral-400 hover:text-white rounded-lg"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {isEditMode && (
                <div className="pt-4 mt-4 border-t border-purple-900/20">
                  <button
                    onClick={() => {
                      setAddingCategoryIdx(catIdx);
                      setNewSkillName('');
                    }}
                    className="w-full py-1 text-center text-xs font-semibold text-pink-400 border border-dashed border-pink-500/40 rounded-lg hover:bg-pink-950/20 transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{language === 'de' ? '+ Skill hinzufügen' : '+ Add Skill'}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
