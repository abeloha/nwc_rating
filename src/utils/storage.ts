import { LecturerModule, Rating, Admin } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  MODULES: 'lecturer_modules',
  RATINGS: 'ratings',
  ADMIN: 'admin',
  RATED_MODULES: 'rated_modules'
};

// Initialize default admin and sample data
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.ADMIN)) {
    const admin: Admin = {
      id: uuidv4(),
      name: 'System Admin',
      email: 'admin@university.edu',
      password: 'admin123'
    };
    localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(admin));
  }

  if (!localStorage.getItem(STORAGE_KEYS.MODULES)) {
    const sampleModules: LecturerModule[] = [
      {
        id: uuidv4(),
        lecturer_name: 'Dr. Sarah Johnson',
        module_name: 'Advanced Mathematics',
        module_description: 'Calculus and Linear Algebra concepts',
        module_objectives: 'Master advanced mathematical concepts',
        email: 'sarah.johnson@uni.edu',
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: uuidv4(),
        lecturer_name: 'Prof. Michael Chen',
        module_name: 'Computer Science Fundamentals',
        module_description: 'Introduction to programming and algorithms',
        is_active: true,
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(sampleModules));
  }

  if (!localStorage.getItem(STORAGE_KEYS.RATINGS)) {
    localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify([]));
  }
};