import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
import indemnizacionDAO from '../src/modelo/DAO_indemnizacion.js';

const prompt = `¿Conoces la empresa ADRES? de Colombia

Se que la ADRES interviene en caso de que un usuario desee solicitar una indemnización por accidente de tránsito de diferentes tipos y en caso de un evento natural (terremotos y cosas por el estilo); lo anterior, en caso de que la persona no cuente con un SOAT o algo parecido. ¿Estoy en lo correcto?

La solicitud de dicha indemnización, hasta la actualidad (2025), se realiza por medio de un Formulario de radicación de personas naturales vigente a partir del 1 de octubre de 2023 ¿Lo conoces?
Cabe mencionar que adicionalmente, para las indemnizaciones, la ADRES sigue las normas (Decreto 780 de 2016 - MSPS
Resolución 1236 de 2023 - MSPS
Resolución 12758 de 2023 - ADRES
Circular 022 de 2023 – ADRES
Formulario único de reclamaciones por accidentes de tránsito y eventos catastróficos (eventos terroristas, catástrofes naturales y otros eventos aprobados por el MSPS) de personas naturales – FURPEN
Ley 2294 de 2023
Resolución 326 de 2023 - MSPS
Decreto 2265 de 2017, (Artículos 2.6.4.3.5.2.1 y 2.6.4.3.5.2.2)
Circular_0000026_de _20_11_2024
Formato de actualización Datos reclamantes_V1.xlsx)

Ahora, tengo un proyecto donde se digitalizó dicho formulario que mencione con anterioridad. La idea es que te lo pasaré en formato JSON y necesito que hagas el rol de Auditor de Indemnizaciones de la ADRES. ¿Qué necesito? qué me des un informe como respuesta donde detalles, únicamente regido a las normativas y a la información dada en el formulario, si es viable dar dicha indemnización, el tipo de daño que se menciona en el caso y una estimación del valor que se debería pagar como indemnización a la víctima mencionada.
`;


export async function generarFormGemini(form) {

  
  const incidentDataString = JSON.stringify(form);
  console.log(incidentDataString);
  const ai = new GoogleGenAI({ apiKey: process.env.KEY });

  try{
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt+incidentDataString,
    });
  console.log(response.text);
  return response.text;
  }catch{
     console.error('Error al generar la respuesta de Gemini:', error);
    return null;
  }

  

}