import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { CIVIC_KNOWLEDGE } from "@/lib/docs";
import { interceptIntent } from "@/lib/intent-interceptor";

const SYSTEM_PROMPT = `
You are the VoteSetu Civic Assistant, an official service of the Election Commission of India.
Your goal is to provide accurate, concise, and helpful information about elections in India.

Official Knowledge Base:
${CIVIC_KNOWLEDGE}

CRITICAL INTELLIGENCE & FOLLOW-UP RULES:
1. If the user asks for a specific number or data point (like "Just give me the age"):
   -> Return ONLY the direct answer in the "text" field.
   -> Do NOT repeat the previous explanation.
   -> Leave "bullets" empty.
2. If exact real-time data is unavailable, provide a reasonable estimate (e.g., "Approximately 96-98 crore").

CRITICAL FORMATTING RULES:
1. You MUST respond with a JSON object containing EXACTLY two keys: "text" and "bullets".
2. "text": A concise explanation (1-2 lines). PLAIN TEXT ONLY. No markdown (**bold**, *italics*, etc.).
3. "bullets": An array of strings for lists, steps, or requirements. Each string is a single item. NO MARKDOWN. NO BULLET SYMBOLS (- or *) in the strings.
4. If there is NO list, return an empty array [] for "bullets".
5. ALWAYS extract multiple requirements or steps into the "bullets" array instead of paragraph text.

Example JSON output for a list:
{
  "text": "You are eligible to vote if you meet these criteria:",
  "bullets": [
    "Must be a citizen of India",
    "Must be 18 years of age or older",
    "Must be enrolled in the electoral roll"
  ]
}

Example JSON output for a direct follow-up:
{
  "text": "18 years.",
  "bullets": []
}

Tone: Professional, authoritative, yet helpful.
`;

// Models to try in order of preference — if one hits quota, the next is tried
const MODELS_TO_TRY = [
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.5-flash",
];

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("GOOGLE_API_KEY is missing from environment variables.");
      return NextResponse.json(
        { error: "API key not configured. Add GOOGLE_API_KEY to .env.local and restart the server." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { messages, language } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided." }, { status: 400 });
    }

    const langInstruction = language === 'hi' ? "हिंदी में उत्तर दें। सरल और स्पष्ट भाषा का उपयोग करें।" : "Respond in English. Use simple, clear language.";
    const finalSystemPrompt = SYSTEM_PROMPT + `\n\nLANGUAGE INSTRUCTION: ${langInstruction}`;

    const lastMessage = messages[messages.length - 1].text;
    
    // HYBRID SYSTEM: Intent Interceptor
    const intercepted = interceptIntent(lastMessage, language);
    if (intercepted) {
      return NextResponse.json(intercepted);
    }


    // Build history: skip the first welcome message (synthetic, not from the model)
    // and skip the last message (sent via sendMessage).
    const rawHistory = messages.slice(1, -1);
    const history: { role: "user" | "model"; parts: { text: string }[] }[] = [];

    for (const m of rawHistory) {
      const role = m.role === "user" ? "user" : "model";
      if (history.length > 0 && history[history.length - 1].role === role) {
        history[history.length - 1].parts[0].text += "\n" + m.text;
      } else {
        history.push({ role, parts: [{ text: m.text }] });
      }
    }

    if (history.length > 0 && history[0].role !== "user") {
      history.shift();
    }

    let lastError: unknown = null;
    for (const modelName of MODELS_TO_TRY) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: finalSystemPrompt,
          generationConfig: {
            responseMimeType: "application/json",
          }
        });

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(lastMessage);
        const rawText = result.response.text();
        
        let parsed;
        try {
          parsed = JSON.parse(rawText);
        } catch (e) {
          // Fallback if model ignored JSON directive
          parsed = { text: rawText.replace(/\*\*/g, ""), bullets: [] };
        }

        return NextResponse.json({ 
          text: parsed.text || (language === 'hi' ? "सूचना प्राप्त की गई।" : "Information retrieved."), 
          bullets: Array.isArray(parsed.bullets) && parsed.bullets.length > 0 ? parsed.bullets : undefined,
          source: language === 'hi' ? "भारत निर्वाचन आयोग" : "Election Commission of India"
        });
      } catch (err: unknown) {
        lastError = err;
        const msg = err instanceof Error ? err.message : "";
        if (
          msg.includes("quota") ||
          msg.includes("429") ||
          msg.includes("RESOURCE_EXHAUSTED") ||
          msg.includes("404") ||
          msg.includes("not found")
        ) {
          continue;
        }
        throw err;
      }
    }

    throw lastError;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "";
    const message = errMsg.includes("API_KEY_INVALID")
      ? "Authentication failed. Please check server configuration."
      : errMsg.includes("quota") || errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED")
      ? "Service is temporarily busy due to high demand. Please try again in a moment."
      : "Service is temporarily unavailable. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

