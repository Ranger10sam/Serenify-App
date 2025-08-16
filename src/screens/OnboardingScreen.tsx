import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText } from 'moti';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onGetStarted: () => void;
}

export function OnboardingScreen({ onGetStarted }: OnboardingScreenProps) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#F5F5F5', '#E8E8E8']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Sky and Clouds */}
          <View style={styles.skyContainer}>
            <MotiView
              from={{ opacity: 0, translateX: -50 }}
              animate={{ opacity: 0.3, translateX: 50 }}
              transition={{ type: 'timing', duration: 8000, loop: true }}
              style={[styles.cloud, styles.cloud1]}
            />
            <MotiView
              from={{ opacity: 0, translateX: 100 }}
              animate={{ opacity: 0.4, translateX: -30 }}
              transition={{ type: 'timing', duration: 12000, loop: true }}
              style={[styles.cloud, styles.cloud2]}
            />
            <MotiView
              from={{ opacity: 0, translateX: -30 }}
              animate={{ opacity: 0.2, translateX: 80 }}
              transition={{ type: 'timing', duration: 10000, loop: true }}
              style={[styles.cloud, styles.cloud3]}
            />
          </View>

          {/* Main Illustration */}
          <MotiView
            from={{ opacity: 0, scale: 0.8, translateY: 50 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 150, delay: 500 }}
            style={styles.illustrationContainer}
          >
            {/* Mountain Base */}
            <View style={styles.mountainContainer}>
              {/* Mountain Shape */}
              <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 18, delay: 800 }}
                style={styles.mountain}
              />
              
              {/* Person on Mountain */}
              <MotiView
                from={{ opacity: 0, translateY: 20, scale: 0.5 }}
                animate={{ opacity: 1, translateY: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 15, delay: 1200 }}
                style={styles.personContainer}
              >
                {/* Person Body */}
                <View style={styles.person}>
                  <View style={styles.personHead} />
                  <View style={styles.personBody} />
                  <View style={styles.personLegs}>
                    <View style={styles.personLeg} />
                    <View style={styles.personLeg} />
                  </View>
                </View>
              </MotiView>

              {/* Birds */}
              <MotiView
                from={{ opacity: 0, translateX: -100, translateY: -30 }}
                animate={{ opacity: 0.6, translateX: 100, translateY: -50 }}
                transition={{ type: 'timing', duration: 6000, loop: true, delay: 1500 }}
                style={styles.bird1}
              >
                <Text style={styles.birdText}>V</Text>
              </MotiView>
              
              <MotiView
                from={{ opacity: 0, translateX: -150, translateY: -20 }}
                animate={{ opacity: 0.4, translateX: 120, translateY: -40 }}
                transition={{ type: 'timing', duration: 8000, loop: true, delay: 2000 }}
                style={styles.bird2}
              >
                <Text style={styles.birdTextSmall}>V</Text>
              </MotiView>
            </View>
          </MotiView>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <MotiText
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'spring', damping: 20, delay: 1800 }}
              style={styles.mainText}
            >
              SELF LOVE.
            </MotiText>
            
            <MotiText
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'spring', damping: 20, delay: 2000 }}
              style={[styles.mainText, styles.grayText]}
            >
              SELF CARE.
            </MotiText>
            
            <MotiText
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'spring', damping: 20, delay: 2200 }}
              style={[styles.mainText, styles.darkerGrayText]}
            >
              SELF GROWTH.
            </MotiText>

            {/* Get Started Button */}
            <MotiView
              from={{ opacity: 0, scale: 0.9, translateY: 20 }}
              animate={{ opacity: 1, scale: 1, translateY: 0 }}
              transition={{ type: 'spring', damping: 18, delay: 2500 }}
            >
              <TouchableOpacity
                onPress={onGetStarted}
                style={styles.getStartedButton}
              >
                <Text style={styles.buttonText}>
                  Get Started
                </Text>
              </TouchableOpacity>
            </MotiView>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  skyContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 128,
  },
  cloud: {
    position: 'absolute',
    backgroundColor: '#D1D5DB',
    borderRadius: 20,
  },
  cloud1: {
    top: 32,
    left: 16,
    width: 48,
    height: 24,
  },
  cloud2: {
    top: 48,
    right: 32,
    width: 64,
    height: 32,
    backgroundColor: '#E5E7EB',
  },
  cloud3: {
    top: 64,
    left: width / 3,
    width: 32,
    height: 16,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  mountainContainer: {
    position: 'relative',
  },
  mountain: {
    width: 128,
    height: 80,
    backgroundColor: '#4B5563',
    transform: [{ rotate: '45deg' }],
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  personContainer: {
    position: 'absolute',
    top: -48,
    left: '50%',
    marginLeft: -12,
  },
  person: {
    alignItems: 'center',
  },
  personHead: {
    width: 24,
    height: 24,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    marginBottom: 4,
  },
  personBody: {
    width: 16,
    height: 32,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    marginBottom: 4,
  },
  personLegs: {
    flexDirection: 'row',
    gap: 4,
  },
  personLeg: {
    width: 8,
    height: 24,
    backgroundColor: '#EF4444',
    borderRadius: 4,
  },
  bird1: {
    position: 'absolute',
    top: -64,
    left: -32,
  },
  bird2: {
    position: 'absolute',
    top: -80,
    right: -16,
  },
  birdText: {
    color: '#6B7280',
    fontSize: 18,
  },
  birdTextSmall: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  textContainer: {
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  mainText: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#000000',
  },
  grayText: {
    color: '#9CA3AF',
  },
  darkerGrayText: {
    color: '#4B5563',
    marginBottom: 48,
  },
  getStartedButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
  },
});
