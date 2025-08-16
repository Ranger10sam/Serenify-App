export interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
  isFavorite?: boolean;
}

export interface MoodEntry {
  id: string;
  mood: 'happy' | 'sad' | 'angry' | 'soft' | 'tired' | 'scared' | 'cheerful';
  emoji: string;
  date: string;
  notes?: string;
}

export interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
  pattern: string;
}

export interface MeditationTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  category: string;
  isPlaying?: boolean;
}

export interface Category {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  gradient: [string, string];
  icon: string;
  illustration: string;
}

export const categories: Category[] = [
  {
    id: 'happiness',
    name: 'Happiness',
    subtitle: 'Feel Pure Joy',
    color: '#4CAF50',
    gradient: ['#81C784', '#66BB6A'],
    icon: '😊',
    illustration: '🌈',
  },
  {
    id: 'success',
    name: 'Success',
    subtitle: 'Achieve your goals',
    color: '#2196F3',
    gradient: ['#64B5F6', '#42A5F5'],
    icon: '🏆',
    illustration: '🚀',
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    subtitle: 'Find Your Passion',
    color: '#FF9800',
    gradient: ['#FFB74D', '#FFA726'],
    icon: '🧘',
    illustration: '🧘‍♀️',
  },
  {
    id: 'love',
    name: 'Love',
    subtitle: 'Love Beyond Limits',
    color: '#E91E63',
    gradient: ['#F06292', '#EC407A'],
    icon: '💖',
    illustration: '💕',
  },
  {
    id: 'positivity',
    name: 'Positivity',
    subtitle: 'Focus on Good',
    color: '#00BCD4',
    gradient: ['#4DD0E1', '#26C6DA'],
    icon: '✨',
    illustration: '🌟',
  },
  {
    id: 'motivation',
    name: 'Motivation',
    subtitle: 'Drive Your Dreams',
    color: '#FF5722',
    gradient: ['#FF8A65', '#FF7043'],
    icon: '💪',
    illustration: '🔥',
  },
];

export const breathingExercises: BreathingExercise[] = [
  {
    id: '1',
    name: 'Relax',
    description: '4-4 Breath Tonic',
    duration: 300,
    inhaleTime: 4,
    holdTime: 0,
    exhaleTime: 4,
    pattern: 'Inhale 4 seconds\nExhale 4 seconds',
  },
  {
    id: '2',
    name: 'Focus',
    description: 'Box Breathing',
    duration: 600,
    inhaleTime: 4,
    holdTime: 4,
    exhaleTime: 4,
    pattern: 'Inhale 4 seconds\nHold 4 seconds\nExhale 4 seconds',
  },
  {
    id: '3',
    name: 'Energize',
    description: 'Power Breath',
    duration: 180,
    inhaleTime: 3,
    holdTime: 1,
    exhaleTime: 2,
    pattern: 'Quick energizing breath',
  },
];

export const meditationTracks: MeditationTrack[] = [
  {
    id: '1',
    title: 'Age of Gods',
    artist: 'Meditation Music',
    duration: '12:30',
    category: 'spiritual',
  },
  {
    id: '2',
    title: 'Ancient Humility',
    artist: 'Zen Sounds',
    duration: '8:45',
    category: 'wisdom',
  },
  {
    id: '3',
    title: 'Blissful Days',
    artist: 'Nature Sounds',
    duration: '15:20',
    category: 'happiness',
  },
  {
    id: '4',
    title: 'Relaxing Dance',
    artist: 'Ambient Music',
    duration: '10:15',
    category: 'relaxation',
  },
  {
    id: '5',
    title: 'World Peace',
    artist: 'Global Harmony',
    duration: '18:00',
    category: 'peace',
  },
  {
    id: '6',
    title: 'Yinghua',
    artist: 'Eastern Meditation',
    duration: '9:30',
    category: 'traditional',
  },
];

export const quotes: Quote[] = [
  {
    id: '1',
    text: 'Believe you can, and you\'re halfway there.',
    author: 'Theodore Roosevelt',
    category: 'success',
  },
  {
    id: '2',
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    category: 'success',
  },
  {
    id: '3',
    text: 'Happiness is not something ready made. It comes from your own actions.',
    author: 'Dalai Lama',
    category: 'happiness',
  },
  {
    id: '4',
    text: 'The present moment is the only time over which we have dominion.',
    author: 'Thich Nhat Hanh',
    category: 'mindfulness',
  },
  {
    id: '5',
    text: 'Where there is love there is life.',
    author: 'Mahatma Gandhi',
    category: 'love',
  },
  {
    id: '6',
    text: 'Keep your face always toward the sunshine—and shadows will fall behind you.',
    author: 'Walt Whitman',
    category: 'positivity',
  },
  {
    id: '7',
    text: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
    category: 'motivation',
  },
  {
    id: '8',
    text: 'Be yourself; everyone else is already taken.',
    author: 'Oscar Wilde',
    category: 'happiness',
  },
  {
    id: '9',
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
    category: 'success',
  },
  {
    id: '10',
    text: 'Peace comes from within. Do not seek it without.',
    author: 'Buddha',
    category: 'mindfulness',
  },
];

export const moodOptions = [
  { mood: 'happy' as const, emoji: '😊', label: 'Happy' },
  { mood: 'sad' as const, emoji: '😢', label: 'Sad' },
  { mood: 'angry' as const, emoji: '😠', label: 'Angry' },
  { mood: 'soft' as const, emoji: '😌', label: 'Soft' },
  { mood: 'tired' as const, emoji: '😴', label: 'Tired' },
  { mood: 'scared' as const, emoji: '😰', label: 'Scared' },
  { mood: 'cheerful' as const, emoji: '😄', label: 'Cheerful' },
];
