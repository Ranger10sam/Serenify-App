import React, { useRef, useState } from 'react';
import { View, Text, Dimensions, PanResponder, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { Quote } from '../lib/quotes';
import { createTheme } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.75;

interface SwipeCardProps {
  quote: Quote;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isTopCard: boolean;
  cardIndex: number;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  quote,
  backgroundColor,
  textColor,
  fontSize,
  fontFamily,
  onSwipeLeft,
  onSwipeRight,
  isTopCard,
  cardIndex,
}) => {
  const theme = createTheme('light');
  const pan = useRef(new Animated.ValueXY()).current;
  const [isPressed, setIsPressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 8 || Math.abs(gestureState.dy) > 8;
      },
      onPanResponderGrant: () => {
        setIsPressed(true);
        setIsDragging(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
      },
      onPanResponderMove: (_, gestureState) => {
        // Provide haptic feedback at threshold points
        if (Math.abs(gestureState.dx) > SWIPE_THRESHOLD * 0.7 && !isDragging) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setIsDragging(false);
        }
        
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(_, gestureState);
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsPressed(false);
        setIsDragging(false);
        pan.flattenOffset();

        const swipeVelocity = Math.abs(gestureState.vx);
        const swipeDistance = Math.abs(gestureState.dx);
        
        // Enhanced swipe detection with velocity consideration
        if (gestureState.dx > SWIPE_THRESHOLD || (swipeVelocity > 0.5 && gestureState.dx > 50)) {
          // Swipe right - like/save
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Animated.timing(pan, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy * 0.3 },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            onSwipeRight();
            pan.setValue({ x: 0, y: 0 });
          });
        } else if (gestureState.dx < -SWIPE_THRESHOLD || (swipeVelocity > 0.5 && gestureState.dx < -50)) {
          // Swipe left - discard
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          Animated.timing(pan, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy * 0.3 },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            onSwipeLeft();
            pan.setValue({ x: 0, y: 0 });
          });
        } else {
          // Snap back with spring animation
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            tension: 100,
            friction: 8,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Enhanced rotation with smoother curve
  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-15deg', '0deg', '15deg'],
    extrapolate: 'clamp',
  });

  // Smooth opacity transition
  const opacity = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [0.3, 1, 0.3],
    extrapolate: 'clamp',
  });

  // Enhanced indicator animations
  const likeOpacity = pan.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD * 0.3, SWIPE_THRESHOLD],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const likeScale = pan.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD * 0.5, SWIPE_THRESHOLD],
    outputRange: [0.8, 1, 1.2],
    extrapolate: 'clamp',
  });

  const nopeOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 0.3, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const nopeScale = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 0.5, 0],
    outputRange: [1.2, 1, 0.8],
    extrapolate: 'clamp',
  });

  // Card stacking with subtle depth
  const cardScale = isTopCard ? (isPressed ? 0.96 : 1) : 0.94 - cardIndex * 0.02;
  const cardOpacity = isTopCard ? 1 : 0.85 - cardIndex * 0.15;
  const cardTranslateY = isTopCard ? 0 : cardIndex * 8;

  return (
    <MotiView
      style={{
        position: 'absolute',
        width: SCREEN_WIDTH - 40,
        height: CARD_HEIGHT,
        alignSelf: 'center',
        zIndex: isTopCard ? 1000 : 1000 - cardIndex,
      }}
      animate={{
        scale: cardScale,
        opacity: cardOpacity,
        translateY: cardTranslateY,
      }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 200,
        mass: 0.8,
      }}
    >
      <Animated.View
        style={{
          flex: 1,
          transform: [
            { translateX: isTopCard ? pan.x : 0 },
            { translateY: isTopCard ? pan.y : 0 },
            { rotate: isTopCard ? rotate : '0deg' },
          ],
          opacity: isTopCard ? opacity : cardOpacity,
        }}
        {...(isTopCard ? panResponder.panHandlers : {})}
      >
        <MotiView
          animate={{
            shadowOpacity: isPressed ? 0.25 : 0.15,
            shadowRadius: isPressed ? 30 : 20,
          }}
          transition={{
            type: 'timing',
            duration: 200,
          }}
          style={{
            flex: 1,
            backgroundColor,
            borderRadius: 24,
            padding: 32,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: 8 },
            elevation: 8,
          }}
        >
          {/* Quote Text with subtle animation */}
          <MotiView
            animate={{
              scale: isPressed ? 0.98 : 1,
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 400,
            }}
            style={{
              paddingHorizontal: 16,
              maxWidth: '100%',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize,
                fontFamily,
                color: textColor,
                textAlign: 'center',
                lineHeight: fontSize * 1.4,
                marginBottom: 24,
                maxWidth: '100%',
              }}
              numberOfLines={8}
              adjustsFontSizeToFit
            >
              "{quote.text}"
            </Text>

            {/* Author */}
            {quote.author && (
              <Text
                style={{
                  fontSize: fontSize * 0.7,
                  fontFamily: 'Montserrat_400Regular',
                  color: textColor,
                  opacity: 0.8,
                  textAlign: 'center',
                  maxWidth: '100%',
                }}
                numberOfLines={2}
              >
                — {quote.author}
              </Text>
            )}
          </MotiView>

          {/* Enhanced Swipe Indicators */}
          {isTopCard && (
            <>
              {/* Like Indicator */}
              <Animated.View
                style={{
                  position: 'absolute',
                  top: 40,
                  right: 40,
                  opacity: likeOpacity,
                  transform: [
                    { rotate: '12deg' },
                    { scale: likeScale }
                  ],
                }}
              >
                <BlurView
                  intensity={30}
                  tint="light"
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 25,
                    borderWidth: 3,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: 'Montserrat_600SemiBold',
                      color: '#4CAF50',
                      letterSpacing: 1,
                    }}
                  >
                    SAVE
                  </Text>
                </BlurView>
              </Animated.View>

              {/* Nope Indicator */}
              <Animated.View
                style={{
                  position: 'absolute',
                  top: 40,
                  left: 40,
                  opacity: nopeOpacity,
                  transform: [
                    { rotate: '-12deg' },
                    { scale: nopeScale }
                  ],
                }}
              >
                <BlurView
                  intensity={30}
                  tint="light"
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 25,
                    borderWidth: 3,
                    borderColor: '#F44336',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: 'Montserrat_600SemiBold',
                      color: '#F44336',
                      letterSpacing: 1,
                    }}
                  >
                    PASS
                  </Text>
                </BlurView>
              </Animated.View>
            </>
          )}
        </MotiView>
      </Animated.View>
    </MotiView>
  );
}; 