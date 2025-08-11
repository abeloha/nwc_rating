export interface LecturerModule {
  id: number;
  lecturer_name: string;
  module_name: string;
  module_description: string;
  module_objectives?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
}

export interface Rating {
  id: number;
  lecturer_module_id: number;
  criteria_1_score: number;
  criteria_2_score: number;
  criteria_3_score: number;
  criteria_4_score: number;
  criteria_5_score: number;
  remarks?: string;
  created_at: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  access_token: string;
}

export interface ModuleReport {
  module: LecturerModule;
  ratings: Rating[];
  averages: {
    criteria_1: number;
    criteria_2: number;
    criteria_3: number;
    criteria_4: number;
    criteria_5: number;
    overall: number;
  };
  totalRatings: number;
}

export const CRITERIA_LABELS = [
  "Relevance of the topic to the module objectives",
  "Content and quality of the lecturer",
  "Use of visual aids and other means of instruction",
  "Style of lecturer",
  "Overall assessment of lecturer"
];