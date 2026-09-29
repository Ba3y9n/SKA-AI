import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { GallerySubmission, GallerySubmissionStatus, GalleryCategory } from '../types/gallery';

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
        const payload = typeof row.text === 'string' ? JSON.parse(row.text) : row.text;
        if (!payload) return;

        // 1. Raw gallery item
        if (row.department === DEPARTMENT_ITEM_TAG && payload.kind === 'CBE_GALLERY') {
          const imgUrl = (payload.image_url || '').trim();
          // Filter any demo mock photos
          if (!imgUrl || imgUrl.includes('images.unsplash.com')) {
            return;
          }

          let normalizedCategory: GalleryCategory = 'فعاليات الكلية';
          if (payload.category === 'أجواء وطنية' || payload.category === 'لحظات وطنية' || payload.category === 'فعاليات الكلية') {
            normalizedCategory = payload.category;
          } else if (payload.category === 'أجواء الكلية' || payload.category === 'فعاليات') {
            normalizedCategory = 'فعاليات الكلية';
          }

          itemsMap.set(row.id, {
            id: row.id,
            image_url: imgUrl,
            uploader_id: payload.uploader_id || 'anonymous',
            submission_token: payload.submission_token || '',
            student_name: payload.student_name || payload.name || 'طالبة الكلية',
            major: payload.major || row.major || 'كلية الأعمال والاقتصاد',
            description: payload.description,
            category: normalizedCategory,
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

// 2. Fetch User's Own Submissions (using persistent submission_token & uploader_id)
export async function fetchMySubmissions(): Promise<GallerySubmission[]> {
  const { submissionToken, uploaderId } = getUserToken();
  const all = await getReconciledSubmissions();
  return all.filter(item => item.submission_token === submissionToken || item.uploader_id === uploaderId);
}

// 3. Admin: Fetch All Submissions for Supervisor Review
export async function fetchAllAdminSubmissions(): Promise<GallerySubmission[]> {
  return await getReconciledSubmissions();
}

// 4. Submit Photo For Review (Cross-Device Database Save)
export async function submitPhotoForReview(params: {
  imageUrl: string;
  studentName?: string;
  major?: string;
  description?: string;
  category: GalleryCategory;
}): Promise<GallerySubmission> {
  const { uploaderId, submissionToken } = getUserToken();
  const createdAt = new Date().toISOString();

  const payload = {
    kind: 'CBE_GALLERY',
    image_url: params.imageUrl,
    uploader_id: uploaderId,
    submission_token: submissionToken,
    student_name: params.studentName?.trim() || 'طالبة الكلية',
    major: params.major?.trim() || 'كلية الأعمال والاقتصاد',
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
        major: params.major || 'pending',
        status: 'approved',
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
    student_name: payload.student_name,
    major: payload.major,
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
          status: 'approved',
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
  imageUrl?: string,
  isAdmin: boolean = false
): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, message: 'قاعدة البيانات غير متصلة.' };
  }

  try {
    // 1. Direct row delete
    await supabase.from('ambitions').delete().eq('id', id);

    // 2. Insert deletion tombstone for real-time multi-device sync
    const modPayload = {
      kind: 'CBE_GALLERY_MODERATION',
      target_id: id,
      action: 'deleted',
      isAdmin: isAdmin,
      timestamp: new Date().toISOString()
    };

    await supabase
      .from('ambitions')
      .insert([
        {
          text: JSON.stringify(modPayload),
          department: DEPARTMENT_MOD_TAG,
          major: 'deleted',
          status: 'approved',
          is_approved: true
        }
      ]);

    // 3. If image URL is stored in Supabase storage, remove it
    if (imageUrl && imageUrl.includes('/storage/v1/object/public/')) {
      try {
        const parts = imageUrl.split('/storage/v1/object/public/');
        if (parts[1]) {
          const [bucket, ...pathParts] = parts[1].split('/');
          const filePath = pathParts.join('/');
          if (bucket && filePath) {
            await supabase.storage.from(bucket).remove([filePath]);
          }
        }
      } catch (storageErr) {
        console.warn('Storage delete exception:', storageErr);
      }
    }

    return { success: true, message: 'تم حذف الصورة بنجاح من قاعدة البيانات والتخزين.' };
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
