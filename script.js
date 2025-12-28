// Navigation Tab Handling
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const homeSection = document.querySelector('.hero-section');
    const lessonsSection = document.querySelector('.lessons-section');
    const quizMainSection = document.querySelector('.quiz-main-section');
    const lessonViewer = document.getElementById('lesson-viewer');
    const unitsSection = document.getElementById('units-section');
    const readingSection = document.getElementById('reading-section');
    
    // Router for Tabs
    const handleTabRouting = () => {
        let hash = window.location.hash || '#home';
        
        // Map sub-sections to main tabs
        if (hash.startsWith('#lesson-') || hash === '#units-section' || hash === '#reading-section') {
            hash = '#lessons';
        }

        if (['#home', '#lessons', '#quiz'].includes(hash)) {
            tabs.forEach(t => t.classList.remove('active'));
            
            const activeTab = document.querySelector(`.tab[href="${hash}"]`);
            if (activeTab) activeTab.classList.add('active');

            // Hide all sections
            if (homeSection) homeSection.style.display = 'none';
            if (lessonsSection) lessonsSection.style.display = 'none';
            if (quizMainSection) quizMainSection.style.display = 'none';
            if (lessonViewer) lessonViewer.style.display = 'none';
            if (unitsSection) unitsSection.style.display = 'none';
            if (readingSection) readingSection.style.display = 'none';

            if (hash === '#home') {
                if (homeSection) homeSection.style.display = 'grid';
            } else if (hash === '#lessons') {
                if (lessonsSection) lessonsSection.style.display = 'block';
            } else if (hash === '#quiz') {
                if (quizMainSection) quizMainSection.style.display = 'block';
            }
        }
    };

    window.addEventListener('hashchange', handleTabRouting);
    window.addEventListener('load', handleTabRouting);

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = tab.getAttribute('href');
        });
    });

    // Set first tab as active by default
    if (tabs.length > 0) {
        tabs[0].classList.add('active');
        if (lessonsSection) lessonsSection.style.display = 'none';
        if (quizMainSection) quizMainSection.style.display = 'none';
    }
});

// Button Click Handlers
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Add feedback on click
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
            
            // Log which button was clicked (for development)
            console.log('Button clicked:', button.textContent);
        });
    });
});

