import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function GlassCard({ children }: { children: ReactNode }) {
	return (
		<View style={styles.wrap}>
			<LinearGradient colors={["rgba(255,255,255,0.12)", "rgba(255,255,255,0.02)"]} style={styles.inner}>
				{children}
			</LinearGradient>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		borderRadius: 18,
		overflow: 'hidden',
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: 'rgba(255,255,255,0.18)',
		backgroundColor: 'rgba(255,255,255,0.06)',
		shadowColor: '#000',
		shadowOpacity: 0.18,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 8 },
	},
	inner: {
		padding: 20,
	}
});
