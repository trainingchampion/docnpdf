
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GroundingChunk } from "../types";

export interface GeminiResponse {
  text: string;
  groundingChunks?: GroundingChunk[];
  error?: string;
}

const cleanBase64 = (data: string) => {
  return data.replace(/^data:application\/pdf;base64,/, '').replace(/\s/g, '');
};

async function safeGenerateContent(params: {
  model: string;
  contents: any;
  config?: any;
}, retries = 2): Promise<GenerateContentResponse> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    window.dispatchEvent(new CustomEvent('aistudio:reauth'));
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: params.model,
      contents: params.contents,
      config: params.config
    });

    if (response.candidates?.[0]?.finishReason === 'SAFETY') {
      throw new Error("SAFETY_BLOCK");
    }
    
    return response;
  } catch (error: any) {
    console.error("Gemini Internal Node Error:", error);
    const errorMsg = error?.message?.toLowerCase() || "";
    
    // Explicit check for 503 and Deadline errors (common in Large PDF reasoning)
    const isDeadlineError = errorMsg.includes("503") || errorMsg.includes("deadline") || errorMsg.includes("unavailable") || errorMsg.includes("deadline expired");
    
    if (errorMsg.includes("requested entity was not found") || errorMsg.includes("invalid authentication")) {
       window.dispatchEvent(new CustomEvent('aistudio:reauth'));
    }

    if (errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("limit")) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        return safeGenerateContent(params, retries - 1);
      }
      throw new Error("QUOTA_EXCEEDED");
    }

    // Handle Pro to Flash fallback on 500, 503, or timeout
    const isRpcError = errorMsg.includes("500") || errorMsg.includes("internal") || isDeadlineError || errorMsg.includes("failed");
    
    if (isRpcError && params.model === 'gemini-3-pro-preview') {
      console.warn("Hot-switching to Flash node due to latency/deadline on Pro model...");
      const fallbackConfig = { ...params.config };
      if (fallbackConfig.thinkingConfig) delete fallbackConfig.thinkingConfig;
      
      // Reduce complexity for Flash fallback to ensure completion
      if (fallbackConfig.maxOutputTokens && fallbackConfig.maxOutputTokens > 8192) {
        fallbackConfig.maxOutputTokens = 8192;
      }

      return safeGenerateContent({
        ...params,
        model: 'gemini-3-flash-preview',
        config: fallbackConfig
      }, 0); 
    }

    throw error;
  }
}

export const extractAndSolveQuestions = async (fileBase64: string, preference: string = 'Standard Step-by-step') => {
  try {
    const data = cleanBase64(fileBase64);
    
    const response = await safeGenerateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'application/pdf', data } },
          { text: `ACT AS AN EXHAUSTIVE ACADEMIC SOLVER NODE. 
          TASK: Resolve EVERY question in this document.
          TARGET: 200+ Questions supported. Do not stop early.
          STYLE: Use "${preference}" for reasoning.
          WRONG OPTION ANALYSIS: Explain why incorrect options are wrong.
          
          STRICT STRUCTURE per question:
          **[Number]. [Question]**
          ==CORRECT ANSWER: [Letter] - [Text]==
          **ANALYSIS**: [Brief reasoning for correct/incorrect options]
          ---
          
          IMPORTANT: If the document contains many questions (e.g. 100+), be concise in the ANALYSIS section to ensure ALL questions are answered within the token limit.` },
        ],
      },
      config: {
        // Increased to max for large exam papers
        maxOutputTokens: 65536,
        // Reduced thinking budget to reserve tokens for the actual output content
        thinkingConfig: { thinkingBudget: 2048 },
        systemInstruction: "Exhaustive PDF solver. Plain text only. Bold headers. Highlights for answers. Prioritize completion of all questions."
      }
    });
    return { text: response.text || "Resolution complete." };
  } catch (error: any) {
    return { text: "", error: error.message };
  }
};

export const analyzePDFs = async (filesBase64: string[], prompt: string, useSearch: boolean = false) => {
  try {
    const fileParts = filesBase64.map(data => ({
      inlineData: { mimeType: 'application/pdf', data: cleanBase64(data) },
    }));

    const response = await safeGenerateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: [...fileParts, { text: prompt }] },
      config: {
        tools: useSearch ? [{ googleSearch: {} }] : undefined,
        maxOutputTokens: 8000,
        thinkingConfig: { thinkingBudget: 3000 },
        systemInstruction: "Elite PDF analyst. Markdown bold headers. No hashes."
      }
    });

    return {
      text: response.text || "Analysis complete.",
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined
    };
  } catch (error: any) {
    return { text: "", error: error.message };
  }
};

export const summarizePDF = async (fileBase64: string) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'application/pdf', data: cleanBase64(fileBase64) } },
          { text: "High-fidelity summary. Bold headers. Highlights with ==text==." },
        ],
      },
      config: { 
        maxOutputTokens: 4000, 
        thinkingConfig: { thinkingBudget: 1000 },
        systemInstruction: "Document strategist."
      }
    });
    return { text: response.text || "" };
  } catch (error: any) {
    return { text: "", error: error.message };
  }
};

export const extractAllPDFData = async (fileBase64: string) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'application/pdf', data: cleanBase64(fileBase64) } },
          { text: "Extract all semantic data from this document. Format as high-fidelity structured intelligence." },
        ],
      },
      config: { 
        maxOutputTokens: 15000, 
        thinkingConfig: { thinkingBudget: 4000 },
        systemInstruction: "Precision data extraction node."
      }
    });
    return { text: response.text || "" };
  } catch (error: any) {
    return { text: "", error: error.message };
  }
};

export const generateQuizFromPDF = async (fileBase64: string) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'application/pdf', data: cleanBase64(fileBase64) } },
          { text: "High-fidelity quiz. **Question**, ==Correct Answer==, **Why This Is Correct**." },
        ],
      },
      config: { 
        maxOutputTokens: 6000, 
        thinkingConfig: { thinkingBudget: 2000 },
        systemInstruction: "Educational architect."
      }
    });
    return { text: response.text || "" };
  } catch (error: any) {
    return { text: "", error: error.message };
  }
};

export const reconstructQuizFromUnstructured = async (content: string, isFile: boolean = false) => {
  try {
    const parts: any[] = [];
    if (isFile) {
      parts.push({ inlineData: { mimeType: 'application/pdf', data: cleanBase64(content) } });
    } else {
      parts.push({ text: `UNSTRUCTURED CONTENT: "${content}"` });
    }
    parts.push({ text: "Reconstruct into structured quiz with pedagogical reasoning." });

    const response = await safeGenerateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: { 
        maxOutputTokens: 8000, 
        thinkingConfig: { thinkingBudget: 2000 },
        systemInstruction: "Content reconstruction node."
      }
    });
    return { text: response.text || "" };
  } catch (error: any) {
    return { text: "", error: error.message };
  }
};

export const chatWithPDFs = async (filesBase64: string[], history: any[], useSearch: boolean = false) => {
  try {
    const fileParts = filesBase64.map(data => ({
      inlineData: { mimeType: 'application/pdf', data: cleanBase64(data) },
    }));
    
    const contents = history.map(h => ({ role: h.role, parts: h.parts }));

    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [...fileParts, { text: "Reference these documents." }] },
        ...contents
      ],
      config: { 
        tools: useSearch ? [{ googleSearch: {} }] : undefined,
        systemInstruction: "Professional assistant Tehila."
      }
    });

    return {
      text: response.text || "",
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined
    };
  } catch (error: any) {
    return { text: "", error: error.message };
  }
};
