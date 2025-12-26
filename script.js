document.addEventListener('DOMContentLoaded',()=>{
  const menuBtn=document.getElementById('menuBtn');
  const nav=document.getElementById('nav');
  const lessonButtons=document.querySelectorAll('.open-lesson');
  const modal=document.getElementById('lessonModal');
  const lessonBody=document.getElementById('lessonBody');
  const closeModal=document.getElementById('closeModal');
  const userInput=document.getElementById('userInput');
  const sendBtn=document.getElementById('sendBtn');
  const chatHistory=document.getElementById('chatHistory');

  menuBtn.addEventListener('click',()=>{
    document.querySelectorAll('.nav a').forEach(a=>{
      a.style.display = a.style.display === 'inline-block' ? 'none' : 'inline-block';
    });
  });

  const lessons = {
    1: '<h4>درس 1 — الحروف والأصوات</h4><p>أمثلة: A /eɪ/، B /biː/، C /siː/. ستمرّن على نطق كل حرف.</p>',
    2: '<h4>درس 2 — أساسيات القواعد</h4><p>مثال: I eat apples. (أنا آكل تفاحًا). فاعل + فعل + مفعول.</p>',
    3: '<h4>درس 3 — محادثات يومية</h4><p>مرحبا! How are you? — I am fine, thank you. تعلّم الردود البسيطة.</p>'
  };

  lessonButtons.forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id=btn.dataset.lesson;
      lessonBody.innerHTML = lessons[id] || '<p>الدرس غير موجود.</p>';
      modal.style.display = 'flex';
    });
  });

  closeModal.addEventListener('click',()=> modal.style.display='none');
  modal.addEventListener('click',(e)=>{ if(e.target===modal) modal.style.display='none'; });

  // الدردشة الذكية مع AI
  let conversationHistory = [];

  const addMessage = (text, sender) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;
    msgDiv.textContent = text;
    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  };

  const sendMessage = async () => {
    const msg = userInput.value.trim();
    if (!msg) return;

    addMessage(msg, 'user');
    userInput.value = '';
    sendBtn.disabled = true;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          conversationHistory: conversationHistory
        })
      });

      const data = await response.json();
      if (data.reply) {
        addMessage(data.reply, 'assistant');
        conversationHistory = data.conversationHistory || conversationHistory;
      } else {
        addMessage('عذرًا، حدث خطأ: ' + (data.error || 'خطأ غير معروف'), 'assistant');
      }
    } catch (err) {
      addMessage('❌ خطأ الاتصال: ' + err.message, 'assistant');
    } finally {
      sendBtn.disabled = false;
      userInput.focus();
    }
  };

  sendBtn.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
});
