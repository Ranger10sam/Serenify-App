import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { createTheme } from '../src/theme';
import { getJSON } from '../src/lib/storage';
import { SwipeCard } from '../src/components/SwipeCard';
import { getRandomQuote, Quote } from '../src/lib/quotes';
import { saveWallpaper } from '../src/lib/storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface WallpaperCard {
  id: string;
  quote: Quote;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
}

const backgroundColors = [
  '#F8F9FA', '#FFF8E1', '#F3E5F5', '#E8F5E8', '#E3F2FD',
  '#FFF3E0', '#FCE4EC', '#F1F8E9', '#E0F2F1', '#E8EAF6',
  '#FAFAFA', '#FDF6E3', '#F5F5F5', '#FFFDE7', '#F9FBE7'
];

const textColors = [
  '#2C3E50', '#34495E', '#5D4E75', '#2E7D32', '#1565C0',
  '#E65100', '#AD1457', '#388E3C', '#00695C', '#3F51B5',
  '#424242', '#6A4C93', '#37474F', '#558B2F', '#2E7D32'
];

const fontSizes = [18, 20, 22, 24, 26];
const fontFamilies = ['Montserrat_400Regular', 'Montserrat_500Medium', 'Montserrat_600SemiBold'];

const generateRandomWallpaper = (): WallpaperCard => {
  const quote = getRandomQuote();
  const backgroundColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
  const textColor = textColors[Math.floor(Math.random() * textColors.length)];
  const fontSize = fontSizes[Math.floor(Math.random() * fontSizes.length)];
  const fontFamily = fontFamilies[Math.floor(Math.random() * fontFamilies.length)];

  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    quote,
    backgroundColor,
    textColor,
    fontSize,
    fontFamily,
  };
};

export default function HomeScreen() {
  const [theme, setTheme] = useState(createTheme('light'));
  const [cards, setCards] = useState<WallpaperCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);


  // Load theme on focus
  useFocusEffect(
    useCallback(() => {
      const loadTheme = async () => {
        const savedTheme = await getJSON('themeMode');
        setTheme(createTheme(savedTheme || 'light'));
      };
      loadTheme();
    }, [])
  );

  // Initialize cards
  useEffect(() => {
    const initialCards = Array.from({ length: 5 }, () => generateRandomWallpaper());
    setCards(initialCards);
  }, []);

  const handleSwipeLeft = useCallback(() => {
    // Just discard - generate new card
    setCurrentCardIndex(prev => prev + 1);
    
    // Add new card to the end
    setCards(prev => [...prev, generateRandomWallpaper()]);
  }, []);

  const handleSwipeRight = useCallback(async () => {
    // Save wallpaper and generate new card
    const currentCard = cards[currentCardIndex];
    if (currentCard) {
      try {
        await saveWallpaper({
          quote: currentCard.quote.text,
          author: currentCard.quote.author,
          backgroundColor: currentCard.backgroundColor,
          textColor: currentCard.textColor,
          fontSize: currentCard.fontSize,
          fontFamily: currentCard.fontFamily,
          textPosition: { x: 0.5, y: 0.5 }, // Center position
          aspectRatio: '9:16', // Mobile default
        });
        
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.error('Error saving wallpaper:', error);
      }
    }
    
    setCurrentCardIndex(prev => prev + 1);
    
    // Add new card to the end
    setCards(prev => [...prev, generateRandomWallpaper()]);
  }, [cards, currentCardIndex]);

  const visibleCards = cards.slice(currentCardIndex, currentCardIndex + 3);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1 }}>
        {/* Header with subtle entrance animation */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: 'timing',
            duration: 800,
            delay: 200,
          }}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 16,
            alignItems: 'center',
          }}
        >

          <Text style={{
            fontSize: 16,
            fontFamily: 'Montserrat_400Regular',
            color: theme.colors.textMuted,
            textAlign: 'center',
            marginTop: 4,
          }}>
            Swipe right to save, left to pass
          </Text>
        </MotiView>

        {/* Cards Container with staggered entrance */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: 'spring',
            damping: 20,
            stiffness: 100,
            delay: 400,
          }}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingBottom: 20,
          }}
        >
          {visibleCards.map((card, index) => (
            <SwipeCard
              key={card.id}
              quote={card.quote}
              backgroundColor={card.backgroundColor}
              textColor={card.textColor}
              fontSize={card.fontSize}
              fontFamily={card.fontFamily}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              isTopCard={index === 0}
              cardIndex={index}
            />
          ))}
        </MotiView>


      </View>
    </SafeAreaView>
  );
}
