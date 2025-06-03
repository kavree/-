
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { APP_TITLE, HomeIcon, QuizIcon, AdminIcon, AIGeneratorIcon } from './constants';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import AdminPage from './pages/AdminPage';
import AIGeneratorPage from './pages/AIGeneratorPage';
import { getQuestions } from './services/questionService';


const App: React.FC = () => {
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [passRate] = useState(75); 

  useEffect(() => {
    setTotalQuestions(getQuestions().length);
  }, []);

  const updateQuestionCount = () => {
    setTotalQuestions(getQuestions().length);
  };

  const navItems = [
    { path: "/", label: "หน้าแรก", icon: <HomeIcon className="w-5 h-5" /> },
    { path: "/quiz", label: "ทำแบบทดสอบ", icon: <QuizIcon className="w-5 h-5" /> },
    { path: "/ai-generator", label: "สร้างคำถาม AI", icon: <AIGeneratorIcon className="w-5 h-5" /> },
    { path: "/admin", label: "จัดการข้อสอบ", icon: <AdminIcon className="w-5 h-5" /> },
  ];

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-100">
        <header className="bg-blue-500 text-white shadow-lg sticky top-0 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <Link to="/" className="text-xl sm:text-2xl font-bold hover:text-blue-100 transition-colors">
                {APP_TITLE}
              </Link>
              <nav className="mt-2 sm:mt-0">
                <ul className="flex space-x-1 sm:space-x-2">
                  {navItems.map(item => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all hover:bg-blue-600 hover:shadow-md ${
                            isActive ? 'bg-blue-700 shadow-md scale-105' : 'hover:scale-105'
                          }`
                        }
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<HomePage totalQuestions={totalQuestions} passRate={passRate} />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/ai-generator" element={<AIGeneratorPage onQuestionAdded={updateQuestionCount} />} />
            <Route path="/admin" element={<AdminPage onQuestionsUpdated={updateQuestionCount} />} />
          </Routes>
        </main>

        <footer className="bg-slate-200 text-slate-700 text-sm p-6">
          <div className="container mx-auto text-center sm:text-left">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <h4 className="font-semibold mb-2">เกี่ยวกับ {APP_TITLE}</h4>
                <p className="text-slate-600">เครื่องมือเตรียมสอบใบอนุญาตครู พร้อมคลังข้อสอบและ AI ช่วยสร้างคำถาม</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">ลิงก์ด่วน</h4>
                <ul className="space-y-1">
                  <li><Link to="/quiz" className="hover:text-blue-600 transition-colors">เริ่มทำแบบทดสอบ</Link></li>
                  <li><Link to="/ai-generator" className="hover:text-blue-600 transition-colors">สร้างคำถาม AI</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">ติดต่อ/ข้อเสนอแนะ</h4>
                <ul className="space-y-1">
                  <li><a href="#" className="hover:text-blue-600 transition-colors">ทีมผู้พัฒนา (ตัวอย่าง)</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">รายงานปัญหา (ตัวอย่าง)</a></li>
                </ul>
              </div>
            </div>
            <hr className="border-slate-300 my-4"/>
            <p className="text-center text-slate-600">&copy; {new Date().getFullYear()} {APP_TITLE}. พัฒนาเพื่อการศึกษาไทย</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;