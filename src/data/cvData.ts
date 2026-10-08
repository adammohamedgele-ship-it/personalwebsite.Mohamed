import { CertificationItem, ExperienceItem, PersonalInfo, PortfolioData, Project, SkillCategory } from '../types';

export const personalInfo: PersonalInfo = {
  fullName: 'Mohamed Mohamed Adam',
  shortName: 'Mohamed Adam',
  headline: {
    de: 'Fachinformatiker für Systemintegration',
    en: 'IT Specialist for System Integration',
  },
  bioShort: {
    de: 'Interessiert an Systemintegration, Netzwerken, PC-Hardware und praktischem IT-Support. Praktische Erfahrung durch ein 3-monatiges IT-Praktikum beim AWO Landesverband Hamburg und den Besuch der Beruflichen Schule City Nord (BS28).',
    en: 'Interested in system integration, networking, PC hardware, and practical IT support. Practical experience gained through a 3-month IT internship at AWO Landesverband Hamburg and vocational school BS28.',
  },
  location: 'August-Kirch-Strasse 17 A, 22525 Hamburg, Deutschland',
  city: 'Hamburg, Germany',
  phone: '+49 176 24925979',
  phoneInternational: '+49 176 24925979',
  email: 'adammohamedgele@gmail.com',
  birthDate: '03.06.2005',
  birthPlace: 'Mogadischu, Somalia',
  nationality: {
    de: 'Somalisch',
    en: 'Somali',
  },
  maritalStatus: {
    de: 'Ledig',
    en: 'Single',
  },
  residenceSince: {
    de: 'Seit März 2024 in Deutschland (Familiennachzug)',
    en: 'In Germany since March 2024 (Family Reunification)',
  },
  driverLicense: {
    de: 'Führerschein Klasse B (PKW)',
    en: 'Driver\'s License Class B',
  },
  availability: {
    de: 'Suche Ausbildungsplatz zum Fachinformatiker für Systemintegration',
    en: 'Seeking IT Apprenticeship (Fachinformatiker für Systemintegration)',
  },
  hobbies: {
    de: ['Fußball spielen', 'Schwimmen', 'Hardware & PC-Bau'],
    en: ['Playing Football', 'Swimming', 'PC Hardware & Assembly'],
  },
  languages: [
    {
      name: { de: 'Somalisch', en: 'Somali' },
      level: { de: 'Muttersprache', en: 'Native' },
      proficiency: 100,
    },
    {
      name: { de: 'Deutsch', en: 'German' },
      level: { de: 'B1 (DTZ-Zertifikat)', en: 'B1 (DTZ Certified)' },
      proficiency: 75,
    },
    {
      name: { de: 'Englisch', en: 'English' },
      level: { de: 'Grundkenntnisse', en: 'Basic Technical English' },
      proficiency: 50,
    },
  ],
};

