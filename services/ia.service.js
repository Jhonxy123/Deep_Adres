import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();


const ai = new GoogleGenAI({ apiKey: process.env.KEY });

async function main() {
    try{
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Qué tal es la universidad distrital de bogotá colombia?",
  });
  console.log(response.text);
   } catch (error) {
    console.error("❌ Error al generar contenido:", error.message || error);
  }
}

main();