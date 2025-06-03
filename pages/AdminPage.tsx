
import React, { useState, useEffect, useCallback } from 'react';
import { Question } from '../types';
import * as QuestionService from '../services/questionService';
import { CATEGORIES, PlusCircleIcon, TrashIcon, PencilSquareIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, CHOICE_LETTERS } from '../constants'; 
import { Button, Card, Input, Select, Textarea, Modal, LoadingSpinner } from '../components/uiElements';

interface AdminPageProps {
  onQuestionsUpdated: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onQuestionsUpdated }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('ทั้งหมด');
  
  const [formState, setFormState] = useState<Partial<Question>>({
    category: CATEGORIES[0],
    question: '',
    choices: ['', '', '', ''],
    answer: '',
    explanation: ''
  });
  const [formError, setFormError] = useState<string | null>(null);

  const [importJson, setImportJson] = useState('');
  const [importStatus, setImportStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);


  const fetchQuestions = useCallback(() => {
    setIsLoading(true);
    const allQuestions = QuestionService.getQuestions();
    setQuestions(filterCategory === 'ทั้งหมด' ? allQuestions : allQuestions.filter(q => q.category === filterCategory));
    setIsLoading(false);
  }, [filterCategory]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleChoiceChange = (index: number, value: string) => {
    setFormState(prev => {
      const newChoices = [...(prev.choices || ['', '', '', ''])];
      newChoices[index] = value;
      return { ...prev, choices: newChoices };
    });
  };

  const validateForm = (): boolean => {
    if (!formState.question?.trim() || !formState.category || (formState.choices || []).some(c => !c.trim()) || !formState.answer?.trim() || !formState.explanation?.trim()) {
      setFormError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return false;
    }
    if (!(formState.choices || []).map(c => c.trim()).includes(formState.answer!.trim())) {
        setFormError("คำตอบที่ถูกต้องต้องเป็นหนึ่งในตัวเลือก (ตรวจสอบการตัดช่องว่าง)");
        return false;
    }
    setFormError(null);
    return true;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const processedFormState = {
        ...formState,
        choices: (formState.choices || []).map(c => c.trim()),
        answer: formState.answer?.trim(),
        question: formState.question?.trim(),
        explanation: formState.explanation?.trim(),
    };

    if (editingQuestion) {
      QuestionService.updateQuestion(editingQuestion.id, processedFormState);
    } else {
      QuestionService.addQuestion(processedFormState as Omit<Question, 'id'>);
    }
    fetchQuestions();
    onQuestionsUpdated();
    closeModal();
  };

  const openModalForNew = () => {
    setEditingQuestion(null);
    setFormState({ category: CATEGORIES[0], question: '', choices: ['', '', '', ''], answer: '', explanation: '' });
    setIsModalOpen(true);
    setFormError(null);
  };

  const openModalForEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormState({ ...question }); // Spread existing question data
    setIsModalOpen(true);
    setFormError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
    setFormError(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบคำถามนี้ออกจากคลังข้อสอบ? การกระทำนี้ไม่สามารถย้อนกลับได้")) {
      QuestionService.deleteQuestion(id);
      fetchQuestions();
      onQuestionsUpdated();
    }
  };
  
  const handleExport = () => {
    const jsonString = QuestionService.exportQuestions();
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `คลังข้อสอบ_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importJson.trim()) {
      setImportStatus({ message: 'กรุณาวางข้อมูล JSON ที่ต้องการนำเข้าในช่องด้านบน', type: 'error' });
      return;
    }
    setImportStatus(null); // Clear previous status
    try {
        const result = QuestionService.importQuestions(importJson);
        setImportStatus({ message: result.message, type: result.success ? 'success' : 'error' });
        if (result.success) {
          fetchQuestions();
          onQuestionsUpdated();
          setImportJson(''); 
        }
    } catch (e) {
        setImportStatus({ message: 'ไฟล์ JSON ไม่ถูกต้องหรือมีข้อผิดพลาดร้ายแรง: ' + (e instanceof Error ? e.message : String(e)), type: 'error' });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      <Card title="จัดการคลังข้อสอบทั้งหมด" titleClassName="text-blue-600">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="w-full sm:w-auto sm:flex-1">
            <Select
              label="กรองตามหมวดหมู่:"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              options={[{ value: 'ทั้งหมด', label: 'ทุกหมวดหมู่' }, ...CATEGORIES.map(c => ({ value: c, label: c }))]}
            />
          </div>
          <Button onClick={openModalForNew} leftIcon={<PlusCircleIcon className="w-5 h-5"/>} variant="primary" size="md" className="w-full sm:w-auto">
            เพิ่มคำถามใหม่
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-60"><LoadingSpinner size="lg" /></div>
        ) : questions.length === 0 ? (
          <div className="text-center text-slate-500 py-12 bg-slate-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-400 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            <p className="text-lg font-semibold">ไม่พบคำถาม</p>
            <p className="text-sm">{filterCategory === 'ทั้งหมด' ? 'ยังไม่มีคำถามในระบบ' : `ไม่มีคำถามในหมวดหมู่ "${filterCategory}"`}</p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th scope="col" className="px-5 py-3.5 text-left text-sm font-semibold text-slate-700">ลำดับ</th>
                  <th scope="col" className="px-5 py-3.5 text-left text-sm font-semibold text-slate-700">คำถาม (ตัวอย่าง)</th>
                  <th scope="col" className="px-5 py-3.5 text-left text-sm font-semibold text-slate-700">หมวดหมู่</th>
                  <th scope="col" className="px-5 py-3.5 text-center text-sm font-semibold text-slate-700">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {questions.map((q, index) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-500">{index + 1}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-800 font-medium max-w-xs sm:max-w-sm md:max-w-md truncate" title={q.question}>{q.question}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-600">{q.category}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                      <Button onClick={() => openModalForEdit(q)} variant="outline" size="sm" leftIcon={<PencilSquareIcon className="w-4 h-4"/>} className="text-yellow-600 border-yellow-400 hover:bg-yellow-50">
                        แก้ไข
                      </Button>
                      <Button onClick={() => handleDelete(q.id)} variant="outline" size="sm" leftIcon={<TrashIcon className="w-4 h-4"/>} className="text-red-600 border-red-400 hover:bg-red-50">
                        ลบ
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
        <Card title="นำเข้าชุดคำถาม (Import)" titleClassName="text-green-600">
          <Textarea
            label="วางข้อมูล JSON สำหรับคำถามที่นี่:"
            value={importJson}
            onChange={(e) => { setImportJson(e.target.value); setImportStatus(null); }}
            rows={8}
            placeholder='[{"question": "เนื้อหาคำถาม...", "choices": ["ตัวเลือก ก", "ตัวเลือก ข", ...], "answer": "ตัวเลือกที่เป็นคำตอบ", "category": "ชื่อหมวดหมู่", "explanation": "คำอธิบาย..."}, ...]'
            className="text-xs leading-relaxed tracking-wide"
          />
          <Button onClick={handleImport} className="mt-4 w-full !py-2.5" variant="success" leftIcon={<ArrowUpTrayIcon className="w-5 h-5"/>}>
            นำเข้าข้อมูล JSON
          </Button>
          {importStatus && (
            <p className={`mt-3 text-sm p-3 rounded-md ${importStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {importStatus.message}
            </p>
          )}
           <p className="text-xs text-slate-500 mt-3">หมายเหตุ: ระบบจะข้ามการนำเข้าคำถามที่มีเนื้อหาซ้ำกับที่มีอยู่แล้วในคลัง</p>
        </Card>
        <Card title="ส่งออกชุดคำถาม (Export)" titleClassName="text-purple-600">
          <p className="text-slate-600 mb-4">
            สำรองข้อมูลคลังคำถามทั้งหมดของคุณ หรือนำไปใช้ที่อื่นได้ง่ายๆ โดยการส่งออกเป็นไฟล์ JSON
          </p>
          <Button onClick={handleExport} className="w-full !py-2.5" variant="secondary" leftIcon={<ArrowDownTrayIcon className="w-5 h-5"/>} style={{backgroundColor: '#E9D5FF', color: '#5B21B6', borderColor: '#C4B5FD'}} >
            ส่งออกเป็นไฟล์ JSON ทั้งหมด
          </Button>
           <p className="text-xs text-slate-500 mt-3">ไฟล์ที่ได้จะมีชื่อว่า <code className="bg-slate-200 px-1 rounded">คลังข้อสอบ_YYYY-MM-DD.json</code></p>
        </Card>
      </div>


      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingQuestion ? "แก้ไขรายละเอียดคำถาม" : "เพิ่มคำถามใหม่เข้าคลัง"} size="xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="คำถาม:" name="question" value={formState.question || ''} onChange={handleInputChange} required />
          <Select label="หมวดหมู่:" name="category" value={formState.category || ''} onChange={handleInputChange} options={CATEGORIES.map(c => ({ value: c, label: c }))} required />
          {(formState.choices || ['', '', '', '']).map((choice, index) => (
            <Input 
                key={index} 
                label={`ตัวเลือกที่ ${CHOICE_LETTERS[index] || index + 1}:`} 
                value={choice} 
                onChange={e => handleChoiceChange(index, e.target.value)} 
                required 
            />
          ))}
          <Input 
            label="คำตอบที่ถูกต้อง (พิมพ์เนื้อหาของตัวเลือกที่ถูกต้อง):" 
            name="answer" 
            value={formState.answer || ''} 
            onChange={handleInputChange} 
            required 
            placeholder="เช่น พิมพ์เนื้อหาของตัวเลือก ก. ที่ถูกต้องตรงนี้"
          />
          <Textarea label="คำอธิบายเฉลย:" name="explanation" value={formState.explanation || ''} onChange={handleInputChange} required />
          
          {formError && <p className="text-red-600 text-sm font-semibold bg-red-50 p-3 rounded-md">{formError}</p>}
          
          </form>
          {/* Footer for modal is passed as prop */}
      </Modal>
      {/* Manually pass footer to Modal due to form being inside Modal's children */}
      {isModalOpen && (
        <div data-modal-footer className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-slate-200 mt-6">
             <Button type="button" variant="outline" onClick={closeModal} className="w-full sm:w-auto">ยกเลิก</Button>
             <Button 
                type="button" 
                variant="primary" 
                onClick={(e) => {
                    // Create a dummy form event
                    const form = document.querySelector('form'); // Assuming only one form in modal
                    if (form) {
                        const event = new Event('submit', { bubbles: true, cancelable: true });
                        form.dispatchEvent(event);
                    }
                }}
                className="w-full sm:w-auto"
            >
                {editingQuestion ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มคำถามเข้าคลัง"}
            </Button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
