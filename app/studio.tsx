import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Alert, ScrollView, Modal, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { BlurView } from 'expo-blur';

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
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'System', value: 'System' },
];

const fontWeights = [
  { name: 'Light', value: '300', family: 'Montserrat_300Light' },
  { name: 'Regular', value: '400', family: 'Montserrat_400Regular' },
  { name: 'Medium', value: '500', family: 'Montserrat_500Medium' },
  { name: 'SemiBold', value: '600', family: 'Montserrat_600SemiBold' },
  { name: 'Bold', value: '700', family: 'Montserrat_700Bold' },
];

const textAlignments = [
  { name: 'Left', value: 'left' as const, icon: 'text-left' },
  { name: 'Center', value: 'center' as const, icon: 'text-center' },
  { name: 'Right', value: 'right' as const, icon: 'text-right' },
];

const aspectRatios = [
  { name: 'Instagram Story', value: '9:16', width: 9, height: 16 },
  { name: 'Instagram Post', value: '1:1', width: 1, height: 1 },
  { name: 'Instagram Portrait', value: '4:5', width: 4, height: 5 },
  { name: 'Pinterest Pin', value: '2:3', width: 2, height: 3 },
  { name: 'Photo Portrait', value: '3:4', width: 3, height: 4 },
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
  const [fontWeight, setFontWeight] = useState('400');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
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
    colors: false,
  });
  


  const viewShotRef = useRef<ViewShot>(null);

  // Calculate canvas dimensions based on aspect ratio
  const maxCanvasWidth = SCREEN_WIDTH - 40;
  const maxCanvasHeight = SCREEN_HEIGHT * 0.6; // Leave more space for toolbar

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
              setTextAlign(wallpaper.textAlign || 'center');
              setFontWeight(wallpaper.fontWeight || '400');
              
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
        fontFamily: fontWeights.find(w => w.value === fontWeight)?.family || fontFamily,
        textPosition: {
          x: textPosition.x,
          y: textPosition.y,
        },
        textWidth,
        textAlign,
        fontWeight,
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
      case '3:4': // Photo Portrait
        return [
          { name: 'Photo Portrait', width: 1536, height: 2048 },
          { name: 'High Quality', width: 2304, height: 3072 },
          { name: 'Ultra HD', width: 3072, height: 4096 },
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
          maxWidth: SCREEN_WIDTH,
          overflow: 'hidden',
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
              left: Math.max(0, Math.min(canvasWidth - textContainerWidth, textPosition.x * canvasWidth - textContainerWidth / 2)),
              top: Math.max(0, Math.min(canvasHeight - textContainerHeight, textPosition.y * canvasHeight - textContainerHeight / 2)),
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
                    fontFamily: fontWeights.find(w => w.value === fontWeight)?.family || fontFamily,
                    color: textColor,
                    textAlign: textAlign,
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
                      textAlign: textAlign,
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

        {/* Compact Toolbar with Blur Background */}
        <MotiView
          animate={{
            height: toolbarExpanded ? 420 : 60,
          }}
          transition={{
            type: 'spring',
            damping: 15,
            stiffness: 150,
          }}
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: 'hidden',
            shadowColor: theme.colors.text,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 10,
          }}
        >
          <BlurView
            intensity={80}
            tint={theme.colors.background === '#000000' ? 'dark' : 'light'}
            style={{
              flex: 1,
            }}
          >
            {/* Subtle background overlay for better contrast */}
            <View style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: theme.colors.surface,
              opacity: 0.85,
            }} />
            
            <View style={{
              flex: 1,
              paddingHorizontal: 16,
              paddingTop: 12,
            }}>
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
              style={{ maxHeight: 320 }}
            >
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 16 }}
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
                    <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
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
                    </View>
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
                    <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
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
                    </View>
                  )}
                </View>

                {/* Typography & Style Section */}
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
                      Typography & Style
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{
                        fontSize: 12,
                        fontFamily: 'Montserrat_400Regular',
                        color: theme.colors.textMuted,
                      }}>
                        {fontSize}px • {fontWeights.find(w => w.value === fontWeight)?.name}
                      </Text>
                      <Ionicons 
                        name={expandedSections.typography ? "chevron-up" : "chevron-down"} 
                        size={16} 
                        color={theme.colors.textMuted} 
                      />
                    </View>
                  </TouchableOpacity>
                  
                  {expandedSections.typography && (
                    <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                      {/* Font Weight Row */}
                      <View style={{ marginBottom: 16 }}>
                        <Text style={{
                          fontSize: 12,
                          fontFamily: 'Montserrat_500Medium',
                          color: theme.colors.textMuted,
                          marginBottom: 8,
                        }}>
                          Font Weight
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                          {fontWeights.map((weight) => (
                            <TouchableOpacity
                              key={weight.value}
                              onPress={() => {
                                setFontWeight(weight.value);
                                setFontFamily(weight.family);
                              }}
                              style={{
                                paddingVertical: 8,
                                paddingHorizontal: 12,
                                backgroundColor: fontWeight === weight.value ? theme.colors.accent : theme.colors.surface,
                                borderRadius: 6,
                                minWidth: 60,
                                alignItems: 'center',
                              }}
                            >
                              <Text style={{
                                fontSize: 11,
                                fontFamily: weight.family,
                                color: fontWeight === weight.value ? 'white' : theme.colors.text,
                              }}>
                                {weight.name}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* Font Size & Text Alignment Row */}
                      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
                        {/* Font Size */}
                        <View style={{ flex: 1 }}>
                          <Text style={{
                            fontSize: 12,
                            fontFamily: 'Montserrat_500Medium',
                            color: theme.colors.textMuted,
                            marginBottom: 8,
                          }}>
                            Size
                          </Text>
                          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                            {fontSizes.map((size) => (
                              <TouchableOpacity
                                key={size}
                                onPress={() => setFontSize(size)}
                                style={{
                                  paddingVertical: 6,
                                  paddingHorizontal: 8,
                                  backgroundColor: fontSize === size ? theme.colors.accent : theme.colors.surface,
                                  borderRadius: 6,
                                  minWidth: 35,
                                  alignItems: 'center',
                                }}
                              >
                                <Text style={{
                                  fontSize: 10,
                                  fontFamily: 'Montserrat_500Medium',
                                  color: fontSize === size ? 'white' : theme.colors.text,
                                }}>
                                  {size}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>

                        {/* Text Alignment */}
                        <View style={{ flex: 1 }}>
                          <Text style={{
                            fontSize: 12,
                            fontFamily: 'Montserrat_500Medium',
                            color: theme.colors.textMuted,
                            marginBottom: 8,
                          }}>
                            Alignment
                          </Text>
                          <View style={{ flexDirection: 'row', gap: 4 }}>
                            {textAlignments.map((align) => (
                              <TouchableOpacity
                                key={align.value}
                                onPress={() => setTextAlign(align.value)}
                                style={{
                                  flex: 1,
                                  paddingVertical: 8,
                                  backgroundColor: textAlign === align.value ? theme.colors.accent : theme.colors.surface,
                                  borderRadius: 6,
                                  alignItems: 'center',
                                }}
                              >
                                <Ionicons
                                  name={align.icon as any}
                                  size={14}
                                  color={textAlign === align.value ? 'white' : theme.colors.text}
                                />
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      </View>
                    </View>
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
                    <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                      {/* Text Width - Horizontal Pills */}
                      <View style={{ marginBottom: 16 }}>
                        <Text style={{
                          fontSize: 12,
                          fontFamily: 'Montserrat_500Medium',
                          color: theme.colors.textMuted,
                          marginBottom: 8,
                        }}>
                          Text Width
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          {[
                            { label: 'Narrow', value: 0.6, icon: 'contract-outline' },
                            { label: 'Medium', value: 0.8, icon: 'resize-outline' },
                            { label: 'Wide', value: 1.0, icon: 'expand-outline' },
                          ].map((option) => (
                            <TouchableOpacity
                              key={option.value}
                              onPress={() => setTextWidth(option.value)}
                              style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 10,
                                borderRadius: 8,
                                backgroundColor: Math.abs(textWidth - option.value) < 0.1 ? theme.colors.accent : theme.colors.surface,
                                gap: 6,
                              }}
                            >
                              <Ionicons 
                                name={option.icon as any} 
                                size={14} 
                                color={Math.abs(textWidth - option.value) < 0.1 ? 'white' : theme.colors.textMuted} 
                              />
                              <Text style={{
                                fontSize: 12,
                                fontFamily: 'Montserrat_500Medium',
                                color: Math.abs(textWidth - option.value) < 0.1 ? 'white' : theme.colors.text,
                              }}>
                                {option.label}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* Position Grid */}
                      <View>
                        <Text style={{
                          fontSize: 12,
                          fontFamily: 'Montserrat_500Medium',
                          color: theme.colors.textMuted,
                          marginBottom: 8,
                        }}>
                          Position
                        </Text>
                        <View style={{ 
                          backgroundColor: theme.colors.surface,
                          borderRadius: 12,
                          padding: 12,
                          aspectRatio: 1,
                        }}>
                          {/* 3x3 Position Grid */}
                          <View style={{ flex: 1, gap: 4 }}>
                            {[
                              [{ x: 0.2, y: 0.2 }, { x: 0.5, y: 0.2 }, { x: 0.8, y: 0.2 }],
                              [{ x: 0.2, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: 0.8, y: 0.5 }],
                              [{ x: 0.2, y: 0.8 }, { x: 0.5, y: 0.8 }, { x: 0.8, y: 0.8 }],
                            ].map((row, rowIndex) => (
                              <View key={rowIndex} style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
                                {row.map((pos, colIndex) => {
                                  const isActive = Math.abs(textPosition.x - pos.x) < 0.15 && Math.abs(textPosition.y - pos.y) < 0.15;
                                  return (
                                    <TouchableOpacity
                                      key={`${rowIndex}-${colIndex}`}
                                      onPress={() => setTextPosition(pos)}
                                      style={{
                                        flex: 1,
                                        borderRadius: 6,
                                        backgroundColor: isActive ? theme.colors.accent : theme.colors.background,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <View style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: isActive ? 'white' : theme.colors.textMuted,
                                      }} />
                                    </TouchableOpacity>
                                  );
                                })}
                              </View>
                            ))}
                          </View>
                        </View>

                                              </View>
                      </View>
                    )}
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
            </View>
          </BlurView>
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