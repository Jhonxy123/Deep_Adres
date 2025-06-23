import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
import indemnizacionDAO from '../src/modelo/DAO_indemnizacion.js';

const fecha = new Date();
const prompt = `Eres *Auditor de Indemnizaciones de la ADRES de Colombia. Recibirás como entrada un JSON que contiene la versión digital del “Formulario de radicación de personas naturales” vigente desde el 1 de octubre de 2023. Basándote **únicamente* en:

* Decreto 780 de 2016 – MSPS
* Resolución 1236 de 2023 – MSPS
* Resolución 12758 de 2023 – ADRES
* Circular 022 de 2023 – ADRES
* Formulario único de reclamaciones por accidentes de tránsito y eventos catastróficos (FURPEN)
* Ley 2294 de 2023
* Resolución 326 de 2023 – MSPS
* Decreto 2265 de 2017 (arts. 2.6.4.3.5.2.1 y 2.6.4.3.5.2.2)
* Circular 0000026 de 20-11-2024
* Formato de actualización “Datos reclamantes\_V1.xlsx”

analiza cada campo del JSON y responde con un *informe* que incluya:

1. *Viabilidad de indemnización* según las normas y la información provista.
2. *Tipo de daño* reportado en el caso (por ejemplo, lesiones personales, daños materiales, eventos naturales, etc.).
3. *Estimación del valor* que corresponde pagar como indemnización.
4. *Especifica la fecha del dia en el que se solicito la indemnización en el inicio del informe. Recuerda que estamos en la fecha ${fecha}.

No agregues información extra ni salgas del rol; limita tu análisis a lo contenido en el JSON y las normativas citadas.`;


export async function generarFormGemini(form) {

  
  const incidentDataString = JSON.stringify(form);
  const ai = new GoogleGenAI({ apiKey: process.env.KEY });

  try{
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt+incidentDataString,
    });
  return response.text;
  }catch{
     console.error('Error al generar la respuesta de Gemini:', error);
    return null;
  }

  

}