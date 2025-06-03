
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../components/uiElements';
import { QuizIcon, AIGeneratorIcon, AdminIcon, APP_TITLE, LightBulbIcon } from '../constants'; // Added LightBulbIcon

interface HomePageProps {
  totalQuestions: number;
  passRate: number; 
}

const HomePage: React.FC<HomePageProps> = ({ totalQuestions, passRate }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <Card className="text-center bg-gradient-to-br from-blue-500 to-blue-600 shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-white">ยินดีต้อนรับสู่</h1>
        <p className="text-4xl sm:text-5xl font-bold mb-5 tracking-tight text-white">{APP_TITLE}!</p>
        <p className="text-md sm:text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          เตรียมตัวให้พร้อมสำหรับการสอบใบอนุญาตประกอบวิชาชีพครู ปี 2568 ด้วยคลังข้อสอบที่ครอบคลุม
          และเครื่องมือสร้างคำถามด้วย AI อัจฉริยะ!
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/quiz">
                <Button variant="primary" size="xl" className="w-full sm:w-auto bg-blue-700 text-white hover:bg-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105" leftIcon={<QuizIcon className="w-6 h-6"/>}>
                    เริ่มทำแบบทดสอบ
                </Button>
            </Link>
            <Link to="/ai-generator">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-blue-200 text-white hover:bg-blue-400 hover:bg-opacity-20 hover:text-white hover:border-white transform hover:scale-105" leftIcon={<AIGeneratorIcon className="w-5 h-5"/>}>
                    สร้างคำถามด้วย AI
                </Button>
            </Link>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <Card title="สถิติข้อสอบ" titleClassName="text-blue-600">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-slate-700 text-sm sm:text-base">ข้อสอบทั้งหมดในคลัง:</span>
              <span className="font-bold text-blue-600 text-xl sm:text-2xl">{totalQuestions} ข้อ</span>
            </div>
            {/* <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-slate-700 text-sm sm:text-base">อัตราการตอบถูก (เฉลี่ย):</span>
              <span className="font-bold text-green-600 text-xl sm:text-2xl">{passRate}%</span>
            </div> */}
            <p className="text-xs sm:text-sm text-slate-500 pt-2">
              คลังข้อสอบของเรามีการปรับปรุงและเพิ่มเติมอย่างสม่ำเสมอ เพื่อให้คุณได้ฝึกฝนกับเนื้อหาที่ทันสมัยที่สุด
            </p>
          </div>
        </Card>

        <Card title="ทางลัดสำคัญ" titleClassName="text-green-600" className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/quiz" className="block group">
              <div className="p-5 bg-green-50 rounded-lg hover:bg-green-100 transition-all duration-200 h-full flex flex-col justify-center items-center text-center transform group-hover:scale-105 group-hover:shadow-lg">
                <QuizIcon className="w-10 h-10 text-green-500 mb-2"/>
                <h3 className="font-semibold text-green-700 text-lg">ทำแบบทดสอบ</h3>
                <p className="text-sm text-green-600">ฝึกฝนกับข้อสอบจริง</p>
              </div>
            </Link>
            <Link to="/ai-generator" className="block group">
              <div className="p-5 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all duration-200 h-full flex flex-col justify-center items-center text-center transform group-hover:scale-105 group-hover:shadow-lg">
                <AIGeneratorIcon className="w-10 h-10 text-indigo-500 mb-2"/>
                <h3 className="font-semibold text-indigo-700 text-lg">สร้างคำถาม AI</h3>
                <p className="text-sm text-indigo-600">คำถามใหม่ไม่ซ้ำใคร</p>
              </div>
            </Link>
            <Link to="/admin" className="block group sm:col-span-2">
              <div className="p-5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all duration-200 h-full flex flex-col justify-center items-center text-center transform group-hover:scale-105 group-hover:shadow-lg">
                <AdminIcon className="w-10 h-10 text-slate-500 mb-2"/>
                <h3 className="font-semibold text-slate-700 text-lg">จัดการคลังข้อสอบ</h3>
                <p className="text-sm text-slate-600">เพิ่ม/แก้ไข/ลบ คำถามของคุณ</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>

      <Card title="เกี่ยวกับใบอนุญาตประกอบวิชาชีพครู" titleClassName="text-slate-700">
        <div className="prose prose-sm sm:prose-base max-w-none text-slate-700 leading-relaxed">
          <p>
            การสอบใบอนุญาตประกอบวิชาชีพครูเป็นขั้นตอนสำคัญสำหรับเส้นทางอาชีพครูในประเทศไทย 
            แอปพลิเคชันนี้ถูกสร้างขึ้นเพื่อเป็นผู้ช่วยมือหนึ่งของคุณในการเตรียมตัว ไม่ว่าจะเป็นการทบทวนเนื้อหาสำคัญ, 
            ฝึกทำข้อสอบจับเวลาเสมือนจริง, หรือแม้แต่การสร้างแนวคำถามใหม่ๆ ด้วยเทคโนโลยี AI ที่ทันสมัย 
            เพื่อให้คุณมีความพร้อมและความมั่นใจสูงสุดก่อนเข้าสู่สนามสอบจริง
          </p>
          <h4 className="font-semibold mt-4 mb-2 text-slate-700">สิ่งที่คุณจะได้รับ:</h4>
          <ul className="list-none p-0 m-0 space-y-2">
            <li className="flex items-start"><LightBulbIcon className="w-5 h-5 text-yellow-500 mr-2 mt-1 flex-shrink-0"/>ครอบคลุมเนื้อหาหลักที่ออกสอบอย่างครบถ้วน</li>
            <li className="flex items-start"><LightBulbIcon className="w-5 h-5 text-yellow-500 mr-2 mt-1 flex-shrink-0"/>ฝึกฝนด้วยข้อสอบหลากหลายหมวดหมู่ พร้อมเฉลยและคำอธิบาย</li>
            <li className="flex items-start"><LightBulbIcon className="w-5 h-5 text-yellow-500 mr-2 mt-1 flex-shrink-0"/>ประเมินความพร้อมและจุดที่ต้องพัฒนาของตนเอง</li>
            <li className="flex items-start"><LightBulbIcon className="w-5 h-5 text-yellow-500 mr-2 mt-1 flex-shrink-0"/>สัมผัสประสบการณ์การสร้างคำถามแบบใหม่ด้วย AI</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default HomePage;