export const certifications: CertificationItem[] = [
  {
    id: 'cert-awo',
    title: {
      de: 'Praktikum im Bereich Fachinformatik (3 Monate)',
      en: 'IT Specialist Internship (3 Months)',
    },
    issuer: 'AWO Landesverband Hamburg',
    categoryBadge: 'Praktikum',
    accentColor: '#10B981',
    description: {
      de: 'Dreimonatiges Praktikum: Arbeitsplatz-Rollout, Peripherie-Setup, Windows 10/11 und Anwendersupport.',
      en: '3-month internship: Workstation setup, peripheral configuration, Windows 10/11, and user assistance.',
    },
    issuedDate: '20.08.2026 – 20.11.2026',
  },
  {
    id: 'cert-dtz-b1',
    title: {
      de: 'Deutsch-Test für Zuwanderer (DTZ B1)',
      en: 'German Language Exam (DTZ B1)',
    },
    issuer: 'BAMF Hamburg',
    categoryBadge: 'Sprachzertifikat',
    accentColor: '#06B6D4',
    description: {
      de: 'Erfolgreich nachgewiesene Deutschkenntnisse auf Niveau B1.',
      en: 'Officially certified German language proficiency at CEFR B1 level.',
    },
    issuedDate: '16.09.2025',
  },
  {
    id: 'cert-lid',
    title: {
      de: 'Test „Leben in Deutschland“',
      en: 'Test „Leben in Deutschland“',
    },
    issuer: 'BAMF Hamburg',
    categoryBadge: 'Zertifikat',
    accentColor: '#8B5CF6',
    description: {
      de: 'Bestandener Test über Rechtsordnung, Kultur und Gesellschaft in Deutschland.',
      en: 'Passed examination on German legal and social framework.',
    },
    issuedDate: '16.09.2025',
  },
  {
    id: 'cert-comp-course',
    title: {
      de: 'Computerkurs (IT-Grundlagen, 6 Monate)',
      en: 'Computer Course (IT Fundamentals, 6 Months)',
    },
    issuer: 'Mogadischu',
    categoryBadge: 'Kurs',
    accentColor: '#F59E0B',
    description: {
      de: 'Sechsmonatiger Kurs über PC-Komponenten, Rechneraufbau und Betriebssysteme.',
      en: '6-month course covering PC components, assembly, and operating systems.',
    },
    issuedDate: '2018',
  },
  {
    id: 'cert-license-b',
    title: {
      de: 'Führerschein Klasse B (PKW)',
      en: 'Driver\'s License Class B',
    },
    issuer: 'Hamburg',
    categoryBadge: 'Fahrerlaubnis',
    accentColor: '#EC4899',
    description: {
      de: 'Gültige Fahrerlaubnis der Klasse B für Pkw.',
      en: 'Valid class B passenger car driving license.',
    },
    issuedDate: 'Gültig',
  },
  {
    id: 'cert-esa',
    title: {
      de: 'Schulabschluss Somalia (Anerkannt als ESA)',
      en: 'School Certificate (Recognized as ESA)',
    },
    issuer: 'Schulbehörde Hamburg',
    categoryBadge: 'Schulabschluss',
    accentColor: '#6366F1',
    description: {
      de: 'Amtliche Gleichwertigkeitsbescheinigung: anerkannt als Erster allgemeinbildender Schulabschluss.',
      en: 'Official certificate of equivalence to German ESA secondary school qualification.',
    },
    issuedDate: '2024',
  },
];

