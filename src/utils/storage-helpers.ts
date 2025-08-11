import { LecturerModule, Rating, Admin } from '@/types';

const STORAGE_KEYS = {
  RATED_MODULES: 'rated_modules',
  ADMIN: 'admin'
};

// API base URL configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Remove any trailing slashes from the API base URL
const normalizeUrl = (url: string) => url.replace(/\/+$/, '');


// API request helper
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${normalizeUrl(API_BASE_URL)}${endpoint}`;
  console.log('API Request:', url, options); // Debug log
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Key': `${getAdmin()?.access_token}`,
        ...options.headers,
      },
      credentials: 'include',
    });

    const responseData = await response.json();
    console.log('API Response:', responseData); // Debug log

     // if resonse is unauthorized, delete admin and throw error
    if (response.status === 401) {
      deleteAdmin();
      location.reload();
      console.log("Unauthorized")
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`, { cause: responseData });
    }

   

    // If the response has a 'data' property, return that, otherwise return the whole response
    return responseData.data !== undefined ? responseData.data : responseData;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Keep these in localStorage as they're used for anonymous tracking
export const getRatedModules = (): number[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.RATED_MODULES);
  return data ? JSON.parse(data) : [];
};

export const addRatedModule = (moduleId: number) => {
  if (typeof window === 'undefined') return;
  const rated = getRatedModules();
  if (!rated.includes(moduleId)) {
    rated.push(moduleId);
    localStorage.setItem(STORAGE_KEYS.RATED_MODULES, JSON.stringify(rated));
  }
};

export const hasRatedModule = (moduleId: number): boolean => {
  if (typeof window === 'undefined') return false;
  return getRatedModules().includes(moduleId);
};

// API-based storage functions
export const getModules = async (): Promise<LecturerModule[]> => {
  console.log("GetModules");
  console.log("API_BASE_URL", API_BASE_URL);
  try {
    const data = await apiRequest<LecturerModule[]>('/modules');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching modules:', error);
    return [];
  }
};

export const saveModule = async (module: Omit<LecturerModule, 'id' | 'created_at'>): Promise<LecturerModule> => {
  try {
    return await apiRequest<LecturerModule>('/modules', {
      method: 'POST',
      body: JSON.stringify(module),
    });
  } catch (error) {
    console.error('Error saving module:', error);
    throw error;
  }
};

export const updateModule = async (module: Omit<LecturerModule, 'id' | 'created_at'>, moduleId: number): Promise<LecturerModule> => {
  try {
    return await apiRequest<LecturerModule>('/modules/' + moduleId, {
      method: 'PUT',
      body: JSON.stringify(module),
    });
  } catch (error) {
    console.error('Error updating module:', error);
    throw error;
  }
};

export const deleteModule = async (moduleId: number): Promise<void> => {
  try {
    await apiRequest<LecturerModule>('/modules/' + moduleId, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting module:', error);
    throw error;
  }
};

export const getRatings = async (lecturerModuleId?: number): Promise<Rating[]> => {
  try {
    const endpoint = lecturerModuleId 
      ? `/ratings?lecturerModuleId=${encodeURIComponent(lecturerModuleId)}`
      : '/ratings';
    
    const data = await apiRequest<Rating[]>(endpoint);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return [];
  }
};

export const saveRating = async (rating: Omit<Rating, 'id' | 'created_at'>): Promise<Rating> => {
  try {
    return await apiRequest<Rating>('/ratings', {
      method: 'POST',
      body: JSON.stringify(rating),
    });
  } catch (error) {
    console.error('Error saving rating:', error);
    throw error;
  }
};

// Admin functions remain in localStorage
export const getAdmin = (): Admin | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.ADMIN);
  return data ? JSON.parse(data) : null;
};

export const saveAdmin = (admin: Admin): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(admin));
};

export const deleteAdmin = (): void => {
  if (typeof window === 'undefined') {
    console.log("Window is undefined");
    return;
  };
  console.log("Removing admin");
  localStorage.removeItem(STORAGE_KEYS.ADMIN);
};

export const authLogin = async (email: string, password: string): Promise<Admin> => {
  try {
    return await apiRequest<Admin>('/rating-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
