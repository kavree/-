
import React, { useState, useEffect } from 'react';
import { GeneratedQuestion } from '../types';
import { generateAIQuestionSuggestions } from '../services/geminiService';
import { addQuestion as addQuestionToBank } from '../services/questionService';
import { 
    CATEGORIES, AIGeneratorIcon, PlusCircleIcon, ArrowPathIcon,
    CheckCircleIcon, XCircleIcon, LightBulbIcon, CHOICE_LETTERS, ChevronRightIcon
} from '../constants';
import { Button, Card, LoadingSpinner, Select } from '../components/uiElements';

interface AIGeneratorPageProps {
  onQuestionAdded: () => void;
}

const AI_QUESTION_BATCH_SIZE = 10;

const AIGeneratorPage: React.FC<AIGeneratorPageProps> = ({ onQuestionAdded }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);
  
  const [aiBatchQuestions, setAiBatchQuestions] = useState<GeneratedQuestion[] | null>(null);
  const [currentBatchIndex, setCurrentBatchIndex] = useState<number>(0);
  const [batchQuestionAddedStatus, setBatchQuestionAddedStatus] = useState<boolean[]>([]);

  const [userSelectedAnswer, setUserSelectedAnswer] = useState<string | null>(null);
  const [isFeedbackShown, setIsFeedbackShown] = useState<boolean>(false);
  
  const [isLoadingBatch, setIsLoadingBatch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);


  const resetInteractionStates = () => {
    setUserSelectedAnswer(null);
    setIsFeedbackShown(false);
    setAddError(null);
  };

  const handleFetchAIBatchQuestions = async () => {
    setIsLoadingBatch(true);
    setError(null);
    setInfoMessage(null);
    setAiBatchQuestions(null);
    setCurrentBatchIndex(0);
    setBatchQuestionAddedStatus([]);
    resetInteractionStates();

    try {
      const questions = await generateAIQuestionSuggestions(selectedCategory, AI_QUESTION_BATCH_SIZE);
      if (questions.length > 0) {
        setAiBatchQuestions(questions);
        setBatchQuestionAddedStatus(new Array(questions.length).fill(false));
        if(questions.length < AI_QUESTION_BATCH_SIZE) {
            setInfoMessage(`AI สร้างคำถามได้ ${questions.length} ข้อ (น้อยกว่าที่ร้องขอ ${AI_QUESTION_BATCH_SIZE} ข้อ)`);
        }
      } else {
        setError(`AI ไม่สามารถสร้างคำถามสำหรับหมวดหมู่ "${selectedCategory}" ได้ในขณะนี้ โปรดลองใหม่อีกครั้งหรือเลือกหมวดหมู่อื่น`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "เกิดข้อผิดพลาดที่ไม่รู้จักในการสร้างคำถาม";
      setError(errorMessage.includes("API Key") || errorMessage.includes("API key not valid") 
        ? "ไม่สามารถเชื่อมต่อ AI ได้: API Key ไม่ถูกต้องหรือไม่ได้ตั้งค่า โปรดตรวจสอบการตั้งค่า API Key"
        : `เกิดข้อผิดพลาด: ${errorMessage}`);
    } finally {
      setIsLoadingBatch(false);
    }
  };

  const handleSelectChoice = (choice: string) => {
    if (isFeedbackShown) return;
    setUserSelectedAnswer(choice);
  };

  const handleCheckAnswer = () => {
    if (!userSelectedAnswer) return;
    setIsFeedbackShown(true);
  };

  const handleAddCurrentQuestionToBank = async () => {
    if (!aiBatchQuestions || batchQuestionAddedStatus[currentBatchIndex] || isLoadingBatch) return;
    
    const questionToAdd = aiBatchQuestions[currentBatchIndex];
    setAddError(null);
    const tempButtonId = `add-btn-${currentBatchIndex}`;
    const buttonElement = document.getElementById(tempButtonId);
    if(buttonElement) buttonElement.classList.add('opacity-50');


    try {
      addQuestionToBank({ ...questionToAdd, category: selectedCategory }); // Assume category is selectedCategory for AI questions
      const newAddedStatus = [...batchQuestionAddedStatus];
      newAddedStatus[currentBatchIndex] = true;
      setBatchQuestionAddedStatus(newAddedStatus);
      onQuestionAdded(); // Update total count in App.tsx
    } catch (err) {
      setAddError("เกิดข้อผิดพลาดในการเพิ่มคำถาม: " + (err instanceof Error ? err.message : String(err)) );
    } finally {
        if(buttonElement) buttonElement.classList.remove('opacity-50');
    }
  };

  const handleNextQuestionInBatch = () => {
    if (isLoadingBatch) return;
    if (aiBatchQuestions && currentBatchIndex < aiBatchQuestions.length - 1) {
      setCurrentBatchIndex(prevIndex => prevIndex + 1);
      resetInteractionStates();
    } else {
      // All questions in batch are done, prompt to generate a new batch
      setInfoMessage(`ครบ ${aiBatchQuestions?.length || 0} คำถามในชุดนี้แล้ว คลิกปุ่มด้านบนเพื่อสร้างชุดใหม่`);
      setAiBatchQuestions(null); // Clear current batch to hide question card
      resetInteractionStates();
    }
  };
  
  const currentAIQuestion = aiBatchQuestions ? aiBatchQuestions[currentBatchIndex] : null;
  const isCurrentQuestionAdded = currentAIQuestion ? batchQuestionAddedStatus[currentBatchIndex] : false;
  const isCorrect = currentAIQuestion && userSelectedAnswer === currentAIQuestion.answer;

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      <Card className="text-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl">
        <AIGeneratorIcon className="w-16 h-16 sm:w-20 sm:h-20 text-white opacity-80 mx-auto mb-4" />
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">สร้างและทดสอบคำถามกับ AI อัจฉริยะ</h1>
        <p className="text-sm sm:text-base text-indigo-100 mb-6 max-w-xl mx-auto">
          เลือกหมวดหมู่ให้ AI ช่วยสร้างชุดคำถาม (ครั้งละ {AI_QUESTION_BATCH_SIZE} ข้อ) จากนั้นลองตอบทีละข้อ
          หากคำถามน่าสนใจ สามารถเพิ่มเข้าคลังข้อสอบหลักของคุณได้ทันที!
        </p>
      </Card>

      <Card className="shadow-xl">
        <div className="space-y-5">
          <Select
            label="1. เลือกหมวดหมู่สำหรับสร้างคำถาม:"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            options={CATEGORIES.map(c => ({ value: c, label: c }))}
            disabled={isLoadingBatch}
            className="text-base"
          />
          <Button 
            onClick={handleFetchAIBatchQuestions} 
            disabled={isLoadingBatch} 
            className="w-full !py-3 text-lg" 
            variant="primary"
            leftIcon={isLoadingBatch ? <LoadingSpinner size="sm" color="border-white" className="mr-2"/> : aiBatchQuestions ? <ArrowPathIcon className="w-5 h-5"/> : <AIGeneratorIcon className="w-6 h-6"/>}
          >
            {isLoadingBatch ? "AI กำลังคิดคำถาม..." : (aiBatchQuestions ? "สร้างชุดคำถาม AI ใหม่" : `2. สร้างชุดคำถาม AI (${AI_QUESTION_BATCH_SIZE} ข้อ)`)}
          </Button>
        </div>
      </Card>

      {error && <Card className="bg-red-50 border-l-4 border-red-500 shadow-lg"><p className="text-red-700 font-semibold p-3 text-center">{error}</p></Card>}
      {infoMessage && !error && <Card className="bg-blue-50 border-l-4 border-blue-500 shadow-lg"><p className="text-blue-700 font-semibold p-3 text-center">{infoMessage}</p></Card>}
      
      {currentAIQuestion && !isLoadingBatch && (
        <Card 
            title={`คำถาม AI: ข้อ ${currentBatchIndex + 1} / ${aiBatchQuestions?.length || 0}`}
            titleClassName="text-indigo-600"
            className="shadow-2xl"
            action={ <span className="text-sm text-slate-500 font-medium">หมวดหมู่: {selectedCategory}</span> }
        >
           <div className="px-2 sm:px-4 pb-4">
                <p className="text-lg sm:text-xl font-semibold text-slate-800 mb-8 leading-relaxed">{currentAIQuestion.question}</p>
                
                <div className="space-y-3.5 mb-10">
                    {currentAIQuestion.choices.map((choice, index) => {
                    const isSelected = userSelectedAnswer === choice;
                    let choiceVariant: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' = 'outline';
                    let icon = null;
                    let customClasses = "w-full text-left justify-start !py-3.5 px-5 text-base items-center rounded-xl shadow-sm transition-all duration-200 ease-in-out transform hover:scale-[1.02]";

                    if (isFeedbackShown) {
                        customClasses += " cursor-not-allowed";
                        if (choice === currentAIQuestion.answer) {
                            choiceVariant = 'success';
                            icon = <CheckCircleIcon className="w-5 h-5" />;
                            customClasses += " ring-2 ring-green-300 !text-white";
                        } else if (isSelected && !isCorrect) {
                            choiceVariant = 'danger';
                            icon = <XCircleIcon className="w-5 h-5" />;
                            customClasses += " ring-2 ring-red-300 !text-white";
                        } else {
                            choiceVariant = 'secondary';
                            customClasses += " !bg-slate-100 !text-slate-500 opacity-80 hover:shadow-sm";
                        }
                    } else {
                        if (isSelected) {
                            choiceVariant = 'primary';
                            customClasses += " ring-2 ring-blue-300 !text-white shadow-lg scale-[1.02]";
                        } else {
                            choiceVariant = 'outline';
                            customClasses += " hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 hover:shadow-md";
                        }
                    }
                    
                    return (
                        <Button
                        key={index}
                        onClick={() => handleSelectChoice(choice)}
                        variant={choiceVariant}
                        className={customClasses}
                        disabled={isFeedbackShown || isLoadingBatch}
                        aria-pressed={!isFeedbackShown && isSelected}
                        leftIcon={icon}
                        >
                        <span className={`font-semibold mr-3 ${
                            isFeedbackShown 
                                ? (choice === currentAIQuestion.answer || (isSelected && !isCorrect) ? 'text-white' : 'text-slate-500') 
                                : (isSelected ? 'text-white' : 'text-slate-600')
                        }`}>
                            {CHOICE_LETTERS[index]}.
                        </span>
                        <span className={isFeedbackShown && choice !== currentAIQuestion.answer && !(isSelected && !isCorrect) ? 'text-slate-600' : '' }>{choice}</span>
                        </Button>
                    );
                    })}
                </div>

                {!isFeedbackShown && (
                    <Button 
                    onClick={handleCheckAnswer} 
                    disabled={!userSelectedAnswer || isLoadingBatch} 
                    className="w-full mb-4 !py-3 text-md"
                    variant="success"
                    >
                    ตรวจคำตอบ
                    </Button>
                )}

                {isFeedbackShown && (
                    <>
                    <div className={`p-5 rounded-xl mt-6 border-l-8 mb-10 shadow-lg ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                        <div className="flex items-center mb-2">
                        {isCorrect ? <CheckCircleIcon className="w-8 h-8 text-green-500 mr-3 flex-shrink-0" /> : <XCircleIcon className="w-8 h-8 text-red-500 mr-3 flex-shrink-0" />}
                        <h3 className={`text-2xl font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            {isCorrect ? "คำตอบถูกต้อง!" : "คำตอบไม่ถูกต้อง"}
                        </h3>
                        </div>
                        {!isCorrect && (
                            <p className="text-md text-slate-700 mt-1 pl-11">คำตอบที่ถูกต้องคือ: <strong className="text-green-700">{currentAIQuestion.answer}</strong></p>
                        )}
                        <div className="mt-3 pl-11">
                            <p className="text-md text-slate-700 flex items-start">
                                <LightBulbIcon className="w-6 h-6 text-yellow-500 mr-2.5 mt-0.5 flex-shrink-0" />
                                <div><strong className="font-semibold text-slate-800">คำอธิบาย:</strong> {currentAIQuestion.explanation}</div>
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-slate-200">
                        <Button 
                            id={`add-btn-${currentBatchIndex}`}
                            onClick={handleAddCurrentQuestionToBank} 
                            className="w-full sm:flex-1 !py-3 text-md" 
                            variant={isCurrentQuestionAdded ? 'success' : 'outline'}
                            disabled={isCurrentQuestionAdded || isLoadingBatch}
                            leftIcon={isCurrentQuestionAdded ? <CheckCircleIcon className="w-5 h-5"/> :<PlusCircleIcon className="w-5 h-5"/>}
                        >
                            {isCurrentQuestionAdded ? "เพิ่มเข้าคลังแล้ว" : "เพิ่มคำถามนี้เข้าคลัง"}
                        </Button>
                         <Button 
                            onClick={handleNextQuestionInBatch} 
                            disabled={isLoadingBatch} 
                            className="w-full sm:flex-1 !py-3 text-md" 
                            variant="primary"
                            rightIcon={<ChevronRightIcon className="w-5 h-5"/>}
                        >
                            {aiBatchQuestions && currentBatchIndex < aiBatchQuestions.length - 1 
                                ? `ไปข้อถัดไป (${currentBatchIndex + 2}/${aiBatchQuestions.length})`
                                : "สร้างชุดคำถาม AI ใหม่"}
                        </Button>
                    </div>
                    {addError && <p className="text-red-600 text-sm mt-3 text-center">{addError}</p>}
                    </>
                )}
           </div>
        </Card>
      )}
    </div>
  );
};

export default AIGeneratorPage;