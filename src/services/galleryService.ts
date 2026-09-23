import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { GallerySubmission, GallerySubmissionStatus } from '../types/gallery';

const STORAGE_KEY = 'cbe_gallery_all_submissions';
const NOTIFICATIONS_KEY = 'cbe_admin_gallery_notifications';

// Helper to get or generate persistent user token
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

// Local storage operations
function getLocalSubmissions(): GallerySubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read local gallery submissions', e);
    return [];
  }
}

function saveLocalSubmissions(submissions: GallerySubmission[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch (e) {
    console.warn('Storage full for local gallery');
  }
}

// Public: Fetch only approved photos
export async function fetchPublicApprovedPhotos(): Promise<GallerySubmission[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('gallery_submissions')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as GallerySubmission[];
      }
    } catch (err) {
      console.warn('Supabase fetch approved failed, fallback to local', err);
    }
  }

  const local = getLocalSubmissions();
  return local.filter(s => s.status === 'approved');
}

// User: Fetch submissions belonging to this user
export async function fetchMySubmissions(): Promise<GallerySubmission[]> {
  const { uploaderId, submissionToken } = getUserToken();

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('gallery_submissions')
        .select('*')
        .eq('submission_token', submissionToken)
        .neq('status', 'deleted')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as GallerySubmission[];
      }
    } catch (err) {
      console.warn('Supabase fetch user submissions failed', err);
    }
  }

  const local = getLocalSubmissions();
  return local.filter(s => s.submission_token === submissionToken && s.status !== 'deleted');
}

// Admin: Fetch all submissions
export async function fetchAllAdminSubmissions(): Promise<GallerySubmission[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('gallery_submissions')
        .select('*')
        .neq('status', 'deleted')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as GallerySubmission[];
      }
    } catch (err) {
      console.warn('Supabase fetch all admin failed', err);
    }
  }

  const local = getLocalSubmissions();
  return local.filter(s => s.status !== 'deleted');
}

// Submit a new photo for review
export async function submitPhotoForReview(params: {
  imageUrl: string;
  description?: string;
  category: 'فعاليات' | 'أجواء الكلية' | 'لحظات وطنية';
}): Promise<GallerySubmission> {
  const { uploaderId, submissionToken } = getUserToken();

  const newSubmission: GallerySubmission = {
    id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    image_url: params.imageUrl,
    uploader_id: uploaderId,
    submission_token: submissionToken,
    description: params.description?.trim() || undefined,
    category: params.category,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  // 1. Try Supabase
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('gallery_submissions')
        .insert([newSubmission])
        .select()
        .single();

      if (!error && data) {
        logAdminNotification(newSubmission);
        return data as GallerySubmission;
      }
    } catch (err) {
      console.warn('Supabase insert failed, saving to local store', err);
    }
  }

  // 2. Save locally
  const current = getLocalSubmissions();
  const updated = [newSubmission, ...current];
  saveLocalSubmissions(updated);
  logAdminNotification(newSubmission);

  return newSubmission;
}

// Admin: Update status ('approved' | 'rejected')
export async function updatePhotoStatus(
  id: string,
  newStatus: 'approved' | 'rejected',
  reviewedBy: string = 'المشرف'
): Promise<boolean> {
  const reviewedAt = new Date().toISOString();

  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('gallery_submissions')
        .update({
          status: newStatus,
          reviewed_at: reviewedAt,
          reviewed_by: reviewedBy,
        })
        .eq('id', id);

      if (!error) {
        // Also update local copy
        const current = getLocalSubmissions();
        const updated = current.map(item =>
          item.id === id ? { ...item, status: newStatus, reviewed_at: reviewedAt, reviewed_by: reviewedBy } : item
        );
        saveLocalSubmissions(updated);
        return true;
      }
    } catch (err) {
      console.warn('Supabase update status failed', err);
    }
  }

  const current = getLocalSubmissions();
  const updated = current.map(item =>
    item.id === id ? { ...item, status: newStatus, reviewed_at: reviewedAt, reviewed_by: reviewedBy } : item
  );
  saveLocalSubmissions(updated);
  return true;
}

// User or Admin: Delete submission
export async function deletePhotoSubmission(
  id: string,
  token?: string,
  isAdmin: boolean = false
): Promise<{ success: boolean; message: string }> {
  const current = getLocalSubmissions();
  const target = current.find(item => item.id === id);

  if (!target) {
    return { success: false, message: 'الصورة غير موجودة.' };
  }

  // Permission check
  if (!isAdmin) {
    const { submissionToken } = getUserToken();
    if (target.submission_token !== submissionToken) {
      return { success: false, message: 'غير مصرح لك بحذف هذه الصورة.' };
    }
    if (target.status !== 'pending') {
      return { success: false, message: 'لا يمكن حذف الصورة بعد اعتمادها. يرجى مراجعة إدارة الكلية.' };
    }
  }

  // Execute deletion in Supabase if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('gallery_submissions').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete failed', err);
    }
  }

  // Update local store
  const updated = current.filter(item => item.id !== id);
  saveLocalSubmissions(updated);

  return { success: true, message: 'تم حذف الصورة بنجاح.' };
}

// Admin notification logger
function logAdminNotification(submission: GallerySubmission) {
  try {
    const notifs = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
    const newNotif = {
      id: 'notif_' + Date.now(),
      message: 'وصلت صورة جديدة للمراجعة في معرض اليوم الوطني.',
      submissionId: submission.id,
      timestamp: new Date().toISOString(),
      read: false,
    };
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([newNotif, ...notifs]));
  } catch (e) {
    console.warn('Notification log error', e);
  }
}

export function getAdminNotifications(): Array<{ id: string; message: string; timestamp: string; read: boolean }> {
  try {
    return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function markNotificationsAsRead() {
  try {
    const notifs = getAdminNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
  } catch {}
}
