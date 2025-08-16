import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';

interface GlassCardProps {
  children: ReactNode;
  style?: any;
  animated?: boolean;
}

export function GlassCard({ children, style, animated = true }: GlassCardProps) {
  const CardWrapper = animated ? MotiView : View;
  const animationProps = animated
    ? {
        from: { opacity: 0, scale: 0.9, translateY: 30 },
        animate: { opacity: 1, scale: 1, translateY: 0 },
        transition: { type: 'spring' as const, damping: 18, stiffness: 150 },
      }
    : {};

  return (
    <CardWrapper {...animationProps} style={[styles.container, style]}>
      <View style={styles.shadowLayer} />
      <BlurView intensity={80} tint="default" style={styles.blurView}>
        <View style={styles.glassEffect}>
          <View style={styles.contentContainer}>{children}</View>
        </View>
      </BlurView>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  shadowLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
    backgroundColor: 'transparent',
  },
  blurView: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  glassEffect: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 28,
  },
  contentContainer: {
    padding: 32,
  },
});
