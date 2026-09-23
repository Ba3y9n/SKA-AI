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
  history: ChatMessage[],
  userContext?: {
    ambitionsCount?: number;
    achievementsCount?: number;
    galleryCount?: number;
    galleryStatus?: string;
  }
): Promise<{ reply: string; model: string; audioBase64?: string | null; mimeType?: string }> {
  const formattedHistory = history.map((m) => ({
    sender: m.sender,
    text: m.text,
  }));

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history: formattedHistory, userContext }),
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

    // Filter legitimate ambitions (exclude internal gallery items & test strings)
    const validData = (data || []).filter((item: any) => {
      if (item.status === 'rejected') return false;
      if (item.is_approved === false) return false;
      if (item.department && item.department.startsWith('CBE_GALLERY')) return false;
      if (item.text && (item.text.startsWith('{') || item.text.includes('CBE_GALLERY'))) return false;
      if (item.text === 'test 1' || item.text === 'test 3' || item.text === 'انا بيان') return false;
      return true;
    });

    return validData as Ambition[];
  } catch (err) {
    console.error('Error fetching ambitions from Supabase:', err);
    return [];
  }
}

export async function submitAmbitionIdea(ambitionData: Partial<Ambition>): Promise<Ambition> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      id: 'local-' + Date.now(),
      text: ambitionData.text || '',
      name: ambitionData.name,
      role: ambitionData.role,
      department: ambitionData.department || '',
      major: ambitionData.major,
      created_at: new Date().toISOString(),
      status: 'approved',
      is_approved: true
    };
  }

  const payload: any = {
    text: ambitionData.text,
    name: ambitionData.name,
    role: ambitionData.role,
    department: ambitionData.department || 'كلية الأعمال والاقتصاد',
    major: ambitionData.major || null,
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
      console.warn('Supabase insert failed, attempting fallback payload:', error);
      const fallbackPayload = {
        text: ambitionData.text,
        department: ambitionData.department || (ambitionData.name ? `${ambitionData.name} - ${ambitionData.role}` : 'كلية الأعمال والاقتصاد'),
        major: ambitionData.major || null,
        status: 'approved',
        is_approved: true
      };

      const retryResult = await supabase
        .from('ambitions')
        .insert([fallbackPayload])
        .select()
        .single();

      if (retryResult.error) {
        throw new Error('Supabase insert failed');
      }

      return retryResult.data as Ambition;
    }

    return data as Ambition;
  } catch (err: any) {
    console.error('Supabase submission exception:', err);
    throw new Error(err.message || 'Error occurred');
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
          const newRecord = payload.new as any;
          if (
            newRecord.status !== 'rejected' && 
            newRecord.is_approved !== false &&
            !newRecord.department?.startsWith('CBE_GALLERY') &&
            !newRecord.text?.startsWith('{')
          ) {
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

export async function deleteAmbition(id: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return true;

  try {
    const { error } = await supabase
      .from('ambitions')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Could not delete from Supabase (likely due to RLS policies):', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception during delete:', err);
    return false;
  }
}