// Handle Discover Lessons & Start Journey Buttons
document.addEventListener('DOMContentLoaded', () => {
    const discoverBtn = document.getElementById('discover-btn');
    const startJourneyBtn = document.getElementById('start-journey-btn');
    const lessonsTab = document.querySelector('a[href="#lessons"]');
    
    const navigateToLessons = () => {
        if (lessonsTab) {
            lessonsTab.click();
            const lessonsSection = document.getElementById('lessons');
            if (lessonsSection) {
                lessonsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    if (discoverBtn) discoverBtn.addEventListener('click', navigateToLessons);
    if (startJourneyBtn) startJourneyBtn.addEventListener('click', navigateToLessons);
});

// Search Functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('lesson-search');
    const lessonCards = document.querySelectorAll('.lesson-card');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            lessonCards.forEach(card => {
                const lessonName = card.querySelector('.lesson-name').textContent.toLowerCase();
                const lessonNameEn = card.querySelector('.lesson-name-en').textContent.toLowerCase();
                const lessonDesc = card.querySelector('.lesson-desc').textContent.toLowerCase();
                const lessonLevel = card.querySelector('.lesson-level').textContent.toLowerCase();

                if (lessonName.includes(searchTerm) || 
                    lessonNameEn.includes(searchTerm) || 
                    lessonDesc.includes(searchTerm) ||
                    lessonLevel.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});

// Filter Functionality
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const lessonCards = document.querySelectorAll('.lesson-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            lessonCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// Lesson Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const lessonViewer = document.getElementById('lesson-viewer');
    const closeBtn = document.getElementById('close-lesson-btn');
    const lessonCards = document.querySelectorAll('.lesson-card:not(.collection-card)');
    
    // Modal Elements
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalDesc = document.getElementById('modal-desc');
    const modalLevel = document.getElementById('modal-level');
    const modalIcon = document.getElementById('modal-icon');
    const modalPoints = document.getElementById('modal-points');

    // New Elements for Active Lesson View
    const summaryView = document.getElementById('modal-summary-view');
    const activeView = document.getElementById('modal-active-lesson-view');
    const startLessonBtn = document.getElementById('start-lesson-btn');
    const backToSummaryBtn = document.getElementById('back-to-summary');
    const activeLessonContent = document.getElementById('active-lesson-content');
    let currentLessonName = '';
    let previousSectionId = 'lessons';

    // Quiz Elements
    const showQuizBtn = document.getElementById('show-quiz-btn');
    const quizSection = document.getElementById('quiz-section');
    const quizContainer = document.getElementById('quiz-container');
    const submitQuizBtn = document.getElementById('submit-quiz-btn');
    const quizResult = document.getElementById('quiz-result');

    // Mock data for lesson content
    const lessonContentData = {
        en: {
            'business': ['Meeting Terminology', 'Formal Email Writing', 'Negotiating in English'],
            'auxiliary': ['Using Do/Does', 'Difference between Have/Has', 'Verb to Be'],
            'greetings': ['Formal & Informal Greetings', 'Self Introduction', 'Asking "How are you?"'],
            'essay': ['Essay Structure', 'Linking Words', 'Writing Conclusions'],
            'future': ['Using Will', 'Using Going to', 'Predictions and Plans'],
            'articles': ['When to use The', 'Difference between A and An', 'Zero Article cases'],
            'past': ['Regular Verbs (-ed)', 'Irregular Verbs', 'Past Time Markers'],
            'travel': ['At the Airport', 'Hotel Booking', 'Asking for Directions'],
            'phrasal': ['Movement Verbs', 'Change Verbs', 'Emotion Verbs'],
            'writing_mastery': ['Paragraph Structure', 'Linking Words', 'Full Essay Construction'],
            'sentence_structure': ['Word Order (SVO)', 'Compound Sentences', 'Complex Sentences'],
            'dialogue_pro': ['Smart Replies', 'Diplomatic Language', 'Leading Conversations'],
            'idioms': ['Common Daily Idioms', 'Business Idioms', 'Advanced Expressions'],
            'public_speaking': ['Body Language', 'Speech Structure', 'Persuasion Techniques'],
            'reading_ai': ['What is AI?', 'How AI Works', 'Future & Ethics'],
            'unit_zoo': ['Zoo Animals Vocabulary', 'Adjectives for Animals', 'Nature & Conservation'],
            'unit_tech': ['Devices Vocabulary', 'Online Actions', 'Advanced Tech Terms'],
            'unit_env': ['Nature Vocabulary', 'Pollution Terms', 'Climate Concepts'],
            'unit_health': ['Body Parts Vocabulary', 'Symptoms & Sickness', 'Health & Lifestyle']
        },
        ar: {
            'business': ['مصطلحات الاجتماعات', 'كتابة البريد الإلكتروني الرسمي', 'التفاوض بالإنجليزية'],
            'auxiliary': ['استخدام Do/Does', 'الفرق بين Have/Has', 'أفعال الكينونة Verb to Be'],
            'greetings': ['التحية الرسمية وغير الرسمية', 'التعريف بالنفس', 'السؤال عن الحال'],
            'essay': ['هيكلة المقال', 'أدوات الربط', 'كتابة الخاتمة'],
            'future': ['استخدام Will', 'استخدام Going to', 'التنبؤات والخطط'],
            'articles': ['متى نستخدم The', 'الفرق بين A و An', 'الحالات التي لا نستخدم فيها أدوات'],
            'past': ['الأفعال المنتظمة (-ed)', 'الأفعال الشاذة', 'الكلمات الدالة على الماضي'],
            'travel': ['في المطار', 'حجز الفندق', 'طلب الاتجاهات'],
            'phrasal': ['أفعال الحركة', 'أفعال التغيير', 'أفعال المشاعر'],
            'writing_mastery': ['هيكل الفقرة', 'أدوات الربط', 'بناء الموضوع الكامل'],
            'sentence_structure': ['ترتيب الكلمات', 'الجمل المركبة', 'الجمل المعقدة'],
            'dialogue_pro': ['الردود الذكية', 'اللغة الدبلوماسية', 'إدارة المحادثات'],
            'idioms': ['أمثال يومية', 'مصطلحات العمل', 'تعبيرات متقدمة'],
            'public_speaking': ['لغة الجسد', 'هيكل الخطاب', 'تقنيات الإقناع'],
            'reading_ai': ['ما هو الذكاء الاصطناعي؟', 'كيف يعمل؟', 'المستقبل والأخلاقيات'],
            'unit_zoo': ['مفردات حديقة الحيوان', 'صفات الحيوانات', 'الطبيعة والحفاظ عليها'],
            'unit_tech': ['مفردات الأجهزة', 'أفعال الإنترنت', 'مصطلحات تقنية'],
            'unit_env': ['مفردات الطبيعة', 'مصطلحات التلوث', 'مفاهيم المناخ'],
            'unit_health': ['مفردات أجزاء الجسم', 'الأعراض والمرض', 'الصحة ونمط الحياة']
        }
    };

    // Detailed Content Data by Level
    const fullLessonContent = {
        en: {
            'business': '<div class="lesson-text"><h3>Professional Business Communication</h3><p>This lesson covers essential vocabulary, formal greetings, email etiquette, and negotiation skills.</p><h4>Key Vocabulary</h4><table style="width:100%; border-collapse: collapse; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);"><thead><tr style="background-color: #007bff; color: white;"><th style="padding: 10px; border: 1px solid #dee2e6;">Word</th><th style="padding: 10px; border: 1px solid #dee2e6;">Meaning (العربية)</th></tr></thead><tbody><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Colleague</td><td style="padding: 8px; border: 1px solid #dee2e6;">زميل عمل</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Agenda</td><td style="padding: 8px; border: 1px solid #dee2e6;">جدول أعمال</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Proposal</td><td style="padding: 8px; border: 1px solid #dee2e6;">اقتراح / عرض</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Deadline</td><td style="padding: 8px; border: 1px solid #dee2e6;">موعد نهائي</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Stakeholder</td><td style="padding: 8px; border: 1px solid #dee2e6;">صاحب مصلحة</td></tr></tbody></table><h4>Email Etiquette</h4><p>Writing professional emails is a crucial skill.</p><ul><li><strong>Subject Line:</strong> Be clear and concise. E.g., "Meeting Follow-up: Project X"</li><li><strong>Salutation:</strong> Use "Dear Mr./Ms. [Last Name]," for formal emails.</li><li><strong>Closing:</strong> Use "Sincerely," or "Best regards,".</li></ul><h4>Negotiation Phrases</h4><ul><li>"I see your point, however, we must consider the budget."</li><li>"We are willing to compromise on the delivery date if the price is lowered."</li><li>"Let\'s find a middle ground."</li></ul></div>',
            'auxiliary': '<div class="lesson-text"><h3>Understanding Auxiliary Verbs</h3><p>Auxiliary (helper) verbs are used with main verbs to show tense, mood, or voice.</p><h4>Main Auxiliaries</h4><table style="width:100%; border-collapse: collapse; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);"><thead><tr style="background-color: #007bff; color: white;"><th style="padding: 10px; border: 1px solid #dee2e6;">Verb</th><th style="padding: 10px; border: 1px solid #dee2e6;">Usage</th></tr></thead><tbody><tr><td style="padding: 8px; border: 1px solid #dee2e6;">To Be (am, is, are)</td><td style="padding: 8px; border: 1px solid #dee2e6;">Continuous tenses & Passive voice</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">To Do (do, does, did)</td><td style="padding: 8px; border: 1px solid #dee2e6;">Questions & Negatives</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">To Have (have, has, had)</td><td style="padding: 8px; border: 1px solid #dee2e6;">Perfect tenses</td></tr></tbody></table><h4>Modal Auxiliaries</h4><p>Modals express ability, permission, or possibility.</p><ul><li><strong>Can/Could:</strong> "I <strong>can</strong> speak English. <strong>Could</strong> you help me?"</li><li><strong>Will/Would:</strong> "I <strong>will</strong> call you. I <strong>would</strong> like a coffee."</li><li><strong>Must/Should:</strong> "You <strong>must</strong> stop. You <strong>should</strong> see a doctor."</li></ul></div>',
            'greetings': '<div class="lesson-text"><h3>Fundamentals of Greetings</h3><p>Learn how to greet, introduce yourself, and say goodbye in English.</p><h4>Vocabulary Table</h4><table style="width:100%; border-collapse: collapse; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);"><thead><tr style="background-color: #007bff; color: white;"><th style="padding: 10px; border: 1px solid #dee2e6;">Phrase</th><th style="padding: 10px; border: 1px solid #dee2e6;">Meaning (العربية)</th></tr></thead><tbody><tr><td style="padding: 8px; border: 1px solid #dee2e6;">What\'s up?</td><td style="padding: 8px; border: 1px solid #dee2e6;">ما الجديد؟ (عامية)</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">How\'s it going?</td><td style="padding: 8px; border: 1px solid #dee2e6;">كيف الحال؟ (شائعة)</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Take care</td><td style="padding: 8px; border: 1px solid #dee2e6;">اعتنِ بنفسك (وداع)</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">See you later</td><td style="padding: 8px; border: 1px solid #dee2e6;">أراك لاحقاً</td></tr></tbody></table><h4>Introductions</h4><p>When you meet someone for the first time:</p><ul><li>"Nice to meet you."</li><li>"What do you do?" (Asking about their job)</li></ul><h4>Saying Goodbye (Farewells)</h4><ul><li><strong>Formal:</strong> "Goodbye.", "It was a pleasure meeting you."</li><li><strong>Informal:</strong> "Bye!", "See ya!", "Later!"</li></ul></div>',
            'unit_zoo': '<div class="lesson-text"><h3>Unit 1: At the Zoo</h3><p>Learn about animals, their classifications, and actions.</p><h4>Animal Vocabulary</h4><table style="width:100%; border-collapse: collapse; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);"><thead><tr style="background-color: #007bff; color: white;"><th style="padding: 10px; border: 1px solid #dee2e6;">Word</th><th style="padding: 10px; border: 1px solid #dee2e6;">Meaning (العربية)</th></tr></thead><tbody><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Lion</td><td style="padding: 8px; border: 1px solid #dee2e6;">أسد</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Elephant</td><td style="padding: 8px; border: 1px solid #dee2e6;">فيل</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Penguin</td><td style="padding: 8px; border: 1px solid #dee2e6;">بطريق</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Kangaroo</td><td style="padding: 8px; border: 1px solid #dee2e6;">كنغر</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Habitat</td><td style="padding: 8px; border: 1px solid #dee2e6;">موطن طبيعي</td></tr></tbody></table><h4>Animal Actions</h4><p>Verbs related to what animals do.</p><ul><li>Lions <strong>roar</strong>.</li><li>Monkeys <strong>climb</strong> trees.</li><li>Penguins <strong>waddle</strong> and <strong>swim</strong>.</li><li>Kangaroos <strong>hop</strong>.</li></ul><h4>Classifications</h4><ul><li><strong>Herbivore:</strong> Eats only plants (e.g., Elephant).</li><li><strong>Carnivore:</strong> Eats only meat (e.g., Lion).</li><li><strong>Omnivore:</strong> Eats both plants and meat (e.g., Bear).</li></ul></div>',
            'unit_tech': '<div class="lesson-text"><h3>Unit 2: Technology</h3><p>Vocabulary for the digital world.</p><h4>Tech Terms</h4><table style="width:100%; border-collapse: collapse; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);"><thead><tr style="background-color: #007bff; color: white;"><th style="padding: 10px; border: 1px solid #dee2e6;">Word</th><th style="padding: 10px; border: 1px solid #dee2e6;">Meaning (العربية)</th></tr></thead><tbody><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Algorithm</td><td style="padding: 8px; border: 1px solid #dee2e6;">خوارزمية</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Cloud Computing</td><td style="padding: 8px; border: 1px solid #dee2e6;">الحوسبة السحابية</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Bandwidth</td><td style="padding: 8px; border: 1px solid #dee2e6;">عرض النطاق</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">User Interface (UI)</td><td style="padding: 8px; border: 1px solid #dee2e6;">واجهة المستخدم</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Database</td><td style="padding: 8px; border: 1px solid #dee2e6;">قاعدة بيانات</td></tr></tbody></table><h4>Example Sentences</h4><ul><li>"Social media sites use an <strong>algorithm</strong> to show you content."</li><li>"I store my photos in the <strong>cloud</strong> so I can access them anywhere."</li><li>"A good <strong>UI</strong> makes an app easy to use."</li></ul></div>',
            'unit_env': '<div class="lesson-text"><h3>Unit 3: Environment</h3><p>Learn key terms about protecting our planet.</p><h4>Environmental Concepts</h4><table style="width:100%; border-collapse: collapse; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);"><thead><tr style="background-color: #007bff; color: white;"><th style="padding: 10px; border: 1px solid #dee2e6;">Concept</th><th style="padding: 10px; border: 1px solid #dee2e6;">Meaning (العربية)</th></tr></thead><tbody><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Sustainability</td><td style="padding: 8px; border: 1px solid #dee2e6;">الاستدامة</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Biodiversity</td><td style="padding: 8px; border: 1px solid #dee2e6;">التنوع البيولوجي</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Carbon Footprint</td><td style="padding: 8px; border: 1px solid #dee2e6;">البصمة الكربونية</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Renewable Energy</td><td style="padding: 8px; border: 1px solid #dee2e6;">الطاقة المتجددة</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Deforestation</td><td style="padding: 8px; border: 1px solid #dee2e6;">إزالة الغابات</td></tr></tbody></table><h4>Practical Actions</h4><p>How can we help the environment?</p><ul><li>Reduce your <strong>carbon footprint</strong> by using public transport.</li><li>Support <strong>sustainability</strong> by buying products with less packaging.</li><li>Planting trees helps combat <strong>deforestation</strong>.</li></ul></div>',
            'unit_health': '<div class="lesson-text"><h3>Unit 4: Health & Fitness</h3><p>Learn about the body, symptoms, and healthy habits.</p><h4>Health Vocabulary</h4><table style="width:100%; border-collapse: collapse; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);"><thead><tr style="background-color: #007bff; color: white;"><th style="padding: 10px; border: 1px solid #dee2e6;">Word</th><th style="padding: 10px; border: 1px solid #dee2e6;">Meaning (العربية)</th></tr></thead><tbody><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Nutrition</td><td style="padding: 8px; border: 1px solid #dee2e6;">التغذية</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Hydration</td><td style="padding: 8px; border: 1px solid #dee2e6;">الترطيب (شرب الماء)</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Metabolism</td><td style="padding: 8px; border: 1px solid #dee2e6;">الأيض (حرق السعرات)</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Immune System</td><td style="padding: 8px; border: 1px solid #dee2e6;">جهاز المناعة</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Symptom</td><td style="padding: 8px; border: 1px solid #dee2e6;">عَرَض (علامة مرض)</td></tr></tbody></table><h4>Healthy Habits</h4><p>Simple steps for a better lifestyle:</p><ul><li>A <strong>balanced diet</strong> includes fruits, vegetables, and proteins.</li><li>Good <strong>hydration</strong> is essential for energy.</li><li>Regular <strong>exercise</strong> strengthens your immune system.</li></ul></div>'
        },
        ar: {
            'business': '<div class="lesson-text"><h3>المحادثة في العمل</h3><p>يغطي هذا الدرس المفردات الأساسية، التحيات الرسمية، آداب البريد الإلكتروني، ومهارات التفاوض.</p><h4>مفردات رئيسية</h4><table style="width:100%; border-collapse: collapse; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);"><thead><tr style="background-color: #007bff; color: white;"><th style="padding: 10px; border: 1px solid #dee2e6;">الكلمة</th><th style="padding: 10px; border: 1px solid #dee2e6;">المعنى</th></tr></thead><tbody><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Colleague</td><td style="padding: 8px; border: 1px solid #dee2e6;">زميل عمل</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Agenda</td><td style="padding: 8px; border: 1px solid #dee2e6;">جدول أعمال</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Proposal</td><td style="padding: 8px; border: 1px solid #dee2e6;">اقتراح / عرض</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Deadline</td><td style="padding: 8px; border: 1px solid #dee2e6;">موعد نهائي</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Stakeholder</td><td style="padding: 8px; border: 1px solid #dee2e6;">صاحب مصلحة</td></tr></tbody></table><h4>آداب البريد الإلكتروني</h4><p>كتابة رسائل البريد الإلكتروني الاحترافية مهارة حاسمة.</p><ul><li><strong>سطر الموضوع:</strong> كن واضحًا ومختصرًا. مثال: "متابعة اجتماع: مشروع س"</li><li><strong>التحية:</strong> استخدم "عزيزي السيد/السيدة [الاسم الأخير]" للرسائل الرسمية.</li><li><strong>الخاتمة:</strong> استخدم "مع خالص التقدير" أو "أطيب التحيات".</li></ul><h4>عبارات التفاوض</h4><ul><li>"I see your point, however..." (أفهم وجهة نظرك، ولكن...)</li><li>"Let\'s find a middle ground." (لنجد حلاً وسطاً)</li></ul></div>',
            'auxiliary': '<div class="lesson-text"><h3>الأفعال المساعدة</h3><p>تستخدم الأفعال المساعدة مع الأفعال الأساسية لتوضيح الزمن أو الحالة.</p><h4>الأفعال المساعدة الرئيسية</h4><table style="width:100%; border-collapse: collapse; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);"><thead><tr style="background-color: #007bff; color: white;"><th style="padding: 10px; border: 1px solid #dee2e6;">الفعل</th><th style="padding: 10px; border: 1px solid #dee2e6;">الاستخدام</th></tr></thead><tbody><tr><td style="padding: 8px; border: 1px solid #dee2e6;">To Be (am, is, are)</td><td style="padding: 8px; border: 1px solid #dee2e6;">الأزمنة المستمرة والمبني للمجهول</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">To Do (do, does, did)</td><td style="padding: 8px; border: 1px solid #dee2e6;">السؤال والنفي</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">To Have (have, has, had)</td><td style="padding: 8px; border: 1px solid #dee2e6;">الأزمنة التامة</td></tr></tbody></table><h4>الأفعال المساعدة الشكلية (Modals)</h4><p>تعبر عن القدرة، الإذن، أو الاحتمالية.</p><ul><li><strong>Can/Could:</strong> "I <strong>can</strong> speak English. <strong>Could</strong> you help me?"</li><li><strong>Will/Would:</strong> "I <strong>will</strong> call you. I <strong>would</strong> like a coffee."</li><li><strong>Must/Should:</strong> "You <strong>must</strong> stop. You <strong>should</strong> see a doctor."</li></ul></div>',
            'greetings': '<div class="lesson-text"><h3>أساسيات التحية</h3><p>تعلم كيف تلقي التحية، تقدم نفسك، وتودع الآخرين باللغة الإنجليزية.</p><h4>جدول العبارات</h4><table style="width:100%; border-collapse: collapse; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);"><thead><tr style="background-color: #007bff; color: white;"><th style="padding: 10px; border: 1px solid #dee2e6;">العبارة</th><th style="padding: 10px; border: 1px solid #dee2e6;">المعنى</th></tr></thead><tbody><tr><td style="padding: 8px; border: 1px solid #dee2e6;">What\'s up?</td><td style="padding: 8px; border: 1px solid #dee2e6;">ما الجديد؟ (عامية)</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">How\'s it going?</td><td style="padding: 8px; border: 1px solid #dee2e6;">كيف الحال؟ (شائعة)</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Take care</td><td style="padding: 8px; border: 1px solid #dee2e6;">اعتنِ بنفسك (وداع)</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">See you later</td><td style="padding: 8px; border: 1px solid #dee2e6;">أراك لاحقاً</td></tr></tbody></table><h4>التعارف</h4><p>عندما تقابل شخصاً لأول مرة:</p><ul><li>"Nice to meet you." (تشرفت بلقائك)</li><li>"What do you do?" (ماذا تعمل؟)</li></ul><h4>الوداع (Farewells)</h4><ul><li><strong>رسمي:</strong> "Goodbye.", "It was a pleasure meeting you."</li><li><strong>غير رسمي:</strong> "Bye!", "See ya!", "Later!"</li></ul></div>',
            'unit_zoo': '<div class="lesson-text"><h3>الوحدة 1: في حديقة الحيوان</h3><p>تعلم عن الحيوانات، تصنيفاتها، وأفعالها.</p><h4>مفردات الحيوانات</h4><table style="width:100%; border-collapse: collapse; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);"><thead><tr style="background-color: #007bff; color: white;"><th style="padding: 10px; border: 1px solid #dee2e6;">الكلمة</th><th style="padding: 10px; border: 1px solid #dee2e6;">المعنى</th></tr></thead><tbody><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Lion</td><td style="padding: 8px; border: 1px solid #dee2e6;">أسد</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Elephant</td><td style="padding: 8px; border: 1px solid #dee2e6;">فيل</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Penguin</td><td style="padding: 8px; border: 1px solid #dee2e6;">بطريق</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Kangaroo</td><td style="padding: 8px; border: 1px solid #dee2e6;">كنغر</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Habitat</td><td style="padding: 8px; border: 1px solid #dee2e6;">موطن طبيعي</td></tr></tbody></table><h4>أفعال الحيوانات</h4><p>أفعال تتعلق بما تفعله الحيوانات.</p><ul><li>الأسود <strong>تزأر</strong> (roar).</li><li>القرود <strong>تتسلق</strong> (climb) الأشجار.</li><li>البطاريق <strong>تتمايل</strong> (waddle) و<strong>تسبح</strong> (swim).</li><li>الكنغر <strong>يقفز</strong> (hop).</li></ul><h4>التصنيفات</h4><ul><li><strong>Herbivore:</strong> آكل أعشاب (مثل الفيل).</li><li><strong>Carnivore:</strong> آكل لحوم (مثل الأسد).</li><li><strong>Omnivore:</strong> قارت (يأكل كل شيء، مثل الدب).</li></ul></div>',
            'unit_tech': '<div class="lesson-text"><h3>الوحدة 2: التكنولوجيا</h3><p>مفردات العالم الرقمي.</p><h4>مصطلحات تقنية</h4><table style="width:100%; border-collapse: collapse; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);"><thead><tr style="background-color: #007bff; color: white;"><th style="padding: 10px; border: 1px solid #dee2e6;">المصطلح</th><th style="padding: 10px; border: 1px solid #dee2e6;">المعنى</th></tr></thead><tbody><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Algorithm</td><td style="padding: 8px; border: 1px solid #dee2e6;">خوارزمية</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Cloud Computing</td><td style="padding: 8px; border: 1px solid #dee2e6;">الحوسبة السحابية</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Bandwidth</td><td style="padding: 8px; border: 1px solid #dee2e6;">عرض النطاق</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">User Interface (UI)</td><td style="padding: 8px; border: 1px solid #dee2e6;">واجهة المستخدم</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Database</td><td style="padding: 8px; border: 1px solid #dee2e6;">قاعدة بيانات</td></tr></tbody></table><h4>جمل أمثلة</h4><ul><li>"تستخدم مواقع التواصل الاجتماعي <strong>خوارزمية</strong> لعرض المحتوى لك."</li><li>"أقوم بتخزين صوري في <strong>السحابة</strong> حتى أتمكن من الوصول إليها في أي مكان."</li><li>"<strong>واجهة المستخدم</strong> الجيدة تجعل التطبيق سهل الاستخدام."</li></ul></div>',
            'unit_env': '<div class="lesson-text"><h3>الوحدة 3: البيئة</h3><p>تعلم مصطلحات أساسية حول حماية كوكبنا.</p><h4>مفاهيم بيئية</h4><table style="width:100%; border-collapse: collapse; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);"><thead><tr style="background-color: #007bff; color: white;"><th style="padding: 10px; border: 1px solid #dee2e6;">المفهوم</th><th style="padding: 10px; border: 1px solid #dee2e6;">المعنى</th></tr></thead><tbody><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Sustainability</td><td style="padding: 8px; border: 1px solid #dee2e6;">الاستدامة</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Biodiversity</td><td style="padding: 8px; border: 1px solid #dee2e6;">التنوع البيولوجي</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Carbon Footprint</td><td style="padding: 8px; border: 1px solid #dee2e6;">البصمة الكربونية</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Renewable Energy</td><td style="padding: 8px; border: 1px solid #dee2e6;">الطاقة المتجددة</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Deforestation</td><td style="padding: 8px; border: 1px solid #dee2e6;">إزالة الغابات</td></tr></tbody></table><h4>إجراءات عملية</h4><p>كيف يمكننا مساعدة البيئة؟</p><ul><li>قلل من <strong>بصمتك الكربونية</strong> باستخدام وسائل النقل العام.</li><li>ادعم <strong>الاستدامة</strong> بشراء منتجات ذات تغليف أقل.</li><li>زراعة الأشجار تساعد في مكافحة <strong>إزالة الغابات</strong>.</li></ul></div>',
            'unit_health': '<div class="lesson-text"><h3>الوحدة 4: الصحة واللياقة</h3><p>تعلم عن الجسم، الأعراض، والعادات الصحية.</p><h4>مفردات الصحة</h4><table style="width:100%; border-collapse: collapse; margin: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);"><thead><tr style="background-color: #007bff; color: white;"><th style="padding: 10px; border: 1px solid #dee2e6;">الكلمة</th><th style="padding: 10px; border: 1px solid #dee2e6;">المعنى</th></tr></thead><tbody><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Nutrition</td><td style="padding: 8px; border: 1px solid #dee2e6;">التغذية</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Hydration</td><td style="padding: 8px; border: 1px solid #dee2e6;">الترطيب (شرب الماء)</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Metabolism</td><td style="padding: 8px; border: 1px solid #dee2e6;">الأيض (حرق السعرات)</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Immune System</td><td style="padding: 8px; border: 1px solid #dee2e6;">جهاز المناعة</td></tr><tr><td style="padding: 8px; border: 1px solid #dee2e6;">Symptom</td><td style="padding: 8px; border: 1px solid #dee2e6;">عَرَض (علامة مرض)</td></tr></tbody></table><h4>عادات صحية</h4><p>خطوات بسيطة لنمط حياة أفضل:</p><ul><li><strong>النظام الغذائي المتوازن</strong> يشمل الفواكه والخضروات والبروتينات.</li><li><strong>الترطيب</strong> الجيد ضروري للطاقة.</li><li><strong>التمرين</strong> المنتظم يقوي جهاز المناعة.</li></ul></div>'
        }
    };

    // Quiz Data
    const lessonQuizzes = {
        en: {
            'business': [
                { q: "What is the best closing for a formal email to a new client?", options: ["Cheers", "Talk soon", "Sincerely"], a: 2 },
                { q: "When a colleague says 'Let's table this discussion', what do they mean?", options: ["Discuss it now", "Write it on the table", "Postpone it"], a: 2 },
                { q: "A 'stakeholder' in a project is...", options: ["Someone who holds stakes", "A person with an interest or concern in the project", "A shareholder"], a: 1 },
                { q: "Which phrase is best for disagreeing politely?", options: ["That's a bad idea.", "I see your point, but I have a different perspective.", "I totally disagree."], a: 1 }
            ],
            'auxiliary': [
                { q: "Which sentence is grammatically correct?", options: ["He don't like it", "He doesn't likes it", "He doesn't like it"], a: 2 },
                { q: "You ___ finish the report by Friday. It's an order from the boss.", options: ["should", "must", "might"], a: 1 },
                { q: "___ I borrow your pen, please?", options: ["Will", "Am", "Could"], a: 2 },
                { q: "They ___ arrived yet.", options: ["haven't", "hasn't", "didn't"], a: 0 }
            ],
            'writing_mastery': [
                { q: "The first sentence of a paragraph is usually the...", options: ["Topic Sentence", "Conclusion", "Detail"], a: 0 },
                { q: "Supporting sentences provide...", options: ["The main idea", "Details and examples", "The title"], a: 1 },
                { q: "Which word shows contrast?", options: ["And", "However", "So"], a: 1 },
                { q: "Which word shows result?", options: ["But", "Therefore", "Because"], a: 1 },
                { q: "The introduction must include a...", options: ["Thesis Statement", "Conclusion", "List of references"], a: 0 }
            ],
            'sentence_structure': [
                { q: "Correct order:", options: ["She plays tennis", "She tennis plays", "Plays she tennis"], a: 0 },
                { q: "Where does the adjective go?", options: ["After noun", "Before noun", "At end"], a: 1 },
                { q: "I like tea, ___ I don't like coffee.", options: ["so", "but", "or"], a: 1 },
                { q: "___ it rained, we went out.", options: ["Because", "Although", "If"], a: 1 }
            ],
            'dialogue_pro': [
                { q: "Best reply to 'How are you?':", options: ["Fine.", "I'm doing great, thanks for asking! How about you?", "No."], a: 1 },
                { q: "Polite disagreement:", options: ["You're wrong.", "That's stupid.", "I see your point, but I disagree."], a: 2 }
            ],
            'idioms': [
                { q: "What does 'Break a leg' mean?", options: ["Get hurt", "Good luck", "Stop walking"], a: 1 },
                { q: "It was a 'piece of cake' means...", options: ["It was delicious", "It was easy", "It was hard"], a: 1 },
                { q: "If the ball is in your court...", options: ["You are playing tennis", "It is your decision", "You are winning"], a: 1 }
            ],
            'public_speaking': [
                { q: "Good posture shows...", options: ["Fear", "Confidence", "Tiredness"], a: 1 },
                { q: "Where should you look?", options: ["The floor", "The ceiling", "The audience"], a: 2 },
                { q: "The 'Hook' comes at the...", options: ["End", "Middle", "Beginning"], a: 2 }
            ],
            'reading_ai': [
                { q: "AI stands for...", options: ["Apple Inc", "Artificial Intelligence", "Auto Internet"], a: 1 },
                { q: "Machine Learning helps computers learn from...", options: ["Books", "Mistakes/Data", "Sleeping"], a: 1 }
            ],
            'unit_zoo': [
                { q: "An animal that eats only plants is called a...", options: ["Carnivore", "Herbivore", "Omnivore"], a: 1 },
                { q: "What is the natural home of an animal called?", options: ["Cage", "Habitat", "House"], a: 1 },
                { q: "Which of these animals can hop?", options: ["Penguin", "Snake", "Kangaroo"], a: 2 },
                { q: "The act of illegal hunting is called...", options: ["Conservation", "Poaching", "Adoption"], a: 1 }
            ],
            'unit_tech': [
                { q: "A set of rules for a computer to follow is called an...", options: ["Algorithm", "Application", "Advertisement"], a: 0 },
                { q: "Storing data on the internet instead of your computer is called...", options: ["Downloading", "Cloud Computing", "Uploading"], a: 1 },
                { q: "What does UI stand for?", options: ["User Internet", "Universal ID", "User Interface"], a: 2 },
                { q: "The speed of your internet connection is its...", options: ["Database", "Bandwidth", "Algorithm"], a: 1 }
            ],
            'unit_env': [
                { q: "The measure of human impact on the environment is called...", options: ["Carbon Footprint", "Pollution", "Recycling"], a: 0 },
                { q: "Energy from the sun is a type of ___ energy.", options: ["Fossil", "Nuclear", "Renewable"], a: 2 },
                { q: "The variety of life in the world is called...", options: ["Biodiversity", "Sustainability", "Atmosphere"], a: 0 },
                { q: "What is the opposite of deforestation?", options: ["Pollution", "Reforestation", "Conservation"], a: 1 }
            ],
            'unit_health': [
                { q: "Which of these is a key part of a healthy lifestyle?", options: ["Sleeping 4 hours", "Eating only fruit", "A balanced diet"], a: 2 },
                { q: "The process of providing the body with water is called...", options: ["Nutrition", "Hydration", "Metabolism"], a: 1 },
                { q: "Your body's defense against illness is the...", options: ["Nervous System", "Skeletal System", "Immune System"], a: 2 },
                { q: "A 'symptom' is a sign of...", options: ["Health", "Illness", "Fitness"], a: 1 }
            ],
            'default': [
                { q: "Did you understand the lesson?", options: ["Yes", "No"], a: 0 }
            ]
        },
        ar: {
            'business': [
                { q: "ما هي أفضل خاتمة لبريد إلكتروني رسمي لعميل جديد؟", options: ["مع السلامة", "نتكلم قريباً", "مع خالص التقدير"], a: 2 },
                { q: "عندما يقول زميل 'Let's table this discussion'، ماذا يعني؟", options: ["لنناقشها الآن", "لنكتبها على الطاولة", "لنؤجلها"], a: 2 },
                { q: "'Stakeholder' في مشروع هو...", options: ["شخص يحمل أوتاد", "شخص له مصلحة أو اهتمام بالمشروع", "حامل أسهم"], a: 1 },
                { q: "أي عبارة هي الأفضل للاعتراض بأدب؟", options: ["هذه فكرة سيئة.", "أرى وجهة نظرك، ولكن لدي منظور مختلف.", "أنا لا أوافق إطلاقاً."], a: 1 }
            ],
            'writing_mastery': [
                { q: "الجملة الأولى في الفقرة تسمى...", options: ["الجملة الافتتاحية", "الخاتمة", "التفاصيل"], a: 0 },
                { q: "كلمة تستخدم للتناقض:", options: ["And", "However", "So"], a: 1 }
            ],
            'sentence_structure': [
                { q: "الترتيب الصحيح:", options: ["She plays tennis", "She tennis plays", "Plays she tennis"], a: 0 }
            ],
            'dialogue_pro': [
                { q: "أفضل رد على 'كيف حالك؟':", options: ["بخير.", "أنا بخير شكراً لسؤالك! وأنت؟", "لا."], a: 1 }
            ],
            'idioms': [
                { q: "معنى 'Break a leg'؟", options: ["انكسرت قدمه", "حظاً موفقاً", "توقف"], a: 1 }
            ],
            'public_speaking': [
                { q: "الوقوف باستقامة يظهر...", options: ["الخوف", "الثقة", "التعب"], a: 1 }
            ],
            'reading_ai': [
                { q: "اختصار AI يعني...", options: ["Apple Inc", "الذكاء الاصطناعي", "الإنترنت التلقائي"], a: 1 }
            ],
            'unit_zoo': [
                { q: "الحيوان الذي يأكل النباتات فقط يسمى...", options: ["آكل لحوم", "آكل أعشاب", "قارت"], a: 1 },
                { q: "ماذا يسمى المسكن الطبيعي للحيوان؟", options: ["قفص", "موطن", "منزل"], a: 1 },
                { q: "أي من هذه الحيوانات يستطيع القفز؟", options: ["بطريق", "ثعبان", "كنغر"], a: 2 },
                { q: "فعل الصيد غير المشروع يسمى...", options: ["حماية", "صيد جائر", "تبني"], a: 1 }
            ],
            'unit_tech': [
                { q: "مجموعة القواعد التي يتبعها الكمبيوتر تسمى...", options: ["خوارزمية", "تطبيق", "إعلان"], a: 0 },
                { q: "تخزين البيانات على الإنترنت بدلاً من جهاز الكمبيوتر يسمى...", options: ["تنزيل", "حوسبة سحابية", "رفع"], a: 1 },
                { q: "إلى ماذا يرمز اختصار UI؟", options: ["إنترنت المستخدم", "معرف عالمي", "واجهة المستخدم"], a: 2 },
                { q: "سرعة اتصالك بالإنترنت هي...", options: ["قاعدة البيانات", "عرض النطاق", "الخوارزمية"], a: 1 }
            ],
            'unit_env': [
                { q: "مقياس تأثير الإنسان على البيئة يسمى...", options: ["البصمة الكربونية", "التلوث", "إعادة التدوير"], a: 0 },
                { q: "الطاقة من الشمس هي نوع من الطاقة ___.", options: ["الأحفورية", "النووية", "المتجددة"], a: 2 },
                { q: "تنوع الحياة في العالم يسمى...", options: ["التنوع البيولوجي", "الاستدامة", "الغلاف الجوي"], a: 0 },
                { q: "ما هو عكس إزالة الغابات؟", options: ["التلوث", "إعادة التحريج", "الحماية"], a: 1 }
            ],
            'unit_health': [
                { q: "أي من هذه جزء أساسي من نمط حياة صحي؟", options: ["النوم 4 ساعات", "أكل الفاكهة فقط", "نظام غذائي متوازن"], a: 2 },
                { q: "عملية تزويد الجسم بالماء تسمى...", options: ["التغذية", "الترطيب", "الأيض"], a: 1 },
                { q: "دفاع جسمك ضد المرض هو...", options: ["الجهاز العصبي", "الجهاز الهيكلي", "جهاز المناعة"], a: 2 },
                { q: "الـ 'symptom' هو علامة على...", options: ["الصحة", "المرض", "اللياقة"], a: 1 }
            ],
            'default': [
                { q: "هل فهمت الدرس؟", options: ["نعم", "لا"], a: 0 }
            ]
        }
    };

    function getLessonContent(name) {
        const lang = document.documentElement.lang || 'en';
        const content = fullLessonContent[lang][name];
        return content || `<strong>${name}</strong><br>Content for this lesson is currently under development. Please try again later or choose another lesson.`;
    }

    function openLessonPage(card) {
        if (document.getElementById('units-section').style.display === 'block') {
            previousSectionId = 'units-section';
        } else if (document.getElementById('reading-section').style.display === 'block') {
            previousSectionId = 'reading-section';
        } else {
            previousSectionId = 'lessons';
        }

        const lessonId = card.dataset.lessonId;
        currentLessonName = lessonId; // Use ID internally
        
        const name = card.querySelector('.lesson-name').textContent;
        const enName = card.querySelector('.lesson-name-en').textContent;
        const desc = card.querySelector('.lesson-desc').textContent;
        const level = card.querySelector('.lesson-level').textContent;
        const icon = card.querySelector('.lesson-icon').textContent;

        modalTitle.textContent = name;
        modalSubtitle.textContent = enName;
        modalDesc.textContent = desc;
        modalLevel.textContent = level;
        modalIcon.textContent = icon;

        // Populate points
        modalPoints.innerHTML = '';
        const lang = document.documentElement.lang || 'en';
        const points = (lessonContentData[lang] && lessonContentData[lang][lessonId]) || ['Lesson Introduction', 'Practical Examples', 'Interactive Exercises'];
        
        points.forEach(point => {
            const li = document.createElement('li');
            li.textContent = point;
            modalPoints.appendChild(li);
        });

        // Reset to summary view
        summaryView.style.display = 'block';
        activeView.style.display = 'none';

        // Hide all main sections
        document.querySelector('.hero-section').style.display = 'none';
        document.getElementById('lessons').style.display = 'none';
        document.getElementById('quiz').style.display = 'none';
        document.getElementById('units-section').style.display = 'none';
        document.getElementById('reading-section').style.display = 'none';
        
        // Show Lesson Viewer
        lessonViewer.style.display = 'block';
        window.scrollTo(0, 0);
    }

    function closeLessonPage() {
        lessonViewer.style.display = 'none';
        
        const targetSection = document.getElementById(previousSectionId) || document.getElementById('lessons');
        targetSection.style.display = 'block';
        targetSection.scrollIntoView();
        
        document.querySelectorAll('.lesson-card.glow').forEach(c => c.classList.remove('glow'));
        const target = previousSectionId === 'lessons' ? '#lessons' : '#' + previousSectionId;
        window.location.hash = target;
    }

    // Router for Lessons and Units
    const handleLessonRouting = () => {
        const hash = window.location.hash;

        // Handle Sub-sections
        if (hash === '#units-section') {
            document.getElementById('lessons').style.display = 'none';
            document.getElementById('units-section').style.display = 'block';
            document.getElementById('reading-section').style.display = 'none';
            window.scrollTo(0, 0);
        } else if (hash === '#reading-section') {
            document.getElementById('lessons').style.display = 'none';
            document.getElementById('units-section').style.display = 'none';
            document.getElementById('reading-section').style.display = 'block';
            window.scrollTo(0, 0);
        } else if (hash === '#lessons') {
            document.getElementById('units-section').style.display = 'none';
            document.getElementById('reading-section').style.display = 'none';
            document.getElementById('lessons').style.display = 'block';
        }

        // Handle Lesson Modal
        if (hash.startsWith('#lesson-')) {
            const lessonId = hash.replace('#lesson-', '');
            const card = document.querySelector(`.lesson-card[data-lesson-id="${lessonId}"]`);
            if (card) {
                if (lessonViewer.style.display !== 'block' || currentLessonName !== lessonId) {
                    openLessonPage(card);
                }
            }
        } else {
            // Close modal if open and hash is not a lesson
            if (lessonViewer.style.display === 'block') {
                lessonViewer.style.display = 'none';
                document.querySelectorAll('.lesson-card.glow').forEach(c => c.classList.remove('glow'));
            }
        }
    };

    window.addEventListener('hashchange', handleLessonRouting);
    window.addEventListener('load', handleLessonRouting);

    lessonCards.forEach(card => {
        card.addEventListener('click', () => {
            openLessonPage(card);
            window.location.hash = '#lesson-' + card.dataset.lessonId;
        });
    });

    // Handle Collection Cards (Unit 1 & Reading)
    document.querySelectorAll('.collection-card').forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.dataset.target;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                document.getElementById('lessons').style.display = 'none';
                targetSection.style.display = 'block';
                window.scrollTo(0, 0);
            }
            window.location.hash = '#' + card.dataset.target;
        });
    });

    // Handle Back to Library Buttons
    document.querySelectorAll('.back-to-library').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('units-section').style.display = 'none';
            document.getElementById('reading-section').style.display = 'none';
            document.getElementById('lessons').style.display = 'block';
            window.location.hash = '#lessons';
        });
    });

    // Proximity-based glow: card lights when mouse is near (not only on hover)
    (function proximityGlow(){
        // Only enable proximity glow on devices that support fine pointer (mouse)
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        const cards = Array.from(document.querySelectorAll('.lesson-card'));
        let mouseX = -9999, mouseY = -9999;
        let ticking = false;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        });

        function update(){
            ticking = false;
            const threshold = 160; // px distance to trigger glow (adjustable)
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = mouseX - cx;
                const dy = mouseY - cy;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < threshold) {
                    if (!card.classList.contains('glow')) card.classList.add('glow');
                } else {
                    card.classList.remove('glow');
                }
            });
        }
    })();

    // Handle Start Lesson Click
    if (startLessonBtn) {
        startLessonBtn.addEventListener('click', () => {
            summaryView.style.display = 'none';
            activeView.style.display = 'block';
            activeLessonContent.innerHTML = getLessonContent(currentLessonName);
            saveLessonProgress(currentLessonName);
            if (quizSection) quizSection.style.display = 'none';
            if (showQuizBtn) showQuizBtn.style.display = 'block';

            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        });
    }

    // Handle Back Button
    if (backToSummaryBtn) {
        backToSummaryBtn.addEventListener('click', () => {
            activeView.style.display = 'none';
            summaryView.style.display = 'block';
        });
    }

    // Quiz Logic
    function loadQuiz(lessonId) {
        const lang = document.documentElement.lang || 'en';
        const quizzes = lessonQuizzes[lang][lessonId] || lessonQuizzes[lang]['default'];
        const questions = quizzes;
        
        quizContainer.innerHTML = '';
        quizResult.textContent = '';
        quizResult.className = 'quiz-result';
        submitQuizBtn.style.display = 'block';
        
        questions.forEach((q, index) => {
            const qElem = document.createElement('div');
            qElem.className = 'quiz-question';
            qElem.innerHTML = `<p>${index + 1}. ${q.q}</p>`;
            
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'quiz-options';
            
            q.options.forEach((opt, i) => {
                const optBtn = document.createElement('div');
                optBtn.className = 'quiz-option';
                optBtn.textContent = opt;
                optBtn.dataset.index = i;
                optBtn.onclick = () => {
                    optionsDiv.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
                    optBtn.classList.add('selected');
                };
                optionsDiv.appendChild(optBtn);
            });
            
            qElem.appendChild(optionsDiv);
            quizContainer.appendChild(qElem);
        });

        quizContainer.dataset.questions = JSON.stringify(questions);
    }

    if (showQuizBtn) {
        showQuizBtn.addEventListener('click', () => {
            loadQuiz(currentLessonName);
            quizSection.style.display = 'block';
            showQuizBtn.style.display = 'none';
            quizSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (submitQuizBtn) {
        submitQuizBtn.addEventListener('click', () => {
            const questions = JSON.parse(quizContainer.dataset.questions || '[]');
            let score = 0;
            const questionDivs = quizContainer.querySelectorAll('.quiz-question');
            
            questionDivs.forEach((qDiv, index) => {
                const selected = qDiv.querySelector('.quiz-option.selected');
                if (selected) {
                    const answerIndex = parseInt(selected.dataset.index);
                    const correctIndex = questions[index].a;
                    if (answerIndex === correctIndex) score++;
                    
                    const options = qDiv.querySelectorAll('.quiz-option');
                    options[correctIndex].classList.add('correct');
                    if (answerIndex !== correctIndex) selected.classList.add('incorrect');
                }
            });

            quizResult.textContent = `${translations[document.documentElement.lang || 'en'].quiz.score} ${score} / ${questions.length}`;
            
            // Confetti effect for perfect score
            if (score === questions.length && typeof confetti === 'function') {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }

            // Save Quiz Result
            const quizProgress = JSON.parse(localStorage.getItem('quizProgress')) || [];
            quizProgress.push({
                lesson: currentLessonName,
                score: score,
                total: questions.length,
                date: new Date().toISOString()
            });
            localStorage.setItem('quizProgress', JSON.stringify(quizProgress));
            
            submitQuizBtn.style.display = 'none';
        });
    }

    function updateLessonProgressUI() {
        const progress = JSON.parse(localStorage.getItem('userProgress')) || { started: [], completed: [] };
        const cards = document.querySelectorAll('.lesson-card');
        
        cards.forEach(card => {
            if (progress.started.includes(card.dataset.lessonId)) {
                card.classList.add('started');
            }
        });
    }

    // Initialize UI
    updateLessonProgressUI();

    function saveLessonProgress(lessonId) {
        // Save started lesson
        const progress = JSON.parse(localStorage.getItem('userProgress')) || { started: [], completed: [] };
        if (!progress.started.includes(lessonId)) {
            progress.started.push(lessonId);
            localStorage.setItem('userProgress', JSON.stringify(progress));
            updateLessonProgressUI();
        }

        // Update vocabulary stats (simulated)
        const vocabulary = JSON.parse(localStorage.getItem('vocabulary')) || [];
        const lessonVocabKey = `vocab_added_${lessonId}`;
        
        if (!localStorage.getItem(lessonVocabKey)) {
            // Simulate adding 5 words per lesson
            for (let i = 0; i < 5; i++) {
                vocabulary.push(`${lessonId}_word_${Date.now()}_${i}`);
            }
            localStorage.setItem('vocabulary', JSON.stringify(vocabulary));
            localStorage.setItem(lessonVocabKey, 'true');
        }
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLessonPage);
});

// Theme Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle;

    // Check local storage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        icon.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            icon.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            icon.textContent = '🌙';
        }
    });
});

