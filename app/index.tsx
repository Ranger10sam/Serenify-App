import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { HomeScreen } from '../src/screens/HomeScreen';
import { CategoriesScreen } from '../src/screens/CategoriesScreen';
import { OnboardingScreen } from '../src/screens/OnboardingScreen';
import { BottomNavigation } from '../src/components/BottomNavigation';

type Screen = 'home' | 'categories' | 'category-detail' | 'favorites' | 'profile';

export default function App() {
	const [showOnboarding, setShowOnboarding] = useState(true);
	const [currentScreen, setCurrentScreen] = useState<Screen>('home');
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	const [fontsLoaded] = useFonts({
		Inter_400Regular,
		Inter_600SemiBold,
	});

	if (!fontsLoaded) {
		return (
			<View style={styles.loadingContainer}>
				<Text>Loading...</Text>
			</View>
		);
	}

	if (showOnboarding) {
		return (
			<SafeAreaProvider>
				<OnboardingScreen 
					onGetStarted={() => setShowOnboarding(false)} 
				/>
			</SafeAreaProvider>
		);
	}

	const handleCategoryPress = (categoryId: string) => {
		setSelectedCategory(categoryId);
		setCurrentScreen('category-detail');
	};

	const handleTabPress = (tab: string) => {
		setCurrentScreen(tab as Screen);
	};

	const handleBack = () => {
		setCurrentScreen('home');
	};

	const renderScreen = () => {
		switch (currentScreen) {
			case 'home':
				return <HomeScreen onCategoryPress={handleCategoryPress} />;
			case 'categories':
				return <CategoriesScreen onCategoryPress={handleCategoryPress} onBack={handleBack} />;
			case 'category-detail':
				// You can implement CategoryDetailScreen later
				return <HomeScreen onCategoryPress={handleCategoryPress} />;
			case 'favorites':
				// You can implement FavoritesScreen later
				return <HomeScreen onCategoryPress={handleCategoryPress} />;
			case 'profile':
				// You can implement ProfileScreen later
				return <HomeScreen onCategoryPress={handleCategoryPress} />;
			default:
				return <HomeScreen onCategoryPress={handleCategoryPress} />;
		}
	};

	return (
		<SafeAreaProvider>
			<StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
			<View style={styles.container}>
				{renderScreen()}
				<BottomNavigation 
					activeTab={currentScreen} 
					onTabPress={handleTabPress}
				/>
			</View>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: { 
		flex: 1,
		backgroundColor: '#F8F9FA',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F8F9FA',
	},
});
