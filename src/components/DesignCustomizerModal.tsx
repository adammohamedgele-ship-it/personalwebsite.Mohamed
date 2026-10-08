import React, { useState } from 'react';
import { Palette, Layout, Check, Sparkles, RotateCcw, X, Eye, Sliders } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { COLOR_SCHEMES, LAYOUT_STYLES, ColorSchemeOption, LayoutStyleOption } from '../theme/themeConfig';
import { ColorSchemeId, DesignConfig, Language, LayoutStyleId } from '../types';

interface DesignCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const DesignCustomizerModal: React.FC<DesignCustomizerModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const {
    designConfig,
    activeDesign,
    previewDesignConfig,
    setPreviewDesign,
    applyDesign,
    resetDesign,
  } = usePortfolio();

  const [selectedScheme, setSelectedScheme] = useState<ColorSchemeId>(activeDesign.colorScheme);
  const [selectedLayout, setSelectedLayout] = useState<LayoutStyleId>(activeDesign.layoutStyle);

  if (!isOpen) return null;

  const handleSelectScheme = (schemeId: ColorSchemeId) => {
    setSelectedScheme(schemeId);
    // Instant live preview
    setPreviewDesign({
      colorScheme: schemeId,
      layoutStyle: selectedLayout,
    });
  };

  const handleSelectLayout = (layoutId: LayoutStyleId) => {
    setSelectedLayout(layoutId);
    // Instant live preview
    setPreviewDesign({
      colorScheme: selectedScheme,
      layoutStyle: layoutId,
    });
  };

  const handleApply = () => {
    applyDesign({
      colorScheme: selectedScheme,
      layoutStyle: selectedLayout,
    });
    onClose();
  };

  const handleCancel = () => {
    // Revert preview back to saved config
    setPreviewDesign(null);
    onClose();
  };

  const handleReset = () => {
    resetDesign();
    setSelectedScheme('cyber-purple');
    setSelectedLayout('split-bento');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={handleCancel}
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-purple-800/40 bg-[#121124] text-white p-6 sm:p-7 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-purple-900/30">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-pink-600/20 text-pink-400">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {language === 'de' ? 'Design & Layout anpassen' : 'Design & Layout Studio'}
              </h3>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {language === 'de'
                ? 'Wählen Sie Farbschemata und Layouts. Die Website aktualisiert sich im Hintergrund live zur Vorschau.'
                : 'Choose color schemes and page layouts. The live preview updates in the background automatically.'}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Indicator */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#0a0916] border border-pink-500/30 text-xs">
          <div className="flex items-center gap-2 text-pink-400 font-medium">
            <Eye className="w-4 h-4 animate-pulse" />
            <span>
              {language === 'de'
                ? 'Live-Vorschau aktiv – Änderungen sind sofort sichtbar'
                : 'Live preview active – choices take effect immediately'}
            </span>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono">
            {selectedScheme} · {selectedLayout}
          </span>
        </div>

        {/* 1. Color Schemes Selector */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4 text-pink-400" />
            <span>{language === 'de' ? '1. Farbschema wählen' : '1. Choose Color Scheme'}</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COLOR_SCHEMES.map((scheme) => {
              const isSelected = selectedScheme === scheme.id;

              return (
                <div
                  key={scheme.id}
                  onClick={() => handleSelectScheme(scheme.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'border-pink-500 bg-[#191533] shadow-lg shadow-pink-500/20'
                      : 'border-purple-900/30 bg-[#0d0c1d] hover:border-purple-700 hover:bg-[#141228]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {/* Swatch dots */}
                      <div className="flex items-center -space-x-1 shrink-0">
                        <span
                          className="w-4 h-4 rounded-full border border-neutral-900"
                          style={{ backgroundColor: scheme.primaryHex }}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-neutral-900"
                          style={{ backgroundColor: scheme.secondaryHex }}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-neutral-900"
                          style={{ backgroundColor: scheme.bgHex }}
                        />
                      </div>
                      <span className="text-xs font-bold text-white truncate">
                        {scheme.name[language]}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-400 leading-snug">
                      {scheme.description[language]}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-pink-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Layout Styles Selector */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block mb-3 flex items-center gap-2">
            <Layout className="w-4 h-4 text-pink-400" />
            <span>{language === 'de' ? '2. Layout & Aufbau wählen' : '2. Choose Layout Architecture'}</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {LAYOUT_STYLES.map((layout) => {
              const isSelected = selectedLayout === layout.id;

              return (
                <div
                  key={layout.id}
                  onClick={() => handleSelectLayout(layout.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-pink-500 bg-[#191533] shadow-lg shadow-pink-500/20'
                      : 'border-purple-900/30 bg-[#0d0c1d] hover:border-purple-700 hover:bg-[#141228]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">
                        {layout.name[language]}
                      </span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-pink-600 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>

                    {/* Miniature Layout Wireframe Sketch */}
                    <div className="h-16 rounded-lg bg-[#070611] p-1.5 mb-2.5 border border-purple-900/30 flex flex-col justify-between">
                      {layout.id === 'split-bento' && (
                        <>
                          <div className="flex gap-1 h-6">
                            <div className="w-3/5 bg-purple-900/40 rounded-xs" />
                            <div className="w-2/5 bg-pink-500/40 rounded-full" />
                          </div>
                          <div className="grid grid-cols-2 gap-1 h-6">
                            <div className="bg-purple-900/30 rounded-xs" />
                            <div className="bg-purple-900/30 rounded-xs" />
                          </div>
                        </>
                      )}
                      {layout.id === 'executive-linear' && (
                        <>
                          <div className="w-full h-5 bg-purple-900/50 rounded-xs flex items-center justify-center">
                            <div className="w-8 h-2 bg-pink-500/60 rounded-full" />
                          </div>
                          <div className="space-y-1">
                            <div className="w-full h-2 bg-purple-900/30 rounded-xs" />
                            <div className="w-full h-2 bg-purple-900/30 rounded-xs" />
                          </div>
                        </>
                      )}
                      {layout.id === 'showcase-grid' && (
                        <div className="grid grid-cols-3 gap-1 h-full">
                          <div className="bg-purple-900/40 rounded-xs flex items-center justify-center text-[7px] text-pink-300">DOC</div>
                          <div className="bg-purple-900/40 rounded-xs flex items-center justify-center text-[7px] text-pink-300">CERT</div>
                          <div className="bg-purple-900/40 rounded-xs flex items-center justify-center text-[7px] text-pink-300">IMG</div>
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] text-neutral-400 leading-snug">
                      {layout.description[language]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="pt-4 border-t border-purple-900/30 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'de' ? 'Auf Standard zurücksetzen' : 'Reset to Defaults'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 rounded-lg transition-colors"
            >
              {language === 'de' ? 'Vorschau beenden' : 'Cancel'}
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-lg shadow-md shadow-pink-500/25 flex items-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'de' ? 'Design anwenden & speichern' : 'Save & Apply Design'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
