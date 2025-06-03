
export interface Question {
  id: string;
  category: string;
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
}

export interface QuizResult {
  question: Question;
  selectedAnswer: string;
  isCorrect: boolean;
}

export enum QuizPageStep {
  Setup = "SETUP",
  InProgress = "IN_PROGRESS",
  Results = "RESULTS",
}

export interface GeneratedQuestion {
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
}