export const experiences: ExperienceItem[] = [
  {
    id: 'bs28-school',
    period: '09.03.2025 – 05/2027',
    role: {
      de: 'Berufliche Schule City Nord (BS28), Hamburg',
      en: 'Berufliche Schule City Nord (BS28), Hamburg',
    },
    organization: 'Berufliche Schule City Nord',
    location: 'Hamburg',
    type: 'education',
    description: {
      de: 'Schulischer Bildungsgang mit Ziel: Mittlerer Schulabschluss (MSA).',
      en: 'School program with objective: Intermediate School Certificate (Mittlerer Schulabschluss / MSA).',
    },
    highlights: {
      de: [
        'Vorbereitung auf die Ausbildung zum Fachinformatiker für Systemintegration',
        'Grundlagen in Informationstechnik, Mathematik und Deutsch',
      ],
      en: [
        'Preparation for IT apprenticeship (Fachinformatiker für Systemintegration)',
        'Foundations in information technology, mathematics, and German',
      ],
    },
  },
  {
    id: 'awo-internship',
    period: '20.08.2026 – 20.11.2026',
    role: {
      de: 'Praktikum im Bereich Fachinformatik (3 Monate)',
      en: 'IT Specialist Internship (3 Months)',
    },
    organization: 'AWO Landesverband Hamburg',
    location: 'Hamburg',
    type: 'work',
    description: {
      de: 'Praktischer Einsatz in der internen IT: Einrichtung von Arbeitsplätzen, Hardware-Wartung und Anwendersupport.',
      en: 'Practical IT internship: Workstation setups, hardware maintenance, and user support.',
    },
    highlights: {
      de: [
        'Einrichtung, Verkabelung und Wartung von PC-Arbeitsplätzen und Monitoren',
        'Hardware-Fehlerdiagnose und Austausch defekter Komponenten unter Windows',
        'Unterstützung von Anwendern bei Problemen und Druckerkonfiguration',
      ],
      en: [
        'Setup, cabling, and maintenance of client workstations and monitors',
        'Hardware troubleshooting and component replacement in Windows environments',
        'Assisting staff with IT support requests and printer configuration',
      ],
    },
  },
  {
    id: 'grundschule-kielkamp',
    period: '01.10.2025 – 01.03.2026',
    role: {
      de: 'Schulbegleiter',
      en: 'School Assistant',
    },
    organization: 'Grundschule Kielkamp',
    location: 'Hamburg',
    type: 'work',
    description: {
      de: 'Unterstützung von Schülerinnen und Schülern im Schulalltag und Zusammenarbeit im pädagogischen Team.',
      en: 'Assisting students in daily school activities and collaborating with teachers.',
    },
    highlights: {
      de: [
        'Zuverlässige Begleitung von Schülern im Unterricht und bei Aufgaben',
        'Gute Zusammenarbeit im Team und strukturierte Arbeitsweise',
      ],
      en: [
        'Reliable classroom support for students during daily lessons',
        'Constructive team collaboration and structured work habits',
      ],
    },
  },
  {
    id: 'integration-course',
    period: '16.10.2024 – 16.09.2025',
    role: {
      de: 'Integrationskurs & Deutsch-Test für Zuwanderer (DTZ)',
      en: 'Integration Course & German Language Exam (DTZ)',
    },
    organization: 'BAMF anerkannter Träger',
    location: 'Hamburg',
    type: 'course',
    description: {
      de: 'Erfolgreich absolvierter Sprachkurs mit Zertifikat B1 und bestandener Test „Leben in Deutschland“.',
      en: 'Successfully completed German language course with CEFR B1 certificate and Test "Leben in Deutschland".',
    },
    highlights: {
      de: [
        'Deutsch-Zertifikat B1 (DTZ)',
        'Test „Leben in Deutschland“ erfolgreich bestanden',
      ],
      en: [
        'German Certificate B1 (DTZ)',
        'Successfully passed civic orientation exam „Leben in Deutschland“',
      ],
    },
  },
  {
    id: 'computer-course',
    period: '2018 (6 Monate)',
    role: {
      de: 'Computerkurs (IT-Grundlagen)',
      en: 'Computer Course (IT Fundamentals, 6 Months)',
    },
    organization: 'Bildungseinrichtung',
    location: 'Mogadischu, Somalia',
    type: 'course',
    description: {
      de: 'Sechsmonatiger Kurs über PC-Hardware, Aufbau von Rechnern und grundlegende Bedienung.',
      en: 'Six-month foundational course on PC hardware, computer components, and basic operations.',
    },
    highlights: {
      de: [
        'Aufbau von Computern: Mainboard, CPU, RAM, Festplatten und Schnittstellen',
        'Grundlagen der Software- und Betriebssysteminstallation',
      ],
      en: [
        'Computer architecture: Motherboard, CPU, RAM, storage, and interfaces',
        'Basics of software and operating system setup',
      ],
    },
  },
  {
    id: 'hauptschule-somalia',
    period: '01.10.2012 – 25.08.2021',
    role: {
      de: 'Schulabschluss Somalia (Anerkannt als ESA)',
      en: 'General School Education (Recognized as ESA)',
    },
    organization: 'Schulbildung Somalia',
    location: 'Somalia',
    type: 'education',
    description: {
      de: 'Allgemeiner Schulabschluss, von der Hamburger Schulbehörde als Erster allgemeinbildender Schulabschluss (ESA) anerkannt.',
      en: 'General school education, officially accredited by the Hamburg school board as equivalent to German ESA.',
    },
    highlights: {
      de: [
        'Amtliche Gleichwertigkeitsbescheinigung der Freien und Hansestadt Hamburg liegt vor',
      ],
      en: [
        'Official certificate of equivalence from Free and Hanseatic City of Hamburg issued',
      ],
    },
  },
];

