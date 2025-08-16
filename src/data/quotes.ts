export interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
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
