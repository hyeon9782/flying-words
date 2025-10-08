// 게임 단어 데이터
export interface GameWord {
  id: string;
  text: string;
  difficulty: "easy" | "medium" | "hard";
  category?: string;
  hints?: string[];
}

// 게임 상태
export type GameState = "nickname" | "playing" | "gameOver" | "ranking";

// 플레이어 점수 데이터
export interface PlayerScore {
  id?: string;
  nickname: string;
  score: number;
  correctAnswers: number;
  maxCombo: number;
  playedAt: Date;
}

// 랭킹 데이터
export interface RankingEntry {
  rank: number;
  nickname: string;
  score: number;
  correctAnswers: number;
  maxCombo: number;
  playedAt: Date;
}
