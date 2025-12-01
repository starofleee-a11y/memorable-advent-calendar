'use client'

import { useState } from 'react'
import Image from 'next/image'

interface CalendarWindowProps {
  date: number
  x: number
  y: number
  count: number
  onClick: () => void
}

export default function CalendarWindow({ date, x, y, count, onClick }: CalendarWindowProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="absolute cursor-pointer group"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: '38px',
        height: '50px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* 클릭 가능한 영역 (투명) */}
      <div className="w-full h-full" />

      {/* 툴팁 */}
      {isHovered && (
        <div
          className="absolute z-[70] animate-fade-in pointer-events-none"
          style={{
            left: '50%',
            top: '-65px',
            transform: 'translateX(-50%)',
          }}
        >
          {/* 툴팁 배경 (핀 모양) */}
          <div className="relative w-[58px] h-[58px]">
            {/* 핀 아이콘 SVG (솔리드) */}
            <svg
              width="58"
              height="58"
              viewBox="0 0 58 58"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-lg"
            >
              <path
                d="M29.0001 5.4375C19.4688 5.4375 11.7188 13.1875 11.7188 22.7188C11.7188 34.5313 27.6563 51.0625 28.3438 51.75C28.6875 52.0938 29.0313 52.4375 29.5469 52.4375C30.0626 52.4375 30.4063 52.0938 30.7501 51.75C31.4376 51.0625 47.2813 34.5313 47.2813 22.7188C47.2813 13.1875 39.5313 5.4375 29.0001 5.4375Z"
                fill="#A82F9C"
              />
            </svg>

            {/* 개수 텍스트 */}
            <div
              className="absolute text-white font-bold text-sm"
              style={{
                left: '50%',
                top: '40%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {count}/5
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

