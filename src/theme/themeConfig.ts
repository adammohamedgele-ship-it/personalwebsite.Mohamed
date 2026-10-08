import { ColorSchemeId, LayoutStyleId } from '../types';

export interface ColorSchemeOption {
  id: ColorSchemeId;
  name: { de: string; en: string };
  description: { de: string; en: string };
  primaryHex: string;
  secondaryHex: string;
  bgHex: string;
  cardHex: string;
  borderClass: string;
  badgeClass: string;
  gradientText: string;
  gradientButton: string;
  ringGlow: string;
  heroAmbientA: string;
  heroAmbientB: string;
  accentText: string;
  tagClass: string;
}

export interface LayoutStyleOption {
  id: LayoutStyleId;
  name: { de: string; en: string };
  description: { de: string; en: string };
  icon: string;
  features: { de: string[]; en: string[] };
}

export const COLOR_SCHEMES: ColorSchemeOption[] = [
  {
    id: 'cyber-purple',
    name: { de: 'Cyber Violett & Pink', en: 'Cyber Neon Purple' },
    description: { de: 'Modernes dunkles Tech-Design mit lebhaften Violett-, Pink- und Rosatönen', en: 'Vibrant dark tech aesthetic with rich violet and pink neon tones' },
    primaryHex: '#ec4899',
    secondaryHex: '#a855f7',
    bgHex: '#080711',
    cardHex: '#121124',
    borderClass: 'border-purple-900/30',
    badgeClass: 'bg-gradient-to-r from-purple-600 to-pink-600',
    gradientText: 'from-purple-400 via-pink-500 to-rose-400',
    gradientButton: 'from-purple-600 via-pink-600 to-rose-500',
    ringGlow: 'from-cyan-400 via-pink-500 to-purple-600',
    heroAmbientA: 'bg-purple-600/15',
    heroAmbientB: 'bg-pink-600/15',
    accentText: 'text-pink-400',
    tagClass: 'bg-[#0d0c1d] border-purple-900/40 text-purple-200',
  },
  {
    id: 'tech-blue',
    name: { de: 'Saphirblau & Cyan', en: 'Deep Tech Sapphire' },
    description: { de: 'Professionelle IT-Infrastruktur & Enterprise Look mit blauem Akzent', en: 'Enterprise systems & network engineering aesthetic in deep navy & cyan' },
    primaryHex: '#0ea5e9',
    secondaryHex: '#3b82f6',
    bgHex: '#050a14',
    cardHex: '#0b162c',
    borderClass: 'border-sky-900/30',
    badgeClass: 'bg-gradient-to-r from-sky-600 to-blue-600',
    gradientText: 'from-cyan-300 via-sky-400 to-blue-500',
    gradientButton: 'from-sky-600 via-blue-600 to-cyan-500',
    ringGlow: 'from-cyan-400 via-sky-500 to-indigo-600',
    heroAmbientA: 'bg-sky-600/15',
    heroAmbientB: 'bg-blue-600/15',
    accentText: 'text-sky-400',
    tagClass: 'bg-[#061022] border-sky-900/40 text-sky-200',
  },
  {
    id: 'emerald-green',
    name: { de: 'Smaragd & Terminal Grün', en: 'Emerald Hardware & Systems' },
    description: { de: 'Inspiriert von Linux-Terminals, Server-Racks und Hardware-Engineering', en: 'Terminal green & server rack hardware theme with cool emerald glow' },
    primaryHex: '#10b981',
    secondaryHex: '#14b8a6',
    bgHex: '#040d0a',
    cardHex: '#0a1d17',
    borderClass: 'border-emerald-900/30',
    badgeClass: 'bg-gradient-to-r from-emerald-600 to-teal-600',
    gradientText: 'from-emerald-300 via-teal-400 to-cyan-400',
    gradientButton: 'from-emerald-600 via-teal-600 to-cyan-600',
    ringGlow: 'from-teal-400 via-emerald-500 to-cyan-500',
    heroAmbientA: 'bg-emerald-600/15',
    heroAmbientB: 'bg-teal-600/15',
    accentText: 'text-emerald-400',
    tagClass: 'bg-[#05130f] border-emerald-900/40 text-emerald-200',
  },
  {
    id: 'slate-minimal',
    name: { de: 'Minimalistisches Titan & Slate', en: 'Minimal Slate & Titanium' },
    description: { de: 'Sehr sauberer, monochromer Look mit kühlem Titan und weißem Kontrast', en: 'Clean monochrome editorial aesthetic with high contrast & crisp slate' },
    primaryHex: '#94a3b8',
    secondaryHex: '#cbd5e1',
    bgHex: '#0a0d14',
    cardHex: '#121824',
    borderClass: 'border-neutral-800',
    badgeClass: 'bg-gradient-to-r from-neutral-700 to-slate-600',
    gradientText: 'from-white via-slate-200 to-neutral-400',
    gradientButton: 'from-slate-700 via-neutral-700 to-slate-800',
    ringGlow: 'from-slate-300 via-neutral-400 to-slate-600',
    heroAmbientA: 'bg-slate-500/10',
    heroAmbientB: 'bg-neutral-600/10',
    accentText: 'text-slate-300',
    tagClass: 'bg-[#0d121c] border-neutral-700 text-neutral-200',
  },
  {
    id: 'amber-warm',
    name: { de: 'Warmes Bernstein & Kupfer', en: 'Warm Amber & Copper' },
    description: { de: 'Warme, einladende Töne mit goldenem Amber und rötlichem Kupferglanz', en: 'Warm studio atmosphere with radiant amber, gold, and copper accents' },
    primaryHex: '#f59e0b',
    secondaryHex: '#f97316',
    bgHex: '#0d0905',
    cardHex: '#1c130a',
    borderClass: 'border-amber-900/30',
    badgeClass: 'bg-gradient-to-r from-amber-600 to-orange-600',
    gradientText: 'from-amber-300 via-orange-400 to-yellow-300',
    gradientButton: 'from-amber-600 via-orange-600 to-yellow-500',
    ringGlow: 'from-yellow-400 via-amber-500 to-orange-600',
    heroAmbientA: 'bg-amber-600/15',
    heroAmbientB: 'bg-orange-600/15',
    accentText: 'text-amber-400',
    tagClass: 'bg-[#140e07] border-amber-900/40 text-amber-200',
  },
];