export const skillCategories: SkillCategory[] = [
  {
    title: {
      de: 'Netzwerk & Konnektivität',
      en: 'Networking',
    },
    skills: [
      { name: 'TCP/IP', level: 'Grundlagen', context: { de: 'Protokoll-Grundlagen, Adressierung', en: 'Protocol basics, addressing' } },
      { name: 'IPv4 & Subnetze', level: 'Grundlagen', context: { de: 'Netzwerk- und Host-Adressen', en: 'Network and host addressing' } },
      { name: 'DHCP & DNS', level: 'Praktisch', context: { de: 'IP-Vergabe und Namensauflösung', en: 'IP leasing and name resolution' } },
      { name: 'FRITZ!Box & Router', level: 'Praktisch', context: { de: 'Router-Einrichtung, WLAN, Portfreigaben', en: 'Router setup, Wi-Fi, port forwarding' } },
      { name: 'LAN-Verkabelung', level: 'Praktisch', context: { de: 'Cat-Kabel, RJ45, Durchgangsprüfung', en: 'Cat cabling, RJ45, continuity check' } },
      { name: 'WLAN & Mesh', level: 'Praktisch', context: { de: 'Heimnetzwerk- und Funknetz-Einrichtung', en: 'Wireless setup and mesh configuration' } },
    ],
  },
  {
    title: {
      de: 'Betriebssysteme',
      en: 'Operating Systems',
    },
    skills: [
      { name: 'Windows 10 / 11 Pro', level: 'Sicher', context: { de: 'Installation, Benutzerkonten, Treiber, Updates', en: 'Installation, user accounts, drivers, updates' } },
      { name: 'Ubuntu Linux', level: 'Grundlagen', context: { de: 'Installation, grundlegende Bedienung', en: 'Installation, basic usage' } },
      { name: 'Terminal / Bash', level: 'Grundlagen', context: { de: 'Navigation, Dateiverwaltung, Befehle', en: 'Navigation, file management, CLI' } },
      { name: 'BIOS / UEFI', level: 'Praktisch', context: { de: 'Boot-Reihenfolge, Grundeinstellungen', en: 'Boot order, fundamental settings' } },
    ],
  },
  {
    title: {
      de: 'Hardware & Montage',
      en: 'Hardware & Assembly',
    },
    skills: [
      { name: 'PC-Montage', level: 'Praktisch', context: { de: 'Zusammenbau von Rechnern (CPU, RAM, Mainboard)', en: 'PC assembly (CPU, RAM, motherboard)' } },
      { name: 'Komponententausch', level: 'Praktisch', context: { de: 'Austausch von Netzteilen, RAM, SSD/HDD', en: 'Replacing power supplies, RAM, SSD/HDD' } },
      { name: 'Hardware-Fehlersuche', level: 'Praktisch', context: { de: 'Ausschlussverfahren bei Startproblemen', en: 'Systematic troubleshooting of boot errors' } },
      { name: 'VirtualBox', level: 'Grundlagen', context: { de: 'Erstellen von virtuellen Testmaschinen', en: 'Creating virtual test machines' } },
    ],
  },
  {
    title: {
      de: 'IT-Support & Service',
      en: 'IT Support & Operations',
    },
    skills: [
      { name: '1st-Level-Support', level: 'Praktisch (AWO)', context: { de: 'Anwenderbetreuung vor Ort und per Telefon', en: 'User support on-site and phone' } },
      { name: 'Arbeitsplatz-Rollout', level: 'Praktisch (AWO)', context: { de: 'Aufbau von PCs, Monitoren und Zubehör', en: 'Setting up PCs, monitors, and peripherals' } },
      { name: 'Druckereinrichtung', level: 'Praktisch', context: { de: 'Netzwerk- und USB-Drucker anbinden', en: 'Connecting network and USB printers' } },
      { name: 'Remote Desktop', level: 'Praktisch', context: { de: 'Fernwartung mit TeamViewer und Windows-Hilfe', en: 'Remote support with TeamViewer / Quick Assist' } },
      { name: 'Kabelmanagement', level: 'Sorgfältig', context: { de: 'Ordentliche Arbeitsplatzverkabelung', en: 'Clean and tidy cable routing' } },
    ],
  },
  {
    title: {
      de: 'Sprachen',
      en: 'Languages',
    },
    skills: [
      { name: 'Somalisch', level: 'Muttersprache', context: { de: 'Fließend in Wort und Schrift', en: 'Native speaker' } },
      { name: 'Deutsch', level: 'B1 (DTZ)', context: { de: 'Zertifiziert DTZ B1, sichere Verständigung', en: 'Certified CEFR B1' } },
      { name: 'Englisch', level: 'Grundkenntnisse', context: { de: 'Grundlegendes technisches Englisch', en: 'Elementary technical English' } },
    ],
  },
  {
    title: {
      de: 'Qualifikationen & Mobilität',
      en: 'Credentials & Mobility',
    },
    skills: [
      { name: 'Führerschein Klasse B', level: 'Gültig', context: { de: 'Pkw-Fahrerlaubnis vorhanden', en: 'Passenger car driving license' } },
      { name: 'Test Leben in Deutschland', level: 'Bestanden', context: { de: 'BAMF-Zertifikat vorhanden', en: 'Passed BAMF integration exam' } },
      { name: 'Schulabschluss (ESA)', level: 'Anerkannt', context: { de: 'Anerkannt durch Schulbehörde Hamburg', en: 'Officially recognized equivalence' } },
    ],
  },
];

