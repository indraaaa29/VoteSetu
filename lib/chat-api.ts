/**
 * API handler for chat interactions.
 */
export async function getGeminiResponse(messages: any[], language: string): Promise<any> {
  try {
    const contextMessages = messages.slice(-10);
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: contextMessages, language }),
    });
    const data = await response.json();
    if (!response.ok || data.error || data.message) {
      throw new Error(data.message || data.error || `Server error ${response.status}`);
    }
    return {
      text: data.text,
      bullets: data.bullets,
      source: data.source || 'chat.source_default',
    };
  } catch (error: unknown) {
    return {
      text: "Service is temporarily unavailable. Please try again.",
      source: "chat.system_error",
    };
  }
}
