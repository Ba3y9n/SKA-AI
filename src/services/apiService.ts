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

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history: formattedHistory, userContext }),
      signal: AbortSignal.timeout(30000),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'حدث خطأ أثناء التواصل مع رِواء');
    }

    return data;
  } catch (err: any) {
    if (err.name === 'TimeoutError' || (err.message && err.message.toLowerCase().includes('timed out'))) {
      throw new Error('استغرقت الاستجابة وقتاً أطول من المتوقع، يرجى إعادة المحاولة.');
    }
    throw err;
  }
}

export async function fetchAmbitions(): Promise<Ambition[]> {
  const localList: string[] = JSON.parse(localStorage.getItem('deletedAmbitionIds') || '[]');
  const locallyDeleted = new Set<string>(localList);

  if (!isSupabaseConfigured() || !supabase) {
    const local = JSON.parse(localStorage.getItem('local_ambitions') || '[]');
    return local.filter((a: Ambition) => !locallyDeleted.has(a.id));
  }

  try {
    const { data, error } = await supabase
      .from('ambitions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      const local = JSON.parse(localStorage.getItem('local_ambitions') || '[]');
      return local.filter((a: Ambition) => !locallyDeleted.has(a.id));
    }

    const deletedIds = new Set<string>(localList);

    // 1. First scan for any deletion markers
    (data || []).forEach((row: any) => {
      if (row.department === 'CBE_AMBITION_MOD' || row.status === 'rejected' || row.is_approved === false) {
        try {
          const parsed = typeof row.text === 'string' && row.text.startsWith('{') ? JSON.parse(row.text) : null;
          if (parsed) {
            if (parsed.target_id) deletedIds.add(parsed.target_id);
            if (Array.isArray(parsed.target_ids)) {
              parsed.target_ids.forEach((tid: string) => deletedIds.add(tid));
            }
          }
        } catch (e) {}
        deletedIds.add(row.id);
      }
    });

    // 2. Filter legitimate real student ambitions
    const validData: Ambition[] = [];
    (data || []).forEach((row: any) => {
      if (deletedIds.has(row.id)) return;
      if (row.status === 'rejected' || row.is_approved === false) return;
      if (row.department && (row.department.startsWith('CBE_GALLERY') || row.department.startsWith('CBE_ACHIEVEMENT') || row.department === 'CBE_AMBITION_MOD')) return;
      if (row.text && row.text.startsWith('{')) return;
      
      const t = (row.text || '').trim();
      if (!t) return;
      
      // Strict guard against any previous mock / demo / noise text
      if (
        t.includes('ئئئئ') || 
        t.includes('test 1') || 
        t.includes('test 3') || 
        t.includes('انا بيان') || 
        t.includes('فزت بالمركز الاول') ||
        t.includes('فزت بالمركز الأول') ||
        t.includes('الحمدلله') ||
        t.includes('الحمد لله') ||
        t.includes('طموحي تحقيق الريادة') ||
        t.includes('طموحي بناء نموذج ذكاء') ||
        t.includes('طموحي تمثيل جامعة القصيم') ||
        t.includes('طموحي تأسيس شركة') ||
        t.includes('طموحي قيادة مبادرة') ||
        t.includes('طموحي أن أؤسس شركة')
      ) return;

      // Parse name & role if formatted as "اسم الطالبة - طالبة"
      let name = row.name;
      let role = row.role;
      if (!name && row.department && row.department.includes(' - ')) {
        const parts = row.department.split(' - ');
        name = parts[0];
        role = parts[1];
      }

      validData.push({
        ...row,
        name: name || 'طالبة طموحة',
        role: role || 'طالبة'
      } as Ambition);
    });

    return validData;
  } catch (err) {
    console.error('Error fetching ambitions from Supabase:', err);
    return [];
  }
}

export async function submitAmbitionIdea(ambitionData: Partial<Ambition>): Promise<Ambition> {
  const departmentFormatted = ambitionData.name
    ? `${ambitionData.name}${ambitionData.role ? ` - ${ambitionData.role}` : ''}`
    : (ambitionData.department || 'طالبة - كلية الأعمال والاقتصاد');

  if (!isSupabaseConfigured() || !supabase) {
    const newLocal: Ambition = {
      id: 'local-' + Date.now(),
      text: ambitionData.text || '',
      name: ambitionData.name || 'طالبة طموحة',
      role: ambitionData.role || 'طالبة',
      department: departmentFormatted,
      major: ambitionData.major,
      created_at: new Date().toISOString(),
      status: 'approved',
      is_approved: true
    };
    const local = JSON.parse(localStorage.getItem('local_ambitions') || '[]');
    localStorage.setItem('local_ambitions', JSON.stringify([newLocal, ...local]));
    return newLocal;
  }

  const payload: any = {
    text: ambitionData.text,
    department: departmentFormatted,
    major: ambitionData.major || 'كلية الأعمال والاقتصاد',
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
      console.error('Supabase insert error:', error);
      throw error;
    }

    return {
      ...data,
      name: ambitionData.name || 'طالبة طموحة',
      role: ambitionData.role || 'طالبة'
    } as Ambition;
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
            !newRecord.department?.startsWith('CBE_ACHIEVEMENT') &&
            !newRecord.department?.startsWith('CBE_AMBITION_MOD') &&
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
  // 1. Immediately record in local deletion cache
  try {
    const localDeleted = new Set(JSON.parse(localStorage.getItem('deletedAmbitionIds') || '[]'));
    localDeleted.add(id);
    localStorage.setItem('deletedAmbitionIds', JSON.stringify(Array.from(localDeleted)));

    const localAmbitions = JSON.parse(localStorage.getItem('local_ambitions') || '[]');
    localStorage.setItem('local_ambitions', JSON.stringify(localAmbitions.filter((a: any) => a.id !== id)));
  } catch (e) {}

  if (!isSupabaseConfigured() || !supabase) return true;

  try {
    // 2. Direct delete attempt
    await supabase
      .from('ambitions')
      .delete()
      .eq('id', id);

    // 3. Supabase RLS-Compliant Cross-Device Deletion Marker (broadcasts to all mobile, desktop & browsers)
    const deletionMarker = {
      kind: 'CBE_AMBITION_DELETED',
      target_id: id,
      deleted_at: new Date().toISOString()
    };

    await supabase
      .from('ambitions')
      .insert([
        {
          text: JSON.stringify(deletionMarker),
          department: 'CBE_AMBITION_MOD',
          status: 'approved',
          is_approved: true
        }
      ]);

    return true;
  } catch (err) {
    console.error('Exception during delete:', err);
    return true;
  }
}
