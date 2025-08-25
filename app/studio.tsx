import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Alert, ScrollView, Modal } from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

import { createTheme } from '../src/theme';
import { getJSON, getWallpaperById, saveWallpaper, updateWallpaper } from '../src/lib/storage';
import { getRandomQuote } from '../src/lib/quotes';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const backgroundColors = [
  '#F8F9FA', '#FFF8E1', '#F3E5F5', '#E8F5E8', '#E3F2FD',
  '#FFF3E0', '#FCE4EC', '#F1F8E9', '#E0F2F1', '#E8EAF6',
  '#FAFAFA', '#FDF6E3', '#F5F5F5', '#FFFDE7', '#F9FBE7'
];

const textColors = [
  '#2C3E50', '#34495E', '#5D4E75', '#2E7D32', '#1565C0',
  '#E65100', '#AD1457', '#388E3C', '#00695C', '#3F51B5',
  '#424242', '#6A4C93', '#37474F', '#558B2F', '#2E7D32'
];

const fontSizes = [16, 18, 20, 22, 24, 26, 28];
const fontFamilies = [
  { name: 'Regular', value: 'Montserrat_400Regular' },
  { name: 'Medium', value: 'Montserrat_500Medium' },
  { name: 'SemiBold', value: 'Montserrat_600SemiBold' },
];

const aspectRatios = [
  { name: 'Instagram Story', value: '9:16', width: 9, height: 16 },
  { name: 'Instagram Post', value: '1:1', width: 1, height: 1 },
  { name: 'Instagram Portrait', value: '4:5', width: 4, height: 5 },
  { name: 'Pinterest Pin', value: '2:3', width: 2, height: 3 },
  { name: 'Mobile Wallpaper', value: '9:19.5', width: 9, height: 19.5 },
  { name: 'Twitter Post', value: '16:9', width: 16, height: 9 },
];

