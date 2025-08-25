import '../global.css';
import { Stack, router, usePathname } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState, useRef } from 'react';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';
import { View, Text, TouchableOpacity, Modal, Animated } from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { createTheme, ThemeMode } from '../src/theme';
import { getJSON } from '../src/lib/storage';

function TopNav({ theme }: { theme: any }) {
	const insets = useSafeAreaInsets();
	const pathname = usePathname();
	const isHome = pathname === '/' || pathname === '/index';
	const [menuOpen, setMenuOpen] = useState(false);
	const slideAnim = useRef(new Animated.Value(0)).current;

	const openMenu = () => {
		setMenuOpen(true);
		Animated.timing(slideAnim, { toValue: 1, duration: 280, useNativeDriver: true }).start();
	};

	const closeMenu = () => {
		Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => setMenuOpen(false));
	};

	return (
		<>
			<View style={{ paddingTop: insets.top + 8, paddingBottom: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: theme.colors.glassStroke }}>
				<View style={{ width: 80 }}>
					{!isHome && (
						<TouchableOpacity onPress={() => router.back()} activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: theme.colors.glassBg, borderWidth: 1, borderColor: theme.colors.glassStroke }}>
							<Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text, marginRight: 4 }}>←</Text>
							<Text style={{ fontSize: 12, fontWeight: '600', letterSpacing: 0.5, color: theme.colors.text }}>Back</Text>
						</TouchableOpacity>
					)}
				</View>
				<View style={{ flex: 1, alignItems: 'center' }}>
					<Text style={{ fontSize: 18, fontWeight: '700', letterSpacing: 2.5, textTransform: 'uppercase', color: theme.colors.text }}>Serenify</Text>
				</View>
				<View style={{ width: 80, alignItems: 'flex-end' }}>
					<TouchableOpacity onPress={openMenu} activeOpacity={0.8} style={{ paddingVertical: 10, paddingHorizontal: 12, borderRadius: 20, backgroundColor: theme.colors.glassBg, borderWidth: 1, borderColor: theme.colors.glassStroke }}>
						<View style={{ width: 18, height: 12, justifyContent: 'space-between' }}>
							<View style={{ width: '100%', height: 2, backgroundColor: theme.colors.text, borderRadius: 1 }} />
							<View style={{ width: '70%', height: 2, backgroundColor: theme.colors.text, borderRadius: 1, alignSelf: 'flex-end' }} />
							<View style={{ width: '85%', height: 2, backgroundColor: theme.colors.text, borderRadius: 1, alignSelf: 'flex-end' }} />
						</View>
					</TouchableOpacity>
				</View>
			</View>

			<Modal transparent visible={menuOpen} animationType="none" onRequestClose={closeMenu}>
				<TouchableOpacity activeOpacity={1} onPress={closeMenu} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
					<Animated.View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 280, transform: [{ translateX: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [280, 0] }) }] }}>
						<BlurView intensity={60} tint="light" style={{ flex: 1, paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
								<Text style={{ fontSize: 14, letterSpacing: 2, fontWeight: '700', color: theme.colors.textLight, textTransform: 'uppercase' }}>Menu</Text>
								<TouchableOpacity onPress={closeMenu} activeOpacity={0.8}>
									<Text style={{ fontSize: 20, fontWeight: '300', color: theme.colors.text }}>×</Text>
								</TouchableOpacity>
							</View>
							{[
								{ label: 'Discover', path: '/', icon: '♡' },
								{ label: 'Studio', path: '/studio', icon: '✎' },
								{ label: 'My Zone', path: '/myzone', icon: '⊞' },
								{ label: 'Settings', path: '/settings', icon: '⚙' },
							].map((item) => (
								<TouchableOpacity key={item.path} onPress={() => { closeMenu(); setTimeout(() => router.push(item.path as any), 100); }} activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, marginBottom: 8, borderRadius: 16, backgroundColor: theme.colors.glassBg, borderWidth: 1, borderColor: theme.colors.glassStroke }}>
									<Text style={{ fontSize: 18, marginRight: 12, color: theme.colors.text }}>{item.icon}</Text>
									<Text style={{ fontSize: 16, fontWeight: '600', letterSpacing: 1, color: theme.colors.text }}>{item.label}</Text>
								</TouchableOpacity>
							))}
							<View style={{ position: 'absolute', bottom: insets.bottom + 20, left: 20, right: 20 }}>
								<Text style={{ fontSize: 11, color: theme.colors.textLight, textAlign: 'center', letterSpacing: 1 }}>Serenify v1.0</Text>
							</View>
						</BlurView>
					</Animated.View>
				</TouchableOpacity>
			</Modal>
		</>
	);
}

function RootLayoutContent() {
	const [loaded] = useFonts({
		Montserrat_400Regular,
		Montserrat_500Medium,
		Montserrat_600SemiBold,
	});
	const insets = useSafeAreaInsets();
	const [themeMode, setThemeMode] = useState<ThemeMode>('light');

	useEffect(() => {
		(async () => {
			const savedMode = await getJSON('themeMode');
			setThemeMode(savedMode ?? 'light');
		})();
	}, []);

	const theme = createTheme(themeMode);

	useEffect(() => {
		SystemUI.setBackgroundColorAsync(theme.colors.background).catch(() => {});
	}, [theme.colors.background]);

	if (!loaded) {
		return <View style={{ flex: 1, backgroundColor: theme.colors.background }} />;
	}

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			<TopNav theme={theme} />
			<View style={{ flex: 1, paddingBottom: Math.max(insets.bottom, 10) }}>
				<Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
					<Stack.Screen name="index" />
					<Stack.Screen name="studio" />
					<Stack.Screen name="myzone" />
					<Stack.Screen name="settings" />
				</Stack>
			</View>
		</View>
	);
}

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<SafeAreaView style={{ flex: 1 }}>
				<RootLayoutContent />
				<Toast />
			</SafeAreaView>
		</SafeAreaProvider>
	);
}
