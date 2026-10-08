export type Language = 'de' | 'en';

export interface PersonalInfo {
  fullName: string;
  shortName: string;
  headline: {
    de: string;
    en: string;
  };
  bioShort: {
    de: string;
    en: string;
  };
  location: string;
  city: string;
  phone: string;
  phoneInternational: string;
  email: string;
  birthDate: string;
  birthPlace: string;
  nationality: {
    de: string;
    en: string;
  };
  maritalStatus: {
    de: string;
    en: string;
  };
  residenceSince: {
    de: string;
    en: string;
  };
  driverLicense: {
    de: string;
    en: string;
  };
  availability: {
    de: string;
    en: string;
  };
  hobbies: {
    de: string[];
    en: string[];
  };
  languages: {
    name: { de: string; en: string };
    level: { de: string; en: string };
    proficiency: number;
  }[];
  avatarUrl?: string;
}

export interface Project {
  id: string;
  title: {
    de: string;
    en: string;
  };
  subtitle: {
    de: string;
    en: string;
  };
  category: 'network' | 'systems' | 'support' | 'virtualization' | 'security';
  group?: 'personal' | 'capstone';
  badge?: string;
  kicker?: string;
  bannerType?: 'network' | 'code' | 'helpdesk' | 'security' | 'terminal' | 'server' | 'hardware';
  period: string;
  summary: {
    de: string;
    en: string;
  };
  challenge: {
    de: string;
    en: string;
  };
  solution: {
    de: string;
    en: string;
  };
  keyOutcomes: {
    de: string[];
    en: string[];
  };
  technologies: string[];
  featured?: boolean;
  imageUrl?: string;
}

export interface CertificationItem {
  id: string;
  title: {
    de: string;
    en: string;
  };
  issuer: string;
  categoryBadge: string;
  accentColor?: string;
  description: {
    de: string;
    en: string;
  };
  issuedDate: string;
  credentialUrl?: string;
  documentUrl?: string;
  fileName?: string;
  fileType?: string;
}

export type ColorSchemeId = 'cyber-purple' | 'tech-blue' | 'emerald-green' | 'slate-minimal' | 'amber-warm';
export type LayoutStyleId = 'split-bento' | 'executive-linear' | 'showcase-grid';

export interface DesignConfig {
  colorScheme: ColorSchemeId;
  layoutStyle: LayoutStyleId;
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: {
    de: string;
    en: string;
  };
  organization: string;
  location: string;
  type: 'work' | 'education' | 'course';
  description: {
    de: string;
    en: string;
  };
  highlights: {
    de: string[];
    en: string[];
  };
}

export interface SkillItem {
  name: string;
  level: string;
  context: {
    de: string;
    en: string;
  };
}

export interface SkillCategory {
  title: {
    de: string;
    en: string;
  };
  skills: SkillItem[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  replyTo?: string;
  subject: string;
  message: string;
  timestamp: string;
  read?: boolean;
  deliveryStatus?: 'delivered' | 'pending' | 'failed';
  recipientEmail?: string;
}

export interface VisitorSession {
  id: string;
  visitorId: string;
  timestamp: string;
  device: 'desktop' | 'mobile' | 'tablet';
  referrer: string;
  source: string;
  language: string;
  sectionsViewed?: string[];
}

export interface VisitorAnalyticsData {
  totalPageViews: number;
  uniqueVisitors: number;
  todayViews: number;
  todayUnique: number;
  last7DaysViews: number;
  last7DaysUnique: number;
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  referrerSources: Record<string, number>;
  sectionViews: Record<string, number>;
  dailyHistory: {
    date: string;
    views: number;
    uniques: number;
  }[];
  recentSessions: VisitorSession[];
  lastUpdated: string;
}

export interface AdminSettings {
  contactRecipientEmail: string;
  ownerEmail: string;
  ownerName: string;
  customDomainNotice?: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  experiences: ExperienceItem[];
  certifications: CertificationItem[];
  skillCategories: SkillCategory[];
  projects: Project[];
  adminSettings: AdminSettings;
  contactMessages?: ContactMessage[];
  visitorAnalytics?: VisitorAnalyticsData;
}