export default function StudioScreen() {
  const params = useLocalSearchParams();
  const editId = params.editId as string;
  const isEditing = !!editId;

  const [theme, setTheme] = useState(createTheme('light'));
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(backgroundColors[0]);
  const [textColor, setTextColor] = useState(textColors[0]);
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState('Montserrat_400Regular');
  const [aspectRatio, setAspectRatio] = useState(aspectRatios[0]); // Default to 9:16
  const [textPosition, setTextPosition] = useState({ x: 0.5, y: 0.5 });
  const [textWidth, setTextWidth] = useState(0.8);
  const [toolbarExpanded, setToolbarExpanded] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Dropdown states
  const [expandedSections, setExpandedSections] = useState({
    content: false,
    format: false,
    typography: false,
    layout: false,
    style: false,
    colors: false,
  });

  const viewShotRef = useRef<ViewShot>(null);

  // Calculate canvas dimensions based on aspect ratio
  const maxCanvasWidth = SCREEN_WIDTH - 40;
  const maxCanvasHeight = SCREEN_HEIGHT * 0.65; // Leave space for toolbar

  let canvasWidth, canvasHeight;
  const ratio = aspectRatio.width / aspectRatio.height;

  if (ratio > 1) {
    // Landscape
    canvasWidth = Math.min(maxCanvasWidth, maxCanvasHeight * ratio);
    canvasHeight = canvasWidth / ratio;
  } else {
    // Portrait or square
    canvasHeight = Math.min(maxCanvasHeight, maxCanvasWidth / ratio);
    canvasWidth = canvasHeight * ratio;
  }

  // Load theme and wallpaper data on focus
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const savedTheme = await getJSON('themeMode');
          setTheme(createTheme(savedTheme || 'light'));

          if (isEditing) {
            const wallpaper = await getWallpaperById(editId);
            if (wallpaper) {
              setQuote(wallpaper.quote);
              setAuthor(wallpaper.author || '');
              setBackgroundColor(wallpaper.backgroundColor);
              setTextColor(wallpaper.textColor);
              setFontSize(wallpaper.fontSize);
              setFontFamily(wallpaper.fontFamily);
              
              // Find matching aspect ratio
              const matchingRatio = aspectRatios.find(ar => ar.value === wallpaper.aspectRatio);
              if (matchingRatio) {
                setAspectRatio(matchingRatio);
              }
              
              setTextPosition({
                x: wallpaper.textPosition.x,
                y: wallpaper.textPosition.y,
              });

              setTextWidth((wallpaper as any).textWidth || 0.8);
            } else {
              Alert.alert('Error', 'Wallpaper not found');
              router.back();
            }
          } else {
            // Generate random quote for new wallpaper
            const randomQuote = getRandomQuote();
            setQuote(randomQuote.text);
            setAuthor(randomQuote.author || '');
          }
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      loadData();
    }, [editId, isEditing])
  );

  // Position slider handlers
  const handlePositionXChange = (value: number) => {
    const newX = Math.max(0.1, Math.min(0.9, value));
    setTextPosition(prev => ({ ...prev, x: newX }));
  };

  const handlePositionYChange = (value: number) => {
    const newY = Math.max(0.1, Math.min(0.9, value));
    setTextPosition(prev => ({ ...prev, y: newY }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const generateRandomQuote = () => {
    const randomQuote = getRandomQuote();
    setQuote(randomQuote.text);
    setAuthor(randomQuote.author || '');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSave = async () => {
    if (!quote.trim()) {
      Alert.alert('Error', 'Please enter a quote');
      return;
    }

    try {
      const wallpaperData = {
        quote: quote.trim(),
        author: author.trim() || undefined,
        backgroundColor,
        textColor,
        fontSize,
        fontFamily,
        textPosition: {
          x: textPosition.x,
          y: textPosition.y,
        },
        textWidth,
        aspectRatio: aspectRatio.value,
      };

            if (isEditing) {
        await updateWallpaper(editId, wallpaperData);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show({
          type: 'success',
          text1: 'Updated Successfully!',
          text2: 'Your wallpaper has been updated',
          visibilityTime: 2000,
        });
        setTimeout(() => router.back(), 1000);
      } else {
        await saveWallpaper(wallpaperData);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show({
          type: 'success',
          text1: 'Saved Successfully!',
          text2: 'Your wallpaper has been saved',
          visibilityTime: 2000,
        });
        setTimeout(() => router.back(), 1000);
      }
    } catch (error) {
      console.error('Error saving wallpaper:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save wallpaper. Please try again.',
        visibilityTime: 3000,
      });
    }
  };

  const handleExport = async (resolution?: { width: number; height: number }) => {
    if (!viewShotRef.current?.capture) return;

    try {
      const uri = await viewShotRef.current.capture();
      await Sharing.shareAsync(uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({
        type: 'success',
        text1: 'Exported Successfully!',
        text2: 'Your wallpaper is ready to share',
        visibilityTime: 2000,
      });
      setShowExportModal(false);
    } catch (error) {
      console.error('Error exporting wallpaper:', error);
      Alert.alert('Error', 'Failed to export wallpaper. Please try again.');
    }
  };

  // Get resolution options based on mobile-focused aspect ratio
  const getResolutionOptions = () => {
    switch (aspectRatio.value) {
      case '9:16': // Instagram Story / TikTok
        return [
          { name: 'Instagram Story', width: 1080, height: 1920 },
          { name: 'TikTok HD', width: 1080, height: 1920 },
          { name: '4K Story', width: 2160, height: 3840 },
        ];
      case '1:1': // Instagram Post
        return [
          { name: 'Instagram Post', width: 1080, height: 1080 },
          { name: 'High Quality', width: 1440, height: 1440 },
          { name: '4K Square', width: 2160, height: 2160 },
        ];
      case '4:5': // Instagram Portrait
        return [
          { name: 'Instagram Portrait', width: 1080, height: 1350 },
          { name: 'High Quality', width: 1440, height: 1800 },
          { name: 'Ultra HD', width: 2160, height: 2700 },
        ];
      case '2:3': // Pinterest Pin
        return [
          { name: 'Pinterest Pin', width: 1000, height: 1500 },
          { name: 'High Quality', width: 1200, height: 1800 },
          { name: 'Ultra HD', width: 1600, height: 2400 },
        ];
      case '9:19.5': // Mobile Wallpaper
        return [
          { name: 'iPhone 14/15', width: 1179, height: 2556 },
          { name: 'Samsung S24', width: 1440, height: 3120 },
          { name: 'Ultra HD', width: 1620, height: 3510 },
        ];
      case '16:9': // Twitter Post
        return [
          { name: 'Twitter Post', width: 1200, height: 675 },
          { name: 'High Quality', width: 1600, height: 900 },
          { name: 'Ultra HD', width: 1920, height: 1080 },
        ];
      default:
        return [
          { name: 'Instagram Story', width: 1080, height: 1920 },
          { name: 'High Quality', width: 1440, height: 2560 },
          { name: '4K Story', width: 2160, height: 3840 },
        ];
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{
            fontSize: 16,
            fontFamily: 'Montserrat_400Regular',
            color: theme.colors.textMuted,
          }}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const textContainerWidth = canvasWidth * textWidth;
  const textContainerHeight = 150;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1 }}>
        {/* Canvas Container */}
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 20,
        }}>
          <ViewShot
            ref={viewShotRef}
            options={{ format: 'png', quality: 1.0 }}
            style={{
              width: canvasWidth,
              height: canvasHeight,
              backgroundColor,
              borderRadius: 12,
              position: 'relative',
              shadowColor: theme.colors.text,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            {/* Text Container */}
            <View
              style={{
                position: 'absolute',
                left: textPosition.x * canvasWidth - textContainerWidth / 2,
                top: textPosition.y * canvasHeight - textContainerHeight / 2,
                width: textContainerWidth,
                height: textContainerHeight,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View style={{
                width: '100%',
                alignItems: 'center',
                paddingHorizontal: 8,
              }}>
                <Text
                  style={{
                    fontSize,
                    fontFamily,
                    color: textColor,
                    textAlign: 'center',
                    lineHeight: fontSize * 1.4,
                    width: '100%',
                  }}
                  numberOfLines={6}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                >
                  "{quote}"
                </Text>
                
                {author && (
                  <Text
                    style={{
                      fontSize: fontSize * 0.7,
                      fontFamily: 'Montserrat_400Regular',
                      color: textColor,
                      opacity: 0.8,
                      textAlign: 'center',
                      marginTop: 8,
                      width: '100%',
                    }}
                    numberOfLines={2}
                  >
                    — {author}
                  </Text>
                )}
              </View>
            </View>
          </ViewShot>

          {/* Aspect Ratio Info */}
          <Text style={{
            fontSize: 12,
            fontFamily: 'Montserrat_400Regular',
            color: theme.colors.textMuted,
            marginTop: 8,
          }}>
            {aspectRatio.name}
          </Text>
        </View>

        {/* Compact Toolbar */}
        <MotiView
          animate={{
            height: toolbarExpanded ? 500 : 60,
          }}
          transition={{
            type: 'spring',
            damping: 15,
            stiffness: 150,
          }}
          style={{
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 16,
            paddingTop: 12,
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          {/* Compact Toolbar Handle */}
          <TouchableOpacity
            onPress={() => setToolbarExpanded(!toolbarExpanded)}
            style={{
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <View style={{
              width: 32,
              height: 3,
              backgroundColor: theme.colors.textMuted,
              borderRadius: 2,
              opacity: 0.4,
            }} />
          </TouchableOpacity>

          {/* Compact Quick Actions */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: toolbarExpanded ? 16 : 0,
          }}>
            <TouchableOpacity
              onPress={generateRandomQuote}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.colors.accent,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
              }}
            >
              <Ionicons name="refresh" size={14} color="white" />
              <Text style={{
                fontSize: 12,
                fontFamily: 'Montserrat_500Medium',
                color: 'white',
                marginLeft: 6,
              }}>
                Random
              </Text>
            </TouchableOpacity>

                         <TouchableOpacity
               onPress={() => setShowExportModal(true)}
               style={{
                 backgroundColor: theme.colors.background,
                 paddingHorizontal: 12,
                 paddingVertical: 6,
                 borderRadius: 16,
               }}
             >
               <Text style={{
                 fontSize: 12,
                 fontFamily: 'Montserrat_500Medium',
                 color: theme.colors.text,
               }}>
                 Export
               </Text>
             </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              style={{
                backgroundColor: theme.colors.accent,
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 16,
              }}
            >
              <Text style={{
                fontSize: 12,
                fontFamily: 'Montserrat_600SemiBold',
                color: 'white',
              }}>
                {isEditing ? 'Update' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Expanded Tools */}
          {toolbarExpanded && (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing', duration: 300 }}
              style={{ maxHeight: 400 }}
            >
              <ScrollView 
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {/* Content Section */}
                <View style={{ 
                  backgroundColor: theme.colors.background,
                  borderRadius: 12,
                  marginBottom: 12,
                  overflow: 'hidden',
                }}>
                  <TouchableOpacity
                    onPress={() => toggleSection('content')}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 16,
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontFamily: 'Montserrat_600SemiBold',
                      color: theme.colors.text,
                    }}>
                      Content
                    </Text>
                    <Ionicons 
                      name={expandedSections.content ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color={theme.colors.textMuted} 
                    />
                  </TouchableOpacity>
                  
                  {expandedSections.content && (
                    <MotiView
                      from={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ type: 'timing', duration: 200 }}
                      style={{ paddingHorizontal: 16, paddingBottom: 16 }}
                    >
                      <TextInput
                        value={quote}
                        onChangeText={setQuote}
                        placeholder="Enter your quote..."
                        multiline
                        style={{
                          backgroundColor: theme.colors.surface,
                          borderRadius: 8,
                          padding: 12,
                          fontSize: 14,
                          fontFamily: 'Montserrat_400Regular',
                          color: theme.colors.text,
                          minHeight: 60,
                          textAlignVertical: 'top',
                          marginBottom: 12,
                        }}
                      />
                      
                      <TextInput
                        value={author}
                        onChangeText={setAuthor}
                        placeholder="Author (optional)"
                        style={{
                          backgroundColor: theme.colors.surface,
                          borderRadius: 8,
                          padding: 12,
                          fontSize: 14,
                          fontFamily: 'Montserrat_400Regular',
                          color: theme.colors.text,
                        }}
                      />
                    </MotiView>
                  )}
                </View>

                {/* Format Section */}
                <View style={{ 
                  backgroundColor: theme.colors.background,
                  borderRadius: 12,
                  marginBottom: 12,
                  overflow: 'hidden',
                }}>
                  <TouchableOpacity
                    onPress={() => toggleSection('format')}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 16,
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontFamily: 'Montserrat_600SemiBold',
                      color: theme.colors.text,
                    }}>
                      Format
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{
                        fontSize: 12,
                        fontFamily: 'Montserrat_400Regular',
                        color: theme.colors.textMuted,
                      }}>
                        {aspectRatio.name}
                      </Text>
                      <Ionicons 
                        name={expandedSections.format ? "chevron-up" : "chevron-down"} 
                        size={16} 
                        color={theme.colors.textMuted} 
                      />
                    </View>
                  </TouchableOpacity>
                  
                  {expandedSections.format && (
                    <MotiView
                      from={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ type: 'timing', duration: 200 }}
                      style={{ paddingHorizontal: 16, paddingBottom: 16 }}
                    >
                      <View style={{ gap: 8 }}>
                        {aspectRatios.map((ratio) => (
                          <TouchableOpacity
                            key={ratio.value}
                            onPress={() => setAspectRatio(ratio)}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              paddingVertical: 12,
                              paddingHorizontal: 12,
                              borderRadius: 8,
                              backgroundColor: aspectRatio.value === ratio.value ? theme.colors.accent : theme.colors.surface,
                            }}
                          >
                            <Text style={{
                              fontSize: 13,
                              fontFamily: 'Montserrat_500Medium',
                              color: aspectRatio.value === ratio.value ? 'white' : theme.colors.text,
                            }}>
                              {ratio.name}
                            </Text>
                            <Text style={{
                              fontSize: 11,
                              fontFamily: 'Montserrat_400Regular',
                              color: aspectRatio.value === ratio.value ? 'rgba(255,255,255,0.8)' : theme.colors.textMuted,
                            }}>
                              {ratio.value}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </MotiView>
                  )}
                </View>

                {/* Typography Section */}
                <View style={{ 
                  backgroundColor: theme.colors.background,
                  borderRadius: 12,
                  marginBottom: 12,
                  overflow: 'hidden',
                }}>
                  <TouchableOpacity
                    onPress={() => toggleSection('typography')}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 16,
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontFamily: 'Montserrat_600SemiBold',
                      color: theme.colors.text,
                    }}>
                      Typography
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{
                        fontSize: 12,
                        fontFamily: 'Montserrat_400Regular',
                        color: theme.colors.textMuted,
                      }}>
                        Size {fontSize}
                      </Text>
                      <Ionicons 
                        name={expandedSections.typography ? "chevron-up" : "chevron-down"} 
                        size={16} 
                        color={theme.colors.textMuted} 
                      />
                    </View>
                  </TouchableOpacity>
                  
                  {expandedSections.typography && (
                    <MotiView
                      from={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ type: 'timing', duration: 200 }}
                      style={{ paddingHorizontal: 16, paddingBottom: 16 }}
                    >
                      <View style={{ gap: 8 }}>
                        {/* Font Size Options */}
                        {[16, 18, 20, 22, 24, 26, 28, 30, 32].map((size) => (
                          <TouchableOpacity
                            key={size}
                            onPress={() => setFontSize(size)}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              paddingVertical: 10,
                              paddingHorizontal: 12,
                              borderRadius: 8,
                              backgroundColor: fontSize === size ? theme.colors.accent : theme.colors.surface,
                            }}
                          >
                            <Text style={{
                              fontSize: 13,
                              fontFamily: 'Montserrat_500Medium',
                              color: fontSize === size ? 'white' : theme.colors.text,
                            }}>
                              Size {size}
                            </Text>
                            <Text style={{
                              fontSize: size > 20 ? 16 : size,
                              fontFamily: 'Montserrat_400Regular',
                              color: fontSize === size ? 'white' : theme.colors.textMuted,
                            }}>
                              Aa
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </MotiView>
                  )}
                </View>

                {/* Layout Section */}
                <View style={{ 
                  backgroundColor: theme.colors.background,
                  borderRadius: 12,
                  marginBottom: 12,
                  overflow: 'hidden',
                }}>
                  <TouchableOpacity
                    onPress={() => toggleSection('layout')}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 16,
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontFamily: 'Montserrat_600SemiBold',
                      color: theme.colors.text,
                    }}>
                      Layout
                    </Text>
                    <Ionicons 
                      name={expandedSections.layout ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color={theme.colors.textMuted} 
                    />
                  </TouchableOpacity>
                  
                  {expandedSections.layout && (
                    <MotiView
                      from={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ type: 'timing', duration: 200 }}
                      style={{ paddingHorizontal: 16, paddingBottom: 16 }}
                    >
                      <View style={{ gap: 8 }}>
                        {/* Text Width Options */}
                        {[
                          { label: 'Narrow', value: 0.6 },
                          { label: 'Medium', value: 0.8 },
                          { label: 'Wide', value: 1.0 },
                        ].map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() => setTextWidth(option.value)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingVertical: 10,
                          paddingHorizontal: 12,
                          borderRadius: 8,
                          backgroundColor: Math.abs(textWidth - option.value) < 0.1 ? theme.colors.accent : theme.colors.surface,
                        }}
                      >
                        <Text style={{
                          fontSize: 13,
                          fontFamily: 'Montserrat_500Medium',
                          color: Math.abs(textWidth - option.value) < 0.1 ? 'white' : theme.colors.text,
                        }}>
                          {option.label} Text
                        </Text>
                        <Text style={{
                          fontSize: 11,
                          fontFamily: 'Montserrat_400Regular',
                          color: Math.abs(textWidth - option.value) < 0.1 ? 'rgba(255,255,255,0.8)' : theme.colors.textMuted,
                        }}>
                          {Math.round(option.value * 100)}%
                        </Text>
                      </TouchableOpacity>
                    ))}
                    
                    {/* Position Presets */}
                    {[
                      { label: 'Top Center', x: 0.5, y: 0.25 },
                      { label: 'Center', x: 0.5, y: 0.5 },
                      { label: 'Bottom Center', x: 0.5, y: 0.75 },
                      { label: 'Top Left', x: 0.25, y: 0.25 },
                      { label: 'Top Right', x: 0.75, y: 0.25 },
                      { label: 'Bottom Left', x: 0.25, y: 0.75 },
                      { label: 'Bottom Right', x: 0.75, y: 0.75 },
                    ].map((preset) => (
                      <TouchableOpacity
                        key={preset.label}
                        onPress={() => setTextPosition({ x: preset.x, y: preset.y })}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingVertical: 10,
                          paddingHorizontal: 12,
                          borderRadius: 8,
                          backgroundColor: (Math.abs(textPosition.x - preset.x) < 0.1 && Math.abs(textPosition.y - preset.y) < 0.1) ? theme.colors.accent : theme.colors.surface,
                        }}
                      >
                        <Text style={{
                          fontSize: 13,
                          fontFamily: 'Montserrat_500Medium',
                          color: (Math.abs(textPosition.x - preset.x) < 0.1 && Math.abs(textPosition.y - preset.y) < 0.1) ? 'white' : theme.colors.text,
                        }}>
                          {preset.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                      </View>
                    </MotiView>
                  )}
                </View>

                {/* Style Section */}
                <View style={{ 
                  backgroundColor: theme.colors.background,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                }}>
                  <Text style={{
                    fontSize: 14,
                    fontFamily: 'Montserrat_600SemiBold',
                    color: theme.colors.text,
                    marginBottom: 12,
                  }}>
                    Style
                  </Text>
                  
                  <View style={{ gap: 8 }}>
                    {/* Font Family Options */}
                    {fontFamilies.map((font) => (
                      <TouchableOpacity
                        key={font.value}
                        onPress={() => setFontFamily(font.value)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingVertical: 12,
                          paddingHorizontal: 12,
                          borderRadius: 8,
                          backgroundColor: fontFamily === font.value ? theme.colors.accent : theme.colors.surface,
                        }}
                      >
                        <Text style={{
                          fontSize: 13,
                          fontFamily: 'Montserrat_500Medium',
                          color: fontFamily === font.value ? 'white' : theme.colors.text,
                        }}>
                          {font.name}
                        </Text>
                        <Text style={{
                          fontSize: 16,
                          fontFamily: font.value,
                          color: fontFamily === font.value ? 'white' : theme.colors.textMuted,
                        }}>
                          Aa
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Colors Section */}
                <View style={{ 
                  backgroundColor: theme.colors.background,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                }}>
                  <Text style={{
                    fontSize: 14,
                    fontFamily: 'Montserrat_600SemiBold',
                    color: theme.colors.text,
                    marginBottom: 12,
                  }}>
                    Colors
                  </Text>
                  
                  <View style={{ gap: 12 }}>
                    {/* Background Colors */}
                    <View>
                      <Text style={{
                        fontSize: 12,
                        fontFamily: 'Montserrat_500Medium',
                        color: theme.colors.textMuted,
                        marginBottom: 8,
                      }}>
                        Background
                      </Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {backgroundColors.map((color) => (
                          <TouchableOpacity
                            key={color}
                            onPress={() => setBackgroundColor(color)}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 8,
                              backgroundColor: color,
                              borderWidth: backgroundColor === color ? 3 : 1,
                              borderColor: backgroundColor === color ? theme.colors.accent : theme.colors.textMuted,
                            }}
                          />
                        ))}
                      </View>
                    </View>

                    {/* Text Colors */}
                    <View>
                      <Text style={{
                        fontSize: 12,
                        fontFamily: 'Montserrat_500Medium',
                        color: theme.colors.textMuted,
                        marginBottom: 8,
                      }}>
                        Text
                      </Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {textColors.map((color) => (
                          <TouchableOpacity
                            key={color}
                            onPress={() => setTextColor(color)}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 8,
                              backgroundColor: color,
                              borderWidth: textColor === color ? 3 : 1,
                              borderColor: textColor === color ? theme.colors.accent : theme.colors.textMuted,
                            }}
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </MotiView>
          )}
        </MotiView>

        {/* Export Modal */}
        <Modal
          visible={showExportModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowExportModal(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: 20,
                padding: 24,
                width: '100%',
                maxWidth: 320,
                shadowColor: theme.colors.text,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <Text style={{
                fontSize: 18,
                fontFamily: 'Montserrat_600SemiBold',
                color: theme.colors.text,
                textAlign: 'center',
                marginBottom: 8,
              }}>
                Export Wallpaper
              </Text>
              
              <Text style={{
                fontSize: 14,
                fontFamily: 'Montserrat_400Regular',
                color: theme.colors.textMuted,
                textAlign: 'center',
                marginBottom: 20,
              }}>
                Choose resolution for {aspectRatio.name}
              </Text>

              {/* Resolution Options */}
              <View style={{ gap: 12, marginBottom: 20 }}>
                {getResolutionOptions().map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleExport({ width: option.width, height: option.height })}
                    style={{
                      backgroundColor: theme.colors.background,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 12,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontFamily: 'Montserrat_500Medium',
                      color: theme.colors.text,
                    }}>
                      {option.name}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      fontFamily: 'Montserrat_400Regular',
                      color: theme.colors.textMuted,
                    }}>
                      {option.width}×{option.height}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Cancel Button */}
              <TouchableOpacity
                onPress={() => setShowExportModal(false)}
                style={{
                  backgroundColor: theme.colors.textMuted,
                  paddingVertical: 12,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  fontSize: 14,
                  fontFamily: 'Montserrat_500Medium',
                  color: 'white',
                }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </MotiView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
} 