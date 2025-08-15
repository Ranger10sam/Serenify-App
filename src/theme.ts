export type ThemeMode = 'light' | 'dark';

export const palettes = [
	{ name: 'Serene Dawn', colors: ['#E6EEF9', '#F5E8F0'], preview: '#E6EEF9' },
	{ name: 'Misty Rose', colors: ['#FDECEF', '#EDE7F6'], preview: '#FDECEF' },
	{ name: 'Slate Breeze', colors: ['#EAF1F7', '#E8F5F1'], preview: '#EAF1F7' },
	{ name: 'Noir Fade', colors: ['#0b0b0c', '#17181a'], preview: '#0b0b0c' },
];

export function createTheme(mode: ThemeMode) {
	const isDark = mode === 'dark';
	return {
		mode,
		background: isDark ? '#0b0b0c' : '#f7f7f9',
		card: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
		text: isDark ? '#F7F7F8' : '#0E0F11',
		muted: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
		gradient: isDark ? ['#0b0b0c', '#14151a'] : ['#f8fbff', '#f7f7fa'],
	};
}
