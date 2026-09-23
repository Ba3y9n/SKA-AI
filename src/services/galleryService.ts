import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { GallerySubmission, GallerySubmissionStatus } from '../types/gallery';

const DEPARTMENT_TAG = 'CBE_GALLERY_ITEM';

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

// Parse database record into typed GallerySubmission
function parseGalleryRow(row: any): GallerySubmission | null {
  if (!row || !row.text) return null;

  try {
    const payload = JSON.parse(row.text);
    if (payload.kind !== 'CBE_GALLERY') return null;

    return {
      id: row.id,
      image_url: payload.image_url,
      uploader_id: payload.uploader_id,
      submission_token: payload.submission_token,
      description: payload.description,
      category: payload.category || 'أجواء الكلية',
      status: (row.major as GallerySubmissionStatus) || payload.status || 'pending',
      created_at: payload.created_at || row.created_at,
      reviewed_at: payload.reviewed_at,
      reviewed_by: payload.reviewed_by
    };
  } catch (e) {
    return null;
  }
}

// 1. Fetch only Approved Photos for Public Gallery
export async function fetchPublicApprovedPhotos(): Promise<GallerySubmission[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('ambitions')
      .select('*')
      .eq('department', DEPARTMENT_TAG)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch public approved error:', error);
      return [];
    }

    const parsed: GallerySubmission[] = [];
    (data || []).forEach(row => {
      const item = parseGalleryRow(row);
      if (item && item.status === 'approved') {
        parsed.push(item);
      }
    });

    return parsed;
  } catch (err) {
    console.error('Error in fetchPublicApprovedPhotos:', err);
    return [];
  }
}

// 2. Fetch User's Own Submissions (using persistent submission_token)
export async function fetchMySubmissions(): Promise<GallerySubmission[]> {
  const { submissionToken } = getUserToken();

  if (!isSupabaseConfigured() || !supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('ambitions')
      .select('*')
      .eq('department', DEPARTMENT_TAG)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch user submissions error:', error);
      return [];
    }

    const mine: GallerySubmission[] = [];
    (data || []).forEach(row => {
      const item = parseGalleryRow(row);
      if (item && item.submission_token === submissionToken && item.status !== 'deleted') {
        mine.push(item);
      }
    });

    return mine;
  } catch (err) {
    console.error('Error in fetchMySubmissions:', err);
    return [];
  }
}

// 3. Admin: Fetch All Submissions for Supervisor Review
export async function fetchAllAdminSubmissions(): Promise<GallerySubmission[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('ambitions')
      .select('*')
      .eq('department', DEPARTMENT_TAG)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch admin submissions error:', error);
      return [];
    }

    const list: GallerySubmission[] = [];
    (data || []).forEach(row => {
      const item = parseGalleryRow(row);
      if (item && item.status !== 'deleted') {
        list.push(item);
      }
    });

    return list;
  } catch (err) {
    console.error('Error in fetchAllAdminSubmissions:', err);
    return [];
  }
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
        department: DEPARTMENT_TAG,
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

  const parsed = parseGalleryRow(data);
  if (!parsed) {
    throw new Error('فشل قراءة السجل المسجل.');
  }

  return parsed;
}

// 5. Admin: Update Status ('approved' | 'rejected')
export async function updatePhotoStatus(
  id: string,
  newStatus: 'approved' | 'rejected',
  reviewedBy: string = 'مشرف الكلية'
): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) {
    return false;
  }

  try {
    // 1. Fetch current row to update its JSON payload
    const { data: row, error: fetchErr } = await supabase
      .from('ambitions')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !row) {
      console.error('Fetch before update failed:', fetchErr);
      return false;
    }

    let payload = JSON.parse(row.text);
    payload.status = newStatus;
    payload.reviewed_at = new Date().toISOString();
    payload.reviewed_by = reviewedBy;

    // 2. Update record in Supabase
    const { error: updateErr } = await supabase
      .from('ambitions')
      .update({
        text: JSON.stringify(payload),
        major: newStatus,
        is_approved: newStatus === 'approved',
      })
      .eq('id', id);

    if (updateErr) {
      console.error('Supabase update status failed:', updateErr);
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
    const { data: row, error: fetchErr } = await supabase
      .from('ambitions')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !row) {
      return { success: false, message: 'السجل غير موجود.' };
    }

    const item = parseGalleryRow(row);
    if (!item) {
      return { success: false, message: 'بيانات غير صالحة.' };
    }

    // Permission Verification
    if (!isAdmin) {
      const { submissionToken } = getUserToken();
      if (item.submission_token !== submissionToken) {
        return { success: false, message: 'غير مصرح لك بحذف هذه الصورة.' };
      }
      if (item.status !== 'pending') {
        return { success: false, message: 'لا يمكن حذف الصورة بعد اعتمادها.' };
      }
    }

    // Delete record from Supabase database
    const { error: delErr } = await supabase
      .from('ambitions')
      .delete()
      .eq('id', id);

    if (delErr) {
      console.error('Supabase delete error:', delErr);
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
        if ((payload.new as any)?.department === DEPARTMENT_TAG || (payload.old as any)?.department === DEPARTMENT_TAG) {
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