export const projects: Project[] = [
  {
    id: 'proj-awo-helpdesk',
    group: 'capstone',
    badge: 'AWO IT-Praktikum',
    kicker: 'IT-SUPPORT & ROLLOUT',
    bannerType: 'helpdesk',
    category: 'support',
    featured: true,
    period: '2026 (3 Monate)',
    title: {
      de: 'Arbeitsplatz-Rollout & IT-Support (AWO Hamburg)',
      en: 'Workstation Rollout & IT Support (AWO Hamburg)',
    },
    subtitle: {
      de: 'Praktikumsprojekt: Einrichtung von Arbeitsplätzen und Anwendersupport',
      en: 'Internship project: Workstation deployment and user support',
    },
    summary: {
      de: 'Während meines dreimonatigen Praktikums beim AWO Landesverband Hamburg unterstützte ich bei der Einrichtung und Verkabelung von PC-Arbeitsplätzen, dem Austausch von Hardwarekomponenten und der Behebung alltäglicher IT-Probleme.',
      en: 'During my 3-month internship at AWO Landesverband Hamburg, I assisted in setting up and wiring PC workstations, replacing hardware components, and resolving daily IT issues for staff.',
    },
    challenge: {
      de: 'Arbeitsplätze mussten zuverlässig verkabelt, mit passenden Treibern und Programmen ausgestattet und Drucker angebunden werden.',
      en: 'Workstations needed reliable cabling, appropriate driver installations, software setup, and printer connections.',
    },
    solution: {
      de: 'Strukturierte Inbetriebnahme nach Checkliste: Hardware anschließen, Windows-Funktionstest, Netzwerkverbindung prüfen und Benutzeranfragen zeitnah bearbeiten.',
      en: 'Systematic workstation commissioning using checklists: connecting hardware, verifying Windows functions, checking network connectivity, and answering support requests.',
    },
    keyOutcomes: {
      de: [
        'Eigenständiger Aufbau und Verkabelung von Arbeitsplätzen mit Monitoren und Peripherie',
        'Installation und Test von Druckern und Druckertreibern',
        'Freundliche und direkte Unterstützung von Mitarbeitern vor Ort',
      ],
      en: [
        'Independent setup and wiring of client workstations, monitors, and peripherals',
        'Installation and testing of network and local printers',
        'Friendly and prompt on-site support for staff members',
      ],
    },
    technologies: ['Windows 10/11', 'PC-Hardware', 'Drucker & Scanner', 'Kabelmanagement', '1st-Level-Support'],
  },
  {
    id: 'proj-pc-hardware-assembly',
    group: 'capstone',
    badge: 'Hardware & Montage',
    kicker: 'HARDWARE & DIAGNOSE',
    bannerType: 'hardware',
    category: 'systems',
    featured: true,
    period: '2025 – 2026',
    title: {
      de: 'PC-Montage & Hardware-Fehlersuche',
      en: 'Custom PC Assembly & Hardware Diagnostics',
    },
    subtitle: {
      de: 'Praktischer Zusammenbau von Computern und Komponententest',
      en: 'Hands-on computer assembly and component testing',
    },
    summary: {
      de: 'Eigenständiger Zusammenbau von Desktop-Computern aus Einzelkomponenten (Mainboard, Prozessor, Arbeitsspeicher, Netzteil, SSD) inklusive Funktionsprüfung im BIOS/UEFI und sauberer Kabelverlegung.',
      en: 'Independent assembly of desktop computers from individual parts (motherboard, CPU, RAM, power supply, SSD) including BIOS/UEFI configuration and clean cable routing.',
    },
    challenge: {
      de: 'Richtige Komponentenauswahl, vorsichtiger Einbau ohne Beschädigung empfindlicher Pins und Lokalisierung von Startproblemen.',
      en: 'Proper component compatibility, careful installation without pin damage, and diagnosing boot issues.',
    },
    solution: {
      de: 'Schrittweiser Aufbau nach Sicherheitsstandards, sorgfältige Wärmeleitpasten-Auftragung, Prüfung der Stromanschlüsse und Testen der Komponenten.',
      en: 'Step-by-step assembly following electrostatic safety, thermal paste application, power connector inspection, and individual component checks.',
    },
    keyOutcomes: {
      de: [
        'Erfolgreicher Zusammenbau und Inbetriebnahme von PCs',
        'Komponententausch (RAM, SSDs, Grafikkarten, Netzteile)',
        'Installation von Betriebssystemen und Treibern',
      ],
      en: [
        'Successful assembly and commissioning of PCs',
        'Component upgrades and replacements (RAM, SSDs, power supplies)',
        'Installation of operating systems and drivers',
      ],
    },
    technologies: ['PC-Montage', 'BIOS / UEFI', 'Komponententausch', 'Hardware-Diagnose', 'SSD / RAM'],
  },
  {
    id: 'proj-home-network',
    group: 'capstone',
    badge: 'Netzwerktechnik',
    kicker: 'NETZWERK & INFRASTRUKTUR',
    bannerType: 'network',
    category: 'network',
    featured: false,
    period: '2025 – 2026',
    title: {
      de: 'Heimnetzwerk & Router-Konfiguration',
      en: 'Home Network & Router Configuration',
    },
    subtitle: {
      de: 'Aufbau eines stabilen Heimnetzwerks mit WLAN, LAN und DHCP',
      en: 'Setup of a home network with Wi-Fi, Ethernet, and DHCP',
    },
    summary: {
      de: 'Konfiguration eines lokalen Heimnetzwerks mit FRITZ!Box: Einrichtung von festen IP-Adressen für Netzwerkgeräte, strukturierte Vergabe über DHCP, Einrichtung von sicherem WLAN und Verlegung von Netzwerkkabeln.',
      en: 'Configuration of a local home network using a FRITZ!Box router: assigning static IP addresses, configuring DHCP pools, securing Wi-Fi, and running Ethernet cabling.',
    },
    challenge: {
      de: 'Stabile Verbindung für mehrere Geräte im Haushalt, Vermeidung von IP-Adresskonflikten und sichere WLAN-Verschlüsselung.',
      en: 'Maintaining stable connectivity across multiple household devices, avoiding IP conflicts, and securing wireless access.',
    },
    solution: {
      de: 'Konfiguration des Routers, feste IP-Zuweisung nach MAC-Adresse für zentrale Geräte, WPA3/WPA2-Verschlüsselung und Cat-6-Verkabelung.',
      en: 'Configured router settings, bound key devices to static DHCP leases by MAC address, enabled strong WPA encryption, and verified Ethernet continuity.',
    },
    keyOutcomes: {
      de: [
        'Konfiguration von DHCP-Bereichen und Portfreigaben',
        'Stabile Netzwerkverbindung über LAN und WLAN',
        'Konfektionieren und Testen von Netzwerkkabeln (RJ45)',
      ],
      en: [
        'Configured DHCP scopes and basic router port management',
        'Stable connections across both Ethernet and wireless nodes',
        'Crimping and testing RJ45 Ethernet patch cables',
      ],
    },
    technologies: ['FRITZ!Box', 'IPv4', 'DHCP', 'DNS', 'Cat 6 LAN', 'WLAN'],
  },
  {
    id: 'proj-os-lab',
    group: 'capstone',
    badge: 'Betriebssysteme',
    kicker: 'BETRIEBSSYSTEME & LABS',
    bannerType: 'code',
    category: 'systems',
    featured: false,
    period: '2025 – 2026',
    title: {
      de: 'Betriebssystem-Praxis mit Linux & Windows',
      en: 'Operating Systems Practice: Linux & Windows',
    },
    subtitle: {
      de: 'Installation und grundlegende Bedienung von Testsystemen',
      en: 'Installation and fundamental administration of test systems',
    },
    summary: {
      de: 'Einrichtung von virtuellen Maschinen mit VirtualBox zum Kennenlernen von Ubuntu Linux und Windows Pro: Benutzerverwaltung, Dateirechte und erste Schritte im Terminal.',
      en: 'Configured virtual machines using VirtualBox to explore Ubuntu Linux and Windows Pro: user accounts, file permissions, and basic command line navigation.',
    },
    challenge: {
      de: 'Sichere Testumgebung ohne Risiko für das Hauptbetriebssystem.',
      en: 'Creating a safe sandbox test environment without risking the host system.',
    },
    solution: {
      de: 'Nutzung von Oracle VirtualBox zur schnellen Bereitstellung von Test-VMs, Testen von Neuinstallationen und Ausprobieren von Terminal-Befehlen.',
      en: 'Used Oracle VirtualBox to spin up test virtual machines, test clean operating system installs, and practice CLI commands.',
    },
    keyOutcomes: {
      de: [
        'Erstellen und Verwalten von virtuellen Maschinen mit VirtualBox',
        'Grundlegende Linux-Terminal-Befehle (Dateiverwaltung, Navigation)',
        'Verständnis von Benutzerrechten und Berechtigungen',
      ],
      en: [
        'Creating and managing virtual machines in VirtualBox',
        'Fundamental Linux terminal commands for files and directories',
        'Understanding basic user accounts and access permissions',
      ],
    },
    technologies: ['Ubuntu Linux', 'Windows 10/11 Pro', 'VirtualBox', 'Terminal (Bash)', 'Dateirechte'],
  },
];

export const initialPortfolioData: PortfolioData = {
  personalInfo,
  certifications,
  experiences,
  skillCategories,
  projects,
  adminSettings: {
    contactRecipientEmail: 'adammohamedgele@gmail.com',
    ownerEmail: 'adammohamedgele@gmail.com',
    ownerName: 'Mohamed Mohamed Adam',
    customDomainNotice: 'mohamed-adam.dev',
  },
  contactMessages: [],
};

