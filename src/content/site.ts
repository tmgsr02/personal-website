// src/content/site.ts

/* ======================================================
   Site metadata
====================================================== */

export const siteConfig = {
  name: 'Miguel Twahirwa',
  role: 'Data scientist, product builder, and perpetually curious person',
  location: 'Toronto',
  tagline: 'Ideas to systems to impact',
  email: 'hello@migueltwahirwa.com',

  hero: {
    headline: 'Understand before you optimize',
    subhead:
      'The interesting problems usually begin before the model. What are we actually trying to change, what evidence matters, and what assumptions are worth testing?',
    secondary:
      'I like working where analysis, product thinking, and making intersect. Simplify the system, test what matters, and build something useful.',
  },

  nowLine:
    'Building RealEstateValueIQ, productizing an on-time delivery early-warning system, and experimenting with AI-driven music workflows.',

  social: {
    linkedin: 'https://linkedin.com/in/migueltwahirwa',
    github: 'https://github.com/migueltwahirwa',
    arena: 'https://are.na/migueltwahirwa',
  },
} as const;

/* ======================================================
   Capabilities
====================================================== */

export interface Capability {
  index: string;
  title: string;
  description: string;
  icon: string;
}

export const capabilities: Capability[] = [
  {
    index: '01',
    title: 'Applied AI + ML',
    description: 'Models and intelligent systems built around real problems.',
    icon: '/engravings/cap-applied-ai.webp',
  },
  {
    index: '02',
    title: 'Product + Analytics',
    description: 'Experimentation, metrics, causal thinking, and decisions.',
    icon: '/engravings/cap-product-analytics.webp',
  },
  {
    index: '03',
    title: 'Data Systems',
    description: 'Reliable analytical foundations from messy, fragmented data.',
    icon: '/engravings/cap-data-systems.webp',
  },
  {
    index: '04',
    title: 'Building',
    description: 'From rough idea to product, prototype, and experience.',
    icon: '/engravings/cap-building.webp',
  },
];

/* ======================================================
   Projects
====================================================== */

export interface Project {
  slug: string;
  title: string;
  outcome: string;
  tags: string[];
  tracklist: {
    data?: string;
    model?: string;
    system?: string;
    impact?: string;
  };
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: 'on-time-delivery-early-warning',
    title: 'On-Time Delivery Early Warning System',
    outcome:
      'Detected KPI degradation before it surfaced in reports, enabling faster intervention.',
    tags: ['XGBoost', 'FastAPI', 'Power BI', 'Monitoring'],
    tracklist: {
      data: 'Shipment, lead-time, and fulfillment metrics across the network',
      model: 'Gradient-boosted early-warning classifier',
      system: 'FastAPI service and Power BI alerts',
      impact: 'Reduced surprise KPI drops and firefighting',
    },
    featured: true,
  },
  {
    slug: 'network-fill-rate-kpi-rebuild',
    title: 'Network Fill Rate / YTD KPI Rebuild',
    outcome:
      'Rebuilt KPI logic to correctly handle zero-activity and late-arriving data.',
    tags: ['DAX', 'Power BI', 'Dimensional Modeling'],
    tracklist: {
      data: 'Distribution center shipment history',
      model: 'Deterministic KPI logic with edge-case handling',
      system: 'Power BI semantic model',
      impact: 'Accurate reporting across all slices',
    },
    featured: true,
  },
  {
    slug: 'xls-to-csv-power-automate',
    title: 'XLS to CSV Conversion Pipeline',
    outcome:
      'Automated reliable file conversion under strict enterprise constraints.',
    tags: ['Power Automate', 'Parsing', 'Automation'],
    tracklist: {
      data: 'Inbound XLS attachments',
      system: 'Power Automate cloud flows',
      impact: 'Eliminated manual file handling',
    },
  },
  {
    slug: 'realestatevalueiq-platform',
    title: 'RealEstateValueIQ Platform',
    outcome: 'Built interactive real estate investment tools and data workflows.',
    tags: ['Next.js', 'Supabase', 'Analytics', 'Product'],
    tracklist: {
      data: 'Property, market, and financial datasets',
      system: 'Web app, calculators, and scoring logic',
      impact: 'Faster deal evaluation and decision-making',
    },
    featured: true,
  },
];

