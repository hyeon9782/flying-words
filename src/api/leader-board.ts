interface SaveScoreData {
  nickname: string;
  score: number;
  correctAnswers: number;
  maxCombo: number;
}

export const saveScore = async (data: SaveScoreData) => {
  const response = await fetch("/api/leader-board", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getLeaderboard = async () => {
  const response = await fetch("/api/leader-board");
  return response.json();
};

export const getTodayLeaderboard = async () => {
  const response = await fetch("/api/leader-board/today");
  return response.json();
};

export const getPlayerRank = async (nickname: string) => {
  const response = await fetch(`/api/leader-board/player/${nickname}`);
  return response.json();
};
