import { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';

interface GlassCardProps {
  children: ReactNode;
  theme: any;
  style?: ViewStyle;
  intensity?: number;
  variant?: 'soft' | 'medium' | 'strong';
  animated?: boolean;
}

export function GlassCard({ 
  children, 
  theme, 
  style, 
  intensity = 30,
  variant = 'soft',
  animated = true 
}: GlassCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'medium':
        return {
          backgroundColor: theme.colors.glassBg,
          borderWidth: 1,
          borderColor: theme.colors.glassStroke,
        };
      case 'strong':
        return {
          backgroundColor: theme.colors.accent + '40',
          borderWidth: 1.5,
          borderColor: theme.colors.glassStroke,
        };
      default:
        return {
          backgroundColor: theme.colors.glassBg,
          borderWidth: 0.5,
          borderColor: theme.colors.glassStroke,
        };
    }
  };

  const CardContent = (
    <View style={[styles.container, getVariantStyles(), style]}>
      <BlurView 
        intensity={intensity} 
        tint="light"
        style={styles.blur}
      >
        <LinearGradient
          colors={[
            theme.colors.glassBg,
            theme.colors.glassBg + '80',
            theme.colors.glassBg + '60',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            {children}
          </View>
        </LinearGradient>
      </BlurView>
    </View>
  );

  if (animated) {
    return (
      <MotiView
        from={{ opacity: 0, scale: 0.95, translateY: 10 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{
          type: 'timing',
          duration: 600,
          delay: 100,
        }}
      >
        {CardContent}
      </MotiView>
    );
  }

  return CardContent;
}

// Abstract floating shapes for background decoration
export function AbstractShape({ theme, variant = 'circle' }: { theme: any; variant?: 'circle' | 'square' | 'blob' }) {
  const getShapeStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      backgroundColor: theme.colors.accent + '20',
      borderWidth: 0.5,
      borderColor: theme.colors.glassStroke,
    };

    switch (variant) {
      case 'square':
        return {
          ...baseStyle,
          width: 60,
          height: 60,
          borderRadius: theme.borderRadius.md,
          transform: [{ rotate: '15deg' }],
        };
      case 'blob':
        return {
          ...baseStyle,
          width: 80,
          height: 60,
          borderRadius: theme.borderRadius.xl,
          transform: [{ rotate: '-10deg' }],
        };
      default:
        return {
          ...baseStyle,
          width: 50,
          height: 50,
          borderRadius: theme.borderRadius.full,
        };
    }
  };

  return (
    <MotiView
      style={getShapeStyle()}
      from={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 0.3, scale: 1 }}
      transition={{
        type: 'timing',
        duration: 1200,
        delay: Math.random() * 1000,
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#5A3A36',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  blur: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
});
