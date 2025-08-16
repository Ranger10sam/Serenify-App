import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';

interface GlassMorphismCardProps {
  children: ReactNode;
  style?: any;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  animated?: boolean;
  glowColor?: string;
}

export function GlassMorphismCard({
  children,
  style,
  intensity = 60,
  tint = 'default',
  animated = true,
  glowColor = 'rgba(255,255,255,0.2)',
}: GlassMorphismCardProps) {
  const CardWrapper = animated ? MotiView : View;
  const animatedProps = animated
    ? {
        from: { opacity: 0, scale: 0.95, translateY: 20 },
        animate: { opacity: 1, scale: 1, translateY: 0 },
        transition: { type: 'spring' as const, damping: 15, stiffness: 120, delay: 100 },
      }
    : {};

  return (
    <CardWrapper {...animatedProps} style={[styles.container, style]}>
      <View style={[styles.glow, { shadowColor: glowColor }]} />
      <BlurView intensity={intensity} tint={tint} style={styles.blurContainer}>
        <View style={styles.innerContainer}>{children}</View>
      </BlurView>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  glow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 34,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
  },
  blurContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  innerContainer: {
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});
