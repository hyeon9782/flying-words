This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```bash
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Google Analytics 설정

1. [Google Analytics](https://analytics.google.com/)에 접속
2. 새 속성 만들기 또는 기존 속성 선택
3. 데이터 스트림 > 웹 추가
4. 측정 ID (G-XXXXXXXXXX 형식) 복사
5. `.env.local` 파일의 `NEXT_PUBLIC_GA_ID`에 붙여넣기

#### GA 이벤트 추적 사용법

게임 내에서 이벤트를 추적하려면 `src/utils/gtag.ts`의 함수를 사용하세요:

```typescript
import { gameEvents } from "@/utils/gtag";

// 게임 시작
gameEvents.startGame(nickname);

// 정답 체크
gameEvents.correctAnswer(word, combo);

// 오답
gameEvents.wrongAnswer(word);

// 패스
gameEvents.passWord(word);

// 게임 종료
gameEvents.endGame(score, correctAnswers, maxCombo);

// 랭킹 조회
gameEvents.viewRanking();
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
