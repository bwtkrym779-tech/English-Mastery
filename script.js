// Navigation Tab Handling
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const homeSection = document.querySelector('.hero-section');
    const lessonsSection = document.querySelector('.lessons-section');
    const statsSection = document.querySelector('.stats-section');
    const quizMainSection = document.querySelector('.quiz-main-section');
    
    // Hide/Show sections based on tab
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');

            // Show/hide sections
            const targetId = tab.getAttribute('href');
            
            // Hide all sections
            if (homeSection) homeSection.style.display = 'none';
            if (lessonsSection) lessonsSection.style.display = 'none';
            if (statsSection) statsSection.style.display = 'none';
            if (quizMainSection) quizMainSection.style.display = 'none';

            if (targetId === '#lessons') {
                if (lessonsSection) lessonsSection.style.display = 'block';
            } else if (targetId === '#home') {
                if (homeSection) homeSection.style.display = 'grid';
            } else if (targetId === '#stats') {
                if (statsSection) statsSection.style.display = 'block';
            } else if (targetId === '#quiz') {
                if (quizMainSection) quizMainSection.style.display = 'block';
            }
        });
    });

    // Set first tab as active by default
    if (tabs.length > 0) {
        tabs[0].classList.add('active');
        if (lessonsSection) lessonsSection.style.display = 'none';
        if (statsSection) statsSection.style.display = 'none';
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
    const modal = document.getElementById('lesson-modal');
    const closeBtn = document.querySelector('.close-modal');
    const lessonLinks = document.querySelectorAll('.lesson-link');
    
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
    const levelBtns = document.querySelectorAll('.level-btn');
    let currentLessonName = '';

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
            'phrasal': ['Movement Verbs', 'Change Verbs', 'Emotion Verbs']
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
            'phrasal': ['أفعال الحركة', 'أفعال التغيير', 'أفعال المشاعر']
        }
    };

    // Detailed Content Data by Level
    const fullLessonContent = {
        en: {
            'business': {
                1: '<strong>Level 1: Basics</strong><br>Learn formal workplace greetings:<br>- "Good morning / Good afternoon"<br>- "How may I assist you?" (Formal way to help)<br>Keywords: Meeting, Office, Manager.',
                2: '<strong>Level 2: Useful Phrases</strong><br>Requesting time off or reporting delay:<br>- "I would like to request a day off."<br>- "I might be running a bit late due to traffic."',
                3: '<strong>Level 3: Advanced Conversation</strong><br>Managing meetings & negotiation:<br>- "Let\'s move on to the next item on the agenda."<br>- "I see your point, however, we must consider the budget constraints."'
            },
            'auxiliary': {
                1: '<strong>Level 1: Verb to Be</strong><br>Using am, is, are:<br>- I am happy.<br>- She is a doctor.<br>- They are here.',
                2: '<strong>Level 2: Do & Does</strong><br>Used for questions and negatives in Present Simple:<br>- Do you like pizza?<br>- He does not (doesn\'t) know.',
                3: '<strong>Level 3: Have & Has</strong><br>Used in Perfect tenses:<br>- I have finished my work.<br>- She has gone to Paris.'
            },
            'greetings': {
                1: '<strong>Level 1: Hello</strong><br>- Hello / Hi<br>- Good morning<br>- Good night',
                2: '<strong>Level 2: Meeting People</strong><br>- Nice to meet you.<br>- Where are you from?<br>- What do you do?',
                3: '<strong>Level 3: Informal Greetings</strong><br>- What\'s up?<br>- How\'s it going?<br>- Long time no see.'
            },
            'past': {
                1: '<strong>Level 1: Formation</strong><br>Add -ed to regular verbs:<br>- Play -> Played<br>- Watch -> Watched<br>Example: I played football yesterday.',
                2: '<strong>Level 2: Irregular Verbs</strong><br>Verbs that change completely:<br>- Go -> Went<br>- See -> Saw<br>- Eat -> Ate',
                3: '<strong>Level 3: Negatives & Questions</strong><br>Use "Did" for negatives and questions:<br>- I did not (didn\'t) go.<br>- Did you see him?'
            }
        },
        ar: {
            'business': {
                1: '<strong>المستوى 1: أساسيات</strong><br>تعلم التحيات الرسمية في العمل:<br>- "Good morning" (صباح الخير)<br>- "How can I help you?" (كيف يمكنني مساعدتك؟)<br>كلمات مهمة: Meeting (اجتماع), Office (مكتب), Manager (مدير).',
                2: '<strong>المستوى 2: جمل مفيدة</strong><br>كيفية طلب إجازة أو تأخير:<br>- "I would like to request a day off." (أود طلب يوم إجازة)<br>- "I might be a bit late today due to traffic." (قد أتأخر قليلاً بسبب الزحام).',
                3: '<strong>المستوى 3: محادثة متقدمة</strong><br>إدارة اجتماع والتفاوض:<br>- "Let\'s move to the next item on the agenda." (لننتقل للنقطة التالية في الجدول)<br>- "I understand your point, but we need to consider the budget." (أفهم وجهة نظرك، لكن علينا مراعاة الميزانية).'
            },
            'auxiliary': {
                1: '<strong>المستوى 1: Verb to Be</strong><br>استخدام am, is, are:<br>- I am happy. (أنا سعيد)<br>- She is a doctor. (هي طبيبة)<br>- They are here. (هم هنا)',
                2: '<strong>المستوى 2: Do & Does</strong><br>تستخدم للنفي والسؤال في المضارع البسيط:<br>- Do you like pizza? (هل تحب البيتزا؟)<br>- He does not (doesn\'t) know. (هو لا يعرف)',
                3: '<strong>المستوى 3: Have & Has</strong><br>تستخدم في الأزمنة التامة:<br>- I have finished my work. (لقد أنهيت عملي)<br>- She has gone to Paris. (لقد ذهبت إلى باريس)'
            },
            'greetings': {
                1: '<strong>المستوى 1: مرحبا</strong><br>- Hello / Hi (مرحبا)<br>- Good morning (صباح الخير)<br>- Good night (تصبح على خير)',
                2: '<strong>المستوى 2: التعارف</strong><br>- Nice to meet you. (تشرفت بلقائك)<br>- Where are you from? (من أين أنت؟)<br>- What do you do? (ماذا تعمل؟)',
                3: '<strong>المستوى 3: تحيات غير رسمية</strong><br>- What\'s up? (ما الجديد؟)<br>- How\'s it going? (كيف تجري الأمور؟)<br>- Long time no see. (لم نرك منذ وقت طويل)'
            },
            'past': {
                1: '<strong>المستوى 1: التكوين</strong><br>نضيف -ed للأفعال المنتظمة:<br>- Play -> Played<br>- Watch -> Watched<br>مثال: I played football yesterday.',
                2: '<strong>المستوى 2: الأفعال الشاذة</strong><br>أفعال يتغير شكلها بالكامل:<br>- Go -> Went<br>- See -> Saw<br>- Eat -> Ate',
                3: '<strong>المستوى 3: النفي والسؤال</strong><br>نستخدم Did للنفي والسؤال:<br>- I did not (didn\'t) go.<br>- Did you see him?'
            }
        }
    };

    // Quiz Data
    const lessonQuizzes = {
        en: {
            'business': {
                1: [
                    { q: "What is a formal greeting?", options: ["Hey", "Good morning", "Yo"], a: 1 },
                    { q: "Who manages the office?", options: ["Manager", "Friend", "Guest"], a: 0 }
                ],
                2: [
                    { q: "How do you request time off?", options: ["I want out", "I request a day off", "Bye"], a: 1 }
                ]
            },
            'default': [
                { q: "Did you understand the lesson?", options: ["Yes", "No"], a: 0 }
            ]
        },
        ar: {
            'business': {
                1: [
                    { q: "ما هي التحية الرسمية؟", options: ["أهلا", "صباح الخير", "يا هلا"], a: 1 },
                    { q: "من يدير المكتب؟", options: ["المدير", "الصديق", "الضيف"], a: 0 }
                ]
            },
            'default': [
                { q: "هل فهمت الدرس؟", options: ["نعم", "لا"], a: 0 }
            ]
        }
    };

    function getLessonContent(name, level) {
        const lang = document.documentElement.lang || 'en';
        const content = fullLessonContent[lang][name];
        if (content && content[level]) {
            return content[level];
        }
        return `<strong>Level ${level}</strong><br>Content for this lesson is currently under development. Please try again later or choose another lesson.`;
    }

    function openModal(card) {
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

        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    }

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            // remove glow from any card when modal closes
            document.querySelectorAll('.lesson-card.glow').forEach(c => c.classList.remove('glow'));
        }, 300);
    }

    lessonLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const card = link.closest('.lesson-card');
            openModal(card);
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
            // Load Level 1 by default
            levelBtns.forEach(btn => btn.classList.remove('active'));
            document.querySelector('.level-btn[data-level="1"]').classList.add('active');
            activeLessonContent.innerHTML = getLessonContent(currentLessonName, 1);
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

    // Handle Level Tabs
    levelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            levelBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const level = btn.getAttribute('data-level');
            activeLessonContent.innerHTML = getLessonContent(currentLessonName, level);
            if (quizSection) quizSection.style.display = 'none';
            if (showQuizBtn) showQuizBtn.style.display = 'block';
        });
    });

    // Quiz Logic
    function loadQuiz(lessonId, level) {
        const lang = document.documentElement.lang || 'en';
        const quizzes = lessonQuizzes[lang][lessonId] || lessonQuizzes[lang]['default'];
        const questions = Array.isArray(quizzes) ? quizzes : (quizzes[level] || lessonQuizzes[lang]['default']);
        
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
            const activeLevelBtn = document.querySelector('.level-btn.active');
            const level = activeLevelBtn ? activeLevelBtn.dataset.level : 1;
            loadQuiz(currentLessonName, level);
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
                level: document.querySelector('.level-btn.active')?.dataset.level || 1,
                score: score,
                total: questions.length,
                date: new Date().toISOString()
            });
            localStorage.setItem('quizProgress', JSON.stringify(quizProgress));
            updateStatsUI();
            
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

    function updateStatsUI() {
        // Update Word Count
        const vocabulary = JSON.parse(localStorage.getItem('vocabulary')) || [];
        const wordCount = document.getElementById('word-count');
        if (wordCount) wordCount.textContent = vocabulary.length;

        // Update Quiz Score
        const quizProgress = JSON.parse(localStorage.getItem('quizProgress')) || [];
        const quizScoreAvg = document.getElementById('quiz-score-avg');
        if (quizScoreAvg) {
            if (quizProgress.length > 0) {
                const total = quizProgress.reduce((acc, curr) => acc + (curr.score / curr.total), 0);
                const avg = Math.round((total / quizProgress.length) * 100);
                quizScoreAvg.textContent = `${avg}%`;
            } else {
                quizScoreAvg.textContent = '0%';
            }
        }
        
        updateLeaderboardUI();
    }

    function updateLeaderboardUI() {
        const leaderboardBody = document.getElementById('leaderboard-body');
        if (!leaderboardBody) return;

        // Get current user score (100 points per correct answer)
        const quizProgress = JSON.parse(localStorage.getItem('quizProgress')) || [];
        const userScore = quizProgress.reduce((acc, curr) => acc + (curr.score * 100), 0);

        // Mock Data for other users
        const mockUsers = [
            { name: "Sarah J.", score: 1200 },
            { name: "Mike T.", score: 850 },
            { name: "Ahmed K.", score: 1500 },
            { name: "Emma W.", score: 600 }
        ];

        // Add current user
        const allUsers = [...mockUsers, { name: "You", score: userScore, isCurrentUser: true }];

        // Sort by score descending
        allUsers.sort((a, b) => b.score - a.score);

        // Render
        leaderboardBody.innerHTML = '';
        allUsers.forEach((user, index) => {
            const tr = document.createElement('tr');
            if (user.isCurrentUser) tr.classList.add('current-user');
            
            const nameCell = user.isCurrentUser ? '<td data-i18n="leaderboard.you">You</td>' : `<td>${user.name}</td>`;
            
            tr.innerHTML = `
                <td>#${index + 1}</td>
                ${nameCell}
                <td>${user.score} pts</td>
            `;
            leaderboardBody.appendChild(tr);
        });
    }

    // Initialize UI
    updateLessonProgressUI();
    updateStatsUI();

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
            
            // Update UI if visible
            updateStatsUI();
        }
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
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
            nav: { home: "Home", lessons: "Lessons", quiz: "Quiz", stats: "Stats" },
            common: { backToTop: "Back to Top" },
            hero: { title: "Learn English", highlight: "Smartly & Easily", desc: "Use the power of AI to improve your conversation and grammar skills. Professional lessons, accurate statistics, and a smart teacher available 24/7.", btn1: "Discover Lessons", btn2: "Start Journey Now", badge: "500+ New Students" },
            lessons: { title: "Lesson Library", subtitle: "Choose a lesson to start your learning journey", search: "Search for a lesson or level..." },
            filter: { all: "All", grammar: "Grammar", vocabulary: "Vocabulary", skills: "Skills" },
            stats: { label: "Words Learned", quizScore: "Avg Quiz Score", leaderboard: "Leaderboard" },
            leaderboard: { rank: "Rank", name: "User", score: "Score", you: "You" },
            quiz: { title: "Quiz", take: "Take Quiz", submit: "Submit Answers", score: "Your Score: ", mainTitle: "Practice Quizzes", mainDesc: "Test your knowledge with general English quizzes", general: "General Knowledge", generalDesc: "Test your overall English skills", start: "Start Quiz", generalTitle: "General English Quiz", retry: "Try Again", close: "Close" },
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
                phrasal: { title: "Essential Phrasal Verbs", desc: "Important phrasal verbs (get up, look for) used by native speakers." }
            },
            level: { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
            modal: { content: "Lesson Content:", start: "Start Lesson", explanation: "Lesson Explanation", 1: "Level 1", 2: "Level 2", 3: "Level 3" }
        },
        ar: {
            nav: { home: "الرئيسية", lessons: "الدروس", quiz: "اختبارات", stats: "إحصائياتي" },
            common: { backToTop: "العودة للأعلى" },
            hero: { title: "تعلم الإنجليزية", highlight: "بذكاء وسهولة", desc: "استخدم قوة الذكاء الاصطناعي لتطوير مهاراتك في المحادثة والقواعد. دروس محترفة، إحصائيات دقيقة، ومدرس ذكي متاح لك 24/7.", btn1: "اكتشف الدروس", btn2: "ابدأ رحلتك الآن", badge: "500+ طالب جديد" },
            lessons: { title: "مكتبة الدروس", subtitle: "اختر درسًا للبدء في رحلة التعلم الخاصة بك", search: "ابحث عن درس أو مستوى..." },
            filter: { all: "الكل", grammar: "قواعد", vocabulary: "مفردات", skills: "مهارات" },
            stats: { label: "كلمة تم تعلمها", quizScore: "متوسط درجات الاختبار", leaderboard: "لوحة المتصدرين" },
            leaderboard: { rank: "الترتيب", name: "المستخدم", score: "النقاط", you: "أنت" },
            quiz: { title: "اختبار", take: "ابدأ الاختبار", submit: "إرسال الإجابات", score: "نتيجتك: ", mainTitle: "اختبارات الممارسة", mainDesc: "اختبر معلوماتك مع اختبارات اللغة الإنجليزية العامة", general: "معلومات عامة", generalDesc: "اختبر مهاراتك العامة في اللغة الإنجليزية", start: "ابدأ الاختبار", generalTitle: "اختبار اللغة الإنجليزية العام", retry: "حاول مرة أخرى", close: "إغلاق" },
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
                phrasal: { title: "الأفعال المركبة", desc: "أهم الأفعال المركبة (get up, look for) التي يستخدمها المتحدثون الأصليون" }
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
    const startGeneralQuizBtn = document.getElementById('start-general-quiz-btn');
    const generalQuizContainer = document.getElementById('general-quiz-container');
    const generalQuizQuestions = document.getElementById('general-quiz-questions');
    const submitGeneralQuizBtn = document.getElementById('submit-general-quiz-btn');
    const retryGeneralQuizBtn = document.getElementById('retry-general-quiz-btn');
    const closeGeneralQuizBtn = document.getElementById('close-general-quiz-btn');
    const generalQuizResult = document.getElementById('general-quiz-result');
    const quizGrid = document.querySelector('.quiz-grid');
    const generalQuizHighScoreEl = document.getElementById('general-quiz-highscore');

    const generalQuestionsPool = {
        en: [
            { q: "Which is a synonym for 'happy'?", options: ["Sad", "Joyful", "Angry"], a: 1 },
            { q: "Complete: I ___ to the store yesterday.", options: ["go", "gone", "went"], a: 2 },
            { q: "What is the plural of 'child'?", options: ["Childs", "Children", "Childrens"], a: 1 },
            { q: "Select the correct article: ___ apple.", options: ["A", "An", "The"], a: 1 },
            { q: "Opposite of 'Big'?", options: ["Large", "Small", "Huge"], a: 1 },
            { q: "Which word is a verb?", options: ["Run", "Blue", "Table"], a: 0 },
            { q: "Past participle of 'eat'?", options: ["Ate", "Eaten", "Eating"], a: 1 },
            { q: "She ___ playing tennis now.", options: ["is", "are", "am"], a: 0 },
            { q: "We ___ TV last night.", options: ["watch", "watched", "watching"], a: 1 },
            { q: "___ you like coffee?", options: ["Do", "Does", "Is"], a: 0 }
        ],
        ar: [
            { q: "ما هو مرادف 'happy'؟", options: ["Sad", "Joyful", "Angry"], a: 1 },
            { q: "أكمل: I ___ to the store yesterday.", options: ["go", "gone", "went"], a: 2 },
            { q: "ما هو جمع 'child'؟", options: ["Childs", "Children", "Childrens"], a: 1 },
            { q: "اختر الأداة الصحيحة: ___ apple.", options: ["A", "An", "The"], a: 1 },
            { q: "عكس كلمة 'Big'؟", options: ["Large", "Small", "Huge"], a: 1 },
            { q: "أي كلمة هي فعل؟", options: ["Run", "Blue", "Table"], a: 0 },
            { q: "التصريف الثالث للفعل 'eat'؟", options: ["Ate", "Eaten", "Eating"], a: 1 },
            { q: "She ___ playing tennis now.", options: ["is", "are", "am"], a: 0 },
            { q: "We ___ TV last night.", options: ["watch", "watched", "watching"], a: 1 },
            { q: "___ you like coffee?", options: ["Do", "Does", "Is"], a: 0 }
        ]
    };

    function updateHighScoreUI() {
        const highScore = localStorage.getItem('generalQuizHighScore');
        if (highScore !== null && generalQuizHighScoreEl) {
            const lang = document.documentElement.lang || 'en';
            const label = lang === 'ar' ? 'أعلى نتيجة: ' : 'High Score: ';
            generalQuizHighScoreEl.textContent = `${label}${highScore}/5`;
            generalQuizHighScoreEl.style.display = 'block';
        }
    }

    function renderGeneralQuiz() {
        const lang = document.documentElement.lang || 'en';
        const pool = generalQuestionsPool[lang] || generalQuestionsPool['en'];
        
        // Shuffle and pick 5
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);
        
        generalQuizQuestions.innerHTML = '';
        generalQuizResult.textContent = '';
        submitGeneralQuizBtn.style.display = 'block';
        retryGeneralQuizBtn.style.display = 'none';
        closeGeneralQuizBtn.style.display = 'none';

        selected.forEach((q, index) => {
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
        
        generalQuizQuestions.dataset.questions = JSON.stringify(selected);
    }

    if (startGeneralQuizBtn) {
        startGeneralQuizBtn.addEventListener('click', () => {
            quizGrid.style.display = 'none';
            generalQuizContainer.style.display = 'block';
            renderGeneralQuiz();
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

            const currentHighScore = parseInt(localStorage.getItem('generalQuizHighScore') || '0');
            if (score > currentHighScore) {
                localStorage.setItem('generalQuizHighScore', score);
            }
            updateHighScoreUI();

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
            quizGrid.style.display = 'grid';
        });
    }

    // Initialize High Score
    updateHighScoreUI();

    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            setTimeout(updateHighScoreUI, 50);
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
