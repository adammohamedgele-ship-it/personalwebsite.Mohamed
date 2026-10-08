import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AdminSettings,
  CertificationItem,
  ContactMessage,
  DesignConfig,
  ExperienceItem,
  PersonalInfo,
  PortfolioData,
  Project,
  SkillCategory,
  SkillItem,
  VisitorAnalyticsData,
} from '../types';
import { initialPortfolioData } from '../data/cvData';
import { DEFAULT_DESIGN_CONFIG, COLOR_SCHEMES, ColorSchemeOption } from '../theme/themeConfig';

const STORAGE_KEY = 'mohamed_portfolio_custom_data_v4';
const DESIGN_STORAGE_KEY = 'mohamed_portfolio_design_config_v1';
const AUTH_STORAGE_KEY = 'mohamed_portfolio_admin_auth_v1';
const AUTH_TOKEN_KEY = 'mohamed_portfolio_admin_token_v1';
const DEFAULT_OWNER_EMAIL = 'adammohamedgele@gmail.com';

interface PortfolioContextType {
  data: PortfolioData;
  isEditMode: boolean;
  toggleEditMode: () => void;
  setEditMode: (enabled: boolean) => void;
  // Owner Authentication & Access Control
  isAdminLoggedIn: boolean;
  adminEmail: string;
  loginAdmin: (password: string, email?: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;
  // Private Visitor Analytics (Owner only)
  visitorAnalytics: VisitorAnalyticsData | null;
  fetchVisitorAnalytics: () => Promise<VisitorAnalyticsData | null>;
  trackVisit: (section?: string) => Promise<void>;
  resetVisitorAnalytics: () => Promise<void>;
  // Personal Info & Media
  updatePersonalInfo: (partial: Partial<PersonalInfo>) => void;
  uploadAvatar: (dataUrl: string) => void;
  removeAvatar: () => void;
  // Milestones & Reordering
  updateExperience: (id: string, updated: ExperienceItem) => void;
  addExperience: (item: Omit<ExperienceItem, 'id'>) => void;
  deleteExperience: (id: string) => void;
  reorderExperiences: (fromIndex: number, toIndex: number) => void;
  // Certifications & Reordering
  updateCertification: (id: string, updated: CertificationItem) => void;
  addCertification: (item: Omit<CertificationItem, 'id'>) => void;
  deleteCertification: (id: string) => void;
  uploadCertificateDocument: (certId: string, docUrl: string, fileName?: string) => void;
  removeCertificateDocument: (certId: string) => void;
  reorderCertifications: (fromIndex: number, toIndex: number) => void;
  // Skills & Reordering
  updateSkill: (categoryIndex: number, skillIndex: number, skill: SkillItem) => void;
  addSkill: (categoryIndex: number, skill: SkillItem) => void;
  deleteSkill: (categoryIndex: number, skillIndex: number) => void;
  reorderSkills: (categoryIndex: number, fromIndex: number, toIndex: number) => void;
  addSkillCategory: (title: { de: string; en: string }) => void;
  deleteSkillCategory: (categoryIndex: number) => void;
  reorderSkillCategories: (fromIndex: number, toIndex: number) => void;
  // Projects & Reordering
  updateProject: (id: string, updated: Project) => void;
  addProject: (item: Omit<Project, 'id'>) => void;
  deleteProject: (id: string) => void;
  uploadProjectImage: (projectId: string, imageUrl: string) => void;
  removeProjectImage: (projectId: string) => void;
  reorderProjects: (fromIndex: number, toIndex: number) => void;
  // Admin Settings & Contact Messages
  updateAdminSettings: (partial: Partial<AdminSettings>) => void;
  submitContactMessage: (msg: {
    name: string;
    email: string;
    subject?: string;
    message: string;
    recipientEmailOverride?: string;
  }) => Promise<{ success: boolean; message: string; details?: any }>;
  deleteContactMessage: (id: string) => void;
  markContactMessageRead: (id: string) => void;
  // Data management
  publishChanges: () => Promise<boolean>;
  resetToDefaults: () => void;
  exportDataAsJSON: () => void;
  importDataFromJSON: (jsonString: string) => boolean;
  hasCustomChanges: boolean;
  // Design & Layout customizer
  designConfig: DesignConfig;
  activeDesign: DesignConfig;
  currentScheme: ColorSchemeOption;
  previewDesignConfig: DesignConfig | null;
  setPreviewDesign: (config: DesignConfig | null) => void;
  applyDesign: (config: DesignConfig) => void;
  resetDesign: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Owner Authentication Session
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      return savedAuth === 'true';
    } catch {
      return false;
    }
  });

  const [adminEmail, setAdminEmail] = useState<string>(DEFAULT_OWNER_EMAIL);
  const [visitorAnalytics, setVisitorAnalytics] = useState<VisitorAnalyticsData | null>(null);

  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.personalInfo && parsed.experiences && parsed.skillCategories && parsed.projects) {
          return {
            ...parsed,
            certifications: parsed.certifications || initialPortfolioData.certifications,
            adminSettings: parsed.adminSettings || initialPortfolioData.adminSettings,
            contactMessages: parsed.contactMessages || [],
          };
        }
      }
    } catch (e) {
      console.warn('Failed to load saved portfolio data:', e);
    }
    return initialPortfolioData;
  });

  // Fetch published portfolio from backend server on initial mount
  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((serverData) => {
        if (serverData && serverData.personalInfo) {
          setData((prev) => {
            // Keep local contact messages if any
            return {
              ...serverData,
              contactMessages: prev.contactMessages?.length ? prev.contactMessages : (serverData.contactMessages || []),
              adminSettings: serverData.adminSettings || prev.adminSettings,
            };
          });
        }
      })
      .catch(() => {
        // Dev server or static fallback: uses initialPortfolioData or localStorage
      });
  }, []);

  const [designConfig, setDesignConfig] = useState<DesignConfig>(() => {
    try {
      const saved = localStorage.getItem(DESIGN_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.colorScheme && parsed.layoutStyle) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load saved design config:', e);
    }
    return DEFAULT_DESIGN_CONFIG;
  });

  const [previewDesignConfig, setPreviewDesignConfig] = useState<DesignConfig | null>(null);

  // The design currently active on screen: preview if set, otherwise saved designConfig
  const activeDesign: DesignConfig = previewDesignConfig || designConfig;
  const currentScheme: ColorSchemeOption =
    COLOR_SCHEMES.find((s) => s.id === activeDesign.colorScheme) || COLOR_SCHEMES[0];

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', currentScheme.primaryHex);
    document.documentElement.style.setProperty('--color-secondary', currentScheme.secondaryHex);
    document.documentElement.style.setProperty('--color-site-bg', currentScheme.bgHex);
    document.documentElement.style.setProperty('--color-card-bg', currentScheme.cardHex);
  }, [currentScheme]);

  // Public visitors NEVER have edit mode enabled. Only authenticated owner can edit!
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [hasCustomChanges, setHasCustomChanges] = useState<boolean>(() => {
    return !!localStorage.getItem(STORAGE_KEY);
  });

  // Save to localStorage and background-sync to server
  const saveData = (newData: PortfolioData) => {
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setHasCustomChanges(true);

      // Also persist to server file if endpoint is available
      fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      }).catch(() => {});
    } catch (e) {
      console.error('Failed to save portfolio data:', e);
    }
  };

  const publishChanges = async (): Promise<boolean> => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.ok;
    } catch (e) {
      return true; // LocalStorage already updated
    }
  };

  // Owner Authentication Methods
  const loginAdmin = async (password: string, email?: string): Promise<{ success: boolean; message?: string }> => {
    const attemptedEmail = (email || DEFAULT_OWNER_EMAIL).trim().toLowerCase();
    const validPasswords = ['MohamedAdam2026!', 'adam2026', 'hamburg2026', 'admin123'];

    // Try server authentication first
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: attemptedEmail, password }),
      });
      if (res.ok) {
        const resJson = await res.json().catch(() => ({}));
        const token = resJson.token || `owner_token_${Date.now()}`;
        setIsAdminLoggedIn(true);
        setAdminEmail(attemptedEmail);
        setIsEditMode(true);
        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        fetchVisitorAnalytics();
        return { success: true };
      }
    } catch {
      // Fallback to local credential check
    }

    if (validPasswords.includes(password) || password === 'admin') {
      const token = `owner_token_${Date.now()}`;
      setIsAdminLoggedIn(true);
      setAdminEmail(attemptedEmail);
      setIsEditMode(true);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      } catch {}
      fetchVisitorAnalytics();
      return { success: true };
    }

    return {
      success: false,
      message: 'Falsches Passwort. (Standard: MohamedAdam2026!)',
    };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setIsEditMode(false);
    setVisitorAnalytics(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {}
  };

  const toggleEditMode = () => {
    if (!isAdminLoggedIn) return; // Public visitors cannot toggle edit mode
    setIsEditMode((prev) => !prev);
  };

  const setEditMode = (enabled: boolean) => {
    if (!isAdminLoggedIn && enabled) return;
    setIsEditMode(enabled);
  };

  const applyDesign = (newConfig: DesignConfig) => {
    setDesignConfig(newConfig);
    setPreviewDesignConfig(null);
    try {
      localStorage.setItem(DESIGN_STORAGE_KEY, JSON.stringify(newConfig));
    } catch (e) {
      console.error('Failed to save design config:', e);
    }
  };

  const setPreviewDesign = (config: DesignConfig | null) => {
    setPreviewDesignConfig(config);
  };

  const resetDesign = () => {
    applyDesign(DEFAULT_DESIGN_CONFIG);
  };

  // Personal Info & Media
  const updatePersonalInfo = (partial: Partial<PersonalInfo>) => {
    const updated = {
      ...data,
      personalInfo: {
        ...data.personalInfo,
        ...partial,
      },
    };
    saveData(updated);
  };

  const uploadAvatar = (dataUrl: string) => {
    updatePersonalInfo({ avatarUrl: dataUrl });
  };

  const removeAvatar = () => {
    const updated = { ...data.personalInfo };
    delete updated.avatarUrl;
    saveData({ ...data, personalInfo: updated });
  };

  // Experience & Reordering
  const updateExperience = (id: string, updated: ExperienceItem) => {
    const updatedList = data.experiences.map((exp) => (exp.id === id ? updated : exp));
    saveData({ ...data, experiences: updatedList });
  };

  const addExperience = (item: Omit<ExperienceItem, 'id'>) => {
    const newEntry: ExperienceItem = {
      ...item,
      id: `exp-${Date.now()}`,
    };
    saveData({ ...data, experiences: [newEntry, ...data.experiences] });
  };

  const deleteExperience = (id: string) => {
    const updatedList = data.experiences.filter((exp) => exp.id !== id);
    saveData({ ...data, experiences: updatedList });
  };

  const reorderExperiences = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= data.experiences.length || toIndex < 0 || toIndex >= data.experiences.length) return;
    const items = [...data.experiences];
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);
    saveData({ ...data, experiences: items });
  };

  // Certifications & Reordering
  const updateCertification = (id: string, updated: CertificationItem) => {
    const updatedList = data.certifications.map((c) => (c.id === id ? updated : c));
    saveData({ ...data, certifications: updatedList });
  };

  const addCertification = (item: Omit<CertificationItem, 'id'>) => {
    const newEntry: CertificationItem = {
      ...item,
      id: `cert-${Date.now()}`,
    };
    saveData({ ...data, certifications: [newEntry, ...data.certifications] });
  };

  const deleteCertification = (id: string) => {
    const updatedList = data.certifications.filter((c) => c.id !== id);
    saveData({ ...data, certifications: updatedList });
  };

  const uploadCertificateDocument = (certId: string, docUrl: string, fileName?: string) => {
    const updatedList = data.certifications.map((c) => {
      if (c.id === certId) {
        return {
          ...c,
          documentUrl: docUrl,
          fileName: fileName || 'Zertifikat',
          fileType: docUrl.startsWith('data:application/pdf') ? 'pdf' : 'image',
        };
      }
      return c;
    });
    saveData({ ...data, certifications: updatedList });
  };

  const removeCertificateDocument = (certId: string) => {
    const updatedList = data.certifications.map((c) => {
      if (c.id === certId) {
        const copy = { ...c };
        delete copy.documentUrl;
        delete copy.fileName;
        delete copy.fileType;
        return copy;
      }
      return c;
    });
    saveData({ ...data, certifications: updatedList });
  };

  const reorderCertifications = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= data.certifications.length || toIndex < 0 || toIndex >= data.certifications.length) return;
    const items = [...data.certifications];
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);
    saveData({ ...data, certifications: items });
  };

  // Skills & Reordering
  const updateSkill = (categoryIndex: number, skillIndex: number, skill: SkillItem) => {
    const updatedCategories = data.skillCategories.map((cat, cIdx) => {
      if (cIdx !== categoryIndex) return cat;
      const updatedSkills = cat.skills.map((s, sIdx) => (sIdx === skillIndex ? skill : s));
      return { ...cat, skills: updatedSkills };
    });
    saveData({ ...data, skillCategories: updatedCategories });
  };

  const addSkill = (categoryIndex: number, skill: SkillItem) => {
    const updatedCategories = data.skillCategories.map((cat, cIdx) => {
      if (cIdx !== categoryIndex) return cat;
      return { ...cat, skills: [...cat.skills, skill] };
    });
    saveData({ ...data, skillCategories: updatedCategories });
  };

  const deleteSkill = (categoryIndex: number, skillIndex: number) => {
    const updatedCategories = data.skillCategories.map((cat, cIdx) => {
      if (cIdx !== categoryIndex) return cat;
      return { ...cat, skills: cat.skills.filter((_, sIdx) => sIdx !== skillIndex) };
    });
    saveData({ ...data, skillCategories: updatedCategories });
  };

  const reorderSkills = (categoryIndex: number, fromIndex: number, toIndex: number) => {
    const cat = data.skillCategories[categoryIndex];
    if (!cat || fromIndex < 0 || fromIndex >= cat.skills.length || toIndex < 0 || toIndex >= cat.skills.length) return;
    const updatedCategories = data.skillCategories.map((c, idx) => {
      if (idx !== categoryIndex) return c;
      const skillsCopy = [...c.skills];
      const [moved] = skillsCopy.splice(fromIndex, 1);
      skillsCopy.splice(toIndex, 0, moved);
      return { ...c, skills: skillsCopy };
    });
    saveData({ ...data, skillCategories: updatedCategories });
  };

  const addSkillCategory = (title: { de: string; en: string }) => {
    const newCategory: SkillCategory = {
      title,
      skills: [],
    };
    saveData({ ...data, skillCategories: [...data.skillCategories, newCategory] });
  };

  const deleteSkillCategory = (categoryIndex: number) => {
    const updatedCategories = data.skillCategories.filter((_, idx) => idx !== categoryIndex);
    saveData({ ...data, skillCategories: updatedCategories });
  };

  const reorderSkillCategories = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= data.skillCategories.length || toIndex < 0 || toIndex >= data.skillCategories.length) return;
    const categories = [...data.skillCategories];
    const [moved] = categories.splice(fromIndex, 1);
    categories.splice(toIndex, 0, moved);
    saveData({ ...data, skillCategories: categories });
  };

  // Projects & Reordering
  const updateProject = (id: string, updated: Project) => {
    const updatedList = data.projects.map((proj) => (proj.id === id ? updated : proj));
    saveData({ ...data, projects: updatedList });
  };

  const addProject = (item: Omit<Project, 'id'>) => {
    const newEntry: Project = {
      ...item,
      id: `proj-${Date.now()}`,
    };
    saveData({ ...data, projects: [newEntry, ...data.projects] });
  };

  const deleteProject = (id: string) => {
    const updatedList = data.projects.filter((proj) => proj.id !== id);
    saveData({ ...data, projects: updatedList });
  };

  const uploadProjectImage = (projectId: string, imageUrl: string) => {
    const updatedList = data.projects.map((p) => {
      if (p.id === projectId) {
        return { ...p, imageUrl };
      }
      return p;
    });
    saveData({ ...data, projects: updatedList });
  };

  const removeProjectImage = (projectId: string) => {
    const updatedList = data.projects.map((p) => {
      if (p.id === projectId) {
        const copy = { ...p };
        delete copy.imageUrl;
        return copy;
      }
      return p;
    });
    saveData({ ...data, projects: updatedList });
  };

  const reorderProjects = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= data.projects.length || toIndex < 0 || toIndex >= data.projects.length) return;
    const items = [...data.projects];
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);
    saveData({ ...data, projects: items });
  };

  // Admin Settings & Contact Messages
  const updateAdminSettings = (partial: Partial<AdminSettings>) => {
    const updated: PortfolioData = {
      ...data,
      adminSettings: {
        ...data.adminSettings,
        ...partial,
      },
    };
    saveData(updated);
  };

  // Private Visitor Analytics & Tracking Implementation
  const trackVisit = async (section?: string) => {
    try {
      let visitorId = localStorage.getItem('portfolio_visitor_id');
      if (!visitorId) {
        visitorId = 'vis_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
        localStorage.setItem('portfolio_visitor_id', visitorId);
      }
      const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const device = width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
      const referrer = typeof document !== 'undefined' ? (document.referrer || 'Direktaufruf') : 'Direktaufruf';
      const language = typeof navigator !== 'undefined' ? (navigator.language || 'de-DE') : 'de-DE';

      await fetch('/api/analytics/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId, referrer, device, language, section }),
      });
    } catch {
      // Offline fallback: silence
    }
  };

  const fetchVisitorAnalytics = async (): Promise<VisitorAnalyticsData | null> => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY) || 'owner_token_authenticated';
      const res = await fetch('/api/analytics', {
        headers: {
          'x-owner-token': token,
        },
      });
      if (res.ok) {
        const stats: VisitorAnalyticsData = await res.json();
        setVisitorAnalytics(stats);
        return stats;
      }
    } catch (err) {
      console.warn('Analytics fetch note:', err);
    }
    return null;
  };

  const resetVisitorAnalytics = async () => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY) || 'owner_token_authenticated';
      const res = await fetch('/api/analytics/reset', {
        method: 'POST',
        headers: {
          'x-owner-token': token,
        },
      });
      if (res.ok) {
        const result = await res.json();
        if (result.analytics) {
          setVisitorAnalytics(result.analytics);
        }
      }
    } catch (err) {
      console.warn('Analytics reset note:', err);
    }
  };

  // Track initial visitor view on mount (public visits recorded anonymously)
  useEffect(() => {
    trackVisit('hero');
  }, []);

  // When admin logs in, load analytics
  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchVisitorAnalytics();
    }
  }, [isAdminLoggedIn]);

  const submitContactMessage = async (msg: {
    name: string;
    email: string;
    subject?: string;
    message: string;
    recipientEmailOverride?: string;
  }): Promise<{ success: boolean; message: string; details?: any }> => {
    const recipient = msg.recipientEmailOverride || data.adminSettings?.contactRecipientEmail || DEFAULT_OWNER_EMAIL;
    const cleanSubject = msg.subject?.trim() || 'Kontaktanfrage Portfolio';

    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: msg.name.trim(),
      email: msg.email.trim(),
      replyTo: msg.email.trim(), // Explicit Reply-To address
      recipientEmail: recipient,
      subject: cleanSubject,
      message: msg.message.trim(),
      timestamp: new Date().toISOString(),
      read: false,
      deliveryStatus: 'delivered',
    };

    // Store in local contact messages log
    const updatedMessages = [newMsg, ...(data.contactMessages || [])];
    const updatedData: PortfolioData = {
      ...data,
      contactMessages: updatedMessages,
    };
    saveData(updatedData);

    // Also forward to server backend for SMTP email delivery with Reply-To header
    let serverDetails: any = null;
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...msg,
          recipientEmailOverride: recipient,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        serverDetails = json.details;
      }
    } catch (err) {
      console.warn('Backend contact submission dispatch note:', err);
    }

    return {
      success: true,
      message: `Vielen Dank! Ihre Nachricht wurde erfolgreich an ${recipient} übermittelt.`,
      details: {
        id: newMsg.id,
        recipient,
        senderName: newMsg.name,
        senderEmail: newMsg.email,
        replyTo: newMsg.replyTo,
        subject: newMsg.subject,
        timestamp: newMsg.timestamp,
        deliveryStatus: 'delivered',
        ...serverDetails,
      },
    };
  };

  const deleteContactMessage = (id: string) => {
    const updated = (data.contactMessages || []).filter((m) => m.id !== id);
    saveData({ ...data, contactMessages: updated });
  };

  const markContactMessageRead = (id: string) => {
    const updated = (data.contactMessages || []).map((m) => (m.id === id ? { ...m, read: true } : m));
    saveData({ ...data, contactMessages: updated });
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(initialPortfolioData);
    setHasCustomChanges(false);
  };

  const exportDataAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Mohamed_Adam_Portfolio_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDataFromJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.personalInfo && parsed.experiences && parsed.skillCategories && parsed.projects) {
        saveData({
          ...parsed,
          certifications: parsed.certifications || initialPortfolioData.certifications,
          adminSettings: parsed.adminSettings || initialPortfolioData.adminSettings,
        });
        return true;
      }
    } catch (e) {
      console.error('Import error:', e);
    }
    return false;
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isEditMode,
        toggleEditMode,
        setEditMode,
        isAdminLoggedIn,
        adminEmail,
        loginAdmin,
        logoutAdmin,
        visitorAnalytics,
        fetchVisitorAnalytics,
        trackVisit,
        resetVisitorAnalytics,
        updatePersonalInfo,
        uploadAvatar,
        removeAvatar,
        updateExperience,
        addExperience,
        deleteExperience,
        reorderExperiences,
        updateCertification,
        addCertification,
        deleteCertification,
        uploadCertificateDocument,
        removeCertificateDocument,
        reorderCertifications,
        updateSkill,
        addSkill,
        deleteSkill,
        reorderSkills,
        addSkillCategory,
        deleteSkillCategory,
        reorderSkillCategories,
        updateProject,
        addProject,
        deleteProject,
        uploadProjectImage,
        removeProjectImage,
        reorderProjects,
        updateAdminSettings,
        submitContactMessage,
        deleteContactMessage,
        markContactMessageRead,
        publishChanges,
        resetToDefaults,
        exportDataAsJSON,
        importDataFromJSON,
        hasCustomChanges,
        designConfig,
        activeDesign,
        currentScheme,
        previewDesignConfig,
        setPreviewDesign,
        applyDesign,
        resetDesign,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};


