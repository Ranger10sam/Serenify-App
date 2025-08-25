import { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const CONTENT_HORIZONTAL_PADDING = 20; // must match styles.scrollContent paddingHorizontal

interface NavItem {
	id: string;
	title: string;
	isLogo?: boolean;
}

interface SliderNavigationProps {
	theme: any;
	activeItem: string;
	onItemPress: (itemId: string) => void;
}

const navItems: NavItem[] = [
	{ id: 'home', title: 'SERENIFY', isLogo: true },
	{ id: 'studio', title: 'STUDIO' },
	{ id: 'settings', title: 'SETTINGS' },
];

export function SliderNavigation({ theme, activeItem, onItemPress }: SliderNavigationProps) {
	const scrollViewRef = useRef<ScrollView>(null);
	const [itemLayouts, setItemLayouts] = useState<{ [key: string]: { x: number; width: number } }>({});
	const [textLayouts, setTextLayouts] = useState<{ [key: string]: { x: number; width: number } }>({});
	const [isInitialized, setIsInitialized] = useState(false);
	const [viewportWidth, setViewportWidth] = useState(width);
	const [contentWidth, setContentWidth] = useState(0);

	const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));

	// Helper: compute text center in scroll content coordinates
	const getTextCenterX = (itemId: string): number | null => {
		const container = itemLayouts[itemId];
		const text = textLayouts[itemId];
		if (!container || !text) return null;
		return container.x + text.x + text.width / 2;
	};

	// Auto-center active item using measured text center and viewport/content sizes
	useEffect(() => {
		const centerX = getTextCenterX(activeItem);
		if (centerX != null && scrollViewRef.current) {
			const rawOffset = centerX - viewportWidth / 2 - CONTENT_HORIZONTAL_PADDING;
			const maxOffset = Math.max(0, contentWidth - viewportWidth);
			const scrollToX = clamp(rawOffset, 0, maxOffset);
			setTimeout(() => {
				scrollViewRef.current?.scrollTo({ x: scrollToX, animated: true });
			}, 40);
		}
	}, [activeItem, itemLayouts, textLayouts, viewportWidth, contentWidth]);

	// Initialize after all layouts are measured
	useEffect(() => {
		const allContainersMeasured = navItems.every(item => itemLayouts[item.id]);
		const allTextsMeasured = navItems.every(item => textLayouts[item.id]);
		if (allContainersMeasured && allTextsMeasured && !isInitialized) {
			setIsInitialized(true);
		}
	}, [itemLayouts, textLayouts, isInitialized]);

	const handleItemPress = (itemId: string) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		onItemPress(itemId);
	};

	const handleItemLayout = (itemId: string, event: any) => {
		const { width: itemWidth, x: itemX } = event.nativeEvent.layout;
		setItemLayouts(prev => ({ ...prev, [itemId]: { x: itemX, width: itemWidth } }));
	};

	const handleTextLayout = (itemId: string, event: any) => {
		const { width: textWidth, x: textX } = event.nativeEvent.layout;
		setTextLayouts(prev => ({ ...prev, [itemId]: { x: textX, width: textWidth } }));
	};

	const getActiveUnderlineWidth = () => {
		const text = textLayouts[activeItem];
		if (!text) return 60;
		return Math.max(16, text.width * 0.95);
	};

	return (
		<View style={styles.container}>
			{/* Fashion Header Background */}
			<LinearGradient
				colors={[
					theme.colors.background + 'F8',
					theme.colors.background + 'E8',
					theme.colors.background + 'F8'
				]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.headerBackground}
			/>

			<View style={styles.navContainer}>
				<ScrollView
					ref={scrollViewRef}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.scrollContent}
					style={styles.scrollView}
					scrollEventThrottle={16}
					decelerationRate="fast"
					onLayout={(e) => setViewportWidth(e.nativeEvent.layout.width)}
					onContentSizeChange={(w) => setContentWidth(w)}
				>
					{navItems.map((item) => (
						<TouchableOpacity
							key={item.id}
							onPress={() => handleItemPress(item.id)}
							onLayout={(event) => handleItemLayout(item.id, event)}
							style={[styles.navItem, item.isLogo && styles.logoItem]}
							activeOpacity={0.8}
						>
							<MotiView
								animate={{ scale: activeItem === item.id ? 1.02 : 1, opacity: activeItem === item.id ? 1 : 0.65 }}
								transition={{ type: 'spring', damping: 24, stiffness: 360, mass: 0.7 }}
							>
								<Text
									onLayout={(e) => handleTextLayout(item.id, e)}
									style={[
										styles.navText,
										item.isLogo && styles.logoText,
										{ color: theme.colors.text, fontFamily: item.isLogo ? theme.typography.heading : theme.typography.primary }
									]}
								>
									{item.title}
								</Text>
								{activeItem === item.id && (
									<MotiView
										from={{ scale: 0.9, opacity: 0 }}
										animate={{ scale: 1, opacity: 0.85 }}
										transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 150 }}
										style={[styles.accentDot, { backgroundColor: theme.colors.accent }]}
									/>
								)}
							</MotiView>
						</TouchableOpacity>
					))}
				</ScrollView>

				{/* Fixed Center Underline */}
				{isInitialized && (
					<MotiView
						style={[styles.centerUnderline, { left: viewportWidth / 2, bottom: 8 }]}
						animate={{
							width: getActiveUnderlineWidth(),
							translateX: -getActiveUnderlineWidth() / 2,
							opacity: 1,
						}}
						transition={{ type: 'spring', damping: 28, stiffness: 420, mass: 0.8 }}
					>
						<LinearGradient
							colors={[ theme.colors.accent + '00', theme.colors.accent, theme.colors.accent + '00' ]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={styles.underlineGradient}
						/>
					</MotiView>
				)}
			</View>

			{/* Elegant Bottom Border */}
			<LinearGradient
				colors={[ theme.colors.glassStroke + '00', theme.colors.glassStroke + '40', theme.colors.glassStroke + '00' ]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				style={styles.bottomBorder}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		marginBottom: 32,
		paddingTop: 8,
	},
	headerBackground: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: '100%',
		borderRadius: 0,
	},
	navContainer: {
		height: 56,
		position: 'relative',
		justifyContent: 'center',
		paddingHorizontal: 24,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		alignItems: 'center',
		paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
	},
	centerUnderline: {
		position: 'absolute',
		height: 2,
		zIndex: 1,
	},
	underlineGradient: {
		flex: 1,
		borderRadius: 1,
	},
	navItem: {
		paddingHorizontal: 24,
		paddingVertical: 16,
		marginHorizontal: 6,
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 48,
		zIndex: 2,
	},
	logoItem: {
		paddingHorizontal: 28,
		marginHorizontal: 8,
	},
	navText: {
		fontSize: 13,
		fontWeight: '600',
		letterSpacing: 1.2,
		textTransform: 'uppercase',
		lineHeight: 16,
	},
	logoText: {
		fontSize: 15,
		fontWeight: '700',
		letterSpacing: 2,
		textTransform: 'uppercase',
	},
	accentDot: {
		width: 3,
		height: 3,
		borderRadius: 1.5,
		position: 'absolute',
		bottom: -12,
		alignSelf: 'center',
	},
	bottomBorder: {
		height: 1,
		marginHorizontal: 32,
		marginTop: 8,
	},
}); 