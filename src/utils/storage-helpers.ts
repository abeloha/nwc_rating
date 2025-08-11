import { LecturerModule, Rating, Admin } from '@/types';

const STORAGE_KEYS = {
  RATED_MODULES: 'rated_modules',
  ADMIN: 'admin'
};

// API base URL - use relative URL in the browser, full URL in server-side rendering
const getApiBaseUrl = () => {
  // In the browser, we'll use relative URLs
  if (typeof window !== 'undefined') {
    return '';
  }
  // In server-side rendering, use the environment variable or default to empty string
  return process.env.NEXT_PUBLIC_API_BASE_URL || '';
};

const API_BASE_URL = getApiBaseUrl();

// Keep these in localStorage as they're used for anonymous tracking
export const getRatedModules = (): string[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.RATED_MODULES);
  return data ? JSON.parse(data) : [];
};

export const addRatedModule = (moduleId: string) => {
  if (typeof window === 'undefined') return;
  const rated = getRatedModules();
  if (!rated.includes(moduleId)) {
    rated.push(moduleId);
    localStorage.setItem(STORAGE_KEYS.RATED_MODULES, JSON.stringify(rated));
  }
};

export const hasRatedModule = (moduleId: string): boolean => {
  if (typeof window === 'undefined') return false;
  return getRatedModules().includes(moduleId);
};

// Helper function to handle API requests
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      credentials: 'include' // Important for cookies if using sessions
    });

    if (!response.ok) {
      let errorMessage = 'Request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If we can't parse the error JSON, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format: expected JSON');
    }

    const data = await response.json();
    
    // Check for API error response format
    if (data && data.success === false) {
      throw new Error(data.error || 'API request failed');
    }
    
    // Return the data property if it exists (our API wraps responses in { success: true, data: ... })
    return data.data !== undefined ? data.data : data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// API-based storage functions
export const getModules = async (): Promise<LecturerModule[]> => {
  try {
    const data = await apiRequest<LecturerModule[]>('/api/modules');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching modules:', error);
    return [];
  }
};

export const saveModule = async (module: Omit<LecturerModule, 'id' | 'created_at' | 'is_active'>): Promise<LecturerModule> => {
  try {
    return await apiRequest<LecturerModule>('/api/modules', {
      method: 'POST',
      body: JSON.stringify(module),
    });
  } catch (error) {
    console.error('Error saving module:', error);
    throw error;
  }
};

export const getRatings = async (lecturerModuleId?: string): Promise<Rating[]> => {
  try {
    const endpoint = lecturerModuleId 
      ? `/api/ratings?lecturerModuleId=${encodeURIComponent(lecturerModuleId)}`
      : '/api/ratings';
    
    const data = await apiRequest<Rating[]>(endpoint);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return [];
  }
};

export const saveRating = async (rating: Omit<Rating, 'id' | 'created_at'>): Promise<Rating> => {
  try {
    return await apiRequest<Rating>('/api/ratings', {
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

export const saveAdmin = (admin: Admin) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(admin));
};
