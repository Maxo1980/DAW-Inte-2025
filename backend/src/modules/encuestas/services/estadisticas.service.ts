import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EstadisticasService {
    private readonly groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    private readonly groqApiKey = process.env.GROQ_API_KEY;

    async analizarRespuestasAbiertas(respuestas: string[]): Promise<{ resumen: string; palabrasClave: string[] }> {
        const prompt = `
Tengo estas respuestas a una misma pregunta de encuesta:

${respuestas.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Genera un resumen de los temas más mencionados. Luego, lista las palabras clave más frecuentes (máximo 5).
Respuesta en formato JSON con esta estructura:
{
  "resumen": "...",
  "palabrasClave": ["...", "..."]
}
No quiero texto extra, solo la respuesta en el formato seleccionado.`;

        const response = await axios.post(
            this.groqApiUrl,
            {
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: 'Eres un asistente que analiza comentarios.' },
                    { role: 'user', content: prompt }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${this.groqApiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const content = response.data.choices[0].message.content;

        try {
            return JSON.parse(content);
        } catch {
            return { resumen: 'No se pudo procesar.', palabrasClave: [] };
        }
    }
}