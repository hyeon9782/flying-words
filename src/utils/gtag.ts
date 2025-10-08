/**
 * Google Analytics 이벤트 추적 유틸리티
 */

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// 페이지뷰 추적
export function pageview(url: string) {
  if (!GA_TRACKING_ID) return;

  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
}

// 이벤트 추적
interface GTagEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export function event({ action, category, label, value }: GTagEvent) {
  if (!GA_TRACKING_ID) return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

// 게임 관련 이벤트
export const gameEvents = {
  // 게임 시작
  startGame: (nickname: string) => {
    event({
      action: "game_start",
      category: "Game",
      label: nickname,
    });
  },

  // 게임 종료
  endGame: (score: number, correctAnswers: number, maxCombo: number) => {
    event({
      action: "game_end",
      category: "Game",
      value: score,
      label: `Score: ${score}, Correct: ${correctAnswers}, Combo: ${maxCombo}`,
    });
  },

  // 정답
  correctAnswer: (word: string, combo: number) => {
    event({
      action: "correct_answer",
      category: "Game",
      label: word,
      value: combo,
    });
  },

  // 오답
  wrongAnswer: (word: string) => {
    event({
      action: "wrong_answer",
      category: "Game",
      label: word,
    });
  },

  // 패스
  passWord: (word: string) => {
    event({
      action: "pass_word",
      category: "Game",
      label: word,
    });
  },

  // 랭킹 조회
  viewRanking: () => {
    event({
      action: "view_ranking",
      category: "Navigation",
    });
  },
};

// gtag 타입 선언
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}
