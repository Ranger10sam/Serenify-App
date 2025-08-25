import AsyncStorage from '@react-native-async-storage/async-storage';

export const setJSON = async (key: string, value: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const getJSON = async (key: string): Promise<any> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
};

// Wallpaper data structure
export interface SavedWallpaper {
  id: string;
  quote: string;
  author?: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  textPosition: { x: number; y: number };
  textWidth: number;
  textAlign?: 'left' | 'center' | 'right';
  fontWeight?: string;
  aspectRatio: string;
  createdAt: number;
  updatedAt: number;
}

// Wallpaper storage operations
export const saveWallpaper = async (wallpaper: Omit<SavedWallpaper, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const id = Date.now().toString();
    const now = Date.now();
    const wallpaperData: SavedWallpaper = {
      ...wallpaper,
      id,
      createdAt: now,
      updatedAt: now,
    };

    const savedWallpapers = await getSavedWallpapers();
    savedWallpapers.unshift(wallpaperData); // Add to beginning
    
    await setJSON('savedWallpapers', savedWallpapers);
    return id;
  } catch (error) {
    console.error('Error saving wallpaper:', error);
    throw error;
  }
};

export const getSavedWallpapers = async (): Promise<SavedWallpaper[]> => {
  try {
    const wallpapers = await getJSON('savedWallpapers');
    return wallpapers || [];
  } catch (error) {
    console.error('Error loading saved wallpapers:', error);
    return [];
  }
};

export const updateWallpaper = async (id: string, updates: Partial<SavedWallpaper>): Promise<void> => {
  try {
    const savedWallpapers = await getSavedWallpapers();
    const index = savedWallpapers.findIndex(w => w.id === id);
    
    if (index !== -1) {
      savedWallpapers[index] = {
        ...savedWallpapers[index],
        ...updates,
        updatedAt: Date.now(),
      };
      await setJSON('savedWallpapers', savedWallpapers);
    } else {
      throw new Error('Wallpaper not found');
    }
  } catch (error) {
    console.error('Error updating wallpaper:', error);
    throw error;
  }
};

export const deleteWallpaper = async (id: string): Promise<void> => {
  try {
    const savedWallpapers = await getSavedWallpapers();
    const filtered = savedWallpapers.filter(w => w.id !== id);
    await setJSON('savedWallpapers', filtered);
  } catch (error) {
    console.error('Error deleting wallpaper:', error);
    throw error;
  }
};

export const getWallpaperById = async (id: string): Promise<SavedWallpaper | null> => {
  try {
    const savedWallpapers = await getSavedWallpapers();
    return savedWallpapers.find(w => w.id === id) || null;
  } catch (error) {
    console.error('Error getting wallpaper by id:', error);
    return null;
  }
};
