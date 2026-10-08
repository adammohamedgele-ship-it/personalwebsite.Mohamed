import React, { useState } from 'react';
import { Lock, Mail, Key, Check, X, AlertCircle, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Language } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const { loginAdmin } = usePortfolio();
  const [email, setEmail] = useState('adammohamedgele@gmail.com');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await loginAdmin(password, email);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message || (language === 'de' ? 'Ungültiges Passwort.' : 'Invalid password.'));
      }
    } catch {
      setErrorMsg(language === 'de' ? 'Verbindungsfehler.' : 'Connection error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-purple-800/50 bg-[#121124] text-white p-6 sm:p-7 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-purple-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-600/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {language === 'de' ? 'Inhaber-Login (Admin)' : 'Owner Sign In (Admin)'}
              </h3>
              <p className="text-xs text-neutral-400">
                {language === 'de'
                  ? 'Nur für Mohamed Mohamed Adam'
                  : 'Restricted to site owner'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed">
          {language === 'de'
            ? 'Öffentliche Besucher können Inhalte nur lesen. Melden Sie sich hier als Eigentümer an, um Ihr Profil, Erfahrungen, Projekte, Zeugnisse und das Design zu bearbeiten.'
            : 'Public visitors have read-only access. Sign in here as the site owner to manage your profile, milestones, projects, certificates, and design.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              {language === 'de' ? 'Inhaber-E-Mail' : 'Owner Email'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adammohamedgele@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0a0916] border border-purple-900/50 text-white placeholder:text-neutral-500 focus:outline-none focus:border-pink-500"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              {language === 'de' ? 'Admin-Passwort' : 'Admin Password'}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0a0916] border border-purple-900/50 text-white placeholder:text-neutral-500 focus:outline-none focus:border-pink-500 font-mono"
              />
              <Key className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
            </div>
            <div className="text-[11px] text-neutral-400 mt-1 flex items-center justify-between">
              <span>Standard-Passwort: <code className="text-pink-300">MohamedAdam2026!</code></span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-xl transition-colors"
            >
              {language === 'de' ? 'Abbrechen' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 font-semibold text-white bg-pink-600 hover:bg-pink-500 disabled:opacity-50 rounded-xl shadow-lg shadow-pink-500/25 flex items-center gap-1.5 transition-all"
            >
              {isSubmitting ? (
                <span>{language === 'de' ? 'Wird geprüft...' : 'Authenticating...'}</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{language === 'de' ? 'Anmelden' : 'Sign In'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
