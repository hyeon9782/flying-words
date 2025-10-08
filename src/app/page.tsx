"use client";

import { useState, useRef, useEffect } from "react";
import { GameCanvas } from "../components/game-canvas";
import { NicknameInput } from "../components/nickname-input";
import { Leaderboard } from "../components/leader-board";
import { getRandomWord, type WordData } from "../data/words";
import { saveScore } from "../api/leader-board";
import type { GameState } from "../types";

function Home() {
  const [gameState, setGameState] = useState<GameState>("nickname");
  const [nickname, setNickname] = useState("");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [targetWordData, setTargetWordData] = useState<WordData | null>(null);
  const [message, setMessage] = useState("");
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false); // 한글 조합 중인지 체크

  const targetWord = targetWordData?.word || "";
  const targetTheme = targetWordData?.theme || "";
  const isPlaying = gameState === "playing";

  // 게임 시작 시 input에 포커스
  useEffect(() => {
    if (isPlaying && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isPlaying]);

  // 개발용: 정답 단어 콘솔 출력
  useEffect(() => {
    if (isPlaying) {
      console.log(
        "🎯 정답:",
        targetWord,
        `(${targetWord.length}글자)`,
        `[테마: ${targetTheme}]`
      );
    }
  }, [targetWord, targetTheme, isPlaying]);

  // 타이머 기능
  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // 게임 종료
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // 최고 콤보 업데이트
  useEffect(() => {
    if (combo > maxCombo) {
      setMaxCombo(combo);
    }
  }, [combo, maxCombo]);

  function handleSubmit(submittedValue: string) {
    if (!targetWord) return; // 단어가 아직 로드되지 않은 경우

    if (submittedValue === targetWord) {
      // 정답!
      const points = 100 + targetWord.length * 20 + combo * 10;
      setScore(score + points);
      setCombo(combo + 1);
      setCorrectAnswers(correctAnswers + 1);
      setMessage("정답입니다! 🎉");
      setInput("");

      // 다음 단어로 변경 (현재 단어 제외)
      setTimeout(() => {
        const nextWordData = getRandomWord(targetWord);
        setTargetWordData(nextWordData);
        setMessage("");
      }, 1500);

      // 포커스 유지
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      // 오답
      setCombo(0);
      setMessage("틀렸습니다! 다시 시도하세요 ❌");
      setInput("");

      // 포커스 유지
      setTimeout(() => inputRef.current?.focus(), 100);

      // 메시지 2초 후 제거
      setTimeout(() => setMessage(""), 2000);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // 한글 조합 중이면 Enter를 무시
    if (e.key === "Enter" && !isComposingRef.current && input.trim()) {
      e.preventDefault();
      handleSubmit(input.trim());
    }
  }

  function handleCompositionStart() {
    isComposingRef.current = true;
  }

  function handleCompositionEnd() {
    isComposingRef.current = false;
  }

  function handleNicknameSubmit(inputNickname: string) {
    setNickname(inputNickname);
    setGameState("playing");
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectAnswers(0);
    setTimeLeft(300);
    setMessage("");
    setInput("");
    setTargetWordData(getRandomWord());
  }

  function handlePass() {
    if (!targetWord) return; // 단어가 아직 로드되지 않은 경우

    // 패스 - 콤보 초기화하고 다음 단어로
    setCombo(0);
    setInput("");
    const nextWordData = getRandomWord(targetWord);
    setTargetWordData(nextWordData);
    setMessage("패스! 다음 문제입니다 ⏭️");

    setTimeout(() => {
      setMessage("");
      inputRef.current?.focus();
    }, 1000);
  }

  async function handleGameOver() {
    setGameState("gameOver");
    setMessage("시간 종료! 게임이 끝났습니다 ⏰");

    // 점수 저장 (비동기)
    try {
      await saveScore({
        nickname,
        score,
        correctAnswers,
        maxCombo,
      });
    } catch (error) {
      console.error("Failed to save score:", error);
      // 에러가 나도 게임은 계속 진행
    }
  }

  function handlePlayAgain() {
    setGameState("playing");
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectAnswers(0);
    setTimeLeft(300);
    setMessage("");
    setInput("");
    setTargetWordData(getRandomWord());
  }

  function handleBackToNickname() {
    setGameState("nickname");
    setNickname("");
  }

  function handleViewRanking() {
    setGameState("ranking");
  }

  function handleCloseRanking() {
    if (nickname) {
      setGameState("gameOver");
    } else {
      setGameState("nickname");
    }
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* 3D 캔버스 */}
      <div className="absolute inset-0">
        <GameCanvas targetWord={targetWord} />
      </div>

      {/* UI 오버레이 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 상단 HUD */}
        <div className="flex justify-between items-start p-6 gap-4">
          {/* 타이머 */}
          <div
            className={`bg-black/50 backdrop-blur-sm rounded-lg px-6 py-3 border-2 transition-colors ${
              timeLeft <= 30
                ? "border-red-500 animate-pulse"
                : timeLeft <= 60
                ? "border-yellow-500"
                : "border-blue-500"
            }`}
          >
            <div className="text-white text-sm font-medium mb-1">시간</div>
            <div
              className={`text-3xl font-bold ${
                timeLeft <= 30
                  ? "text-red-400"
                  : timeLeft <= 60
                  ? "text-yellow-400"
                  : "text-white"
              }`}
            >
              {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
            </div>
          </div>

          {/* 테마 & 글자 수 힌트 */}
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-6 py-3 border-2 border-green-500">
            <div className="text-white text-sm font-medium mb-1">힌트</div>
            <div className="text-green-400 text-2xl font-bold">
              {targetTheme}
            </div>
            <div className="text-yellow-400 text-lg font-bold mt-1">
              {targetWord.length}글자
            </div>
          </div>

          {/* 점수 */}
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-6 py-3 border-2 border-purple-500">
            <div className="text-white text-sm font-medium mb-1">점수</div>
            <div className="text-white text-3xl font-bold">{score}</div>
          </div>

          {/* 콤보 */}
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-6 py-3 border-2 border-yellow-500">
            <div className="text-white text-sm font-medium mb-1">콤보</div>
            <div className="text-white text-3xl font-bold">×{combo}</div>
          </div>

          {/* 패스 버튼 */}
          <button
            onClick={handlePass}
            disabled={!isPlaying}
            className="pointer-events-auto bg-orange-500/80 hover:bg-orange-600 disabled:bg-gray-500/50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 border-2 border-orange-400"
          >
            <div className="text-sm mb-1">패스</div>
            <div className="text-2xl">⏭️</div>
          </button>
        </div>

        {/* 정답/오답 메시지 */}
        {message && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              className={`${
                message.includes("정답")
                  ? "bg-green-500/90 border-green-300"
                  : "bg-red-500/90 border-red-300"
              } backdrop-blur-md rounded-2xl px-12 py-6 border-2 shadow-2xl animate-bounce`}
            >
              <div className="text-white text-4xl font-bold text-center">
                {message}
              </div>
            </div>
          </div>
        )}

        {/* 하단 입력창 */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-2xl mx-auto">
            {/* 입력 표시 */}
            <div className="bg-black/70 backdrop-blur-md rounded-2xl px-8 py-6 border-2 border-green-500 shadow-2xl pointer-events-auto">
              <div className="text-white/70 text-sm font-medium mb-3">
                날아다니는 글자로 단어를 맞춰보세요!
              </div>
              <div className="relative">
                {/* 실제 input 요소 (숨김) */}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={handleCompositionEnd}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-default"
                  autoComplete="off"
                  disabled={!isPlaying}
                />
                {/* 표시용 div */}
                <div
                  className="text-white text-4xl font-bold min-h-[60px] flex items-center cursor-text"
                  onClick={() => inputRef.current?.focus()}
                >
                  {input || (
                    <span className="text-white/30">여기에 입력하세요...</span>
                  )}
                </div>
              </div>
              <div className="text-white/50 text-sm mt-4 text-center">
                Enter: 제출 | Backspace: 삭제
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 닉네임 입력 화면 */}
      {gameState === "nickname" && (
        <NicknameInput
          onStart={handleNicknameSubmit}
          onViewRanking={handleViewRanking}
        />
      )}

      {/* 게임 오버 화면 */}
      {gameState === "gameOver" && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-gradient-to-br from-red-900/90 to-purple-900/90 backdrop-blur-md rounded-3xl p-12 max-w-2xl border-2 border-red-500/50 shadow-2xl">
            <h1 className="text-6xl font-bold mb-6 text-center text-red-400">
              게임 종료!
            </h1>

            {/* 플레이어 정보 */}
            <div className="text-center mb-6">
              <div className="text-white/70 text-lg mb-2">플레이어</div>
              <div className="text-blue-300 text-3xl font-bold">{nickname}</div>
            </div>

            {/* 결과 통계 */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-white/70 text-sm mb-1">최종 점수</div>
                <div className="text-yellow-400 text-3xl font-bold">
                  {score}점
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-white/70 text-sm mb-1">정답 수</div>
                <div className="text-green-400 text-3xl font-bold">
                  {correctAnswers}
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-white/70 text-sm mb-1">최고 콤보</div>
                <div className="text-purple-400 text-3xl font-bold">
                  ×{maxCombo}
                </div>
              </div>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handlePlayAgain}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-xl px-12 py-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                다시 하기 🎮
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleViewRanking}
                  className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 font-bold text-lg px-6 py-3 rounded-xl border-2 border-yellow-500/50 transition-all duration-200"
                >
                  랭킹 보기 🏆
                </button>
                <button
                  onClick={handleBackToNickname}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white/80 font-bold text-lg px-6 py-3 rounded-xl border-2 border-white/20 transition-all duration-200"
                >
                  닉네임 변경
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 랭킹 화면 */}
      {gameState === "ranking" && (
        <Leaderboard
          onClose={handleCloseRanking}
          currentPlayerNickname={nickname}
          highlightScore={score}
        />
      )}
    </div>
  );
}

export default Home;
