export type GallerySubmissionStatus = 'pending' | 'approved' | 'rejected' | 'deleted';

export interface GallerySubmission {
  id: string;
  image_url: string;
  uploader_id: string;
  submission_token: string;
  description?: string;
  category: 'فعاليات' | 'أجواء الكلية' | 'لحظات وطنية';
  status: GallerySubmissionStatus;
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}
