import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const systemPrompt = `أنت معلم لغة إنجليزية مختص وودود. ساعد الطالب على:
1. تعلم القواعد الأساسية والقواعس المتقدمة
2. تحسين النطق والاستماع
3. ممارسة المحادثات اليومية
4. حل الأسئلة والتمارين

رد باللغة العربية والإنجليزية. كن صبورًا وشجّع الطالب. قدّم أمثلة وتمارين عملية.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'رسالة غير صالحة' });
    }

    const messages = [
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages
    });

    const assistantMessage = response.content[0].type === 'text' 
      ? response.content[0].text 
      : 'عذرًا، حدث خطأ في الرد.';

    res.json({
      reply: assistantMessage,
      conversationHistory: [
        ...messages,
        { role: 'assistant', content: assistantMessage }
      ]
    });
  } catch (error) {
    console.error('خطأ API:', error);
    res.status(500).json({
      error: error.message || 'خطأ في الاتصال بـ API'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 خادم التعليم يعمل على http://localhost:${PORT}`);
  console.log('تأكد من تعيين ANTHROPIC_API_KEY في ملف .env');
});
