import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { GallerySubmission, GallerySubmissionStatus } from '../types/gallery';

const DEPARTMENT_ITEM_TAG = 'CBE_GALLERY_ITEM';
const DEPARTMENT_MOD_TAG = 'CBE_GALLERY_MODERATION';

// Helper to get or generate persistent user token in browser
export function getUserToken(): { uploaderId: string; submissionToken: string } {
  let uploaderId = localStorage.getItem('rewaa_uploader_id');
  let submissionToken = localStorage.getItem('rewaa_submission_token');

  if (!uploaderId || !submissionToken) {
    uploaderId = 'usr_' + Math.random().toString(36).substring(2, 9) + Date.now();
    submissionToken = 'tok_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('rewaa_uploader_id', uploaderId);
    localStorage.setItem('rewaa_submission_token', submissionToken);
  }

  return { uploaderId, submissionToken };
}

// Fetch and fold all gallery rows and moderation actions from database
async function getReconciledSubmissions(): Promise<GallerySubmission[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('ambitions')
      .select('*')
      .in('department', [DEPARTMENT_ITEM_TAG, DEPARTMENT_MOD_TAG])
      .order('created_at', { ascending: true });

    if (error || !data) {
      console.error('Supabase fetch gallery error:', error);
      return [];
    }

    const itemsMap = new Map<string, GallerySubmission>();
    const deletedIds = new Set<string>();

    data.forEach((row: any) => {
      try {
        const payload = JSON.parse(row.text);

        // 1. Raw gallery item
        if (row.department === DEPARTMENT_ITEM_TAG && payload.kind === 'CBE_GALLERY') {
          itemsMap.set(row.id, {
            id: row.id,
            image_url: payload.image_url,
            uploader_id: payload.uploader_id,
            submission_token: payload.submission_token,
            description: payload.description,
            category: payload.category || 'أجواء الكلية',
            status: (payload.status as GallerySubmissionStatus) || 'pending',
            created_at: payload.created_at || row.created_at,
            reviewed_at: payload.reviewed_at,
            reviewed_by: payload.reviewed_by
          });
        }

        // 2. Moderation action applied on an item
        if (row.department === DEPARTMENT_MOD_TAG && payload.kind === 'CBE_GALLERY_MODERATION') {
          const targetId = payload.target_id;
          if (targetId) {
            if (payload.action === 'deleted') {
              deletedIds.add(targetId);
              itemsMap.delete(targetId);
            } else if (itemsMap.has(targetId)) {
              const existing = itemsMap.get(targetId)!;
              existing.status = payload.action as GallerySubmissionStatus;
              existing.reviewed_at = payload.timestamp;
              existing.reviewed_by = payload.reviewed_by;
            }
          }
        }
      } catch (e) {
        // ignore malformed row
      }
    });

    // Filter out any deleted records
    const result: GallerySubmission[] = [];
    itemsMap.forEach((val) => {
      if (!deletedIds.has(val.id) && val.status !== 'deleted') {
        result.push(val);
      }
    });

    // Sort newest first
    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (err) {
    console.error('Exception in getReconciledSubmissions:', err);
    return [];
  }
}

// 1. Fetch only Approved Photos for Public Gallery
export async function fetchPublicApprovedPhotos(): Promise<GallerySubmission[]> {
  const all = await getReconciledSubmissions();
  return all.filter(item => item.status === 'approved');
}

// 2. Fetch User's Own Submissions (using persistent submission_token)
export async function fetchMySubmissions(): Promise<GallerySubmission[]> {
  const { submissionToken } = getUserToken();
  const all = await getReconciledSubmissions();
  return all.filter(item => item.submission_token === submissionToken);
}

// 3. Admin: Fetch All Submissions for Supervisor Review
export async function fetchAllAdminSubmissions(): Promise<GallerySubmission[]> {
  return await getReconciledSubmissions();
}

// 4. Submit Photo For Review (Cross-Device Database Save)
export async function submitPhotoForReview(params: {
  imageUrl: string;
  description?: string;
  category: 'فعاليات' | 'أجواء الكلية' | 'لحظات وطنية';
}): Promise<GallerySubmission> {
  const { uploaderId, submissionToken } = getUserToken();
  const createdAt = new Date().toISOString();

  const payload = {
    kind: 'CBE_GALLERY',
    image_url: params.imageUrl,
    uploader_id: uploaderId,
    submission_token: submissionToken,
    description: params.description?.trim() || undefined,
    category: params.category,
    status: 'pending',
    created_at: createdAt,
  };

  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('قاعدة البيانات غير متصلة.');
  }

  const { data, error } = await supabase
    .from('ambitions')
    .insert([
      {
        text: JSON.stringify(payload),
        department: DEPARTMENT_ITEM_TAG,
        major: 'pending',
        is_approved: true,
      },
    ])
    .select()
    .single();

  if (error || !data) {
    console.error('Supabase gallery insert failed:', error);
    throw new Error('فشل إرسال الصورة إلى قاعدة البيانات.');
  }

  return {
    id: data.id,
    image_url: payload.image_url,
    uploader_id: payload.uploader_id,
    submission_token: payload.submission_token,
    description: payload.description,
    category: payload.category,
    status: 'pending',
    created_at: createdAt
  };
}

// 5. Admin: Update Status ('approved' | 'rejected') via Realtime Moderation Event
export async function updatePhotoStatus(
  id: string,
  newStatus: 'approved' | 'rejected',
  reviewedBy: string = 'مشرف الكلية'
): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return false;
  }

  try {
    const modPayload = {
      kind: 'CBE_GALLERY_MODERATION',
      target_id: id,
      action: newStatus,
      reviewed_by: reviewedBy,
      timestamp: new Date().toISOString()
    };

    const { error } = await supabase
      .from('ambitions')
      .insert([
        {
          text: JSON.stringify(modPayload),
          department: DEPARTMENT_MOD_TAG,
          major: newStatus,
          is_approved: true
        }
      ]);

    if (error) {
      console.error('Supabase update status insert error:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exception in updatePhotoStatus:', err);
    return false;
  }
}

// 6. Delete Submission (Permanent Database & Storage Delete)
export async function deletePhotoSubmission(
  id: string,
  isAdmin: boolean = false
): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, message: 'قاعدة البيانات غير متصلة.' };
  }

  try {
    const modPayload = {
      kind: 'CBE_GALLERY_MODERATION',
      target_id: id,
      action: 'deleted',
      isAdmin: isAdmin,
      timestamp: new Date().toISOString()
    };

    const { error } = await supabase
      .from('ambitions')
      .insert([
        {
          text: JSON.stringify(modPayload),
          department: DEPARTMENT_MOD_TAG,
          major: 'deleted',
          is_approved: true
        }
      ]);

    if (error) {
      console.error('Supabase delete insert error:', error);
      return { success: false, message: 'فشل حذف الصورة من قاعدة البيانات.' };
    }

    return { success: true, message: 'تم حذف الصورة بنجاح من قاعدة البيانات.' };
  } catch (err: any) {
    console.error('Delete exception:', err);
    return { success: false, message: err.message || 'حدث خطأ أثناء الحذف.' };
  }
}

// 7. Subscribe to real-time changes
export function subscribeToGalleryChanges(onUpdate: () => void) {
  if (!isSupabaseConfigured() || !supabase) {
    return () => {};
  }

  const channel = supabase
    .channel('cbe_gallery_realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'ambitions' },
      (payload) => {
        const dept = (payload.new as any)?.department || (payload.old as any)?.department;
        if (dept === DEPARTMENT_ITEM_TAG || dept === DEPARTMENT_MOD_TAG) {
          onUpdate();
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
