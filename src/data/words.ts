// 게임에 사용될 한글 단어 목록 (테마별)

export interface WordData {
  word: string;
  theme: string;
}

export const WORD_THEMES: Record<string, string[]> = {
  과자: [
    "빼빼로",
    "썬칩",
    "카라멜콘",
    "프링글스",
    "초코파이",
    "오레오",
    "포카칩",
    "새우깡",
  ],
  과일: ["사과", "바나나", "딸기", "수박", "포도", "귤", "복숭아", "키위"],
  동물: [
    "코끼리",
    "기린",
    "호랑이",
    "사자",
    "토끼",
    "강아지",
    "고양이",
    "햄스터",
  ],
  전자제품: [
    "컴퓨터",
    "키보드",
    "마우스",
    "모니터",
    "노트북",
    "스마트폰",
    "태블릿",
    "헤드폰",
  ],
  가전제품: [
    "냉장고",
    "세탁기",
    "에어컨",
    "선풍기",
    "청소기",
    "전자레인지",
    "텔레비전",
    "오븐",
  ],
  음식: [
    "김치찌개",
    "된장찌개",
    "불고기",
    "비빔밥",
    "떡볶이",
    "라면",
    "치킨",
    "피자",
  ],
  스포츠: ["축구", "야구", "농구", "배구", "테니스", "수영", "골프", "탁구"],
  직업: [
    "의사",
    "선생님",
    "경찰관",
    "소방관",
    "요리사",
    "운동선수",
    "가수",
    "배우",
  ],
};

// 모든 단어를 평탄화
const ALL_WORDS: WordData[] = Object.entries(WORD_THEMES).flatMap(
  ([theme, words]) => words.map((word) => ({ word, theme }))
);

/**
 * 랜덤으로 단어 선택 (테마 포함)
 */
export function getRandomWord(excludeWord?: string): WordData {
  let availableWords = ALL_WORDS;

  // 현재 단어를 제외 (중복 방지)
  if (excludeWord) {
    availableWords = ALL_WORDS.filter((data) => data.word !== excludeWord);
  }

  const randomIndex = Math.floor(Math.random() * availableWords.length);
  return availableWords[randomIndex];
}
