import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateEnhancedPost = async (
  rawText: string,
  category: string
): Promise<{ title: string; description: string; tags: string[] }> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are an expert copywriter for a social marketplace app called LinkUp.
      The user wants to create a listing in the category: "${category}".
      Their raw input is: "${rawText}".

      Please generate a catchy, trustworthy, and clear Title and Description for this post. 
      Also generate 3 short tags.
      
      Return the result in strictly valid JSON format like this:
      {
        "title": "The Title",
        "description": "The Description",
        "tags": ["Tag1", "Tag2", "Tag3"]
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback if AI fails
    return {
      title: `${category} Request`,
      description: rawText,
      tags: [category, 'New']
    };
  }
};