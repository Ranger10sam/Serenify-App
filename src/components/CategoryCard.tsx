import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Category } from '../data/quotes';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
  index: number;
}

export function CategoryCard({ category, onPress, index }: CategoryCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.8, translateY: 50 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ 
        type: 'spring', 
        damping: 15, 
        stiffness: 150, 
        delay: index * 100 
      }}
      style={styles.container}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <LinearGradient
          colors={category.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Text style={styles.illustration}>{category.illustration}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
            </View>
            <View style={styles.arrow}>
              <Text style={styles.arrowIcon}>↗</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 16,
  },
  gradient: {
    padding: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  illustration: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 2,
  },
  categorySubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Inter_400Regular',
  },
  arrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
