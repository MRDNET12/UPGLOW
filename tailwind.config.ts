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
  			// Educational Playful Theme Colors
  			'edu-purple': {
  				light: '#A69FF5',
  				DEFAULT: '#8B7FE8',
  				dark: '#6B5FD8'
  			},
  			'edu-blue': {
  				light: '#7AB4F5',
  				DEFAULT: '#5B9FE8',
  				dark: '#4A8FD8'
  			},
  			'edu-orange': {
  				light: '#FFB088',
  				DEFAULT: '#FFA366',
  				dark: '#FF9055'
  			},
  			'edu-coral': {
  				light: '#FFB299',
  				DEFAULT: '#FF9B7F',
  				dark: '#FF8B6B'
  			},
  			'edu-peach': {
  				light: '#FFD9B8',
  				DEFAULT: '#FFCBA4',
  				dark: '#FFBD90'
  			},
  			'edu-bg': {
  				lightest: '#FFF5E9',
  				light: '#FFECD6',
  				DEFAULT: '#F5E5D3'
  			},
  			'edu-dark': {
  				DEFAULT: '#2B2B2B',
  				darker: '#1A1A1A',
  				light: '#3A3A3A'
  			},
  			'edu-yellow': '#FFD93D'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			'card': '16px',
  			'button': '12px',
  			'nav': '24px'
  		},
  		boxShadow: {
  			'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
  			'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
  			'floating': '0 8px 24px rgba(0, 0, 0, 0.15)'
  		},
  		spacing: {
  			'card': '16px',
  			'section': '20px'
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
};
export default config;
