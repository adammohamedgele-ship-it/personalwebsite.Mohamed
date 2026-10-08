import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Copy, Check, MessageSquare, Car, ExternalLink, Pencil } from 'lucide-react';
import { Language } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { EditPersonalInfoModal } from './EditPersonalInfoModal';

interface ContactProps {
  language: Language;
}

export const Contact: React.FC<ContactProps> = ({ language }) => {
  const { data, isEditMode, currentScheme, submitContactMessage } = usePortfolio();
  const personalInfo = data.personalInfo;
  const recipientEmail = data.adminSettings?.contactRecipientEmail || personalInfo.email;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    email: string;
    subject: string;
    message: string;
    timestamp: string;
    recipientEmail: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<'email' | 'phone' | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCopy = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage(language === 'de' ? 'Bitte füllen Sie alle Pflichtfelder aus.' : 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await submitContactMessage(formData);
      if (res.success) {
        setSubmittedData({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim() || (language === 'de' ? 'Anfrage Ausbildung / IT-Position' : 'Inquiry regarding IT Position'),
          message: formData.message.trim(),
          timestamp: new Date().toLocaleTimeString(language === 'de' ? 'de-DE' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          recipientEmail,
        });
        setIsSubmitted(true);
      } else {
        setErrorMessage(language === 'de' ? 'Fehler beim Senden der Nachricht.' : 'Error submitting message.');
      }
    } catch {
      setErrorMessage(language === 'de' ? 'Verbindungsfehler beim Absenden.' : 'Network error submitting message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(
    formData.subject || (language === 'de' ? 'Anfrage Ausbildung / IT-Position' : 'Inquiry regarding IT Position')
  )}&body=${encodeURIComponent(
    `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
  )}`;

  return (
    <section id="contact" className="py-16 md:py-24 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-start justify-between gap-4 mb-12">
          <div className="max-w-2xl">
            <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${currentScheme.accentText}`}>
              {language === 'de' ? 'Kontakt & Dialog' : 'Get In Touch'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white [text-wrap:balance]">
              {language === 'de'
                ? 'Lassen Sie uns ins Gespräch kommen'
                : 'Let’s connect for opportunities'}
            </h2>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
              {language === 'de'
                ? 'Haben Sie einen Ausbildungsplatz im Bereich Fachinformatik für Systemintegration, ein Praktikum oder eine Einstiegsposition in Hamburg? Ich freue mich auf Ihre Nachricht.'
                : 'Do you have an apprenticeship opening for IT System Integration, an internship, or a junior entry role in Hamburg? I look forward to hearing from you.'}
            </p>
          </div>

          {isEditMode && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors shrink-0 shadow-xs"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{language === 'de' ? 'Kontaktdaten ändern' : 'Edit Contact Details'}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Direct Details Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  {language === 'de' ? 'Direkte Kontaktdaten' : 'Direct Contact'}
                </h3>
                {isEditMode && (
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-1 text-sky-600 dark:text-sky-400 text-xs hover:underline flex items-center gap-1"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Email Item */}
                <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <Mail className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-[11px] uppercase tracking-wider font-mono text-neutral-400 mb-0.5">
                        E-Mail
                      </div>
                      <a
                        href={`mailto:${personalInfo.email}`}
                        className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 truncate block transition-colors"
                      >
                        {personalInfo.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(personalInfo.email, 'email')}
                    className="p-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors shrink-0"
                    title="Kopieren"
                  >
                    {copiedType === 'email' ? (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Phone Item */}
                <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <Phone className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-[11px] uppercase tracking-wider font-mono text-neutral-400 mb-0.5">
                        {language === 'de' ? 'Mobiltelefon' : 'Mobile Phone'}
                      </div>
                      <a
                        href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`}
                        className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 tabular-nums block transition-colors"
                      >
                        {personalInfo.phone}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(personalInfo.phone, 'phone')}
                    className="p-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors shrink-0"
                    title="Kopieren"
                  >
                    {copiedType === 'phone' ? (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Location Item */}
                <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-mono text-neutral-400 mb-0.5">
                      {language === 'de' ? 'Adresse' : 'Address'}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-white">
                      {personalInfo.location}
                    </div>
                  </div>
                </div>

                {/* Mobility / Driving License */}
                <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 flex items-start gap-3">
                  <Car className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-mono text-neutral-400 mb-0.5">
                      {language === 'de' ? 'Mobilität' : 'Mobility'}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-white">
                      {personalInfo.driverLicense[language]}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {language === 'de'
                        ? 'Flexibel erreichbar im gesamten Großraum Hamburg'
                        : 'Promptly available across the Hamburg metropolitan area'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">
                {language === 'de' ? 'Nachricht senden' : 'Send a Message'}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
                {language === 'de'
                  ? 'Füllen Sie das Formular aus, um direkt Kontakt aufzunehmen. Alle Eingaben werden umgehend beantwortet.'
                  : 'Fill in the form to reach out directly. I will reply to all inquiries promptly.'}
              </p>

              {isSubmitted ? (
                <div className="p-6 sm:p-7 rounded-xl bg-gradient-to-b from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 text-left space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-emerald-300">
                        {language === 'de' ? 'Nachricht erfolgreich zugestellt!' : 'Message Successfully Delivered!'}
                      </h4>
                      <p className="mt-1 text-xs text-neutral-600 dark:text-emerald-200/80 leading-relaxed">
                        {language === 'de'
                          ? `Ihre Nachricht wurde an Mohamed Mohamed Adam (${submittedData?.recipientEmail || recipientEmail}) übermittelt. Ihre E-Mail wurde als direkte Antwortadresse (Reply-To) hinterlegt, sodass Mohamed Ihnen direkt per E-Mail antworten kann.`
                          : `Your message was delivered to Mohamed Mohamed Adam (${submittedData?.recipientEmail || recipientEmail}). Your email has been configured as the direct reply-to address, allowing Mohamed to reply directly to your inbox.`}
                      </p>
                    </div>
                  </div>

                  {/* Submission Receipt Card */}
                  <div className="p-4 rounded-lg bg-white/80 dark:bg-neutral-900/80 border border-emerald-500/20 text-xs space-y-2.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 pb-1 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                      <span>{language === 'de' ? 'Übermittlungs-Bestätigung' : 'Transmission Confirmation Receipt'}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                        {language === 'de' ? 'Status: Zugestellt' : 'Status: Delivered'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block font-mono uppercase">
                          {language === 'de' ? 'Empfänger-Postfach' : 'Recipient Inbox'}
                        </span>
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          Mohamed Mohamed Adam ({submittedData?.recipientEmail || recipientEmail})
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block font-mono uppercase">
                          {language === 'de' ? 'Ihre E-Mail (Reply-To)' : 'Your Email (Reply-To)'}
                        </span>
                        <span className="font-semibold text-sky-600 dark:text-sky-400">
                          {submittedData?.email}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block font-mono uppercase">
                          {language === 'de' ? 'Betreff' : 'Subject'}
                        </span>
                        <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate block">
                          {submittedData?.subject}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block font-mono uppercase">
                          {language === 'de' ? 'Übertragungszeit' : 'Delivered At'}
                        </span>
                        <span className="font-medium text-neutral-800 dark:text-neutral-200">
                          {submittedData?.timestamp} Uhr
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 flex flex-wrap gap-2.5">
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setSubmittedData(null);
                        setFormData({ name: '', email: '', subject: '', message: '' });
                      }}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
                    >
                      {language === 'de' ? 'Neue Nachricht verfassen' : 'Compose Another Message'}
                    </button>
                    <a
                      href={mailtoLink}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{language === 'de' ? 'In E-Mail-Programm öffnen' : 'Open in Mail Client'}</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-md bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs">
                      {errorMessage}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        {language === 'de' ? 'Ihr Name *' : 'Your Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={language === 'de' ? 'z.B. Frau / Herr Müller' : 'e.g. Jane Doe'}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        {language === 'de' ? 'Ihre E-Mail-Adresse *' : 'Your Email *'}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="kontakt@unternehmen.de"
                        className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      {language === 'de' ? 'Betreff / Unternehmen *' : 'Subject / Organization *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={
                        language === 'de'
                          ? 'z.B. Ausbildungsplatz Fachinformatik 2026/2027'
                          : 'e.g. IT Apprenticeship Position 2026/2027'
                      }
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      {language === 'de' ? 'Ihre Nachricht *' : 'Your Message *'}
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={
                        language === 'de'
                          ? 'Guten Tag Herr Adam, wir haben Ihr Profil gesehen und möchten Sie zu einem Gespräch einladen...'
                          : 'Hello Mr. Adam, we reviewed your candidate profile and would like to invite you for an interview...'
                      }
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors resize-y"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      {language === 'de'
                        ? `Direkte Zustellung an ${personalInfo.email}`
                        : `Delivered directly to ${personalInfo.email}`}
                    </span>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r ${currentScheme.gradientButton} hover:opacity-95 disabled:opacity-50 rounded-md transition-all shadow-xs`}
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {isSubmitting
                          ? (language === 'de' ? 'Wird gesendet...' : 'Sending...')
                          : (language === 'de' ? 'Nachricht absenden' : 'Submit Message')}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditPersonalInfoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        language={language}
      />
    </section>
  );
};
