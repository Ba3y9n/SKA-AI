export type GallerySubmissionStatus = 'pending' | 'approved' | 'rejected' | 'deleted';

export type GalleryCategory = 'فعاليات الكلية' | 'أجواء وطنية' | 'لحظات وطنية' | 'أجواء الكلية' | 'فعاليات';

export interface GallerySubmission {
  id: string;
  image_url: string;
  uploader_id: string;
  submission_token: string;
  student_name?: string;
  major?: string;
  description?: string;
  category: GalleryCategory;
  status: GallerySubmissionStatus;
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}
