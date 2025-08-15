import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Share } from 'expo-sharing';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { captureScreen } from 'react-native-view-shot';
import { createTheme, palettes } from '../src/theme';
import { GlassCard } from '../src/components/GlassCard';

const STORAGE_KEY = 'serenify_quotes_v1';

export default function Home() {
	const scheme = useColorScheme();
	const theme = useMemo(() => createTheme(scheme === 'dark' ? 'dark' : 'light'), [scheme]);
	const [quotes, setQuotes] = useState<string[]>(["Small steps, quiet mind.", "Consistency compounds.", "Focus on the next gentle move."]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [editing, setEditing] = useState(false);
	const [text, setText] = useState(quotes[0]);

	useEffect(() => {
		AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
			if (raw) {
				try {
					const parsed = JSON.parse(raw) as string[];
					if (Array.isArray(parsed) && parsed.length > 0) {
						setQuotes(parsed);
						setText(parsed[0]);
					}
				} catch {}
			}
		});
	}, []);

	useEffect(() => {
		AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(quotes)).catch(() => {});
	}, [quotes]);

	function nextQuote() {
		const idx = (currentIndex + 1) % quotes.length;
		setCurrentIndex(idx);
		setText(quotes[idx]);
	}

	function prevQuote() {
		const idx = (currentIndex - 1 + quotes.length) % quotes.length;
		setCurrentIndex(idx);
		setText(quotes[idx]);
	}

	function saveEdit() {
		const updated = [...quotes];
		updated[currentIndex] = text.trim();
		setQuotes(updated);
		setEditing(false);
	}

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}> 
			<LinearGradient
				colors={theme.gradient}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={StyleSheet.absoluteFill}
			/>

			<View style={styles.header}> 
				<Text style={[styles.brand, { color: theme.text }]}>Serenify</Text>
			</View>

			<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
				<MotiView from={{ opacity: 0, translateY: 12 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 450 }}>
					<BlurView intensity={40} tint={scheme === 'dark' ? 'dark' : 'light'} style={styles.glassWrap}>
						<GlassCard>
							{editing ? (
								<TextInput
									value={text}
									onChangeText={setText}
									placeholder="Type your affirmation..."
									placeholderTextColor={theme.muted}
									style={[styles.input, { color: theme.text }]}
									multiline
								/>
							) : (
								<Text style={[styles.quote, { color: theme.text }]}>{text}</Text>
							)}
						</GlassCard>
					</BlurView>
				</MotiView>

				<View style={styles.actions}>
					<TouchableOpacity onPress={prevQuote} style={[styles.btn, { backgroundColor: theme.card }]}> 
						<Text style={[styles.btnText, { color: theme.text }]}>Prev</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => setEditing((s) => !s)} style={[styles.btn, { backgroundColor: theme.card }]}> 
						<Text style={[styles.btnText, { color: theme.text }]}>{editing ? 'Done' : 'Edit'}</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={nextQuote} style={[styles.btn, { backgroundColor: theme.card }]}> 
						<Text style={[styles.btnText, { color: theme.text }]}>Next</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>

			<View style={styles.paletteRow}>
				{palettes.map((p) => (
					<TouchableOpacity key={p.name} onPress={() => {}} style={[styles.swatch, { backgroundColor: p.preview }]} />
				))}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
	brand: { fontSize: 22, fontWeight: '600' },
	content: { padding: 20, rowGap: 16 },
	glassWrap: { borderRadius: 18, overflow: 'hidden' },
	quote: { fontSize: 28, lineHeight: 36 },
	input: { fontSize: 24, lineHeight: 32, minHeight: 120 },
	actions: { flexDirection: 'row', columnGap: 12, justifyContent: 'center', marginTop: 16 },
	btn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
	btnText: { fontSize: 16 },
	paletteRow: { flexDirection: 'row', columnGap: 8, padding: 16, justifyContent: 'center' },
	swatch: { width: 28, height: 28, borderRadius: 999 },
});
