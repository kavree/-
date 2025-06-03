
import React from 'react';

export const APP_TITLE = "ติวสอบใบประกอบวิชาชีพครู 2568";

export const CATEGORIES = [
  "กฎหมายการศึกษา",
  "จรรยาบรรณครู",
  "หลักสูตรและการสอน",
  "นวัตกรรมและเทคโนโลยีทางการศึกษา",
  "การวัดและประเมินผลการศึกษา",
  "จิตวิทยาสำหรับครู",
  "ความเป็นครู",
];

export const DEFAULT_QUIZ_OPTIONS = [10, 20, 30]; 

// SVG Icons as React Components
export const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

export const QuizIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

export const AdminIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93s.844-.062 1.158-.442l.655-.713c.381-.414.964-.604 1.494-.468l.992.248c.53.132.888.634.826 1.164l-.094.796a1.123 1.123 0 00.398 1.06l.748.747c.403.404.538.981.363 1.478l-.248.992c-.135.53-.635.888-1.164.826l-.796-.094a1.125 1.125 0 00-1.06.398l-.747.748c-.404.403-.981.538-1.478.363l-.992-.248c-.53-.135-.888-.635-.826-1.164l.094-.796a1.125 1.125 0 00-.398-1.06l-.748-.747c-.403-.404-.538-.981-.363-1.478l.248-.992c.135.53.635.888 1.164.826l.796.094a1.125 1.125 0 001.06-.398l.747-.748c.404.403.981.538-1.478.363l-.992-.248c-.53-.135-.888-.635-.826-1.164l.094-.796A1.125 1.125 0 0012 5.175v-.218c0-.55-.45-1-1-1H9.75c-.55 0-1 .45-1 1v.218c0 .414-.218.796-.542.992l-.796.497c-.478.298-.627.912-.33 1.39l.497.796c.298.478.912.627 1.39.33l.796-.497A1.125 1.125 0 0010.343 3.94zM14.25 12a2.25 2.25 0 10-4.5 0 2.25 2.25 0 004.5 0z" />
  </svg>
);

export const AIGeneratorIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17.437 15.904 15.75 12l1.687-3.904L18.25 12zm1.5-1.5L21.75 12l-1.904.563.563 1.904L19.75 15l.563-1.904-1.904-.563.563-1.904 1.904.563z" />
  </svg>
);

export const PlusCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.242.078 3.223.226M5.27 5.79m14.456 0A51.655 51.655 0 0112 5.25c-2.676 0-5.216.354-7.624.962" />
  </svg>
);

export const PencilSquareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
</svg>
);

export const ArrowPathIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const LightBulbIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.354a12.059 12.059 0 01-4.5 0M15 11.25a3 3 0 11-6 0 3 3 0 016 0zm-3 4.5V14.25m0-3.375a6.01 6.01 0 00-1.5-.188m1.5.188a6.011 6.011 0 011.5-.188m-3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.354a12.059 12.059 0 01-4.5 0M9.75 15.75A3 3 0 017.5 18v-5.25a3 3 0 013-3h3a3 3 0 013 3V18a3 3 0 01-2.25-2.25M12 18.75a.375.375 0 11-1.085-1.085.375.375 0 011.085 1.085z" />
  </svg>
);

export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

export const ArrowDownTrayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const ArrowUpTrayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);


export const INITIAL_QUESTIONS_KEY = 'teacherExamInitialQuestionsLoaded';
export const MOCK_QUESTIONS = [
  {
    id: '1',
    category: 'จรรยาบรรณครู',
    question: 'ข้อใดกล่าวถูกต้องเกี่ยวกับหลักจรรยาบรรณของวิชาชีพครู?',
    choices: [
      'ครูสามารถรับของขวัญจากนักเรียนเพื่อแลกเกรดได้',
      'ครูควรคำนึงถึงผลประโยชน์ส่วนตัวก่อน',
      'ครูต้องยึดมั่นในความซื่อสัตย์และความยุติธรรม',
      'ครูไม่จำเป็นต้องเคารพผู้บริหาร'
    ],
    answer: 'ครูต้องยึดมั่นในความซื่อสัตย์และความยุติธรรม',
    explanation: 'จรรยาบรรณของวิชาชีพครูเน้นย้ำเรื่องความซื่อสัตย์ ความยุติธรรม และการยึดประโยชน์ของผู้เรียนเป็นสำคัญ'
  },
  {
    id: '2',
    category: 'กฎหมายการศึกษา',
    question: 'พระราชบัญญัติการศึกษาแห่งชาติ พ.ศ. 2542 แก้ไขเพิ่มเติม (ฉบับที่ 2) พ.ศ. 2545 กำหนดให้การจัดการศึกษาต้องเป็นไปเพื่อพัฒนาคนไทยให้เป็นมนุษย์ที่สมบูรณ์ทั้งด้านใดบ้าง?',
    choices: [
      'ร่างกาย สติปัญญา และอารมณ์',
      'ร่างกาย จิตใจ สติปัญญา ความรู้ และคุณธรรม',
      'สติปัญญา ความสามารถ และทักษะอาชีพ',
      'ความรู้ คุณธรรม และวัฒนธรรม'
    ],
    answer: 'ร่างกาย จิตใจ สติปัญญา ความรู้ และคุณธรรม',
    explanation: 'มาตรา 6 ของ พ.ร.บ. การศึกษาแห่งชาติฯ กำหนดให้การจัดการศึกษาต้องเป็นไปเพื่อพัฒนาคนไทยให้เป็นมนุษย์ที่สมบูรณ์ทั้งร่างกาย จิตใจ สติปัญญา ความรู้ และคุณธรรม มีจริยธรรมและวัฒนธรรมในการดำรงชีวิต สามารถอยู่ร่วมกับผู้อื่นได้อย่างมีความสุข'
  },
  {
    id: '3',
    category: 'หลักสูตรและการสอน',
    question: 'การสอนแบบใดที่เน้นให้ผู้เรียนสร้างความรู้ด้วยตนเองผ่านการลงมือปฏิบัติและการแก้ปัญหา?',
    choices: [
      'การสอนแบบบรรยาย',
      'การสอนแบบสาธิต',
      'การสอนแบบโครงงาน (Project-Based Learning)',
      'การสอนแบบท่องจำ'
    ],
    answer: 'การสอนแบบโครงงาน (Project-Based Learning)',
    explanation: 'การสอนแบบโครงงานเป็นแนวทางการจัดการเรียนรู้ที่เน้นผู้เรียนเป็นสำคัญ ให้ผู้เรียนได้เรียนรู้ผ่านการลงมือปฏิบัติจริง (Learning by Doing) และการแก้ปัญหาที่ซับซ้อน ซึ่งส่งเสริมการสร้างองค์ความรู้ด้วยตนเอง'
  }
];

export const CHOICE_LETTERS = ['ก', 'ข', 'ค', 'ง', 'จ', 'ฉ']; // Thai alphabet for choices
