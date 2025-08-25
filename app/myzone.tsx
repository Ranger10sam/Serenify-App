import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { createTheme } from '../src/theme';
import { getJSON, getSavedWallpapers, deleteWallpaper, SavedWallpaper } from '../src/lib/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_WIDTH = (SCREEN_WIDTH - 50) / 2; // 2 columns with less padding
const COLUMN_GAP = 10; // Gap between columns
const CARD_GAP = 10; // Gap between cards vertically

interface WallpaperGridItemProps {
  wallpaper: SavedWallpaper;
  theme: any;
  width: number;
  height: number;
  onEdit: (wallpaper: SavedWallpaper) => void;
  onDelete: (id: string) => void;
}

const WallpaperGridItem: React.FC<WallpaperGridItemProps> = ({ wallpaper, theme, width, height, onEdit, onDelete }) => {
  


  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Wallpaper Options',
      'What would you like to do with this wallpaper?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Edit', onPress: () => onEdit(wallpaper) },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Delete Wallpaper',
              'Are you sure you want to delete this wallpaper?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => onDelete(wallpaper.id) }
              ]
            );
          }
        },
      ]
    );
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 15, stiffness: 150 }}
    >
      <TouchableOpacity
        onPress={() => onEdit(wallpaper)}
        onLongPress={handleLongPress}
        activeOpacity={0.8}
        style={{
          width: width,
          height: height,
          marginBottom: CARD_GAP,
          borderRadius: 12,
          backgroundColor: wallpaper.backgroundColor,
          padding: 10, // Consistent padding for all cards
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: theme.colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
          overflow: 'hidden', // Prevent any content from overflowing
        }}
      >
        {/* Quote Preview with Position */}
        <View style={{
          position: 'absolute',
          left: wallpaper.textPosition ? `${wallpaper.textPosition.x * 100}%` : '50%',
          top: wallpaper.textPosition ? `${wallpaper.textPosition.y * 100}%` : '50%',
          transform: [
            { translateX: -(width * (wallpaper.textWidth || 0.8)) / 2 },
            { translateY: -Math.min(height * 0.08, 30) } // Adaptive offset with max limit
          ],
          width: width * (wallpaper.textWidth || 0.8),
          maxHeight: height * 0.9, // Use most of the available space
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <Text
            style={{
              fontSize: Math.min(wallpaper.fontSize * 0.4, Math.max(9, height / 18)),
              fontFamily: wallpaper.fontFamily,
              color: wallpaper.textColor,
              textAlign: wallpaper.textAlign || 'center',
              lineHeight: Math.min(wallpaper.fontSize * 0.4, Math.max(9, height / 18)) * 1.3,
            }}
            numberOfLines={Math.max(2, Math.min(Math.floor(height / 20), 12))}
            ellipsizeMode="tail"
            adjustsFontSizeToFit={true}
            minimumFontScale={0.6}
          >
            "{wallpaper.quote}"
          </Text>
          
          {/* Author */}
          {wallpaper.author && (
            <Text
              style={{
                fontSize: Math.min(wallpaper.fontSize * 0.25, Math.max(7, height / 35)),
                fontFamily: 'Montserrat_400Regular',
                color: wallpaper.textColor,
                opacity: 0.8,
                textAlign: wallpaper.textAlign || 'center',
                marginTop: Math.max(3, height / 50),
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
              adjustsFontSizeToFit={true}
              minimumFontScale={0.7}
            >
              — {wallpaper.author}
            </Text>
          )}
        </View>

        {/* Edit Indicator */}
        <View
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: 'rgba(0,0,0,0.15)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="pencil" size={10} color="white" />
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

export default function MyZoneScreen() {
  const [theme, setTheme] = useState(createTheme('light'));
  const [wallpapers, setWallpapers] = useState<SavedWallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Load theme and wallpapers on focus
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const [savedTheme, savedWallpapers] = await Promise.all([
            getJSON('themeMode'),
            getSavedWallpapers(),
          ]);
          setTheme(createTheme(savedTheme || 'light'));
          setWallpapers(savedWallpapers);
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      setLoading(true); // Reset loading state on focus
      loadData();
    }, [refreshKey])
  );

  const handleEdit = useCallback((wallpaper: SavedWallpaper) => {
    // Navigate to studio with wallpaper data for editing
    router.push({
      pathname: '/studio',
      params: { editId: wallpaper.id }
    });
  }, []);

  const refreshWallpapers = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
        try {
      const savedWallpapers = await getSavedWallpapers();
      setWallpapers(savedWallpapers);
    } catch (error) {
      console.error('Error refreshing wallpapers:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteWallpaper(id);
      setWallpapers(prev => prev.filter(w => w.id !== id));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error deleting wallpaper:', error);
      Alert.alert('Error', 'Failed to delete wallpaper. Please try again.');
    }
  }, []);

  // Calculate card dimensions maintaining TRUE aspect ratios (Pinterest-style)
  const getCardDimensions = (wallpaper: SavedWallpaper) => {
    const aspectRatio = wallpaper.aspectRatio || '9:16';
    const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
    
    const width = COLUMN_WIDTH;
    // Calculate height to maintain EXACT aspect ratio
    const height = width * (heightRatio / widthRatio);
    
    // Apply reasonable bounds only to prevent extreme cases, but maintain ratios
    const minHeight = 100;
    const maxHeight = 500; // Allow tall cards for authentic Pinterest look
    
    const constrainedHeight = Math.max(minHeight, Math.min(maxHeight, height));
    
    return { width, height: constrainedHeight };
  };

  // Create Pinterest-style masonry columns
  const createMasonryColumns = (wallpapers: SavedWallpaper[]) => {
    const leftColumn: SavedWallpaper[] = [];
    const rightColumn: SavedWallpaper[] = [];
    let leftHeight = 0;
    let rightHeight = 0;

    wallpapers.forEach((wallpaper) => {
      const { height } = getCardDimensions(wallpaper);
      
      // Always add to the shorter column for better balance
      if (leftHeight <= rightHeight) {
        leftColumn.push(wallpaper);
        leftHeight += height + CARD_GAP;
      } else {
        rightColumn.push(wallpaper);
        rightHeight += height + CARD_GAP;
      }
    });

    return { leftColumn, rightColumn };
  };

  const renderWallpaper = (wallpaper: SavedWallpaper) => {
    const { width, height } = getCardDimensions(wallpaper);
    return (
      <WallpaperGridItem
        key={`${wallpaper.id}-${wallpaper.updatedAt}`}
        wallpaper={wallpaper}
        theme={theme}
        width={width}
        height={height}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  };

  const renderEmpty = () => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600 }}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 100,
      }}
    >
      <Ionicons 
        name="heart-outline" 
        size={64} 
        color={theme.colors.textMuted} 
        style={{ marginBottom: 16 }}
      />
      <Text
        style={{
          fontSize: 24,
          fontFamily: 'Montserrat_600SemiBold',
          color: theme.colors.text,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        No Saved Wallpapers
      </Text>
      <Text
        style={{
          fontSize: 16,
          fontFamily: 'Montserrat_400Regular',
          color: theme.colors.textMuted,
          textAlign: 'center',
          lineHeight: 24,
          marginBottom: 32,
        }}
      >
        Start discovering wallpapers on the home screen and save the ones you love!
      </Text>
      <TouchableOpacity
        onPress={() => router.push('/')}
        style={{
          backgroundColor: theme.colors.accent,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 24,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Montserrat_500Medium',
            color: 'white',
          }}
        >
          Discover Wallpapers
        </Text>
      </TouchableOpacity>
    </MotiView>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Montserrat_400Regular',
              color: theme.colors.textMuted,
            }}
          >
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {wallpapers.length === 0 ? (
        renderEmpty()
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.accent}
              colors={[theme.colors.accent]}
            />
          }
          contentContainerStyle={{
            paddingBottom: 100, // Space for bottom navigation
          }}
        >
          {/* Scrollable Header */}
          <View style={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 32,
              fontFamily: 'Montserrat_700Bold',
              color: theme.colors.text,
              textAlign: 'center',
            }}>
              My Zone
            </Text>
            <Text style={{
              fontSize: 16,
              fontFamily: 'Montserrat_400Regular',
              color: theme.colors.textMuted,
              textAlign: 'center',
              marginTop: 6,
              opacity: 0.8,
            }}>
              {wallpapers.length} saved wallpaper{wallpapers.length !== 1 ? 's' : ''}
            </Text>
          </View>

          {/* Pinterest-style Grid */}
          <View style={{
            flexDirection: 'row',
            paddingHorizontal: 15,
            gap: COLUMN_GAP,
          }}>
            {(() => {
              const { leftColumn, rightColumn } = createMasonryColumns(wallpapers);
              return (
                <>
                  {/* Left Column */}
                  <View style={{ flex: 1 }}>
                    {leftColumn.map(renderWallpaper)}
                  </View>
                  
                  {/* Right Column */}
                  <View style={{ flex: 1 }}>
                    {rightColumn.map(renderWallpaper)}
                  </View>
                </>
              );
            })()}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
} 