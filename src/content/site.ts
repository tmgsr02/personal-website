// src/content/site.ts

/* ======================================================
   Site Metadata
====================================================== */

export const siteConfig = {
  name: "Miguel Twahirwa",
  tagline: "Data Scientist • Supply Chain • Builder",
  email: "hello@migueltwahirwa.com",

  hero: {
    headline: "I build data products that ship.",
    subhead:
      "I design analytics and ML systems that help teams act faster — from root causes to forecasts to next-best actions — grounded in supply chain experience and strong engineering.",
    nowLine:
      "Building RealEstateValueIQ, productizing an on-time delivery early-warning system, and experimenting with AI-driven music workflows.",
    ctas: [
      { label: "View work", href: "/work", variant: "primary" as const },
      { label: "Contact", href: "/contact", variant: "secondary" as const },
    ],
  },

  social: {
    linkedin: "https://linkedin.com/in/migueltwahirwa",
    github: "https://github.com/migueltwahirwa",
    twitter: "https://twitter.com/migueltwahirwa",
  },

  proofStrip:
    "6+ yrs • Data Science + Supply Chain • SQL/Python • Power BI • ML Systems • Product-minded Builder",
} as const;

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
  description?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "on-time-delivery-early-warning",
    title: "On-Time Delivery Early Warning System",
    outcome:
      "Detected KPI degradation before it surfaced in reports, enabling faster intervention.",
    tags: ["XGBoost", "FastAPI", "Power BI", "Monitoring"],
    tracklist: {
      data: "Shipment, lead-time, and fulfillment metrics across the network",
      model: "Gradient-boosted early-warning classifier",
      system: "FastAPI service + Power BI alerts",
      impact: "Reduced surprise KPI drops and firefighting",
    },
    featured: true,
  },
  {
    slug: "network-fill-rate-kpi-rebuild",
    title: "Network Fill Rate / YTD KPI Rebuild",
    outcome:
      "Rebuilt KPI logic to correctly handle zero-activity and late-arriving data.",
    tags: ["DAX", "Power BI", "Dim Modeling"],
    tracklist: {
      data: "Distribution center shipment history",
      model: "Deterministic KPI logic with edge-case handling",
      system: "Power BI semantic model",
      impact: "Accurate reporting across all slices",
    },
    featured: true,
  },
  {
    slug: "xls-to-csv-power-automate",
    title: "XLS → CSV Conversion Pipeline",
    outcome:
      "Automated reliable file conversion under strict enterprise constraints.",
    tags: ["Power Automate", "Parsing", "Automation"],
    tracklist: {
      data: "Inbound XLS attachments",
      system: "Power Automate cloud flows",
      impact: "Eliminated manual file handling",
    },
    featured: true,
  },
  {
    slug: "realestatevalueiq-platform",
    title: "RealEstateValueIQ Platform",
    outcome:
      "Built interactive real estate investment tools and data workflows.",
    tags: ["Next.js", "Supabase", "Analytics", "Product"],
    tracklist: {
      data: "Property, market, and financial datasets",
      system: "Web app + calculators + scoring logic",
      impact: "Faster deal evaluation and decision-making",
    },
    featured: true,
  },
];

/* ======================================================
   Interests (Used in AboutPanel)
====================================================== */

export interface Interest {
  title: string;
  description: string;
  icon?: string;
}

export const interests: Interest[] = [
  {
    title: "Basketball",
    description:
      "Pickup games, team leadership, and thinking about what makes a good rep.",
    icon: "🏀",
  },
  {
    title: "DJ / Music",
    description:
      "Curating sets, discovering sounds, and experimenting with AI-driven transitions.",
    icon: "🎧",
  },
  {
    title: "Photography",
    description:
      "Street and portrait photography — composition, light, and timing.",
    icon: "📸",
  },
  {
    title: "Startups",
    description:
      "Building tools that turn messy problems into usable systems.",
    icon: "🚀",
  },
];

/* ======================================================
   Types
====================================================== */

export type SiteConfig = typeof siteConfig;
