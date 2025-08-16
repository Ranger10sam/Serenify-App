export type ThemeMode = 'light' | 'dark';

export type Palette = { 
  name: string; 
  colors: [string, string, string]; 
  preview: string;
  accent: string;
  glow: string;
};

export const palettes: Palette[] = [
  { 
    name: 'Aurora Dreams', 
    colors: ['#667eea', '#764ba2', '#f093fb'], 
    preview: '#667eea',
    accent: '#8A2BE2',
    glow: 'rgba(102, 126, 234, 0.4)'
  },
  { 
    name: 'Sunset Paradise', 
    colors: ['#ff9a9e', '#fecfef', '#fecfef'], 
    preview: '#ff9a9e',
    accent: '#FF6B9D',
    glow: 'rgba(255, 154, 158, 0.4)'
  },
  { 
    name: 'Ocean Depths', 
    colors: ['#667db6', '#0082c8', '#0082c8'], 
    preview: '#667db6',
    accent: '#00B4DB',
    glow: 'rgba(102, 125, 182, 0.4)'
  },
  { 
    name: 'Mystic Forest', 
    colors: ['#11998e', '#38ef7d', '#38ef7d'], 
    preview: '#11998e',
    accent: '#00FF87',
    glow: 'rgba(17, 153, 142, 0.4)'
  },
  { 
    name: 'Cosmic Purple', 
    colors: ['#667eea', '#764ba2', '#f093fb'], 
    preview: '#667eea',
    accent: '#C471ED',
    glow: 'rgba(196, 113, 237, 0.4)'
  },
  { 
    name: 'Golden Hour', 
    colors: ['#f093fb', '#f5576c', '#4facfe'], 
    preview: '#f093fb',
    accent: '#FFD700',
    glow: 'rgba(255, 215, 0, 0.4)'
  },
  { 
    name: 'Midnight Noir', 
    colors: ['#0c0c0c', '#1a1a2e', '#16213e'], 
    preview: '#0c0c0c',
    accent: '#FF6B9D',
    glow: 'rgba(255, 107, 157, 0.3)'
  },
];

export function createTheme(mode: ThemeMode) {
  const isDark = mode === 'dark';
  return {
    mode,
    background: isDark ? '#0a0a0a' : '#f8fafc',
    card: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.85)',
    cardDark: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.95)',
    text: isDark ? '#ffffff' : '#1a202c',
    textSecondary: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(26, 32, 44, 0.8)',
    muted: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(26, 32, 44, 0.5)',
    border: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
    shadow: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.1)',
    gradient: (isDark ? ['#0a0a0a', '#1a1a2e'] : ['#f8fafc', '#e2e8f0']) as [string, string],
    accent: '#667eea',
    success: '#38ef7d',
    warning: '#ffd700',
    error: '#ff6b9d',
  };
}
