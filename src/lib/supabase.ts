import { createClient } from "@supabase/supabase-js";

// Supabase 프로젝트 URL과 anon key를 환경변수에서 가져옵니다
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL과 Anon Key가 환경변수에 설정되어 있지 않습니다. .env 파일을 확인해주세요."
  );
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database 타입 정의 (Supabase에서 생성한 테이블 구조에 맞게)
export interface Database {
  public: {
    Tables: {
      scores: {
        Row: {
          id: string;
          nickname: string;
          score: number;
          correct_answers: number;
          max_combo: number;
          played_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          nickname: string;
          score: number;
          correct_answers: number;
          max_combo: number;
          played_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          nickname?: string;
          score?: number;
          correct_answers?: number;
          max_combo?: number;
          played_at?: string;
          created_at?: string;
        };
      };
    };
  };
}
