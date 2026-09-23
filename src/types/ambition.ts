export interface Ambition {
  id: string;
  text: string;
  name?: string;
  role?: string;
  department?: string;
  major?: string;
  created_at: string;
  status?: 'pending' | 'approved' | 'rejected';
  is_approved?: boolean;
}
