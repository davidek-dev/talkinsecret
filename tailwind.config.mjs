/** @type {import('tailwindcss').Config} */



export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				bandfont: 'Binggo Wood', // Adds a new `font-display` class
			  }
		},
	},
	plugins: [require("@tailwindcss/typography"), require("daisyui")],
	
	daisyui: {
		themes: [
		  {
			myTheme: {
			  "primary": "#884d45",
			  "secondary": "#d5c8a4",
			  "accent": "#d94d4a",
			  "neutral": "#212c21",
			  "base-100": "#dae3da",
			},
		  },
		],
	  },
}
