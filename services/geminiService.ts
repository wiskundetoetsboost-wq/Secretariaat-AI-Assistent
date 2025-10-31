import { GoogleGenAI } from "@google/genai";
import type { GeneratorOptions } from '../types';

const PROMPT_TEMPLATE = `Je bent een professionele secretariële assistent. Schrijf EXACT volgens de onderstaande instructies. Geen inleiding, geen uitleg, geen opmaak buiten de tekst.

--- GEBRUIKERKEUZES ---
Formaat: {{FORMAAT}}
Modus: {{MODUS}}
Invoer: {{INVOER}}
Toon: {{TOON}}
Emoji: {{EMOJI}}
Lettertype: {{LETTERTYPE}}
Tekengrootte: {{TEKENGROOTTE}}
{{INSTRUCTIES_BLOK}}
--- STIJL PER FORMAAT ---
- **brief**: Officiële opmaak, aanhef, plaats/datum, afsluiting.
- **email**: Onderwerpregel, aanhef (Beste...), groet (Met vriendelijke groet).
- **platte tekst**: Geen opmaak, alleen de boodschap.
- **bericht voor whatsapp**: Kort, direct, spreektaal, max 3 zinnen.

--- MODUS REGELS ---
- **actie**: Bedénk zelf een passende, logische tekst op basis van {{INVOER}} en {{TOON}}
- **reactie**: Lees {{INVOER}} als een ontvangen brief/email/bericht. Schrijf een professioneel antwoord in {{TOON}}. Verwerk de "Instructies voor antwoord" (indien aanwezig) in je reactie.

--- TOON AANPASSING ---
Pas de woordkeuze, zinslengte en emotie aan. Houd hierbij ook rekening met de stilistische connotatie van het gekozen lettertype (Times New Roman is formeler en traditioneler dan Arial/Calibri):
- Neutraal: Zakelijk, feitelijk
- Officieel: Formele taal, u-vorm, geen afkortingen
- Geïrriteerd: Streng, direct, maar beleefd
- Vriendelijk: Warm, behulpzaam, jij-vorm oké
- Informatief: Duidelijk, gestructureerd, opsommingen
- Kritisch: Fouten benoemen, suggesties, maar respectvol

--- EMOJI ---
Voeg {{EMOJI}} toe op een logische plek (alleen bij whatsapp of platte tekst indien passend). Geen emoji bij brief/email tenzij expliciet gekozen.

--- OUTPUT ---
1. Geef ALLEEN de volledige tekst in platte tekst (geen markdown buiten aanhef).
2. Gebruik EXACT: **{{LETTERTYPE}}, {{TEKENGROOTTE}}** (vermeld dit niet, maar zorg dat het in Word/PDF zo is).
3. Zorg dat de output:
   - Direct kopieerbaar is uit preview
   - Downloadbaar is als **.docx** (Word) en **.pdf**
   - Perfect geformatteerd in Word (geen rare inspringingen)

---

Schrijf nu de tekst. Alleen de output. Geen code, geen uitleg.`;


export const generateText = async (options: GeneratorOptions): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API key not found. Please set the API_KEY environment variable.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const instructiesBlok = options.responseInstructions 
        ? `Instructies voor antwoord: ${options.responseInstructions}\n` 
        : '';

    const prompt = PROMPT_TEMPLATE
        .replace("{{FORMAAT}}", options.format)
        .replace("{{MODUS}}", options.mode)
        .replace("{{INVOER}}", options.input)
        .replace("{{TOON}}", options.tone)
        .replace("{{EMOJI}}", options.emoji || 'geen')
        .replace("{{LETTERTYPE}}", options.font)
        .replace("{{TEKENGROOTTE}}", options.fontSize)
        .replace("{{INSTRUCTIES_BLOK}}", instructiesBlok);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate text from Gemini API.");
    }
};