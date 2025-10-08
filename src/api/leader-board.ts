import type { PlayerScore, RankingEntry } from "../types";
import { supabase } from "../lib/supabase";

/**
 * 게임 점수를 Supabase에 저장
 */
export async function saveScore(
  scoreData: Omit<PlayerScore, "id" | "playedAt">
): Promise<PlayerScore> {
  try {
    const { data, error } = await supabase
      .from("scores")
      .insert({
        nickname: scoreData.nickname,
        score: scoreData.score,
        correct_answers: scoreData.correctAnswers,
        max_combo: scoreData.maxCombo,
        played_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Supabase 데이터를 앱 형식으로 변환
    return {
      id: data.id,
      nickname: data.nickname,
      score: data.score,
      correctAnswers: data.correct_answers,
      maxCombo: data.max_combo,
      playedAt: new Date(data.played_at),
    };
  } catch (error) {
    console.error("Error saving score:", error);
    throw error;
  }
}

/**
 * 상위 랭킹 조회 (기본 100명)
 * 각 닉네임의 최고 점수만 표시
 */
export async function getLeaderboard(limit = 100): Promise<RankingEntry[]> {
  try {
    // 모든 점수 데이터 가져오기
    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .order("score", { ascending: false })
      .order("played_at", { ascending: true });

    if (error) {
      throw error;
    }

    // 닉네임별 최고 점수만 필터링
    const bestScoresByNickname = new Map<string, (typeof data)[0]>();

    (data || []).forEach((item) => {
      const existing = bestScoresByNickname.get(item.nickname);
      if (!existing || item.score > existing.score) {
        bestScoresByNickname.set(item.nickname, item);
      }
    });

    // Map을 배열로 변환하고 점수순으로 정렬
    const uniqueScores = Array.from(bestScoresByNickname.values())
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score; // 점수 내림차순
        }
        // 점수가 같으면 먼저 기록한 사람이 우선
        return (
          new Date(a.played_at).getTime() - new Date(b.played_at).getTime()
        );
      })
      .slice(0, limit); // limit 적용

    // 순위를 계산하고 데이터를 변환
    return uniqueScores.map((item, index) => ({
      rank: index + 1,
      nickname: item.nickname,
      score: item.score,
      correctAnswers: item.correct_answers,
      maxCombo: item.max_combo,
      playedAt: new Date(item.played_at),
    }));
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}

/**
 * 오늘의 랭킹 조회
 * 각 닉네임의 최고 점수만 표시
 */
export async function getTodayLeaderboard(
  limit = 100
): Promise<RankingEntry[]> {
  try {
    // 오늘 날짜의 시작 시간 계산
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.toISOString();

    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .gte("played_at", todayStart)
      .order("score", { ascending: false })
      .order("played_at", { ascending: true });

    if (error) {
      throw error;
    }

    // 닉네임별 최고 점수만 필터링
    const bestScoresByNickname = new Map<string, (typeof data)[0]>();

    (data || []).forEach((item) => {
      const existing = bestScoresByNickname.get(item.nickname);
      if (!existing || item.score > existing.score) {
        bestScoresByNickname.set(item.nickname, item);
      }
    });

    // Map을 배열로 변환하고 점수순으로 정렬
    const uniqueScores = Array.from(bestScoresByNickname.values())
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score; // 점수 내림차순
        }
        // 점수가 같으면 먼저 기록한 사람이 우선
        return (
          new Date(a.played_at).getTime() - new Date(b.played_at).getTime()
        );
      })
      .slice(0, limit); // limit 적용

    // 순위를 계산하고 데이터를 변환
    return uniqueScores.map((item, index) => ({
      rank: index + 1,
      nickname: item.nickname,
      score: item.score,
      correctAnswers: item.correct_answers,
      maxCombo: item.max_combo,
      playedAt: new Date(item.played_at),
    }));
  } catch (error) {
    console.error("Error fetching today's leaderboard:", error);
    return [];
  }
}

/**
 * 특정 플레이어의 순위 조회
 * 닉네임별 최고 점수를 기준으로 순위 계산
 */
export async function getPlayerRank(nickname: string): Promise<number | null> {
  try {
    // 모든 점수 데이터 가져오기
    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .order("score", { ascending: false });

    if (error) {
      throw error;
    }

    // 닉네임별 최고 점수만 필터링
    const bestScoresByNickname = new Map<string, number>();

    (data || []).forEach((item) => {
      const existing = bestScoresByNickname.get(item.nickname);
      if (!existing || item.score > existing) {
        bestScoresByNickname.set(item.nickname, item.score);
      }
    });

    // 해당 플레이어의 최고 점수
    const playerBestScore = bestScoresByNickname.get(nickname);
    if (!playerBestScore) {
      return null; // 해당 플레이어의 기록이 없음
    }

    // 점수를 배열로 변환하고 내림차순 정렬
    const sortedScores = Array.from(bestScoresByNickname.values()).sort(
      (a, b) => b - a
    );

    // 플레이어의 순위 찾기
    const rank =
      sortedScores.findIndex((score) => score === playerBestScore) + 1;

    return rank;
  } catch (error) {
    console.error("Error fetching player rank:", error);
    return null;
  }
}
