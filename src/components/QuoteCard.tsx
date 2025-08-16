import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

interface QuoteCardProps {
  quote: string;
  author: string;
  onPress?: () => void;
  style?: any;
}

export function QuoteCard({ quote, author, onPress, style }: QuoteCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95, translateY: 20 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ 
        type: 'spring', 
        damping: 18, 
        stiffness: 120,
        delay: 200
      }}
      style={[styles.container, style]}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <LinearGradient
          colors={['#2C2C2E', '#1C1C1E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Text style={styles.quote}>"{quote}"</Text>
            <Text style={styles.author}>— {author}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>💝</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>📤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    marginVertical: 12,
  },
  gradient: {
    padding: 24,
  },
  content: {
    alignItems: 'center',
  },
  quote: {
    fontSize: 20,
    lineHeight: 28,
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  author: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  actionIcon: {
    fontSize: 18,
  },
});
