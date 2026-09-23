import { ChatMessage } from '../types/chat';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Ambition } from '../types/ambition';
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
    signal: AbortSignal.timeout(18000),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'حدث خطأ في استجابة المساعد الذكي');
  }

  return data;
}

export async function fetchAmbitions(): Promise<Ambition[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('ambitions')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase fetch error:', error);
    throw new Error('حدث خطأ أثناء جلب الطموحات');
  }

  return data as Ambition[];
}

export async function submitAmbitionIdea(text: string, department: string, major?: string): Promise<Ambition> {
  if (!isSupabaseConfigured() || !supabase) {
    // If Supabase is not yet configured by the user, return a local mock so it doesn't break development UI testing
    return {
      id: 'local-' + Date.now(),
      text,
      department,
      major,
      created_at: new Date().toISOString(),
      status: 'pending',
      is_approved: false
    };
  }

  const newAmbition = {
    text,
    department,
    major: major || null,
    status: 'approved',
    is_approved: true
  };

  const { data, error } = await supabase
    .from('ambitions')
    .insert([newAmbition])
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error('حدث خطأ أثناء حفظ الطموح');
  }

  return data as Ambition;
}

