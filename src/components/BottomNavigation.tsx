import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const tabs = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'categories', icon: '📚', label: 'Categories' },
  { id: 'favorites', icon: '💝', label: 'Favorites' },
  { id: 'profile', icon: '👤', label: 'Profile' },
];

export function BottomNavigation({ activeTab, onTabPress }: BottomNavigationProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 150, delay: 800 }}
      style={styles.container}
    >
      <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabPress(tab.id)}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <MotiView
                animate={{
                  scale: activeTab === tab.id ? 1.1 : 1,
                  backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                }}
                transition={{ type: 'spring', damping: 15 }}
                style={[
                  styles.tabContent,
                  activeTab === tab.id && styles.activeTab
                ]}
              >
                <Text style={[
                  styles.tabIcon,
                  activeTab === tab.id && styles.activeTabIcon
                ]}>
                  {tab.icon}
                </Text>
                {activeTab === tab.id && (
                  <MotiView
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                  >
                    <Text style={styles.tabLabel}>{tab.label}</Text>
                  </MotiView>
                )}
              </MotiView>
            </TouchableOpacity>
          ))}
        </View>
      </BlurView>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 34,
    paddingHorizontal: 16,
  },
  blurContainer: {
    borderRadius: 25,
    overflow: 'hidden',
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  activeTab: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabIcon: {
    fontSize: 20,
  },
  activeTabIcon: {
    fontSize: 22,
  },
  tabLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
});