/* ======================================================
   Experience — powers /work and /work/[slug]
====================================================== */

export interface Experience {
  slug: string;
  org: string;
  disciplines: string[];
  period: string;
  summary: string;
  /** Slugs from `projects`. Asserted in site.test.ts. */
  projects: string[];
}

export const experience: Experience[] = [
  {
    slug: 'wesco',
    org: 'Wesco',
    disciplines: ['Supply Chain', 'Operations', 'Data Science'],
    period: '2022 — Present',
    summary:
      'Analytics and machine learning across a distribution network: early-warning systems for delivery performance, KPI foundations that hold up under messy data, and automation that removes manual handling.',
    projects: [
      'on-time-delivery-early-warning',
      'network-fill-rate-kpi-rebuild',
      'xls-to-csv-power-automate',
    ],
  },
  {
    slug: 'chime',
    org: 'Chime',
    disciplines: ['Product', 'Customer Analytics'],
    period: '2021 — 2022',
    summary:
      'Customer analytics and experimentation in consumer fintech — understanding behaviour well enough to know which changes were worth making.',
    projects: [],
  },
  {
    slug: 'deloitte',
    org: 'Deloitte',
    disciplines: ['Technology', 'Consulting'],
    period: '2019 — 2021',
    summary:
      'Technology consulting across client engagements: turning ambiguous business problems into systems that could actually be operated.',
    projects: [],
  },
  {
    slug: 'carnegie-mellon',
    org: 'Carnegie Mellon',
    disciplines: ['Information Systems', 'Analytics'],
    period: 'Graduate study',
    summary:
      'Information systems and analytics — the formal grounding underneath the practical work.',
    projects: [],
  },
  {
    slug: 'morehouse',
    org: 'Morehouse',
    disciplines: ['Chemistry', 'Mathematics'],
    period: 'Undergraduate study',
    summary:
      'Chemistry and mathematics. Where the habit of asking better questions before reaching for a method started.',
    projects: [],
  },
];

/* ======================================================
   Field notes — short entries, powers /notes
====================================================== */

export interface FieldNote {
  id: string;
  title: string;
  date: string;
  summary: string;
  href?: string;
}

export const fieldNotes: FieldNote[] = [
  {
    id: '001',
    title: 'Lineup',
    date: '2026-08-14',
    summary: 'Sequencing a set, and what it taught me about ordering a roadmap.',
  },
  {
    id: '002',
    title: 'Built North',
    date: '2026-07-02',
    summary: 'Notes on building from Toronto rather than despite it.',
  },
  {
    id: '003',
    title: 'Voice AI Toronto',
    date: '2026-05-19',
    summary: 'What the local voice-AI scene is actually shipping.',
  },
  {
    id: '004',
    title: 'ML Experiments',
    date: '2026-04-08',
    summary: 'Small models, honest baselines, and the results worth keeping.',
  },
  {
    id: '005',
    title: 'Interface Studies',
    date: '2026-02-21',
    summary: 'Interfaces I keep returning to, and why they hold up.',
  },
  {
    id: '006',
    title: 'Photography',
    date: '2026-01-30',
    summary: 'Composition, light, and timing — the same problem as good analysis.',
  },
];

/* ======================================================
   Now — powers /now
====================================================== */

export interface NowItem {
  label: string;
  value: string;
}

export const nowItems: NowItem[] = [
  {
    label: 'Building',
    value: 'RealEstateValueIQ — investment tooling and data workflows.',
  },
  {
    label: 'Shipping',
    value: 'Productizing the on-time delivery early-warning system.',
  },
  {
    label: 'Experimenting',
    value: 'AI-driven music workflows and transition tooling.',
  },
  {
    label: 'Reading',
    value: 'Systems thinking, causal inference, and interface history.',
  },
];

export type SiteConfig = typeof siteConfig;
