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

  try {
    const { data, error } = await supabase
      .from('ambitions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      return [];
    }

    // Include all approved or non-rejected ambitions
    const validData = (data || []).filter((item: any) => {
      if (item.status === 'rejected') return false;
      if (item.is_approved === false) return false;
      return true;
    });

    return validData as Ambition[];
  } catch (err) {
    console.error('Error fetching ambitions from Supabase:', err);
    return [];
  }
}

export async function submitAmbitionIdea(text: string, department: string, major?: string): Promise<Ambition> {
  if (!isSupabaseConfigured() || !supabase) {
    // If Supabase credentials are not provided, provide a clean local card
    return {
      id: 'local-' + Date.now(),
      text,
      department,
      major,
      created_at: new Date().toISOString(),
      status: 'approved',
      is_approved: true
    };
  }

  const payload: any = {
    text,
    department,
    major: major || null,
    status: 'approved',
    is_approved: true
  };

  try {
    const { data, error } = await supabase
      .from('ambitions')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.warn('Supabase insert with is_approved failed, attempting fallback payload:', error);
      // Fallback without is_approved in case column is not created
      const fallbackPayload = {
        text,
        department,
        major: major || null,
        status: 'approved'
      };

      const retryResult = await supabase
        .from('ambitions')
        .insert([fallbackPayload])
        .select()
        .single();

      if (retryResult.error) {
        console.error('Supabase fallback insert failed:', retryResult.error);
        throw new Error('حدث خطأ أثناء حفظ الطموح في قاعدة البيانات');
      }

      return retryResult.data as Ambition;
    }

    return data as Ambition;
  } catch (err: any) {
    console.error('Supabase submission exception:', err);
    throw new Error(err.message || 'حدث خطأ أثناء حفظ الطموح');
  }
}

export function subscribeToAmbitions(onNewAmbition: (ambition: Ambition) => void) {
  if (!isSupabaseConfigured() || !supabase) {
    return () => {};
  }

  const channel = supabase
    .channel('public:ambitions')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'ambitions' },
      (payload) => {
        if (payload.new) {
          const newRecord = payload.new as Ambition;
          if (newRecord.status !== 'rejected' && newRecord.is_approved !== false) {
            onNewAmbition(newRecord);
          }
        }
      }
    )
    .subscribe();

  return () => {
    if (supabase) {
      supabase.removeChannel(channel);
    }
  };
}