// Language Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const langToggle = document.getElementById('lang-toggle');
    const html = document.documentElement;

    const translations = {
        en: {
            nav: { home: "Home", lessons: "Lessons", quiz: "Quiz" },
            common: { backToTop: "Back to Top", backToLibrary: "Back to Library" },
            hero: { title: "Learn English", highlight: "Smartly & Easily", desc: "Use the power of AI to improve your conversation and grammar skills. Professional lessons, accurate statistics, and a smart teacher available 24/7.", btn1: "Discover Lessons", btn2: "Start Journey Now", badge: "500+ New Students" },
            lessons: { title: "Lesson Library", subtitle: "Choose a lesson to start your learning journey", search: "Search for a lesson or level..." },
            filter: { all: "All", grammar: "Grammar", vocabulary: "Vocabulary", skills: "Skills" },
            common: { backToLessons: "Back to Lessons" },
            quiz: { title: "Quiz", take: "Take Quiz", submit: "Submit Answers", score: "Your Score: ", mainTitle: "Categorized Quizzes", mainDesc: "Choose a category and difficulty level", grammarDesc: "Tenses, verbs, and structure", vocabDesc: "Words, phrases, and idioms", skillsDesc: "Dialogue and communication", select: "Select", selectLevel: "Select Difficulty", retry: "Try Again", close: "Close", nextLevel: "Next Level" },
            card: {
                view: "View Lesson",
                business: { title: "Professional Business Communication", desc: "Develop business communication skills in the workplace." },
                auxiliary: { title: "Understanding Auxiliary Verbs", desc: "Detailed explanation of using have, do, be, and will." },
                greetings: { title: "Fundamentals of Greetings", desc: "Learn how to greet and interact with others in English." },
                essay: { title: "Academic Essay Composition", desc: "Structured discussions for writing organized academic texts." },
                future: { title: "Mastering the Future Simple", desc: "How to talk about your future plans using 'going to' and 'will'." },
                articles: { title: "Definite & Indefinite Articles", desc: "Basic rules for using 'a', 'an', and 'the'." },
                past: { title: "The Past Simple Tense", desc: "Learn how to talk about finished past events and verb conjugations." },
                travel: { title: "English for Travel & Tourism", desc: "Essential words and phrases for traveling, airports, and hotels." },
                phrasal: { title: "Essential Phrasal Verbs", desc: "Important phrasal verbs (get up, look for) used by native speakers." },
                writing_mastery: { title: "Mastering Writing Skills", desc: "Learn how to structure paragraphs and write complete, coherent topics." },
                sentence_structure: { title: "Advanced Sentence Building", desc: "Master the rules of syntax, word order, and complex sentence structures." },
                dialogue_pro: { title: "Professional Dialogue & Replies", desc: "Techniques for professional conversation, diplomatic replies, and active listening." },
                idioms: { title: "Idioms & Slang", desc: "Speak like a native with common idioms and expressions." },
                public_speaking: { title: "Public Speaking Mastery", desc: "Conquer stage fright and learn to persuade an audience." },
                reading_ai: { title: "Artificial Intelligence", desc: "Read about AI, how it works, and its future." },
                unit_zoo: { title: "Unit 1: At the Zoo", desc: "Learn names of animals and their habitats." },
                unit_tech: { title: "Unit 2: Technology", desc: "Vocabulary for smartphones and the internet." },
                unit_env: { title: "Unit 3: Environment", desc: "Nature, recycling, and saving the planet." },
                unit_health: { title: "Unit 4: Health & Fitness", desc: "Body parts, symptoms, and healthy living." },
                unit_collection: { title: "Unit 1", desc: "Contains 4 lessons: Zoo, Technology, Environment, Health." },
                reading_collection: { title: "Reading Practice", desc: "Improve your reading skills with full topics like AI." },
                open: "Open"
            },
            level: { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
            modal: { content: "Lesson Content:", start: "Start Lesson", explanation: "Lesson Explanation", 1: "Level 1", 2: "Level 2", 3: "Level 3" }
        },
        ar: {
            nav: { home: "الرئيسية", lessons: "الدروس", quiz: "اختبارات" },
            common: { backToTop: "العودة للأعلى", backToLibrary: "العودة للمكتبة" },
            hero: { title: "تعلم الإنجليزية", highlight: "بذكاء وسهولة", desc: "استخدم قوة الذكاء الاصطناعي لتطوير مهاراتك في المحادثة والقواعد. دروس محترفة، إحصائيات دقيقة، ومدرس ذكي متاح لك 24/7.", btn1: "اكتشف الدروس", btn2: "ابدأ رحلتك الآن", badge: "500+ طالب جديد" },
            lessons: { title: "مكتبة الدروس", subtitle: "اختر درسًا للبدء في رحلة التعلم الخاصة بك", search: "ابحث عن درس أو مستوى..." },
            filter: { all: "الكل", grammar: "قواعد", vocabulary: "مفردات", skills: "مهارات" },
            common: { backToLessons: "العودة للدروس" },
            quiz: { title: "اختبار", take: "ابدأ الاختبار", submit: "إرسال الإجابات", score: "نتيجتك: ", mainTitle: "اختبارات مصنفة", mainDesc: "اختر التصنيف ومستوى الصعوبة", grammarDesc: "الأزمنة، الأفعال، والتراكيب", vocabDesc: "الكلمات، العبارات، والمصطلحات", skillsDesc: "المحادثة والتواصل", select: "اختر", selectLevel: "اختر الصعوبة", retry: "حاول مرة أخرى", close: "إغلاق", nextLevel: "المستوى التالي" },
            card: {
                view: "عرض الدرس",
                business: { title: "المحادثة في العمل", desc: "تطوير مهارات التواصل التجاري في بيئة العمل" },
                auxiliary: { title: "الأفعال المساعدة", desc: "تعرّف على شرح مفصّل لاستخدام have, do, be, will" },
                greetings: { title: "أساسيات التحية", desc: "تعلّم كيف تحيي وتتفاعل مع الآخرين باللغة الإنجليزية" },
                essay: { title: "كتابة المقالات", desc: "نقاشات منفصلة لكتابة نصوص أكاديمية منظمة" },
                future: { title: "المستقبل البسيط", desc: "كيف تتحدث عن خطتك المستقبلية باستخدام going to" },
                articles: { title: "أدوات التعريف", desc: "القواعد الأساسية لاستخدام أدوات التعريف والتنكير" },
                past: { title: "الماضي البسيط", desc: "تعلم كيفية التحدث عن الأحداث المنتهية في الماضي وقواعد التصريف الثاني" },
                travel: { title: "مفردات السفر", desc: "كلمات وعبارات أساسية تحتاجها عند السفر، في المطار، وحجز الفنادق" },
                phrasal: { title: "الأفعال المركبة", desc: "أهم الأفعال المركبة (get up, look for) التي يستخدمها المتحدثون الأصليون" },
                writing_mastery: { title: "إتقان مهارات الكتابة", desc: "تعلم كيفية بناء الفقرات وكتابة مواضيع كاملة ومترابطة." },
                sentence_structure: { title: "بناء الجمل المتقدم", desc: "أتقن قواعد النحو، ترتيب الكلمات، وتراكيب الجمل المعقدة." },
                dialogue_pro: { title: "الحوار والردود الاحترافية", desc: "تقنيات المحادثة المهنية، الردود الدبلوماسية، والاستماع الفعال." },
                idioms: { title: "الأمثال والمصطلحات", desc: "تحدث كالأجانب باستخدام الأمثال والتعبيرات الشائعة." },
                public_speaking: { title: "فن الخطابة", desc: "تغلب على الخوف وتعلم كيف تقنع الجمهور." },
                reading_ai: { title: "الذكاء الاصطناعي", desc: "اقرأ عن الذكاء الاصطناعي، كيف يعمل، ومستقبله." },
                unit_zoo: { title: "الوحدة 1: في حديقة الحيوان", desc: "تعلم أسماء الحيوانات ومواطنها." },
                unit_tech: { title: "الوحدة 2: التكنولوجيا", desc: "مفردات الهواتف الذكية والإنترنت." },
                unit_env: { title: "الوحدة 3: البيئة", desc: "الطبيعة، إعادة التدوير، وحماية الكوكب." },
                unit_health: { title: "الوحدة 4: الصحة واللياقة", desc: "أجزاء الجسم، الأعراض، والحياة الصحية." },
                unit_collection: { title: "الوحدة 1", desc: "تحتوي على 4 دروس: حديقة الحيوان، التكنولوجيا، البيئة، الصحة." },
                reading_collection: { title: "ممارسة القراءة", desc: "حسن مهارات القراءة بمواضيع كاملة مثل الذكاء الاصطناعي." },
                open: "فتح"
            },
            level: { beginner: "مبتدئ", intermediate: "متوسط", advanced: "متقدم" },
            modal: { content: "محتوى الدرس:", start: "ابدأ الدرس", explanation: "شرح الدرس", 1: "مستوى 1", 2: "مستوى 2", 3: "مستوى 3" }
        }
    };

    function updateLanguage(lang) {
        html.lang = lang;
        html.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        // Update simple text elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const keys = key.split('.');
            let val = translations[lang];
            keys.forEach(k => val = val[k]);
            if (val) el.textContent = val;
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            const keys = key.split('.');
            let val = translations[lang];
            keys.forEach(k => val = val[k]);
            if (val) el.placeholder = val;
        });

        // Update aria-labels
        document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
            const key = el.dataset.i18nAriaLabel;
            const keys = key.split('.');
            let val = translations[lang];
            keys.forEach(k => val = val[k]);
            if (val) el.setAttribute('aria-label', val);
        });

        localStorage.setItem('lang', lang);
    }

    const savedLang = localStorage.getItem('lang') || 'en';
    updateLanguage(savedLang);

    langToggle.addEventListener('click', () => {
        const currentLang = html.lang;
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        updateLanguage(newLang);
    });
});

