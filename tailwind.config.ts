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
  			// Modern Educational Design System
  			'cream': {
  				50: '#FFF9F0',
  				100: '#FFF5E9',
  				200: '#FFECD6',
  				300: '#FFE3C3'
  			},
  			'soft-purple': {
  				100: '#E8E4FF',
  				200: '#D4CCFF',
  				300: '#B8ACFF',
  				400: '#9C8CFF',
  				500: '#8B7FE8'
  			},
  			'soft-orange': {
  				100: '#FFE8D9',
  				200: '#FFD4B8',
  				300: '#FFC09A',
  				400: '#FFAC7C',
  				500: '#FF9966'
  			},
  			'peach': {
  				100: '#FFE5D9',
  				200: '#FFD4C4',
  				300: '#FFC3AF',
  				400: '#FFB29A',
  				500: '#FFA185'
  			},
  			'navy': {
  				800: '#2C3E50',
  				900: '#1A252F'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			'xl': '16px',
  			'2xl': '20px',
  			'3xl': '24px',
  			'4xl': '28px'
  		},
  		boxShadow: {
  			'soft': '0 2px 12px rgba(0, 0, 0, 0.06)',
  			'soft-lg': '0 4px 20px rgba(0, 0, 0, 0.08)',
  			'soft-xl': '0 8px 30px rgba(0, 0, 0, 0.10)'
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
};
export default config;
