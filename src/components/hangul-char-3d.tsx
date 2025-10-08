import { useRef, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";
import type { Group } from "three";

interface HangulChar3DProps {
  char: string;
  isVowel: boolean;
  position: [number, number, number];
  speed: number;
}

export const HangulChar3D = memo(function HangulChar3D({
  char,
  isVowel,
  position,
  speed,
}: HangulChar3DProps) {
  const groupRef = useRef<Group>(null);
  const timeRef = useRef(0);

  // 초기 위치와 움직임 방향을 저장
  const initialPos = useRef(position);
  const direction = useRef({
    x: (Math.random() - 0.5) * 2,
    y: (Math.random() - 0.5) * 2,
    z: (Math.random() - 0.5) * 2,
  });

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    timeRef.current += delta * speed;

    // 부드러운 회전 애니메이션
    groupRef.current.rotation.x += delta * 0.5;
    groupRef.current.rotation.y += delta * 0.3;

    // 사인파를 이용한 부드러운 움직임
    const time = timeRef.current;
    groupRef.current.position.x =
      initialPos.current[0] + Math.sin(time + direction.current.x) * 3;
    groupRef.current.position.y =
      initialPos.current[1] + Math.cos(time + direction.current.y) * 2;
    groupRef.current.position.z =
      initialPos.current[2] + Math.sin(time * 0.5 + direction.current.z) * 2;
  });

  // 자음: 파란색 계열, 모음: 빨간색 계열
  const color = isVowel ? "#ff6b6b" : "#4dabf7";

  return (
    <group ref={groupRef} position={position}>
      <Center>
        <Text3D
          font="/fonts/NanumGothic_Bold.json"
          size={1.5}
          height={0.5}
          curveSegments={12}
          bevelEnabled={true}
          bevelThickness={0.1}
          bevelSize={0.05}
          bevelOffset={0}
          bevelSegments={4}
        >
          {char}
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            metalness={0.3}
            roughness={0.4}
            toneMapped={false}
          />
        </Text3D>
      </Center>
    </group>
  );
});
