
import { Question } from '../types';
import { MOCK_QUESTIONS, INITIAL_QUESTIONS_KEY } from '../constants';

const QUESTIONS_STORAGE_KEY = 'teacherExamQuestions';

export const initializeMockQuestions = (): void => {
  if (!localStorage.getItem(INITIAL_QUESTIONS_KEY)) {
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(MOCK_QUESTIONS));
    localStorage.setItem(INITIAL_QUESTIONS_KEY, 'true');
  }
};

export const getQuestions = (): Question[] => {
  initializeMockQuestions(); // Ensure mock questions are loaded if it's the first time
  const questionsJson = localStorage.getItem(QUESTIONS_STORAGE_KEY);
  return questionsJson ? JSON.parse(questionsJson) : [];
};

export const addQuestion = (question: Omit<Question, 'id'>): Question => {
  const questions = getQuestions();
  const newQuestion: Question = {
    ...question,
    id: Date.now().toString(), // Simple unique ID
  };
  questions.push(newQuestion);
  localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
  return newQuestion;
};

export const updateQuestion = (id: string, updatedQuestionData: Partial<Omit<Question, 'id'>>): Question | null => {
  const questions = getQuestions();
  const questionIndex = questions.findIndex(q => q.id === id);
  if (questionIndex > -1) {
    questions[questionIndex] = { ...questions[questionIndex], ...updatedQuestionData };
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
    return questions[questionIndex];
  }
  return null;
};

export const deleteQuestion = (id: string): boolean => {
  let questions = getQuestions();
  const initialLength = questions.length;
  questions = questions.filter(q => q.id !== id);
  if (questions.length < initialLength) {
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
    return true;
  }
  return false;
};

export const getQuestionById = (id: string): Question | undefined => {
  return getQuestions().find(q => q.id === id);
};

export const getQuestionsByCategory = (category: string): Question[] => {
  return getQuestions().filter(q => q.category === category);
};

export const exportQuestions = (): string => {
  return JSON.stringify(getQuestions(), null, 2);
};

export const importQuestions = (jsonString: string): { success: boolean; message: string; count?: number } => {
  try {
    const importedQs = JSON.parse(jsonString) as Question[];
    if (!Array.isArray(importedQs)) {
      return { success: false, message: "ข้อมูลไม่ถูกต้อง: ต้องเป็นอาร์เรย์ของคำถาม" };
    }
    // Basic validation for each question structure
    for (const q of importedQs) {
        if (!q.question || !q.choices || !q.answer || !q.category || !q.explanation || !Array.isArray(q.choices) || q.choices.length === 0) {
            return { success: false, message: `ข้อมูลไม่ถูกต้อง: คำถาม '${q.question?.substring(0,20)}...' มีโครงสร้างไม่สมบูรณ์` };
        }
    }

    const currentQs = getQuestions();
    // Filter out duplicates based on question text, assign new IDs if not present
    const newQs = importedQs.filter(iq => !currentQs.some(cq => cq.question === iq.question))
                           .map(iq => ({...iq, id: iq.id || Date.now().toString() + Math.random().toString(36).substring(2,7) }));

    const updatedQs = [...currentQs, ...newQs];
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(updatedQs));
    return { success: true, message: `นำเข้าคำถามสำเร็จ ${newQs.length} ข้อ (ข้ามข้อที่ซ้ำ)`, count: newQs.length };
  } catch (error) {
    return { success: false, message: "เกิดข้อผิดพลาดในการประมวลผลไฟล์ JSON: " + (error instanceof Error ? error.message : String(error)) };
  }
};
