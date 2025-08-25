import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

import { createTheme, ThemeMode } from '../src/theme';
import { GlassCard } from '../src/components/GlassCard';
import { getJSON, setJSON } from '../src/lib/storage';

export default function SettingsScreen() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const theme = createTheme(themeMode);

  useEffect(() => {
    (async () => {
      const savedMode = await getJSON<ThemeMode>('themeMode', 'light');
      setThemeMode(savedMode ?? 'light');
    })();
  }, []);

  const handleMode = async (mode: ThemeMode) => {
    setThemeMode(mode);
    Haptics.selectionAsync();
  };

  const applySettings = async () => {
    await setJSON('themeMode', themeMode);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />

      <SafeAreaView style={styles.safeArea}>
        {/* Theme Section */}
        <MotiView from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400 }}>
          <GlassCard theme={theme} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.heading }]}>Theme</Text>
            <View style={styles.row}>
              {(['light', 'dark'] as ThemeMode[]).map((m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => handleMode(m)}
                  style={[
                    styles.modeBtn,
                    { borderColor: theme.colors.glassStroke, backgroundColor: themeMode === m ? theme.colors.surfaceLight : 'transparent' },
                  ]}
                  activeOpacity={0.9}
                >
                  <Text style={{ color: theme.colors.text, fontWeight: '600' }}>{m.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={applySettings} style={[styles.applyBtn, { borderColor: theme.colors.text }]}> 
              <Text style={{ color: theme.colors.text, fontWeight: '700' }}>Apply</Text>
            </TouchableOpacity>
          </GlassCard>
        </MotiView>

        {/* About */}
        <MotiView from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 100 }}>
          <GlassCard theme={theme} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.heading }]}>About</Text>
            <View style={{ alignItems: 'center' }}>
              <Text style={[styles.appName, { color: theme.colors.text, fontFamily: theme.typography.heading }]}>Serenify</Text>
              <Text style={[styles.appVersion, { color: theme.colors.textLight }]}>Version 1.0.0</Text>
              <Text style={[styles.appDescription, { color: theme.colors.textLight }]}>Create elegant quote wallpapers with minimal, immersive UI.</Text>
            </View>
          </GlassCard>
        </MotiView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: 24, paddingBottom: 24 },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 18, marginBottom: 16, letterSpacing: 0.3 },
  row: { flexDirection: 'row', gap: 12 },
  modeBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  applyBtn: { marginTop: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  appName: { fontSize: 24, fontWeight: '700', marginBottom: 4, letterSpacing: 1 },
  appVersion: { fontSize: 14, marginBottom: 10 },
  appDescription: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
}); 