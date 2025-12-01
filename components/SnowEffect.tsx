'use client'

import { useEffect, useState } from 'react'

interface Snowflake {
  id: number
  left: number
  animationDuration: number
  animationDelay: number
  fontSize: number
  opacity: number
  drift: number // 좌우 흔들림
}

export default function SnowEffect() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([])

  useEffect(() => {
    // 눈송이 생성
    const flakes: Snowflake[] = []
    const numberOfFlakes = 60 // 눈송이 개수

    for (let i = 0; i < numberOfFlakes; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100, // 0-100% 랜덤 위치
        animationDuration: 15 + Math.random() * 15, // 15-30초 랜덤 속도 (천천히)
        animationDelay: Math.random() * 10, // 0-10초 랜덤 딜레이
        fontSize: 12 + Math.random() * 18, // 12-30px 랜덤 크기
        opacity: 0.4 + Math.random() * 0.6, // 0.4-1.0 랜덤 투명도
        drift: -50 + Math.random() * 100, // -50 ~ 50px 좌우 흔들림
      })
    }

    setSnowflakes(flakes)
  }, [])

  return (
    <>
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute -top-10 text-white drop-shadow-lg pointer-events-none"
          style={{
            left: `${flake.left}%`,
            animation: `snow ${flake.animationDuration}s linear infinite`,
            animationDelay: `${flake.animationDelay}s`,
            fontSize: `${flake.fontSize}px`,
            opacity: flake.opacity,
            '--drift': `${flake.drift}px`,
          } as React.CSSProperties & { '--drift': string }}
        >
          ❄
        </div>
      ))}
    </>
  )
}

