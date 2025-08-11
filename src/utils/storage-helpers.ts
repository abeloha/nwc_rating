import { LecturerModule, Rating, Admin } from '@/types';

const STORAGE_KEYS = {
  RATED_MODULES: 'rated_modules',
  ADMIN: 'admin'
};

// Keep these in localStorage as they're used for anonymous tracking
export const getRatedModules = (): string[] => {
  const data = localStorage.getItem(STORAGE_KEYS.RATED_MODULES);
  return data ? JSON.parse(data) : [];
};

export const addRatedModule = (moduleId: string) => {
  const rated = getRatedModules();
  if (!rated.includes(moduleId)) {
    rated.push(moduleId);
    localStorage.setItem(STORAGE_KEYS.RATED_MODULES, JSON.stringify(rated));
  }
};

export const hasRatedModule = (moduleId: string): boolean => {
  return getRatedModules().includes(moduleId);
};

// API-based storage functions
export const getModules = async (): Promise<LecturerModule[]> => {
  try {
    const response = await fetch('/api/modules');
    if (!response.ok) {
      throw new Error('Failed to fetch modules');
    }
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching modules:', error);
    return [];
  }
};

export const saveModule = async (module: Omit<LecturerModule, 'id' | 'created_at' | 'is_active'>): Promise<LecturerModule> => {
  try {
    const response = await fetch('/api/modules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(module),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save module');
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving module:', error);
    throw error;
  }
};

export const getRatings = async (lecturerModuleId?: string): Promise<Rating[]> => {
  try {
    const url = lecturerModuleId 
      ? `/api/ratings?lecturerModuleId=${lecturerModuleId}`
      : '/api/ratings';
      
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch ratings');
    }
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return [];
  }
};

export const saveRating = async (rating: Omit<Rating, 'id' | 'created_at'>): Promise<Rating> => {
  try {
    const response = await fetch('/api/ratings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rating),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save rating');
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving rating:', error);
    throw error;
  }
};

// Admin functions remain in localStorage
export const getAdmin = (): Admin | null => {
  const data = localStorage.getItem(STORAGE_KEYS.ADMIN);
  return data ? JSON.parse(data) : null;
};

export const saveAdmin = (admin: Admin) => {
  localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(admin));
};