// 3D Tilt Effect for Lesson Cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.lesson-card');
    
    cards.forEach(card => {
        // Skip tilt while pressed (so pressed transform isn't overridden)
        card.addEventListener('mousemove', (e) => {
            if (card.classList.contains('pressed')) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        // Pointer events to handle press/touch animation
        card.addEventListener('pointerdown', (e) => {
            // add pressed, glow & animate classes
            card.classList.add('pressed');
            card.classList.add('glow');
            card.classList.add('animate-press');
            // remove animate class after animation ends
            setTimeout(() => card.classList.remove('animate-press'), 500);
            // remove the transient glow after a short interval (proximity handler may re-add it)
            setTimeout(() => {
                card.classList.remove('glow');
            }, 2500);
        });

        const releaseHandler = () => {
            // remove pressed state after short delay so animation can settle
            setTimeout(() => card.classList.remove('pressed'), 220);
            // remove glow shortly after release so click gives visible feedback
            setTimeout(() => card.classList.remove('glow'), 300);
        };

        card.addEventListener('pointerup', releaseHandler);
        card.addEventListener('pointercancel', releaseHandler);
        card.addEventListener('mouseleave', () => {
            // clear transforms and states
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            card.classList.remove('pressed');
            card.classList.remove('animate-press');
        });
    });
});

