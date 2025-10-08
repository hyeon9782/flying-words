import { useState, useRef, useEffect } from "react";

interface NicknameInputProps {
  onStart: (nickname: string) => void;
  onViewRanking: () => void;
}

export function NicknameInput({ onStart, onViewRanking }: NicknameInputProps) {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 자동 포커스
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedNickname = nickname.trim();

    // 유효성 검사
    if (!trimmedNickname) {
      setError("닉네임을 입력해주세요");
      return;
    }

    if (trimmedNickname.length < 2) {
      setError("닉네임은 2글자 이상이어야 합니다");
      return;
    }

    if (trimmedNickname.length > 10) {
      setError("닉네임은 10글자 이하여야 합니다");
      return;
    }

    // 특수문자 제한 (한글, 영문, 숫자만 허용)
    const validPattern = /^[가-힣a-zA-Z0-9]+$/;
    if (!validPattern.test(trimmedNickname)) {
      setError("한글, 영문, 숫자만 사용 가능합니다");
      return;
    }

    // 유효성 검사 통과
    onStart(trimmedNickname);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNickname(e.target.value);
    setError(""); // 입력 시 에러 초기화
  }

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-gradient-to-br from-blue-900/90 to-purple-900/90 backdrop-blur-md rounded-3xl p-4 max-w-2xl border-2 border-white/20 shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          날아라 한글!
        </h1>
        <p className="text-white/90 text-lg mb-8 text-center leading-relaxed">
          날아다니는 자음과 모음을 조합해서
          <br />
          숨겨진 단어를 맞춰보세요!
        </p>

        {/* 게임 설명 */}
        <div className="space-y-3 text-white/80 text-base mb-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span>파란색 = 자음 (ㄱ, ㄴ, ㄷ...)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span>빨간색 = 모음 (ㅏ, ㅓ, ㅗ...)</span>
          </div>
          <div className="mt-6 p-4 bg-white/10 rounded-lg space-y-2">
            <p className="text-white/70 text-sm">
              💡 힌트: 테마와 글자 수가 화면에 표시됩니다!
            </p>
            <p className="text-white/70 text-sm">
              ⏭️ 어려우면 패스 버튼으로 다음 문제로!
            </p>
            <p className="text-white/70 text-sm">
              ⏰ 제한 시간 3분 안에 최대한 많이 맞춰보세요!
            </p>
          </div>
        </div>

        {/* 닉네임 입력 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="nickname"
              className="block text-white text-sm font-medium mb-2"
            >
              닉네임 입력 (2~10글자)
            </label>
            <input
              ref={inputRef}
              id="nickname"
              type="text"
              value={nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력하세요"
              maxLength={10}
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors"
            />
            {error && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </p>
            )}
          </div>

          {/* 버튼 그룹 */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              게임 시작 🎮
            </button>
            <button
              type="button"
              onClick={onViewRanking}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-lg px-6 py-4 rounded-xl border-2 border-white/20 transition-all duration-200"
            >
              랭킹 보기 🏆
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
