
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Chatbot from './components/Chatbot';
import LessonsList from './components/LessonsList';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Hero onStart={() => setActiveTab('lessons')} />;
      case 'lessons':
        return <LessonsList />;
      case 'tutor':
        return (
          <div className="py-12 px-4">
            <h2 className="text-center text-3xl font-bold text-slate-900 mb-8">تدرب على المحادثة</h2>
            <Chatbot />
          </div>
        );
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Hero onStart={() => setActiveTab('lessons')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 pb-20">
        {renderContent()}
      </main>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-indigo-600 text-white p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-xl font-bold">إتقان الإنجليزية</span>
              </div>
              <p className="text-slate-400 max-w-md">
                منصتك الشاملة لتعلم اللغة الإنجليزية بأحدث التقنيات. نحن نؤمن بأن التعليم يجب أن يكون ممتعاً وتفاعلياً ومتاحاً للجميع.
              </p>
            </div>
            <div>
                <h4 className="font-bold mb-4">روابط سريعة</h4>
                <ul className="space-y-2 text-slate-400">
                    <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('home')}>الرئيسية</li>
                    <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('lessons')}>الدروس</li>
                    <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('tutor')}>المدرب الذكي</li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-4">تواصل معنا</h4>
                <p className="text-slate-400 text-sm">info@itqan-english.com</p>
                <div className="flex gap-4 mt-4">
                    <span className="bg-slate-800 p-2 rounded-full cursor-pointer hover:bg-slate-700">🐦</span>
                    <span className="bg-slate-800 p-2 rounded-full cursor-pointer hover:bg-slate-700">📘</span>
                    <span className="bg-slate-800 p-2 rounded-full cursor-pointer hover:bg-slate-700">📸</span>
                </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} إتقان الإنجليزية. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
