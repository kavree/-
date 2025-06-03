
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question, QuizResult, QuizPageStep } from '../types';
import { getQuestions, getQuestionsByCategory } from '../services/questionService';
import { 
    CATEGORIES, DEFAULT_QUIZ_OPTIONS, QuizIcon, HomeIcon, ArrowPathIcon as TryAgainIcon,
    CheckCircleIcon, XCircleIcon, LightBulbIcon, ChevronLeftIcon, ChevronRightIcon, CHOICE_LETTERS
} from '../constants';
import { Button, Card, LoadingSpinner, Select } from '../components/uiElements';

const QuizPage: React.FC = () => {
  const [step, setStep] = useState<QuizPageStep>(QuizPageStep.Setup);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [feedbackVisibleForQuestionId, setFeedbackVisibleForQuestionId] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);
  const [selectedNumQuestions, setSelectedNumQuestions] = useState<number>(DEFAULT_QUIZ_OPTIONS[0]);

  const navigate = useNavigate();

  useEffect(() => {
    const questions = getQuestions();
    setAllQuestions(questions);
  }, []);

  useEffect(() => {
    if (step === QuizPageStep.InProgress && timeLeft === 0 && feedbackVisibleForQuestionId === null) {
      handleQuizEnd();
    }
  }, [timeLeft, step, feedbackVisibleForQuestionId]); 

  const startTimer = useCallback((duration: number) => {
    setTimeLeft(duration);
    if (timerId) clearInterval(timerId);
    const newTimerId = setInterval(() => {
      setTimeLeft(prevTime => (prevTime !== null && prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    setTimerId(newTimerId);
  }, [timerId]); 

  const stopTimer = useCallback(() => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  }, [timerId]);

  const handleStartQuiz = () => {
    let questionsToUse = selectedCategory === "ทั้งหมด"
      ? allQuestions
      : getQuestionsByCategory(selectedCategory);

    questionsToUse = [...questionsToUse].sort(() => Math.random() - 0.5);
    questionsToUse = questionsToUse.slice(0, selectedNumQuestions);

    if (questionsToUse.length === 0) {
      alert("ไม่มีคำถามในหมวดหมู่นี้หรือจำนวนที่เลือก");
      return;
    }

    setQuizQuestions(questionsToUse);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizResults([]);
    setFeedbackVisibleForQuestionId(null);
    setStep(QuizPageStep.InProgress);
    startTimer(questionsToUse.length * 60); 
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    if (feedbackVisibleForQuestionId === questionId) return; 
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleConfirmAnswer = () => {
    const currentQ = quizQuestions[currentQuestionIndex];
    if (!selectedAnswers[currentQ.id]) return; 

    const result: QuizResult = {
      question: currentQ,
      selectedAnswer: selectedAnswers[currentQ.id],
      isCorrect: selectedAnswers[currentQ.id] === currentQ.answer,
    };
    setQuizResults(prevResults => {
        const otherResults = prevResults.filter(r => r.question.id !== currentQ.id);
        return [...otherResults, result];
    });
    setFeedbackVisibleForQuestionId(currentQ.id);
  };

  const handleNextQuestion = () => {
    setFeedbackVisibleForQuestionId(null);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizEnd();
    }
  };

  const handlePrevQuestion = () => {
    setFeedbackVisibleForQuestionId(null);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuizEnd = useCallback(() => {
    stopTimer();
    const finalResults = quizQuestions.map(q => {
        const existingResult = quizResults.find(r => r.question.id === q.id);
        if (existingResult) return existingResult;
        
        const selectedAnswer = selectedAnswers[q.id] || "ไม่ได้ตอบ";
        return {
            question: q,
            selectedAnswer: selectedAnswer,
            isCorrect: selectedAnswer === q.answer,
        };
    });

    setQuizResults(finalResults);
    setStep(QuizPageStep.Results);
    setFeedbackVisibleForQuestionId(null); 
  }, [quizQuestions, selectedAnswers, quizResults, stopTimer]);


  const currentQuestion = quizQuestions[currentQuestionIndex];

  if (allQuestions.length === 0 && step === QuizPageStep.Setup) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  if (step === QuizPageStep.Setup) {
    return (
      <Card title="ตั้งค่าแบบทดสอบของคุณ" className="max-w-lg mx-auto animate-fadeIn" titleClassName="text-center text-blue-600">
        <div className="space-y-6 p-2">
          <Select
            label="เลือกหมวดหมู่คำถาม:"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            options={[{ value: "ทั้งหมด", label: "ทุกหมวดหมู่" }, ...CATEGORIES.map(c => ({ value: c, label: c }))]}
            className="text-base"
          />
          <Select
            label="เลือกจำนวนคำถาม:"
            value={selectedNumQuestions}
            onChange={e => setSelectedNumQuestions(parseInt(e.target.value))}
            options={DEFAULT_QUIZ_OPTIONS.map(n => ({ value: n, label: `${n} ข้อ` }))}
            className="text-base"
          />
          <Button onClick={handleStartQuiz} className="w-full !py-3" variant="primary" size="lg" leftIcon={<QuizIcon className="w-6 h-6"/>}>
            เริ่มทำแบบทดสอบ
          </Button>
        </div>
      </Card>
    );
  }

  if (step === QuizPageStep.InProgress && currentQuestion) {
    const isFeedbackVisible = feedbackVisibleForQuestionId === currentQuestion.id;
    const userAnswer = selectedAnswers[currentQuestion.id];
    const isCorrect = userAnswer === currentQuestion.answer;

    return (
      <Card className="max-w-3xl mx-auto shadow-2xl animate-fadeIn">
        <div className="mb-6 p-5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-xl text-white">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold">คำถามที่ {currentQuestionIndex + 1} <span className="font-normal opacity-80">/ {quizQuestions.length}</span></h2>
                {timeLeft !== null && (
                    <div className={`text-base sm:text-lg font-semibold px-3 py-1.5 rounded-md shadow-sm ${timeLeft <= 30 && timeLeft > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-blue-600'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 inline-block mr-1.5 align-text-bottom">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                    </svg>
                    เวลา: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
                    </div>
                )}
            </div>
            <p className="text-sm text-blue-100 mt-2">หมวดหมู่: {currentQuestion.category}</p>
        </div>
        
        <div className="px-5 sm:px-7 pb-7">
            <p className="text-lg sm:text-xl font-semibold text-slate-800 mb-8 leading-relaxed">{currentQuestion.question}</p>

            <div className="space-y-3.5 mb-10">
            {currentQuestion.choices.map((choice, index) => {
                const isSelected = userAnswer === choice;
                let choiceVariant: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' = 'outline';
                let icon = null;
                let customClasses = "w-full text-left justify-start !py-3.5 px-5 text-base items-center rounded-xl shadow-sm transition-all duration-200 ease-in-out transform hover:scale-[1.02]";

                if (isFeedbackVisible) {
                  customClasses += " cursor-not-allowed";
                  if (choice === currentQuestion.answer) {
                      choiceVariant = 'success'; // Solid green background
                      icon = <CheckCircleIcon className="w-5 h-5" />;
                      customClasses += " ring-2 ring-green-300 !text-white";
                  } else if (isSelected && !isCorrect) {
                      choiceVariant = 'danger'; // Solid red background
                      icon = <XCircleIcon className="w-5 h-5" />;
                      customClasses += " ring-2 ring-red-300 !text-white";
                  } else {
                      // Other non-selected, non-answer choices during feedback
                      choiceVariant = 'secondary';
                      customClasses += " !bg-slate-100 !text-slate-500 opacity-80 hover:shadow-sm";
                  }
                } else { // Not feedback visible
                  if (isSelected) {
                      choiceVariant = 'primary'; // Solid blue for selected
                      customClasses += " ring-2 ring-blue-300 !text-white shadow-lg scale-[1.02]";
                  } else {
                      choiceVariant = 'outline'; // Outline for others
                      customClasses += " hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 hover:shadow-md";
                  }
                }
                
                return (
                <Button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion.id, choice)}
                    variant={choiceVariant}
                    className={customClasses}
                    disabled={isFeedbackVisible}
                    aria-pressed={!isFeedbackVisible && isSelected}
                    leftIcon={icon}
                >
                    <span className={`font-semibold mr-3 ${
                        isFeedbackVisible 
                            ? (choice === currentQuestion.answer || (isSelected && !isCorrect) ? 'text-white' : 'text-slate-500') 
                            : (isSelected ? 'text-white' : 'text-slate-600')
                    }`}>
                    {CHOICE_LETTERS[index]}.
                    </span>
                    <span className={isFeedbackVisible && choice !== currentQuestion.answer && !(isSelected && !isCorrect) ? 'text-slate-600' : '' }>{choice}</span>
                </Button>
                );
            })}
            </div>

            {isFeedbackVisible && (
            <div className={`p-5 rounded-xl mt-6 border-l-8 mb-10 shadow-lg ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                <div className="flex items-center mb-2">
                {isCorrect ? <CheckCircleIcon className="w-8 h-8 text-green-500 mr-3 flex-shrink-0" /> : <XCircleIcon className="w-8 h-8 text-red-500 mr-3 flex-shrink-0" />}
                <h3 className={`text-2xl font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? "คำตอบถูกต้อง!" : "คำตอบไม่ถูกต้อง"}
                </h3>
                </div>
                {!isCorrect && (
                    <p className="text-md text-slate-700 mt-1 pl-11">คำตอบที่ถูกต้องคือ: <strong className="text-green-700">{currentQuestion.answer}</strong></p>
                )}
                <div className="mt-3 pl-11">
                    <p className="text-md text-slate-700 flex items-start">
                        <LightBulbIcon className="w-6 h-6 text-yellow-500 mr-2.5 mt-0.5 flex-shrink-0" />
                        <div><strong className="font-semibold text-slate-800">คำอธิบาย:</strong> {currentQuestion.explanation}</div>
                    </p>
                </div>
            </div>
            )}

            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between items-center mt-10 pt-6 border-t border-slate-200">
              <Button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0 || isFeedbackVisible} variant="outline" leftIcon={<ChevronLeftIcon className="w-5 h-5"/>} size="md">
                  ก่อนหน้า
              </Button>
            
              {!isFeedbackVisible ? (
                  <Button onClick={handleConfirmAnswer} disabled={!userAnswer} variant="success" size="lg">
                  ยืนยันคำตอบ
                  </Button>
              ) : (
                  <Button onClick={handleNextQuestion} variant="primary" size="lg" rightIcon={<ChevronRightIcon className="w-5 h-5"/>}>
                  {currentQuestionIndex === quizQuestions.length - 1 ? 'ดูสรุปผลการทดสอบ' : 'คำถามถัดไป'}
                  </Button>
              )}
            </div>
            { step === QuizPageStep.InProgress && (
                <Button onClick={handleQuizEnd} variant="danger" className="w-full mt-8 !py-2.5" size="sm">
                    สิ้นสุดการทดสอบ (ดูสรุปผลทันที)
                </Button>
            )}
        </div>
      </Card>
    );
  }

  if (step === QuizPageStep.Results) {
    const score = quizResults.filter(r => r.isCorrect).length;
    const percentage = quizQuestions.length > 0 ? Math.round((score / quizQuestions.length) * 100) : 0;
    return (
      <Card title="สรุปผลการทดสอบของคุณ" className="max-w-3xl mx-auto shadow-2xl animate-fadeIn" titleClassName="text-center text-blue-600">
        <div className="text-center mb-10 p-6 sm:p-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg">
          <h2 className="text-4xl sm:text-5xl font-bold">คุณได้ {score} / {quizQuestions.length} คะแนน</h2>
          <p className="text-5xl sm:text-6xl font-bold my-4">{percentage}%</p>
          <p className="text-xl sm:text-2xl mt-3 opacity-90">
            {percentage >= 70 ? "ยอดเยี่ยมมาก! คุณทำได้ดีทีเดียว 🎉" : percentage >=50 ? "เกือบแล้ว! พยายามอีกนิดนะ 👍" : "สู้ๆ! การฝึกฝนจะช่วยให้คุณเก่งขึ้น 💪"}
          </p>
        </div>

        <div className="space-y-6 mb-12">
          <h3 className="text-xl font-semibold text-slate-700 mb-3">รายละเอียดผลลัพธ์:</h3>
          {quizResults.map((result, index) => (
            <div 
                key={index} 
                className={`p-5 rounded-xl shadow-lg border-l-8 ${result.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'} transition-shadow duration-200`}
                aria-label={`ผลลัพธ์สำหรับคำถามที่ ${index + 1}`}
            >
                <div className="flex items-start">
                    <span className={`mr-3 text-lg font-bold ${result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>{index + 1}.</span>
                    <div className="flex-1">
                    <p className="font-semibold text-md sm:text-lg text-slate-800 mb-2">{result.question.question}</p>
                    <p className="text-sm sm:text-md mt-2">
                        <span className="font-medium text-slate-600">คำตอบของคุณ: </span>
                        <span className={`font-semibold ${result.isCorrect ? 'text-green-700' : 'text-red-700'}`}>{result.selectedAnswer}</span>
                        {result.isCorrect ?
                        <CheckCircleIcon className="w-5 h-5 inline-block ml-1.5 text-green-500 align-middle" /> :
                        <XCircleIcon className="w-5 h-5 inline-block ml-1.5 text-red-500 align-middle" />
                        }
                    </p>
                    {!result.isCorrect && (
                        <p className="text-sm sm:text-md mt-1">
                            <span className="font-medium text-slate-600">คำตอบที่ถูกต้อง: </span>
                            <strong className="text-green-700">{result.question.answer}</strong>
                        </p>
                    )}
                    <div className="text-xs sm:text-sm text-slate-600 mt-3 pt-3 border-t border-slate-200 flex items-start">
                        <LightBulbIcon className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div><strong className="font-semibold text-slate-700">คำอธิบาย:</strong> {result.question.explanation}</div>
                    </div>
                    </div>
                </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
          <Button onClick={() => {
            setStep(QuizPageStep.Setup);
            setCurrentQuestionIndex(0);
            setSelectedAnswers({});
            setQuizResults([]);
            setTimeLeft(null);
            stopTimer();
            setFeedbackVisibleForQuestionId(null); 
          }} variant="primary" size="lg" leftIcon={<TryAgainIcon className="w-5 h-5"/>}>
            ทำแบบทดสอบใหม่อีกครั้ง
          </Button>
          <Button onClick={() => navigate('/')} variant="outline" size="lg" leftIcon={<HomeIcon className="w-5 h-5"/>}>
            กลับไปหน้าแรก
          </Button>
        </div>
      </Card>
    );
  }

  return <div className="text-center text-slate-600 py-10">กำลังโหลดหน้าทดสอบ...</div>;
};

export default QuizPage;
