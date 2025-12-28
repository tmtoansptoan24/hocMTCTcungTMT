
import { GoogleGenAI, Type } from "@google/genai";
import { HistoricalFigure, GenerationResult } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateHistoricalContent(characterName: string): Promise<GenerationResult> {
    // 1. Generate Text Info
    const textResponse = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Hãy cung cấp thông tin về nhân vật lịch sử Việt Nam: ${characterName}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            title: { type: Type.STRING },
            era: { type: Type.STRING },
            description: { type: Type.STRING },
            achievements: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            inspirationalQuote: { type: Type.STRING }
          },
          required: ["name", "title", "era", "description", "achievements", "inspirationalQuote"]
        }
      }
    });

    const figure: HistoricalFigure = JSON.parse(textResponse.text);

    // 2. Generate Coloring Image (Line Art)
    const coloringPrompt = `A high-quality, professional black and white coloring book page, clean line art of ${figure.name}, a famous Vietnamese historical figure. Heroic pose, traditional Vietnamese armor or clothing from the ${figure.era} era. Clear black outlines, pure white background, no shading, minimal complex details for easy coloring. Cultural elements like dragons or lotus in the background.`;
    
    const coloringImageResponse = await this.ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: coloringPrompt,
      config: {
        imageConfig: { aspectRatio: "3:4" }
      }
    });

    let coloringImageUrl = "";
    for (const part of coloringImageResponse.candidates![0].content.parts) {
      if (part.inlineData) {
        coloringImageUrl = `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    // 3. Generate Colored Version for Inspiration
    const coloredPrompt = `A stunning, high-quality cinematic digital painting in vibrant colors of ${figure.name} in his traditional attire. Epic lighting, historical accuracy, detailed textures. Use a classic Vietnamese art style mixed with modern realism.`;
    
    const coloredImageResponse = await this.ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: coloredPrompt,
      config: {
        imageConfig: { aspectRatio: "3:4" }
      }
    });

    let coloredImageUrl = "";
    for (const part of coloredImageResponse.candidates![0].content.parts) {
      if (part.inlineData) {
        coloredImageUrl = `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    return {
      figure,
      coloringImageUrl,
      coloredImageUrl
    };
  }
}
