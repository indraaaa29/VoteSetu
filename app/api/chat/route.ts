import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { CIVIC_KNOWLEDGE } from "@/lib/docs";
import { interceptIntent } from "@/lib/intent-interceptor";

const SYSTEM_PROMPT = `
You are the VoteSetu Civic Assistant, an official service of the Election Commission of India.
Your goal is to provide accurate, concise, and helpful information about elections in India.

Official Knowledge Base:
${CIVIC_KNOWLEDGE}

CRITICAL FORMATTING RULES:
1. Always paraphrase. Never reproduce official text verbatim.
2. You MUST respond with a JSON object containing EXACTLY two keys: "text" and "bullets".
3. "text": A concise explanation (1-2 lines). PLAIN TEXT ONLY. No markdown (**bold**, *italics*, etc.).
4. "bullets": An array of strings for lists, steps, or requirements. Each string is a single item. NO MARKDOWN. NO BULLET SYMBOLS (- or *) in the strings.
5. If there is NO list, return an empty array [] for "bullets".
6. ALWAYS extract multiple requirements or steps into the "bullets" array instead of paragraph text.

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
Answer like a civic expert. Provide clear, direct, useful answers. Avoid generic statements. Use short explanations and bullet points.
Do NOT say things like 'data not available' unless absolutely necessary.
Always provide the most useful possible answer.
Always paraphrase. Never reproduce official text verbatim.
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
        { message: "API key not configured. Add GOOGLE_API_KEY to .env.local and restart the server." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { messages, language } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ message: "No messages provided." }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1].text;
    
    if (!lastMessage || typeof lastMessage !== 'string' || lastMessage.trim().length === 0) {
      return NextResponse.json({ message: "Please enter a valid question." }, { status: 400 });
    }
    
    if (lastMessage.length > 800) {
      return NextResponse.json({ message: "Question is too long. Please keep it under 800 characters." }, { status: 400 });
    }

    const sanitizedInput = lastMessage.replace(/<[^>]*>/g, '').trim();

    const langInstruction = language === 'hi'
      ? "हिंदी में उत्तर दें। सरल भाषा का उपयोग करें।"
      : "Respond in English. Use simple, clear language.";
    const finalSystemPrompt = SYSTEM_PROMPT + `\n\nLANGUAGE INSTRUCTION: ${langInstruction}`;

    const intercepted = interceptIntent(sanitizedInput, language);
    if (intercepted) {
      return NextResponse.json(intercepted);
    }


    // Build history: skip the first welcome message and keep only the last 10
    // to keep the context window small and improve performance.
    const rawHistory = messages.slice(1, -1).slice(-10);
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
        const result = await chat.sendMessage(sanitizedInput);
        const rawText = result.response.text();
        
        let parsed;
        try {
          parsed = JSON.parse(rawText);
        } catch (e) {
          const cleanedText = rawText.replace(/\*\*/g, "").replace(/\*/g, "").replace(/#{1,6}\s/g, "").replace(/\n/g, " ").trim();
          parsed = { text: cleanedText, bullets: [] };
        }

        return NextResponse.json({ 
          text: parsed.text || (language === 'hi' ? "सूचना प्राप्त की गई。" : "Information retrieved."), 
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
        if (msg.includes("recitation")) {
          return NextResponse.json({
            text: language === 'hi' 
              ? "यहाँ एक सरलीकृत स्पष्टीकरण दिया गया है:" 
              : "Here’s a simplified explanation:",
            bullets: language === 'hi'
              ? ["आधिकारिक पाठ की नकल करने से बचने के लिए जानकारी को संक्षिप्त किया गया है", "अधिक स्पष्ट विवरण के लिए एक विशिष्ट प्रश्न पूछें"]
              : ["Information is summarized to avoid copying official text", "Ask a specific question for clearer details"],
            source: language === 'hi' ? "भारत निर्वाचन आयोग" : "Election Commission of India"
          });
        }
        throw err;
      }
    }

    throw lastError;
  } catch (error: unknown) {
    console.error("API Route Error:", error);
    return NextResponse.json({ message: "Service is temporarily unavailable. Please try again." }, { status: 500 });
  }
}

