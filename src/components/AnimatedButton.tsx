import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  gradient?: [string, string];
  style?: any;
  textStyle?: any;
  disabled?: boolean;
  haptic?: boolean;
}

export function AnimatedButton({
  title,
  onPress,
  gradient = ['#667eea', '#764ba2'],
  style,
  textStyle,
  disabled = false,
  haptic = true,
}: AnimatedButtonProps) {
  const handlePress = () => {
    if (disabled) return;
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <MotiView
      from={{ scale: 1 }}
      animate={{ scale: disabled ? 0.95 : 1 }}
      transition={{ type: 'timing', duration: 200 }}
    >
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        style={[styles.container, style]}
      >
        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 150 }}
        >
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradient, { opacity: disabled ? 0.5 : 1 }]}
          >
            <Text style={[styles.text, textStyle]}>{title}</Text>
          </LinearGradient>
        </MotiView>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
});
