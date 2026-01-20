import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			// Educational Dashboard Design System
  			'ds-purple': {
  				DEFAULT: '#8B7FE8',
  				light: '#A69FF5',
  				dark: '#6B5FD8'
  			},
  			'ds-blue': {
  				DEFAULT: '#5B9FE8',
  				light: '#7AB4F5',
  				dark: '#4A8FD8'
  			},
  			'ds-orange': {
  				DEFAULT: '#FFA366',
  				light: '#FFB088',
  				dark: '#FF9055'
  			},
  			'ds-coral': {
  				DEFAULT: '#FF9B7F',
  				light: '#FFB299',
  				dark: '#FF8B6B'
  			},
  			'ds-peach': {
  				DEFAULT: '#FFCBA4',
  				light: '#FFD9B8',
  				dark: '#FFBD90'
  			},
  			'ds-bg': {
  				DEFAULT: '#FFF5E9',
  				light: '#FFECD6',
  				dark: '#F5E5D3'
  			},
  			'ds-dark': {
  				DEFAULT: '#2B2B2B',
  				darker: '#1A1A1A',
  				light: '#3A3A3A'
  			},
  			'ds-gray': {
  				DEFAULT: '#F0F0F0',
  				light: '#E5E5E5',
  				dark: '#D0D0D0'
  			},
  			'ds-yellow': '#FFD93D'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			// Design System
  			'ds-sm': '8px',
  			'ds-md': '12px',
  			'ds-lg': '16px',
  			'ds-xl': '20px',
  			'ds-2xl': '24px',
  			'ds-pill': '999px'
  		},
  		boxShadow: {
  			'ds-card': '0 2px 8px rgba(0, 0, 0, 0.08)',
  			'ds-card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
  			'ds-floating': '0 8px 24px rgba(0, 0, 0, 0.15)',
  			'ds-subtle': '0 1px 3px rgba(0, 0, 0, 0.06)'
  		},
  		spacing: {
  			'ds-xs': '4px',
  			'ds-sm': '8px',
  			'ds-md': '12px',
  			'ds-lg': '16px',
  			'ds-xl': '24px',
  			'ds-2xl': '32px',
  			'ds-3xl': '48px'
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
};
export default config;