export const LAYOUT_STYLES: LayoutStyleOption[] = [
  {
    id: 'split-bento',
    name: { de: 'Modern Split & Bento', en: 'Modern Split & Bento' },
    description: {
      de: 'Ausgewogener Split-Hero mit leuchtendem Profilbild, 2-Spalten-Profil und Bento-Projektkarten',
      en: 'Balanced split-column hero with glowing portrait frame, profile card, and bento projects',
    },
    icon: 'LayoutGrid',
    features: {
      de: ['Split Hero mit leuchtendem Avatar-Ring', 'Bento-Grid für praktische IT-Projekte', 'Kompakte technische Fähigkeiten'],
      en: ['Split hero with glowing avatar frame', 'Bento grid layout for project portfolio', 'Compact technical skill cards'],
    },
  },
  {
    id: 'executive-linear',
    name: { de: 'Executive Timeline & Fokus', en: 'Executive Linear Timeline' },
    description: {
      de: 'Zentrierter Header mit klaren Statusträgern und strukturierter vertikaler Zeitleiste für Werdegang & Praxis',
      en: 'Centered presentation emphasizing linear career timeline, credentials, and step-by-step experience',
    },
    icon: 'ListFilter',
    features: {
      de: ['Zentrierter Hero mit Fokus auf Verfügbarkeit', 'Prominente Zeitleiste mit Meilenstein-Linie', 'Zertifikate & Nachweise im direkten Überblick'],
      en: ['Centered hero focusing on apprenticeship availability', 'Continuous timeline milestone view', 'Direct credentials and certificate summary'],
    },
  },
  {
    id: 'showcase-grid',
    name: { de: 'Visuelle Dokumente & Galerie', en: 'Showcase & Document Gallery' },
    description: {
      de: 'Fokus auf hochgeladene Zeugnisse, Zertifikate und Nachweise mit interaktiver Vollbild-Vorschau',
      en: 'Visual showcase highlighting certificates, credentials, and project screenshots with lightbox view',
    },
    icon: 'Maximize2',
    features: {
      de: ['Interaktive Zertifikate- und Nachweisgalerie', 'Vollbild-Vorschau für Zeugnisse & Scheine', 'Visuelle Karten mit Bild-Upload'],
      en: ['Interactive document & certificate viewer', 'Full-res lightbox preview for credentials', 'Project cards with visual uploads'],
    },
  },
];

export const DEFAULT_DESIGN_CONFIG = {
  colorScheme: 'cyber-purple' as ColorSchemeId,
  layoutStyle: 'split-bento' as LayoutStyleId,
};
