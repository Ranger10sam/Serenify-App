import { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { router, usePathname } from 'expo-router';
import Svg, { 
  Defs, 
  Filter, 
  FeTurbulence, 
  FeDisplacementMap, 
  FeGaussianBlur,
  FeMorphology,
  FeOffset,
  FeFlood,
  FeComposite,
  Rect,
  Line
} from 'react-native-svg';

interface Props {
  theme: any;
}

const TABS = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'studio', label: 'Studio', path: '/studio' },
  { id: 'settings', label: 'Settings', path: '/settings' },
];

export default function LiquidGlassBottomNav({ theme }: Props) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const activeId = useMemo(() => {
    if (pathname.startsWith('/studio')) return 'studio';
    if (pathname.startsWith('/settings')) return 'settings';
    return 'home';
  }, [pathname]);

  const handlePress = (path: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(path as any);
  };

  return (
    <View 
      style={{ 
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        paddingHorizontal: 16,
        paddingBottom: Math.max(insets.bottom, 12),
        alignItems: 'center',
        backgroundColor: 'transparent',
      }}
    >
      {/* Floating Glass Container with Edge Refraction */}
      <View
        style={{
          borderRadius: 28,
          overflow: 'hidden',
          backgroundColor: 'transparent',
        }}
      >
        {/* Edge Refraction Layer */}
        <View style={{ position: 'absolute', inset: 0, borderRadius: 28 }}>
          <Svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <Defs>
              {/* Edge Refraction Filter */}
              <Filter id="edgeRefraction" x="-20%" y="-20%" width="140%" height="140%">
                <FeTurbulence
                  baseFrequency="0.02 0.03"
                  numOctaves="3"
                  seed="2"
                  stitchTiles="stitch"
                />
                <FeDisplacementMap in="SourceGraphic" scale="3" />
                <FeGaussianBlur stdDeviation="0.8" />
                <FeMorphology operator="dilate" radius="0.5" />
              </Filter>

              {/* Rim Light Filter */}
              <Filter id="rimLight" x="-50%" y="-50%" width="200%" height="200%">
                <FeGaussianBlur stdDeviation="4" result="blur" />
                <FeOffset dx="0" dy="1" result="offset" />
                <FeFlood floodColor="rgba(255,255,255,0.6)" floodOpacity="0.4" />
                <FeComposite in="offset" operator="in" />
              </Filter>
            </Defs>

            {/* Edge Refraction Effects */}
            <Rect
              width="100%"
              height="100%"
              fill="rgba(255,255,255,0.03)"
              filter="url(#edgeRefraction)"
              rx="28"
            />
            <Rect
              width="100%"
              height="100%"
              fill="rgba(255,255,255,0.02)"
              filter="url(#rimLight)"
              rx="28"
            />
          </Svg>
        </View>

        {/* Reduced Blur Layer for Less Frosting */}
        <BlurView 
          intensity={35}
          tint="default"
          style={{
            paddingHorizontal: 24,
            paddingVertical: 16,
            minWidth: 280,
            backgroundColor: 'transparent',
          }}
        >
          {/* Subtle Glass Enhancement */}
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.08)',
              'rgba(255, 255, 255, 0.02)',
              'rgba(255, 255, 255, 0.06)',
            ]}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 28,
            }}
          />

          {/* Refined Glass Border */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 28,
              borderWidth: 0.8,
              borderColor: theme.mode === 'light' 
                ? 'rgba(255, 255, 255, 0.4)' 
                : 'rgba(255, 255, 255, 0.25)',
            }}
          />

          {/* Navigation Content */}
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: 28,
            position: 'relative',
          }}>
            {TABS.map((tab) => {
              const isActive = activeId === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  activeOpacity={0.7}
                  onPress={() => handlePress(tab.path)}
                  style={{
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    position: 'relative',
                    flex: 1,
                  }}
                >
                  <MotiView
                    animate={{ 
                      opacity: isActive ? 1 : 0.85, 
                      scale: isActive ? 1.02 : 1,
                      translateY: isActive ? -1 : 0,
                    }}
                    transition={{ 
                      type: 'spring', 
                      damping: 18, 
                      stiffness: 280,
                      mass: 0.8,
                    }}
                    style={{ alignItems: 'center' }}
                  >
                    <Text 
                      style={{ 
                        fontSize: 12,
                        fontWeight: isActive ? '700' : '500',
                        letterSpacing: 1.4,
                        textTransform: 'uppercase',
                        color: isActive 
                          ? (theme.mode === 'light' ? '#000000' : '#FFFFFF') 
                          : (theme.mode === 'light' ? '#666666' : '#999999'),
                      }}
                    >
                      {tab.label}
                    </Text>
                  </MotiView>
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </View>
    </View>
  );
} 