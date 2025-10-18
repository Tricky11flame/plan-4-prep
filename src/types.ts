// src/types.ts

export interface Question {
  q: string;
  a: string;
}

export interface StudyMaterial {
  name: string;
  questions: Question[];
}

export interface TestSession {
  questions: Question[];
  currentIndex: number;
  mode: 'test' | 'course';
}

export interface NotificationState {
  message: string;
  type: 'error' | 'success' | 'info';
}