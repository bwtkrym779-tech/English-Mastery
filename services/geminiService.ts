
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const API_KEY = process.env.API_KEY || "";

export class GeminiTutorService {
  private ai: GoogleGenAI;
  private chat: any;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are a friendly and encouraging English language tutor named 'Nova'. 
        Your goal is to help Arabic-speaking students practice their English. 
        Rules:
        1. Always encourage the student.
        2. Correct their English grammar or spelling mistakes politely if you spot them.
        3. Use a mix of English and Arabic for explanations if the user seems to struggle, but encourage them to speak more English.
        4. Keep responses concise and engaging.
        5. Provide examples for vocabulary used.`,
        temperature: 0.7,
      },
    });
  }

  async sendMessage(text: string): Promise<string> {
    try {
      const response = await this.chat.sendMessage({ message: text });
      return response.text || "عذراً، لم أستطع معالجة طلبك حالياً.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "حدث خطأ في الاتصال بالمدرب الذكي. يرجى المحاولة لاحقاً.";
    }
  }

  async getLessonExplanation(lessonTitle: string): Promise<string> {
    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Explain the English lesson: "${lessonTitle}" to an Arabic speaking student. 
            Provide key vocabulary, grammar rules, and 3 example sentences. 
            Format the response in clear Markdown with headings.`,
        });
        return response.text || "لا يتوفر شرح حالياً.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "فشل تحميل شرح الدرس.";
    }
  }
}

export const tutorService = new GeminiTutorService();
