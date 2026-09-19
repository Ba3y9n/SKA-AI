import { ChatMessage } from '../types/chat';
import { AmbitionCard } from '../types/ambition';

export interface ServerStatus {
  status: string;
  model: string;
  isApiKeySet: boolean;
  character: string;
}

export async function checkServerStatus(): Promise<ServerStatus> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.warn('Backend server status check failed, using fallback mode:', err);
    return {
      status: 'offline_fallback',
      model: 'gemini-2.5-flash',
      isApiKeySet: false,
      character: 'رِواء AI',
    };
  }
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[]
): Promise<{ reply: string; model: string; audioBase64?: string | null; mimeType?: string }> {
  const formattedHistory = history.map((m) => ({
    sender: m.sender,
    text: m.text,
  }));

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history: formattedHistory }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'حدث خطأ في استجابة المساعد الذكي');
  }

  return data;
}

export async function submitAmbitionIdea(idea: string): Promise<AmbitionCard> {
  const res = await fetch('/api/ambition', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'تعذر معالجة الطموح');
  }

  return data;
}
