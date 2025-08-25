export type ThemeMode = 'light' | 'dark';

export function createTheme(mode: ThemeMode) {
	const isDark = mode === 'dark';

	const typography = {
		primary: 'Montserrat_400Regular',
		heading: 'Montserrat_600SemiBold',
		accent: 'Montserrat_500Medium',
		elegant: 'Montserrat_400Regular',
	};

	const base = {
		typography,
		spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64 },
		borderRadius: { sm: 8, md: 16, lg: 24, xl: 32, full: 9999 },
	};

	const light = {
		mode: 'light' as const,
		colors: {
			background: '#FFFFFF',
			surface: '#F7F8F9',
			accent: '#EAECEF',
			text: '#111111',
			textMuted: '#6B7280',
			glassBg: 'rgba(255,255,255,0.4)',
			glassStroke: 'rgba(17,17,17,0.08)',
			light: '#FFFFFF',
			surfaceLight: '#F2F3F5',
			textLight: '#9CA3AF',
		},
		...base,
		shadows: {
			soft: { shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
			medium: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } },
		},
	};

	const dark = {
		mode: 'dark' as const,
		colors: {
			background: '#0F1115',
			surface: '#141821',
			accent: '#1F2430',
			text: '#F5F6F8',
			textMuted: '#9AA1AE',
			glassBg: 'rgba(31,36,48,0.35)',
			glassStroke: 'rgba(245,246,248,0.08)',
			light: '#0F1115',
			surfaceLight: '#1A1F2A',
			textLight: '#B8BFCC',
		},
		...base,
		shadows: {
			soft: { shadowColor: '#000', shadowOpacity: 0.32, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } },
			medium: { shadowColor: '#000', shadowOpacity: 0.45, shadowRadius: 28, shadowOffset: { width: 0, height: 14 } },
		},
	};

	return isDark ? dark : light;
}
