import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import { captureRef } from 'react-native-view-shot';
import { createTheme, palettes } from '../src/theme';
import { GlassCard } from '../src/components/GlassCard';

const STORAGE_QUOTES = 'serenify_quotes_v1';
const STORAGE_FONT = 'serenify_font_v1';
const STORAGE_PALETTE = 'serenify_palette_v1';

const fontKeys = [
	'Inter_600SemiBold',
	'Inter_400Regular',
	'Manrope_400Regular',
	'DMSans_400Regular',
	'Sora_400Regular',
	'PlusJakartaSans_400Regular',
	'Outfit_400Regular',
] as const;

export default function Home() {
	const scheme = useColorScheme();
	const theme = useMemo(() => createTheme(scheme === 'dark' ? 'dark' : 'light'), [scheme]);
	const [quotes, setQuotes] = useState<string[]>(["Small steps, quiet mind.", "Consistency compounds.", "Focus on the next gentle move."]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [editing, setEditing] = useState(false);
	const [text, setText] = useState(quotes[0]);
	const [paletteIndex, setPaletteIndex] = useState(0);
	const [fontKey, setFontKey] = useState<typeof fontKeys[number]>('Inter_600SemiBold');
	const cardRef = useRef<View | null>(null);

	useEffect(() => {
		(async () => {
			const [rawQuotes, rawFont, rawPalette] = await Promise.all([
				AsyncStorage.getItem(STORAGE_QUOTES),
				AsyncStorage.getItem(STORAGE_FONT),
				AsyncStorage.getItem(STORAGE_PALETTE),
			]);
			if (rawQuotes) {
				try {
					const parsed = JSON.parse(rawQuotes) as string[];
					if (Array.isArray(parsed) && parsed.length > 0) {
						setQuotes(parsed);
						setText(parsed[0]);
					}
				} catch {}
			}
			if (rawFont && fontKeys.includes(rawFont as any)) setFontKey(rawFont as any);
			if (rawPalette) {
				const idx = Number(rawPalette);
				if (!Number.isNaN(idx)) setPaletteIndex(Math.max(0, Math.min(palettes.length - 1, idx)));
			}
		})();
	}, []);

	useEffect(() => {
		AsyncStorage.setItem(STORAGE_QUOTES, JSON.stringify(quotes)).catch(() => {});
	}, [quotes]);

	useEffect(() => {
		AsyncStorage.setItem(STORAGE_FONT, fontKey).catch(() => {});
	}, [fontKey]);

	useEffect(() => {
		AsyncStorage.setItem(STORAGE_PALETTE, String(paletteIndex)).catch(() => {});
	}, [paletteIndex]);

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

	function toggleEdit() {
		if (editing) {
			const updated = [...quotes];
			updated[currentIndex] = text.trim();
			setQuotes(updated);
			setEditing(false);
		} else {
			setEditing(true);
		}
	}

	async function shareAsImage() {
		try {
			if (!cardRef.current) return;
			const uri = await captureRef(cardRef.current, { format: 'png', quality: 1, result: 'tmpfile' });
			await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Share your Serenify quote' });
		} catch {}
	}

	const colors = palettes[paletteIndex]?.colors ?? theme.gradient;

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}> 
			<LinearGradient
				colors={colors}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={StyleSheet.absoluteFill}
			/>

			<View style={styles.header}> 
				<Text style={[styles.brand, { color: theme.text, fontFamily: 'Inter_600SemiBold' }]}>Serenify</Text>
			</View>

			<ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
				<MotiView from={{ opacity: 0, translateY: 12 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 450 }}>
					<BlurView intensity={40} tint={scheme === 'dark' ? 'dark' : 'light'} style={styles.glassWrap}>
						<View ref={cardRef} collapsable={false}>
							<GlassCard>
								{editing ? (
									<TextInput
										value={text}
										onChangeText={setText}
										placeholder="Type your affirmation..."
										placeholderTextColor={theme.muted}
										style={[styles.input, { color: theme.text, fontFamily: fontKey }]}
										multiline
									/>
							) : (
								<Text style={[styles.quote, { color: theme.text, fontFamily: fontKey }]}>{text}</Text>
							)}
							</GlassCard>
						</View>
					</BlurView>
				</MotiView>

				<View style={styles.actions}>
					<TouchableOpacity onPress={prevQuote} style={[styles.btn, { backgroundColor: theme.card }]}> 
						<Text style={[styles.btnText, { color: theme.text }]}>Prev</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={toggleEdit} style={[styles.btn, { backgroundColor: theme.card }]}> 
						<Text style={[styles.btnText, { color: theme.text }]}>{editing ? 'Done' : 'Edit'}</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={nextQuote} style={[styles.btn, { backgroundColor: theme.card }]}> 
						<Text style={[styles.btnText, { color: theme.text }]}>Next</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={shareAsImage} style={[styles.btn, { backgroundColor: theme.card }]}> 
						<Text style={[styles.btnText, { color: theme.text }]}>Share</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.fontRow}>
					{fontKeys.map((key) => (
						<TouchableOpacity
							key={key}
							onPress={() => { setFontKey(key); Haptics.selectionAsync(); }}
							style={[styles.fontChip, { backgroundColor: theme.card, opacity: key === fontKey ? 1 : 0.7 }]}
						>
							<Text style={{ color: theme.text, fontFamily: key, fontSize: 12 }}>{key.replace('_400Regular', '').replace('_600SemiBold', '').replace('_', ' ')}</Text>
						</TouchableOpacity>
					))}
				</View>
			</ScrollView>

			<View style={styles.paletteRow}>
				{palettes.map((p, idx) => (
					<TouchableOpacity key={p.name} onPress={() => { setPaletteIndex(idx); Haptics.selectionAsync(); }} style={[styles.swatch, { backgroundColor: p.preview, opacity: idx === paletteIndex ? 1 : 0.6 }]} />
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
	actions: { flexDirection: 'row', columnGap: 12, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' },
	btn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginVertical: 4 },
	btnText: { fontSize: 16 },
	paletteRow: { flexDirection: 'row', columnGap: 8, padding: 16, justifyContent: 'center' },
	swatch: { width: 28, height: 28, borderRadius: 999 },
	fontRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12, justifyContent: 'center' },
	fontChip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999 },
});
