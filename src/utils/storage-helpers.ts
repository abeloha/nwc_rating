import { LecturerModule, Rating, Admin } from '@/types';

const STORAGE_KEYS = {
  MODULES: 'lecturer_modules',
  RATINGS: 'ratings',
  ADMIN: 'admin',
  RATED_MODULES: 'rated_modules'
};

export const getModules = (): LecturerModule[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MODULES);
  return data ? JSON.parse(data) : [];
};

export const saveModules = (modules: LecturerModule[]) => {
  localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(modules));
};

export const getRatings = (): Rating[] => {
  const data = localStorage.getItem(STORAGE_KEYS.RATINGS);
  return data ? JSON.parse(data) : [];
};

export const saveRatings = (ratings: Rating[]) => {
  localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(ratings));
};

export const getAdmin = (): Admin | null => {
  const data = localStorage.getItem(STORAGE_KEYS.ADMIN);
  return data ? JSON.parse(data) : null;
};

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