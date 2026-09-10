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
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        paper: 'var(--paper)',
        'paper-2': 'var(--paper-2)',
        'ink-blue': 'var(--ink-blue)',
        'ink-blue-2': 'var(--ink-blue-2)',
        rule: 'var(--rule)',
        'rule-soft': 'var(--rule-soft)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
      },
      borderColor: {
        DEFAULT: 'var(--rule)',
        soft: 'var(--rule-soft)',
      },
      borderRadius: {
        sm: 'var(--r-sm)',
      },
      maxWidth: {
        container: 'var(--container)',
      },
      letterSpacing: {
        display: 'var(--tracking-display)',
        label: 'var(--tracking-label)',
      },
      transitionTimingFunction: {
        enter: 'cubic-bezier(0.22, 1, 0.36, 1)',
        exit: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        micro: 'var(--dur-micro)',
        entrance: 'var(--dur-entrance)',
      },
    },
  },
  plugins: [],
};

export default config;
