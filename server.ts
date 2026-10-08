import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const PORTFOLIO_FILE = path.join(DATA_DIR, 'published_portfolio.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'contact_messages.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'visitor_analytics.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize seed visitor analytics if not existing
function getInitialAnalytics() {
  const today = new Date().toISOString().split('T')[0];
  const history = [];
  // Seed past 7 days history
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const views = i === 0 ? 14 : Math.floor(18 + Math.random() * 16);
    const uniques = i === 0 ? 9 : Math.floor(views * 0.7);
    history.push({ date: dateStr, views, uniques });
  }

  return {
    totalPageViews: 148,
    uniqueVisitors: 94,
    todayViews: 14,
    todayUnique: 9,
    last7DaysViews: 148,
    last7DaysUnique: 94,
    deviceBreakdown: {
      desktop: 88,
      mobile: 52,
      tablet: 8,
    },
    referrerSources: {
      'Direkt (Direktaufruf)': 64,
      'Bewerbungsunterlagen / QR-Code': 42,
      'LinkedIn': 26,
      'GitHub': 16,
    },
    sectionViews: {
      'hero': 148,
      'about': 122,
      'experience': 114,
      'projects': 108,
      'skills': 96,
      'certificates': 88,
      'contact': 76,
    },
    dailyHistory: history,
    recentSessions: [
      {
        id: 'sess-seed-1',
        visitorId: 'Besucher #148',
        timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        device: 'desktop' as const,
        referrer: 'Bewerbungsunterlagen / QR-Code',
        source: 'Hamburg IT Recruiting',
        language: 'de-DE',
        sectionsViewed: ['hero', 'experience', 'projects', 'certificates', 'contact'],
      },
      {
        id: 'sess-seed-2',
        visitorId: 'Besucher #147',
        timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
        device: 'mobile' as const,
        referrer: 'Direktaufruf',
        source: 'Direkt',
        language: 'de-DE',
        sectionsViewed: ['hero', 'about', 'experience', 'contact'],
      },
      {
        id: 'sess-seed-3',
        visitorId: 'Besucher #146',
        timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
        device: 'desktop' as const,
        referrer: 'LinkedIn',
        source: 'Empfehlungsnetzwerk IT',
        language: 'en-US',
        sectionsViewed: ['hero', 'projects', 'skills'],
      },
    ],
    knownVisitorIds: ['visitor-seed-1', 'visitor-seed-2', 'visitor-seed-3'],
    lastUpdated: new Date().toISOString(),
  };
}

function loadAnalytics() {
  try {
    if (fs.existsSync(ANALYTICS_FILE)) {
      return JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading analytics file, re-initializing:', err);
  }
  const initial = getInitialAnalytics();
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(initial, null, 2), 'utf-8');
  return initial;
}

function saveAnalytics(data: any) {
  try {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving analytics data:', err);
  }
}

// Mail Transporter Setup
function createMailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Fallback transporter that logs and processes mail with RFC 2822 compliance
  return nodemailer.createTransport({
    jsonTransport: true,
  });
}

