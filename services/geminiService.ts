
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GeneratedQuestion } from '../types';

// Ensure API_KEY is handled by the build/environment process.
const API_KEY = process.env.API_KEY || ""; 

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const DEFAULT_NUM_AI_SUGGESTIONS = 10; // Default number of questions to request from AI

const validateSingleGeneratedQuestion = (q: any): q is GeneratedQuestion => {
  return (
    q &&
    typeof q.question === 'string' &&
    Array.isArray(q.choices) &&
    q.choices.length >= 2 && 
    q.choices.every((c: any) => typeof c === 'string') &&
    typeof q.answer === 'string' &&
    typeof q.explanation === 'string' &&
    // Ensure the answer is one of the choices (case-insensitive, trimmed)
    q.choices.map((c:string) => c.trim().toLowerCase()).includes(q.answer.trim().toLowerCase())
  );
};


export const generateAIQuestionSuggestions = async (category: string, count: number = DEFAULT_NUM_AI_SUGGESTIONS): Promise<GeneratedQuestion[]> => {
  if (!API_KEY) {
    throw new Error("API Key ไม่ได้ตั้งค่าสำหรับ Gemini API");
  }

  const model = 'gemini-2.5-flash-preview-04-17';
  // Refined prompt to be more explicit and less prone to malformed JSON
  const prompt = `
คุณเป็น AI ผู้เชี่ยวชาญในการสร้างคำถามสำหรับการสอบใบอนุญาตประกอบวิชาชีพครูในประเทศไทย
โปรดสร้างคำถามปรนัย ${count} ข้อ สำหรับหมวดหมู่: "${category}"
แต่ละคำถามควรเป็นปรนัย มี 4 ตัวเลือก โดยมีเพียง 1 ตัวเลือกที่ถูกต้อง
กรุณาให้คำตอบที่ถูกต้องพร้อมคำอธิบายสั้นๆ เกี่ยวกับเหตุผลที่คำตอบนั้นถูกต้อง

โปรดตอบกลับในรูปแบบ JSON array เสมอ (แม้ว่าจะมีเพียงคำถามเดียวหรือไม่มีคำถามเลยก็ตาม)
แต่ละ object ภายใน array นั้น จะต้องมีโครงสร้างดังนี้:
{
  "question": "คำถามภาษาไทยที่สร้างขึ้น",
  "choices": ["ตัวเลือกที่ 1 (ภาษาไทย)", "ตัวเลือกที่ 2 (ภาษาไทย)", "ตัวเลือกที่ 3 (ภาษาไทย)", "ตัวเลือกที่ 4 (ภาษาไทย)"],
  "answer": "ตัวเลือกที่เป็นคำตอบที่ถูกต้อง (ต้องตรงกับหนึ่งใน choices ทุกประการ)",
  "explanation": "คำอธิบายสำหรับคำตอบที่ถูกต้อง (ภาษาไทย)"
}

ตัวอย่างเช่น หากคุณสร้าง 2 คำถาม ผลลัพธ์ควรเป็น array ที่มี 2 objects ตามโครงสร้างด้านบน
ถ้าไม่สามารถสร้างคำถามได้เลย ให้ส่งกลับเป็น array ว่าง []
ห้ามใส่ comment หรือข้อความอื่นใดนอกเหนือจาก JSON array ที่ถูกต้อง
`;
  let jsonStr = ''; // Declare jsonStr here to make it accessible in the catch block

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: count > 1 ? 0.78 : 0.65, // Slightly adjusted temperature
      },
    });
    
    jsonStr = response.text.trim();
    // More robust fence removal, handles potential variations in markdown
    const fenceRegex = /^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }

    const parsedData = JSON.parse(jsonStr);

    if (!Array.isArray(parsedData)) {
        console.error("AI response is not an array after parsing:", parsedData);
        throw new Error("AI ไม่ได้ตอบกลับในรูปแบบอาร์เรย์ที่คาดไว้หลังจากประมวลผลแล้ว");
    }

    const validQuestions: GeneratedQuestion[] = [];
    for (const item of parsedData) {
        // Attempt to normalize if answer isn't directly in choices due to minor variations
        // This step is crucial if AI slightly deviates in the answer string vs choice string
        let correctedItem = {...item};
        if (correctedItem && Array.isArray(correctedItem.choices) && typeof correctedItem.answer === 'string') {
            const foundChoice = correctedItem.choices.find((c: string) => c.trim().toLowerCase() === correctedItem.answer.trim().toLowerCase());
            if (foundChoice) {
                correctedItem.answer = foundChoice; // Correct the answer to match a choice string exactly
            }
        }

        if (validateSingleGeneratedQuestion(correctedItem)) {
            validQuestions.push(correctedItem);
        } else {
            console.warn("AI generated a malformed or invalid question suggestion, skipping:", item, "Validated item:", correctedItem);
        }
    }
    
    if (validQuestions.length === 0 && parsedData.length > 0) {
        // This means AI sent data, but none of it was valid after our checks
        console.warn("AI responded with data, but no questions were valid after validation. Original parsed data:", parsedData);
        // It might be better to return an empty array than throw an error here, 
        // unless we are certain the AI should always return something.
        // For now, let's allow empty if AI says it's empty.
    }
    
    return validQuestions;

  } catch (error) {
    console.error("Error generating AI question suggestions:", error);
    let errorMessage = "เกิดข้อผิดพลาดที่ไม่รู้จักในการสร้างคำถามด้วย AI";
    if (error instanceof Error) {
        errorMessage = error.message;
        if (error.message.includes("API key not valid")) {
            errorMessage = "API Key ไม่ถูกต้อง โปรดตรวจสอบการตั้งค่า";
        } else if (error instanceof SyntaxError) {
             errorMessage = `เกิดข้อผิดพลาดในการประมวลผล JSON จาก AI: ${error.message}. เนื้อหา JSON ที่พยายามประมวลผล (บางส่วน): ${jsonStr ? jsonStr.substring(0,500) + (jsonStr.length > 500 ? "..." : "") : "ไม่สามารถแสดงเนื้อหา JSON ได้"}`;
        } else {
            errorMessage = `เกิดข้อผิดพลาดในการสร้างคำถามด้วย AI: ${error.message}`;
        }
    }
    throw new Error(errorMessage);
  }
};
