import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PersonAchievement } from '../data/achievementsData';

const DEPARTMENT_ACHIEVEMENT_TAG = 'CBE_ACHIEVEMENT_ITEM';
const DEPARTMENT_ACHIEVEMENT_MOD = 'CBE_ACHIEVEMENT_MOD';

export interface DatabaseAchievement extends PersonAchievement {
  userToken?: string;
  isUserAdded: boolean;
}

// Get or create persistent user token
export function getAchievementUserToken(): string {
  let token = localStorage.getItem('rewaa_user_token');
  if (!token) {
    token = 'usr_' + Math.random().toString(36).substring(2, 9) + Date.now();
    localStorage.setItem('rewaa_user_token', token);
  }
  return token;
}

// Fetch all user-added achievements from Supabase
export async function fetchDatabaseAchievements(): Promise<DatabaseAchievement[]> {
  if (!isSupabaseConfigured() || !supabase) {
    const saved = localStorage.getItem('user_achievements');
    return saved ? JSON.parse(saved) : [];
  }

  try {
    const { data, error } = await supabase
      .from('ambitions')
      .select('*')
      .in('department', [DEPARTMENT_ACHIEVEMENT_TAG, DEPARTMENT_ACHIEVEMENT_MOD])
      .order('created_at', { ascending: true });

    if (error || !data) {
      console.warn('Supabase fetch achievements error, fallback to local storage:', error);
      const saved = localStorage.getItem('user_achievements');
      return saved ? JSON.parse(saved) : [];
    }

    const itemsMap = new Map<string, DatabaseAchievement>();
    const deletedIds = new Set<string>();

    data.forEach((row: any) => {
      try {
        const payload = JSON.parse(row.text);
        if (row.department === DEPARTMENT_ACHIEVEMENT_TAG && payload.kind === 'CBE_ACHIEVEMENT') {
          itemsMap.set(row.id, {
            id: row.id,
            nameAr: payload.nameAr,
            nameEn: payload.nameEn || '',
            classification: payload.classification || 'طالبة',
            major: payload.major || 'كلية الأعمال والاقتصاد',
            achievementTitle: payload.achievementTitle || payload.type || 'إنجاز أكاديمي',
            year: payload.year || new Date().getFullYear().toString(),
            description: payload.description,
            linkedIn: payload.linkedIn,
            officialSource: payload.officialSource,
            userToken: payload.userToken,
            imageUrl: payload.imageUrl,
            isUserAdded: true,
            source: {
              sourceType: 'user',
              sourceName: 'مشاركة طالبة موثقة',
              verified: true,
              dateVerified: payload.createdAt || row.created_at
            },
            type: payload.type || 'إنجاز متميز'
          });
        }

        if (row.department === DEPARTMENT_ACHIEVEMENT_MOD && payload.kind === 'CBE_ACHIEVEMENT_MOD') {
          if (payload.action === 'deleted' && payload.target_id) {
            deletedIds.add(payload.target_id);
            itemsMap.delete(payload.target_id);
          }
        }
      } catch (e) {
        // ignore malformed row
      }
    });

    const result: DatabaseAchievement[] = [];
    itemsMap.forEach((val) => {
      if (!deletedIds.has(val.id)) {
        result.push(val);
      }
    });

    return result.reverse();
  } catch (err) {
    console.error('Exception in fetchDatabaseAchievements:', err);
    const saved = localStorage.getItem('user_achievements');
    return saved ? JSON.parse(saved) : [];
  }
}

// Submit a new achievement into database
export async function submitDatabaseAchievement(
  achievement: Omit<DatabaseAchievement, 'id' | 'isUserAdded' | 'source'>
): Promise<DatabaseAchievement> {
  const userToken = getAchievementUserToken();
  const payload = {
    kind: 'CBE_ACHIEVEMENT',
    ...achievement,
    userToken,
    createdAt: new Date().toISOString()
  };

  if (!isSupabaseConfigured() || !supabase) {
    const localItem: DatabaseAchievement = {
      id: 'local_ach_' + Date.now(),
      ...achievement,
      userToken,
      isUserAdded: true,
      source: {
        sourceType: 'user',
        sourceName: 'مشاركة محلية',
        verified: true,
        dateVerified: new Date().toISOString()
      }
    };
    const saved = JSON.parse(localStorage.getItem('user_achievements') || '[]');
    localStorage.setItem('user_achievements', JSON.stringify([localItem, ...saved]));
    return localItem;
  }

  const { data, error } = await supabase
    .from('ambitions')
    .insert([
      {
        text: JSON.stringify(payload),
        department: DEPARTMENT_ACHIEVEMENT_TAG,
        major: achievement.major || 'كلية الأعمال والاقتصاد',
        status: 'approved',
        is_approved: true
      }
    ])
    .select()
    .single();

  if (error || !data) {
    throw new Error('تعذر حفظ الإنجاز في قاعدة البيانات.');
  }

  const newRecord: DatabaseAchievement = {
    id: data.id,
    ...achievement,
    userToken,
    isUserAdded: true,
    source: {
      sourceType: 'user',
      sourceName: 'مشاركة طالبة موثقة',
      verified: true,
      dateVerified: new Date().toISOString()
    }
  };

  // Also cache locally
  const saved = JSON.parse(localStorage.getItem('user_achievements') || '[]');
  localStorage.setItem('user_achievements', JSON.stringify([newRecord, ...saved]));

  return newRecord;
}

// Delete achievement by owner
export async function deleteDatabaseAchievement(id: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    const saved = JSON.parse(localStorage.getItem('user_achievements') || '[]');
    localStorage.setItem('user_achievements', JSON.stringify(saved.filter((a: any) => a.id !== id)));
    return true;
  }

  try {
    // 1. Direct row delete
    await supabase.from('ambitions').delete().eq('id', id);

    // 2. Insert deletion tombstone for real-time multi-device sync
    const modPayload = {
      kind: 'CBE_ACHIEVEMENT_MOD',
      target_id: id,
      action: 'deleted',
      timestamp: new Date().toISOString()
    };

    await supabase.from('ambitions').insert([
      {
        text: JSON.stringify(modPayload),
        department: DEPARTMENT_ACHIEVEMENT_MOD,
        is_approved: true
      }
    ]);

    const saved = JSON.parse(localStorage.getItem('user_achievements') || '[]');
    localStorage.setItem('user_achievements', JSON.stringify(saved.filter((a: any) => a.id !== id)));
    return true;
  } catch (err) {
    console.error('Error deleting achievement:', err);
    return false;
  }
}