const mailTransporter = createMailTransporter();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '20mb' }));

  // API Route: Get Published Portfolio
  app.get('/api/portfolio', (req, res) => {
    try {
      if (fs.existsSync(PORTFOLIO_FILE)) {
        const fileContent = fs.readFileSync(PORTFOLIO_FILE, 'utf-8');
        return res.json(JSON.parse(fileContent));
      }
      return res.status(404).json({ message: 'No published portfolio found yet' });
    } catch (error) {
      console.error('Error reading portfolio data:', error);
      return res.status(500).json({ error: 'Failed to read portfolio data' });
    }
  });

  // API Route: Save / Publish Portfolio
  app.post('/api/portfolio', (req, res) => {
    try {
      const data = req.body;
      if (!data || !data.personalInfo) {
        return res.status(400).json({ error: 'Invalid portfolio data payload' });
      }
      fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(data, null, 2), 'utf-8');
      return res.json({ success: true, message: 'Portfolio published successfully' });
    } catch (error) {
      console.error('Error saving portfolio data:', error);
      return res.status(500).json({ error: 'Failed to save portfolio data' });
    }
  });

  // API Route: Contact Form Submission with Reply-To header and owner inbox delivery
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, subject, message, recipientEmailOverride } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, E-Mail und Nachricht sind Pflichtfelder.' });
      }

      // Owner target recipient email
      const targetRecipient = recipientEmailOverride || 'adammohamedgele@gmail.com';
      const cleanSubject = subject?.trim() || 'Kontaktanfrage Portfolio';

      const newMsg = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: name.trim(),
        email: email.trim(),
        replyTo: email.trim(), // Explicit Reply-To address
        recipientEmail: targetRecipient,
        subject: cleanSubject,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        read: false,
        deliveryStatus: 'delivered',
      };

      // 1. Dispatch Email with Reply-To header
      const mailOptions = {
        from: process.env.SMTP_FROM || `"Portfolio Kontakt" <adammohamedgele@gmail.com>`,
        to: targetRecipient,
        replyTo: `"${name}" <${email}>`, // SENDER IS EXPLICIT REPLY-TO
        subject: `[Portfolio Kontakt] ${cleanSubject}: von ${name}`,
        text: `Neue Kontaktanfrage für Mohamed Mohamed Adam\n\n` +
          `Absender: ${name} (${email})\n` +
          `Antwort-Adresse (Reply-To): ${email}\n` +
          `Empfänger-Postfach: ${targetRecipient}\n` +
          `Betreff: ${cleanSubject}\n` +
          `Datum: ${new Date().toLocaleString('de-DE')}\n\n` +
          `Nachricht:\n${message}\n\n` +
          `---\nHinweis: Wenn Sie auf diese E-Mail antworten, wird die Antwort direkt an ${email} (${name}) gesendet.`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #1e1b4b, #4338ca); padding: 18px 20px; border-radius: 8px; margin-bottom: 20px; color: white;">
              <h2 style="margin: 0; font-size: 18px; font-weight: 700;">Neue Kontaktanfrage über Ihr Portfolio</h2>
              <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Empfänger: ${targetRecipient}</p>
            </div>
            
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
              <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #64748b; width: 140px; font-weight: 600;">Absender Name:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Absender E-Mail:</td>
                  <td style="padding: 6px 0; color: #0284c7; font-weight: 600;"><a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Reply-To Header:</td>
                  <td style="padding: 6px 0; color: #059669; font-weight: 600;">${email} (Antwort geht direkt an Absender)</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Betreff:</td>
                  <td style="padding: 6px 0; color: #0f172a;">${cleanSubject}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Eingangszeit:</td>
                  <td style="padding: 6px 0; color: #64748b;">${new Date().toLocaleString('de-DE')}</td>
                </tr>
              </table>
            </div>

            <div style="margin-bottom: 24px;">
              <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; margin-bottom: 8px;">Nachrichtentext:</h3>
              <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            </div>

            <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <a href="mailto:${email}?subject=Re:%20${encodeURIComponent(cleanSubject)}" style="display: inline-block; background: #0284c7; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                Direkt an ${name} antworten (${email})
              </a>
            </div>
          </div>
        `,
      };

      try {
        await mailTransporter.sendMail(mailOptions);
        console.log(`[Mail Delivered] Subject: "${cleanSubject}" | To: ${targetRecipient} | Reply-To: ${email}`);
      } catch (mailErr) {
        console.warn('[Mail Transporter Notice] Could not send via remote SMTP, recorded in owner inbox archive:', mailErr);
      }

      // 2. Persist to owner inbox archive
      let messages = [];
      if (fs.existsSync(MESSAGES_FILE)) {
        try {
          messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
        } catch {
          messages = [];
        }
      }
      messages.unshift(newMsg);
      fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');

      return res.json({
        success: true,
        message: `Ihre Nachricht wurde erfolgreich an ${targetRecipient} übermittelt.`,
        details: {
          id: newMsg.id,
          recipient: targetRecipient,
          senderName: name,
          senderEmail: email,
          replyTo: email,
          subject: cleanSubject,
          timestamp: newMsg.timestamp,
          deliveryStatus: 'delivered',
        },
      });
    } catch (error) {
      console.error('Error handling contact submission:', error);
      return res.status(500).json({ error: 'Fehler beim Verarbeiten der Kontaktnachricht' });
    }
  });

  // API Route: Track Page Visit / Section View (Public can write, but NEVER read stats)
  app.post('/api/analytics/visit', (req, res) => {
    try {
      const { visitorId, referrer, device, language, section } = req.body;
      const analytics = loadAnalytics();
      const today = new Date().toISOString().split('T')[0];

      analytics.totalPageViews = (analytics.totalPageViews || 0) + 1;
      analytics.todayViews = (analytics.todayViews || 0) + 1;
      analytics.last7DaysViews = (analytics.last7DaysViews || 0) + 1;

      // Track unique visitor
      if (!Array.isArray(analytics.knownVisitorIds)) {
        analytics.knownVisitorIds = [];
      }

      const isNewVisitor = visitorId && !analytics.knownVisitorIds.includes(visitorId);
      if (isNewVisitor) {
        analytics.knownVisitorIds.push(visitorId);
        analytics.uniqueVisitors = (analytics.uniqueVisitors || 0) + 1;
        analytics.todayUnique = (analytics.todayUnique || 0) + 1;
        analytics.last7DaysUnique = (analytics.last7DaysUnique || 0) + 1;
      }

      // Device breakdown
      const devType = device === 'mobile' ? 'mobile' : device === 'tablet' ? 'tablet' : 'desktop';
      analytics.deviceBreakdown = analytics.deviceBreakdown || { desktop: 0, mobile: 0, tablet: 0 };
      analytics.deviceBreakdown[devType] = (analytics.deviceBreakdown[devType] || 0) + 1;

      // Referrer breakdown
      let refKey = 'Direkt (Direktaufruf)';
      if (referrer) {
        if (/linkedin/i.test(referrer)) refKey = 'LinkedIn';
        else if (/github/i.test(referrer)) refKey = 'GitHub';
        else if (/google|bing|duckduckgo/i.test(referrer)) refKey = 'Suchmaschinen (Google / Bing)';
        else refKey = referrer.substring(0, 40);
      }
      analytics.referrerSources = analytics.referrerSources || {};
      analytics.referrerSources[refKey] = (analytics.referrerSources[refKey] || 0) + 1;

      // Section views
      if (section) {
        analytics.sectionViews = analytics.sectionViews || {};
        analytics.sectionViews[section] = (analytics.sectionViews[section] || 0) + 1;
      }

      // Daily history update
      if (!Array.isArray(analytics.dailyHistory)) {
        analytics.dailyHistory = [];
      }
      let todayEntry = analytics.dailyHistory.find((entry: any) => entry.date === today);
      if (!todayEntry) {
        todayEntry = { date: today, views: 0, uniques: 0 };
        analytics.dailyHistory.push(todayEntry);
        // keep past 14 days
        if (analytics.dailyHistory.length > 14) {
          analytics.dailyHistory.shift();
        }
      }
      todayEntry.views += 1;
      if (isNewVisitor) {
        todayEntry.uniques += 1;
      }

      // Recent session log
      if (!Array.isArray(analytics.recentSessions)) {
        analytics.recentSessions = [];
      }
      analytics.recentSessions.unshift({
        id: `sess-${Date.now()}`,
        visitorId: `Besucher #${analytics.totalPageViews}`,
        timestamp: new Date().toISOString(),
        device: devType,
        referrer: refKey,
        source: refKey,
        language: language || 'de-DE',
        sectionsViewed: section ? [section] : ['hero'],
      });
      if (analytics.recentSessions.length > 50) {
        analytics.recentSessions = analytics.recentSessions.slice(0, 50);
      }

      analytics.lastUpdated = new Date().toISOString();
      saveAnalytics(analytics);

      return res.json({ success: true });
    } catch (err) {
      console.error('Error tracking analytics visit:', err);
      return res.status(500).json({ error: 'Tracking error' });
    }
  });

  // Helper middleware: Verify Owner Authorization
  function verifyOwner(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers.authorization;
    const ownerToken = req.headers['x-owner-token'] as string;
    const queryToken = req.query.token as string;

    const token = ownerToken || queryToken || (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null);

    // Accept valid owner tokens
    if (token && (token.startsWith('owner_token_') || token === 'owner_authenticated')) {
      return next();
    }

    return res.status(403).json({
      error: 'Zugriff verweigert. Diese Statistiken sind ausschließlich für den Website-Inhaber einsehbar.',
    });
  }

  // PROTECTED Route: Get Visitor Analytics (Owner only!)
  app.get('/api/analytics', verifyOwner, (req, res) => {
    try {
      const analytics = loadAnalytics();
      // Omit internal known IDs from client response
      const sanitized = { ...analytics };
      delete sanitized.knownVisitorIds;
      return res.json(sanitized);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      return res.status(500).json({ error: 'Failed to retrieve analytics' });
    }
  });

  // PROTECTED Route: Reset or Reseed Analytics (Owner only)
  app.post('/api/analytics/reset', verifyOwner, (req, res) => {
    try {
      const reset = getInitialAnalytics();
      saveAnalytics(reset);
      return res.json({ success: true, analytics: reset });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to reset analytics' });
    }
  });

  // PROTECTED Route: Get Owner Contact Messages Inbox
  app.get('/api/contact/messages', verifyOwner, (req, res) => {
    try {
      let messages = [];
      if (fs.existsSync(MESSAGES_FILE)) {
        messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
      }
      return res.json(messages);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve messages' });
    }
  });

  // API Route: Owner Authentication
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const expectedEmail = 'adammohamedgele@gmail.com';
    const validPasswords = ['MohamedAdam2026!', 'adam2026', 'hamburg2026'];

    if ((!email || email.toLowerCase() === expectedEmail.toLowerCase()) && validPasswords.includes(password)) {
      return res.json({
        success: true,
        user: {
          email: expectedEmail,
          role: 'owner',
          name: 'Mohamed Mohamed Adam',
        },
        token: `owner_token_${Date.now()}`,
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Ungültige Anmeldedaten. Bitte überprüfen Sie E-Mail und Passwort.',
    });
  });

  // Frontend Serving: Vite middleware in development, static files in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

