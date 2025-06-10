import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
import indemnizacionDAO from '../src/modelo/DAO_indemnizacion.js'

const userId = "2jhon45213";
const resultado = await indemnizacionDAO.encontrarForm(userId);
const incidentDataString = JSON.stringify(resultado);
console.log(incidentDataString);

const ai = new GoogleGenAI({ apiKey: process.env.KEY });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "como se resuelve la intgral de euler elevado a la -x",
  });
  console.log(response.text);
}

main();