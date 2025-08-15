import { Stack } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Manrope_400Regular } from '@expo-google-fonts/manrope';
import { DM_Sans_400Regular } from '@expo-google-fonts/dm-sans';
import { Sora_400Regular } from '@expo-google-fonts/sora';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans';
import { Outfit_400Regular } from '@expo-google-fonts/outfit';
import { View } from 'react-native';

export default function RootLayout() {
	const [loaded] = useFonts({
		Inter_400Regular,
		Inter_600SemiBold,
		Manrope_400Regular,
		DM_Sans_400Regular,
		Sora_400Regular,
		PlusJakartaSans_400Regular,
		Outfit_400Regular,
	});

	useEffect(() => {
		SystemUI.setBackgroundColorAsync('#0b0b0c').catch(() => {});
	}, []);

	if (!loaded) {
		return <View style={{ flex: 1, backgroundColor: '#0b0b0c' }} />;
	}

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="index" />
		</Stack>
	);
}
