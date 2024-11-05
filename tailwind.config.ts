import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			gridTemplateColumns: {
				'auto-fill-300': 'repeat(auto-fill, minmax(300px, 1fr))'
			}
		}
	},

	plugins: []
} satisfies Config;
