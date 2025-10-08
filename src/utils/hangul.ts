// 한글 자음 모음 분해 유틸리티

const CHO = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

const JUNG = [
  "ㅏ",
  "ㅐ",
  "ㅑ",
  "ㅒ",
  "ㅓ",
  "ㅔ",
  "ㅕ",
  "ㅖ",
  "ㅗ",
  "ㅘ",
  "ㅙ",
  "ㅚ",
  "ㅛ",
  "ㅜ",
  "ㅝ",
  "ㅞ",
  "ㅟ",
  "ㅠ",
  "ㅡ",
  "ㅢ",
  "ㅣ",
];

const JONG = [
  "",
  "ㄱ",
  "ㄲ",
  "ㄳ",
  "ㄴ",
  "ㄵ",
  "ㄶ",
  "ㄷ",
  "ㄹ",
  "ㄺ",
  "ㄻ",
  "ㄼ",
  "ㄽ",
  "ㄾ",
  "ㄿ",
  "ㅀ",
  "ㅁ",
  "ㅂ",
  "ㅄ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

// 모음 리스트
const VOWELS = new Set(JUNG);

/**
 * 한글 글자를 자음과 모음으로 분해
 */
export function decomposeHangul(word: string): string[] {
  const result: string[] = [];

  for (const char of word) {
    const code = char.charCodeAt(0) - 0xac00;

    // 완성형 한글인 경우
    if (code >= 0 && code <= 11171) {
      const cho = Math.floor(code / 588);
      const jung = Math.floor((code % 588) / 28);
      const jong = code % 28;

      result.push(CHO[cho], JUNG[jung]);
      if (jong !== 0) result.push(JONG[jong]);
    }
  }

  return result;
}

/**
 * 자음인지 모음인지 판별
 */
export function isVowel(char: string): boolean {
  return VOWELS.has(char);
}

/**
 * 랜덤한 위치 생성
 */
export function getRandomPosition(): [number, number, number] {
  return [
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
  ];
}

/**
 * 랜덤한 속도 생성
 */
export function getRandomSpeed(): number {
  return 0.5 + Math.random() * 1.5;
}

/**
 * 랜덤 자음 생성
 */
export function getRandomConsonants(count: number): string[] {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * CHO.length);
    result.push(CHO[randomIndex]);
  }
  return result;
}

/**
 * 랜덤 모음 생성
 */
export function getRandomVowels(count: number): string[] {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * JUNG.length);
    result.push(JUNG[randomIndex]);
  }
  return result;
}
