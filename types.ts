
export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface Lesson {
  id: string;
  title: string;
  titleEn: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  icon: string;
}

export interface UserProgress {
  wordsLearned: number;
  lessonsCompleted: number;
  streak: number;
  activityData: { name: string; score: number }[];
}
