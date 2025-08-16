import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { SafeAreaView } from 'react-native-safe-area-context';
import { categories, quotes } from '../data/quotes';
import { CategoryCard } from '../components/CategoryCard';
import { QuoteCard } from '../components/QuoteCard';

interface HomeScreenProps {
  onCategoryPress: (categoryId: string) => void;
}

export function HomeScreen({ onCategoryPress }: HomeScreenProps) {
  const todayQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const userName = "Self"; // You can make this dynamic later

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFF8E1', '#FFECB3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 20, delay: 100 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Good Morning, {userName}</Text>
              <Text style={styles.subtitle}>Stay inspired today!</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>🧘</Text>
            </View>
          </View>
        </MotiView>

        {/* Hero Illustration */}
        <MotiView
          from={{ opacity: 0, scale: 0.8, translateY: 30 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 18, delay: 300 }}
          style={styles.heroContainer}
        >
          <LinearGradient
            colors={['#FFE082', '#FFCC02']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroIllustration}>
                <Text style={styles.heroIcon}>🏔️</Text>
                <Text style={styles.heroCharacter}>🧗‍♀️</Text>
              </View>
              <Text style={styles.heroText}>Find your inner peace and{'\n'}strength today</Text>
              <TouchableOpacity style={styles.heroButton}>
                <Text style={styles.heroButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </MotiView>

        {/* Today's Quote */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 18, delay: 400 }}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Quote</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <QuoteCard
            quote={todayQuote.text}
            author={todayQuote.author}
          />
        </MotiView>

        {/* Categories */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 18, delay: 500 }}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoriesGrid}>
            {categories.slice(0, 4).map((category, index) => (
              <View key={category.id} style={styles.categoryWrapper}>
                <CategoryCard
                  category={category}
                  onPress={() => onCategoryPress(category.id)}
                  index={index}
                />
              </View>
            ))}
          </View>
        </MotiView>

        {/* More to Inspire You */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 18, delay: 600 }}
          style={[styles.section, { paddingBottom: 120 }]}
        >
          <Text style={styles.sectionTitle}>More to Inspire You</Text>
          <View style={styles.moreSection}>
            {quotes.slice(1, 4).map((quote, index) => (
              <QuoteCard
                key={quote.id}
                quote={quote.text}
                author={quote.author}
                style={styles.smallQuoteCard}
              />
            ))}
          </View>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C2C2E',
    fontFamily: 'Inter_600SemiBold',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  heroContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    minHeight: 200,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroIllustration: {
    position: 'relative',
    marginBottom: 16,
  },
  heroIcon: {
    fontSize: 60,
  },
  heroCharacter: {
    fontSize: 40,
    position: 'absolute',
    top: 10,
    right: -10,
  },
  heroText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2E',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 24,
  },
  heroButton: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 20,
  },
  heroButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C2C2E',
    fontFamily: 'Inter_600SemiBold',
  },
  seeAll: {
    fontSize: 16,
    color: '#007AFF',
    fontFamily: 'Inter_400Regular',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryWrapper: {
    width: '48%',
  },
  moreSection: {
    gap: 16,
  },
  smallQuoteCard: {
    marginVertical: 0,
  },
});
