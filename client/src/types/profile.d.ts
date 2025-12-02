export interface Profile {
  full_name: string;
  email: string;
  address: string | null;
  birth_date: Date | null;
  avatar_url: string | null;
  role: string;
  rating_positive: number | null;
  rating_count: number | null;
  created_at: string;
  updated_at: string;
};
