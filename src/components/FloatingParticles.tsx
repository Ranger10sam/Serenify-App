import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';

interface FloatingParticlesProps {
  count?: number;
  color?: string;
}

export function FloatingParticles({ count = 8, color = 'rgba(255,255,255,0.1)' }: FloatingParticlesProps) {
  const particles = Array.from({ length: count }, (_, i) => i);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((particle) => (
        <MotiView
          key={particle}
          from={{
            opacity: 0,
            translateY: Math.random() * 800 + 100,
            translateX: Math.random() * 300 - 150,
            scale: 0,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            translateY: -100,
            translateX: Math.random() * 100 - 50,
            scale: [0, 1, 0],
            rotate: `${Math.random() * 360}deg`,
          }}
          transition={{
            type: 'timing',
            duration: 8000 + Math.random() * 4000,
            delay: Math.random() * 2000,
            repeatReverse: false,
            loop: true,
          }}
          style={[
            styles.particle,
            {
              backgroundColor: color,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
