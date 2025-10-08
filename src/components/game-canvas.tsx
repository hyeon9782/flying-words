import { useMemo, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { HangulChar3D } from "./hangul-char-3d";
import {
  decomposeHangul,
  isVowel,
  getRandomPosition,
  getRandomSpeed,
  // getRandomConsonants, // 하드 모드용
  // getRandomVowels, // 하드 모드용
} from "../utils/hangul";

interface GameCanvasProps {
  targetWord?: string;
}

export const GameCanvas = memo(function GameCanvas({
  targetWord = "한글날",
}: GameCanvasProps) {
  // 글자 데이터를 메모이제이션 - targetWord가 변경될 때만 재생성
  const charDataList = useMemo(() => {
    // 타겟 단어를 자음/모음으로 분해
    const chars = decomposeHangul(targetWord);

    // [하드 모드용] 랜덤 자음 3개, 모음 3개 추가
    // const randomConsonants = getRandomConsonants(3);
    // const randomVowels = getRandomVowels(3);
    // const allChars = [...chars, ...randomConsonants, ...randomVowels];

    // 일반 모드: 정답에 필요한 글자를 중복 포함하여 모두 표시
    const allChars = chars;

    // 각 글자의 위치와 속도를 미리 생성하여 고정
    return allChars.map((char) => ({
      char,
      isVowel: isVowel(char),
      position: getRandomPosition(),
      speed: getRandomSpeed(),
    }));
  }, [targetWord]);

  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 75 }}
      style={{
        background: "linear-gradient(to bottom, #1a1a2e 0%, #16213e 100%)",
      }}
    >
      {/* 조명 설정 */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
      />

      {/* 환경 설정 */}
      <Environment preset="city" />

      {/* 날아다니는 3D 한글 글자들 */}
      {charDataList.map((charData, index) => (
        <HangulChar3D
          key={`${charData.char}-${index}`}
          char={charData.char}
          isVowel={charData.isVowel}
          position={charData.position}
          speed={charData.speed}
        />
      ))}

      {/* 카메라 컨트롤 (개발 중에만 사용) */}
      <OrbitControls enableZoom={true} enablePan={true} />
    </Canvas>
  );
});