// General Quiz Logic
document.addEventListener('DOMContentLoaded', () => {
    const generalQuizContainer = document.getElementById('general-quiz-container');
    const generalQuizQuestions = document.getElementById('general-quiz-questions');
    const submitGeneralQuizBtn = document.getElementById('submit-general-quiz-btn');
    const retryGeneralQuizBtn = document.getElementById('retry-general-quiz-btn');
    const closeGeneralQuizBtn = document.getElementById('close-general-quiz-btn');
    const generalQuizResult = document.getElementById('general-quiz-result');
    const quizCategories = document.getElementById('quiz-categories');
    const quizDifficulty = document.getElementById('quiz-difficulty');
    const backToCategoriesBtn = document.getElementById('back-to-categories');
    const quizActiveTitle = document.getElementById('quiz-active-title');

    let selectedCategory = '';
    let selectedLevel = 1;

    // New Separate Quizzes Data
    const separateQuizzes = {
        en: {
            grammar: {
                1: [
                    { q: "She ___ a doctor.", options: ["is", "are", "am"], a: 0 },
                    { q: "___ you like apples?", options: ["Does", "Do", "Is"], a: 1 },
                    { q: "They ___ playing football.", options: ["is", "am", "are"], a: 2 }
                ],
                2: [
                    { q: "I ___ seen him before.", options: ["did", "have", "has"], a: 1 },
                    { q: "If I ___ you, I would go.", options: ["was", "am", "were"], a: 2 },
                    { q: "She ___ working here for 5 years.", options: ["is", "has been", "have been"], a: 1 }
                ],
                3: [
                    { q: "By next year, I ___ graduated.", options: ["will have", "will has", "have"], a: 0 },
                    { q: "Hardly ___ I arrived when he left.", options: ["did", "had", "have"], a: 1 },
                    { q: "I wish I ___ that.", options: ["didn't say", "hadn't said", "haven't said"], a: 1 }
                ]
            },
            vocabulary: {
                1: [
                    { q: "Opposite of 'Big'?", options: ["Large", "Small", "Huge"], a: 1 },
                    { q: "A place to sleep at night.", options: ["Kitchen", "Bedroom", "Bathroom"], a: 1 },
                    { q: "You wear this on your head.", options: ["Shoe", "Hat", "Glove"], a: 1 }
                ],
                2: [
                    { q: "To 'give up' means to...", options: ["Start", "Stop/Quit", "Continue"], a: 1 },
                    { q: "Synonym for 'Difficult'?", options: ["Easy", "Hard", "Simple"], a: 1 },
                    { q: "A person who travels is a...", options: ["Tourist", "Doctor", "Pilot"], a: 0 }
                ],
                3: [
                    { q: "What does 'Ubiquitous' mean?", options: ["Rare", "Everywhere", "Expensive"], a: 1 },
                    { q: "To 'hit the hay' means...", options: ["Go to sleep", "Eat", "Work"], a: 0 },
                    { q: "Antonym of 'Benevolent'?", options: ["Kind", "Malevolent", "Generous"], a: 1 }
                ]
            },
            skills: {
                1: [
                    { q: "A: 'How are you?' B: '___'", options: ["I'm fine, thanks.", "Yes, I am.", "My name is John."], a: 0 },
                    { q: "To ask for price: 'How ___ is this?'", options: ["many", "much", "cost"], a: 1 },
                    { q: "Saying goodbye:", options: ["Hello", "See you later", "Nice to meet you"], a: 1 }
                ],
                2: [
                    { q: "In a restaurant: 'Can I have the ___, please?'", options: ["bill", "money", "wallet"], a: 0 },
                    { q: "Apologizing: 'I am ___ for the mistake.'", options: ["sad", "sorry", "afraid"], a: 1 },
                    { q: "Asking for opinion: 'What do you ___?'", options: ["think", "believe", "idea"], a: 0 }
                ],
                3: [
                    { q: "Disagreeing politely: 'I see your point, ___...'", options: ["but you are wrong", "however I disagree", "shut up"], a: 1 },
                    { q: "Starting a presentation: 'I'd like to ___ by...'", options: ["start", "begin", "commence"], a: 0 },
                    { q: "Clarifying: 'Could you ___ on that?'", options: ["explain", "elaborate", "talk"], a: 1 }
                ]
            }
        },
        ar: {
            // Arabic translations would go here, using English for now to save space as requested logic structure
        }
    };
    // Fallback for Arabic to use English structure for demo
    separateQuizzes.ar = separateQuizzes.en;

    function renderGeneralQuiz() {
        const lang = document.documentElement.lang || 'en';
        const questions = separateQuizzes[lang][selectedCategory][selectedLevel];
        
        // Update Title
        const catTitle = document.querySelector(`[data-cat="${selectedCategory}"]`).parentElement.querySelector('h3').textContent;
        const levelTitle = document.querySelector(`.diff-btn[data-level="${selectedLevel}"]`).textContent;
        quizActiveTitle.textContent = `${catTitle} - ${levelTitle}`;
        
        generalQuizQuestions.innerHTML = '';
        generalQuizResult.textContent = '';
        submitGeneralQuizBtn.style.display = 'block';
        retryGeneralQuizBtn.style.display = 'none';
        closeGeneralQuizBtn.style.display = 'none';

        questions.forEach((q, index) => {
            const qElem = document.createElement('div');
            qElem.className = 'quiz-question';
            qElem.innerHTML = `<p>${index + 1}. ${q.q}</p>`;
            
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'quiz-options';
            
            q.options.forEach((opt, i) => {
                const optBtn = document.createElement('div');
                optBtn.className = 'quiz-option';
                optBtn.textContent = opt;
                optBtn.dataset.index = i;
                optBtn.onclick = () => {
                    optionsDiv.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
                    optBtn.classList.add('selected');
                };
                optionsDiv.appendChild(optBtn);
            });
            
            qElem.appendChild(optionsDiv);
            generalQuizQuestions.appendChild(qElem);
        });
        
        generalQuizQuestions.dataset.questions = JSON.stringify(questions);
    }

    // Category Selection
    document.querySelectorAll('.start-cat-quiz-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedCategory = btn.dataset.cat;
            quizCategories.style.display = 'none';
            quizDifficulty.style.display = 'block';
        });
    });

    // Difficulty Selection
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedLevel = btn.dataset.level;
            quizDifficulty.style.display = 'none';
            generalQuizContainer.style.display = 'block';
            renderGeneralQuiz();
        });
    });

    // Back Button
    if (backToCategoriesBtn) {
        backToCategoriesBtn.addEventListener('click', () => {
            quizDifficulty.style.display = 'none';
            quizCategories.style.display = 'grid';
        });
    }

    if (submitGeneralQuizBtn) {
        submitGeneralQuizBtn.addEventListener('click', () => {
            const questions = JSON.parse(generalQuizQuestions.dataset.questions || '[]');
            let score = 0;
            const questionDivs = generalQuizQuestions.querySelectorAll('.quiz-question');
            
            questionDivs.forEach((qDiv, index) => {
                const selected = qDiv.querySelector('.quiz-option.selected');
                if (selected) {
                    const answerIndex = parseInt(selected.dataset.index);
                    const correctIndex = questions[index].a;
                    if (answerIndex === correctIndex) score++;
                    
                    const options = qDiv.querySelectorAll('.quiz-option');
                    options[correctIndex].classList.add('correct');
                    if (answerIndex !== correctIndex) selected.classList.add('incorrect');
                }
            });

            // Confetti effect for perfect score
            if (score === questions.length && typeof confetti === 'function') {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }

            const lang = document.documentElement.lang || 'en';
            const scoreText = lang === 'ar' ? 'نتيجتك: ' : 'Your Score: ';
            
            generalQuizResult.textContent = `${scoreText} ${score} / ${questions.length}`;
            submitGeneralQuizBtn.style.display = 'none';
            retryGeneralQuizBtn.style.display = 'inline-block';
            closeGeneralQuizBtn.style.display = 'inline-block';
        });
    }

    if (retryGeneralQuizBtn) {
        retryGeneralQuizBtn.addEventListener('click', () => {
            renderGeneralQuiz();
        });
    }

    if (closeGeneralQuizBtn) {
        closeGeneralQuizBtn.addEventListener('click', () => {
            generalQuizContainer.style.display = 'none';
            quizCategories.style.display = 'grid';
        });
    }

    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
        });
    }
});

// Reading Progress Bar
window.addEventListener('scroll', () => {
    const progressBar = document.getElementById("myBar");
    if (progressBar) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    }
});

// Back to Top Button
document.addEventListener('DOMContentLoaded', () => {
    const backToTopBtn = document.getElementById("back-to-top");

    window.addEventListener('scroll', () => {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            if (backToTopBtn) backToTopBtn.style.display = "flex";
        } else {
            if (backToTopBtn) backToTopBtn.style.display = "none";
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});