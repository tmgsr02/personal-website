import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-mono)'],
        display: ['var(--font-display)'],
      },
      colors: {
        paper: 'var(--paper)',
        'paper-2': 'var(--paper-2)',
        newsprint: 'var(--newsprint)',
        'aged-paper': 'var(--aged-paper)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        muted: 'var(--muted)',
        'newspaper-ink': 'var(--newspaper-ink)',
        'pop-orange': 'var(--pop-orange)',
        'pop-mustard': 'var(--pop-mustard)',
        'pop-blue': 'var(--pop-blue)',
        leather: 'var(--leather)',
        'leather-dark': 'var(--leather-dark)',
        'leather-light': 'var(--leather-light)',
        'leather-2': 'var(--leather-2)',
        stitch: 'var(--stitch)',
        'stitch-shadow': 'var(--stitch-shadow)',
        'signal-red': 'var(--signal-red)',
      },
      borderColor: {
        DEFAULT: 'var(--border)',
        strong: 'var(--border-strong)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
      },
      borderRadius: {
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        pill: 'var(--r-pill)',
      },
      maxWidth: {
        container: 'var(--container)',
      },
    },
  },
  plugins: [],
};

export default config;
