export interface Teacher {
  id: string;
  name: string;
  currentEmotionId?: string;
  emotionIds?: string[];
  customNote?: string;
  updatedAt?: string;
}

export interface Emotion {
  id: string;
  emoji: string;
  title: string;
  description: string;
  category: 'positive' | 'exhausted' | 'funny' | 'realistic' | 'focused';
}

export interface SheetConfig {
  spreadsheetId: string | null;
  spreadsheetUrl: string | null;
  sheetName: string;
}

export interface LogItem {
  id: string;
  teacherName: string;
  emoji: string;
  emotionTitle: string;
  customNote?: string;
  time: string;
}
