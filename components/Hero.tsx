
import React from 'react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden bg-white py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-right">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              تعلم الإنجليزية <span className="text-indigo-600">بذكاء</span> وسهولة
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              استخدم قوة الذكاء الاصطناعي لتطوير مهاراتك في المحادثة والقواعد. دروس مخصصة، إحصائيات دقيقة، ومدرب ذكي متاح لك 24/7.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
              <button 
                onClick={onStart}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg transition-all transform hover:scale-105"
              >
                ابدأ رحلتك الآن
              </button>
              <button className="inline-flex items-center justify-center px-8 py-3 border border-slate-300 text-base font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 md:text-lg shadow-sm">
                اكتشف الدروس
              </button>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-lg">
              <img
                className="rounded-2xl shadow-2xl ring-1 ring-slate-200 transform rotate-2 hover:rotate-0 transition-transform duration-500"
                src="https://picsum.photos/seed/learn-english/600/400"
                alt="English Learning"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">+500 كلمة جديدة</div>
                  <div className="text-xs text-slate-500">تم تعلمها اليوم</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
