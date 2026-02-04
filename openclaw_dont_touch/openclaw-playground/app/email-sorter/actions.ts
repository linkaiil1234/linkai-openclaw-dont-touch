'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const googleKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

const genAI = googleKey ? new GoogleGenerativeAI(googleKey) : null;
const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;

export async function suggestCategories(manifesto: string, existingIds: string[] = []) {
  const systemPrompt = `You are an email organization expert. Suggest 5 NEW email categories based on the user's manifesto. 
  Do NOT suggest categories with these IDs: ${existingIds.join(', ')}.
  Return ONLY a JSON object with this structure: { "suggestions": [{ "id": "short_id", "name": "Category Name (with Emoji)", "desc": "Short description", "color": "#hex" }] }`;

  try {
    if (openai) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Manifesto: ${manifesto}` }
        ],
        response_format: { type: "json_object" }
      });
      const data = JSON.parse(response.choices[0].message.content || '{}');
      return { success: true, data: data.suggestions || [] };
    }
    
    if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(systemPrompt + "\n\nManifesto: " + manifesto);
      const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(text);
      return { success: true, data: data.suggestions || [] };
    }

    throw new Error("No AI API keys configured (OpenAI or Gemini)");

  } catch (error: any) {
    console.error("AI Error:", error);
    return { success: false, error: error.message };
  }
}

export async function runSortTest(manifesto: string, categories: any[]) {
    // Mock for now until we have auth session
    return {
        success: true,
        results: [
            { from: "billing@aws.com", subject: "Invoice #1234", snippet: "Your payment processed...", categoryId: "invoices", category: "Invoices", reason: "Contains billing keywords" },
            { from: "newsletter@substack.com", subject: "Daily Digest", snippet: "Top stories...", categoryId: "newsletters", category: "Newsletters", reason: "Newsletter platform" },
            { from: "security@google.com", subject: "New sign-in", snippet: "Was this you?", categoryId: "security", category: "Security", reason: "Security alert" }
        ]
    };
}
