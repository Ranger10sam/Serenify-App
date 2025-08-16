import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface AnimatedBackgroundProps {
  colors: [string, string, string];
  children: React.ReactNode;
}

export function AnimatedBackground({ colors, children }: AnimatedBackgroundProps) {
  return (
    <View style={styles.container}>
      {/* Main gradient background */}
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Animated gradient overlays for dynamic effect */}
      <MotiView
        from={{ opacity: 0.3, rotate: '0deg' }}
        animate={{ opacity: 0.6, rotate: '360deg' }}
        transition={{
          type: 'timing',
          duration: 20000,
          loop: true,
        }}
        style={[StyleSheet.absoluteFill, { transform: [{ scale: 1.5 }] }]}
      >
        <LinearGradient
          colors={[colors[0], 'transparent', colors[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </MotiView>

      {/* Floating orbs */}
      <MotiView
        from={{ translateX: -100, translateY: height * 0.3, scale: 0.8 }}
        animate={{ translateX: width + 100, translateY: height * 0.7, scale: 1.2 }}
        transition={{
          type: 'timing',
          duration: 15000,
          loop: true,
        }}
        style={styles.orb1}
      >
        <LinearGradient
          colors={[colors[0] + '40', colors[1] + '20']}
          style={styles.orbGradient}
        />
      </MotiView>

      <MotiView
        from={{ translateX: width + 100, translateY: height * 0.1, scale: 1 }}
        animate={{ translateX: -100, translateY: height * 0.5, scale: 0.6 }}
        transition={{
          type: 'timing',
          duration: 18000,
          loop: true,
        }}
        style={styles.orb2}
      >
        <LinearGradient
          colors={[colors[1] + '30', colors[0] + '10']}
          style={styles.orbGradient}
        />
      </MotiView>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orb1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  orb2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  orbGradient: {
    flex: 1,
    borderRadius: 100,
  },
});
