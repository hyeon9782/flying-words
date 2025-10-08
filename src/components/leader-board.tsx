import { useState, useEffect } from "react";
import { getLeaderboard, getTodayLeaderboard } from "../api/leader-board";
import type { RankingEntry } from "../types";

interface LeaderboardProps {
  onClose: () => void;
  currentPlayerNickname?: string;
  highlightScore?: number;
}

export function Leaderboard({
  onClose,
  currentPlayerNickname,
  highlightScore,
}: LeaderboardProps) {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"all" | "today">("all");

  useEffect(() => {
    loadRankings();
  }, [viewMode]);

  async function loadRankings() {
    setIsLoading(true);
    try {
      const data =
        viewMode === "today"
          ? await getTodayLeaderboard(100)
          : await getLeaderboard(100);
      setRankings(data);
    } catch (error) {
      console.error("Failed to load rankings:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getMedalEmoji(rank: number) {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "";
    }
  }

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-md rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] border-2 border-white/20 shadow-2xl overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            🏆 리더보드
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 탭 전환 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewMode("all")}
            className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all ${
              viewMode === "all"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            전체 랭킹
          </button>
          <button
            onClick={() => setViewMode("today")}
            className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all ${
              viewMode === "today"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            오늘의 랭킹
          </button>
        </div>

        {/* 랭킹 리스트 */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-white/70 text-lg">로딩 중...</div>
            </div>
          ) : rankings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-white/70 text-lg">아직 기록이 없습니다</div>
              <div className="text-white/50 text-sm mt-2">
                첫 번째 플레이어가 되어보세요!
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {rankings.map((entry) => {
                const isCurrentPlayer =
                  currentPlayerNickname === entry.nickname &&
                  highlightScore === entry.score;
                return (
                  <div
                    key={`${entry.rank}-${entry.nickname}-${entry.playedAt}`}
                    className={`${
                      isCurrentPlayer
                        ? "bg-gradient-to-r from-green-500/30 to-blue-500/30 border-2 border-green-400"
                        : "bg-white/5 hover:bg-white/10 border border-white/10"
                    } backdrop-blur-sm rounded-xl p-4 transition-all duration-200`}
                  >
                    <div className="flex items-center gap-4">
                      {/* 순위 */}
                      <div className="flex-shrink-0 w-12 text-center">
                        <div className="text-2xl font-bold text-white">
                          {getMedalEmoji(entry.rank)}
                          {!getMedalEmoji(entry.rank) && (
                            <span className="text-white/70">{entry.rank}</span>
                          )}
                        </div>
                      </div>

                      {/* 닉네임 */}
                      <div className="flex-1">
                        <div
                          className={`text-lg font-bold ${
                            isCurrentPlayer ? "text-green-300" : "text-white"
                          }`}
                        >
                          {entry.nickname}
                          {isCurrentPlayer && (
                            <span className="ml-2 text-sm text-green-400">
                              (나)
                            </span>
                          )}
                        </div>
                        <div className="text-white/50 text-xs">
                          {formatDate(entry.playedAt)}
                        </div>
                      </div>

                      {/* 통계 */}
                      <div className="flex gap-4 text-right">
                        <div>
                          <div className="text-yellow-400 text-xl font-bold">
                            {entry.score}점
                          </div>
                          <div className="text-white/50 text-xs">점수</div>
                        </div>
                        <div>
                          <div className="text-blue-400 text-xl font-bold">
                            {entry.correctAnswers}
                          </div>
                          <div className="text-white/50 text-xs">정답</div>
                        </div>
                        <div>
                          <div className="text-purple-400 text-xl font-bold">
                            ×{entry.maxCombo}
                          </div>
                          <div className="text-white/50 text-xs">최고콤보</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold text-lg px-8 py-3 rounded-xl transition-all duration-200"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
