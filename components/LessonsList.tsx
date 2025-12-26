
import React, { useState, useMemo } from 'react';
import { Lesson } from '../types';
import { tutorService } from '../services/geminiService';

const LESSONS: Lesson[] = [
  { id: '1', title: 'أساسيات التحية', titleEn: 'Greetings Basics', level: 'Beginner', description: 'تعلم كيف تبدأ محادثة بسيطة وتلقي التحية.', icon: '👋' },
  { id: '2', title: 'الأفعال المساعدة', titleEn: 'Auxiliary Verbs', level: 'Intermediate', description: 'شرح مفصل لاستخدام do, be, have.', icon: '🛠️' },
  { id: '3', title: 'المحادثة في العمل', titleEn: 'Business English', level: 'Advanced', description: 'تطوير مهارات التواصل الاحترافي في بيئة العمل.', icon: '💼' },
  { id: '4', title: 'أدوات التعريف', titleEn: 'Articles (A, An, The)', level: 'Beginner', description: 'القواعد الأساسية لاستخدام أدوات التعريف والتنكير.', icon: '📚' },
  { id: '5', title: 'المستقبل البسيط', titleEn: 'Future Simple', level: 'Intermediate', description: 'كيف تتحدث عن خططك المستقبلية باستخدام will و going to.', icon: '🔮' },
  { id: '6', title: 'كتابة المقالات', titleEn: 'Essay Writing', level: 'Advanced', description: 'تقنيات متقدمة لكتابة نصوص أكاديمية منظمة.', icon: '✍️' },
];

const LessonsList: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLessons = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return LESSONS;
    
    return LESSONS.filter(lesson => 
      lesson.title.toLowerCase().includes(query) ||
      lesson.titleEn.toLowerCase().includes(query) ||
      lesson.level.toLowerCase().includes(query) ||
      (query === 'مبتدئ' && lesson.level === 'Beginner') ||
      (query === 'متوسط' && lesson.level === 'Intermediate') ||
      (query === 'متقدم' && lesson.level === 'Advanced')
    );
  }, [searchQuery]);

  const fetchExplanation = async (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setLoading(true);
    setExplanation('');
    const res = await tutorService.getLessonExplanation(lesson.titleEn);
    setExplanation(res);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">مكتبة الدروس</h2>
          <p className="text-slate-500">اختر درساً للبدء في رحلة التعلم الخاصة بك</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pr-10 pl-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
            placeholder="ابحث عن درس أو مستوى..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {filteredLessons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <div 
              key={lesson.id} 
              className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              onClick={() => fetchExplanation(lesson)}
            >
              <div className="bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                {lesson.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{lesson.title}</h3>
              <div className="font-en text-indigo-600 text-sm font-semibold mb-3 tracking-wide">{lesson.titleEn}</div>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed flex-grow">{lesson.description}</p>
              
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <span className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold shadow-sm ${
                  lesson.level === 'Beginner' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                  lesson.level === 'Intermediate' ? 'bg-sky-50 text-sky-600 border border-sky-100' :
                  'bg-violet-50 text-violet-600 border border-violet-100'
                }`}>
                  {lesson.level === 'Beginner' ? 'مبتدئ' : lesson.level === 'Intermediate' ? 'متوسط' : 'متقدم'}
                </span>
                <span className="text-indigo-600 font-bold text-sm flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                  عرض الدرس
                  <svg className="w-4 h-4 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">عذراً، لم نجد نتائج لـ "{searchQuery}"</h3>
          <p className="text-slate-500">حاول البحث بكلمات أخرى أو تصفح الأقسام الرئيسية</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-6 px-6 py-2 text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl transition-colors"
          >
            مسح البحث
          </button>
        </div>
      )}

      {selectedLesson && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300 border border-white/20">
            <div className="p-8 border-b border-slate-100 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <span className="text-3xl">{selectedLesson.icon}</span>
                   <h3 className="text-2xl font-black text-slate-900 leading-tight">{selectedLesson.title}</h3>
                </div>
                <p className="font-en text-slate-400 font-medium tracking-wide">{selectedLesson.titleEn}</p>
              </div>
              <button 
                onClick={() => setSelectedLesson(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 group-hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto bg-slate-50/50 flex-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-800 font-bold text-lg mb-1">ذكاء نوفا يعمل الآن...</p>
                    <p className="text-slate-500 text-sm">نقوم بتحليل الدرس وبناء أفضل شرح لك</p>
                  </div>
                </div>
              ) : (
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-en">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    {explanation ? (
                      <div className="whitespace-pre-wrap">{explanation}</div>
                    ) : (
                      <div className="text-red-500 font-bold text-center">حدث خطأ أثناء تحميل الشرح. يرجى المحاولة مرة أخرى.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-8 border-t border-slate-100 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between">
                <p className="text-xs text-slate-400 italic">تم إنشاء هذا الشرح بواسطة الذكاء الاصطناعي</p>
                <button 
                    onClick={() => setSelectedLesson(null)}
                    className="w-full sm:w-auto px-10 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-95"
                >
                    تم الاستيعاب
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonsList;
