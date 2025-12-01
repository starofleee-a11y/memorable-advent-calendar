'use client'

import { Memory } from '@/types'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { isDateUnlocked } from '@/lib/utils'

interface MemorySidebarProps {
  isOpen: boolean
  onClose: () => void
  date: string
  memories: Memory[]
  onDateChange: (date: string, dateNumber: number) => void
}

export default function MemorySidebar({
  isOpen,
  onClose,
  date,
  memories,
  onDateChange,
}: MemorySidebarProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // 사이드바가 열릴 때마다 인덱스 초기화
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0)
    }
  }, [isOpen, date])

  if (!isOpen) return null

  const currentMemory = memories[currentIndex]
  const totalMemories = memories.length

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalMemories - 1 ? prev + 1 : prev))
  }

  const handleClose = () => {
    setCurrentIndex(0)
    onClose()
  }

  return (
    <>
      {/* 오버레이 배경 - 클릭 시 닫기 */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-transparent cursor-default"
          onClick={onClose}
        />
      )}

      {/* Sidebar - 우측에서 등장 */}
      <div 
        className="fixed top-0 h-full shadow-2xl z-50 overflow-y-auto transition-all duration-[1500ms]"
        style={{
          right: isOpen ? '0' : '-602px',
          width: '602px',
          backgroundImage: 'url(/img/ribbon.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div className="p-8 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            {/* 날짜 선택 드롭다운 */}
            <select
              value={date}
              onChange={(e) => {
                const newDate = e.target.value
                const day = parseInt(newDate.split('-')[2])
                onDateChange(newDate, day)
              }}
              className="text-xl font-bold text-[#8C5067] bg-white rounded-lg px-4 py-2 cursor-pointer hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200"
              style={{ 
                fontFamily: 'Georgia, serif',
                border: '0.5px solid #D1D5DB'
              }}
            >
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1
                const dateStr = `2025-12-${day.toString().padStart(2, '0')}`
                const isUnlocked = isDateUnlocked(dateStr)
                return (
                  <option 
                    key={dateStr} 
                    value={dateStr}
                    disabled={!isUnlocked}
                    style={{ 
                      color: isUnlocked ? '#8C5067' : '#999999',
                      cursor: isUnlocked ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {dateStr.replace(/-/g, '/')} {!isUnlocked ? '🔒' : ''}
                  </option>
                )
              })}
            </select>

            <button
              onClick={handleClose}
              className="hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="Close sidebar"
            >
              <Image
                src="/img/x btn.png"
                alt="Close"
                width={23}
                height={23}
              />
            </button>
          </div>

          {/* 구분선 */}
          <div className="w-full h-px bg-[#AB9B9B] mb-12" />

          {/* Memory Content */}
          {memories.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500">No memories yet.</p>
              <p className="text-gray-400 text-sm mt-2">Be the first to share a memory!</p>
            </div>
          ) : (
            <>
              {/* 이미지 & 텍스트 */}
              <div className="flex-1 flex flex-col items-center">
                {/* 이미지 (300x300 정방형) */}
                <div className="relative w-[300px] h-[300px] rounded-xl overflow-hidden bg-[#483E3E] mb-8">
                  <Image
                    src={currentMemory.image_url}
                    alt="Memory"
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>

                {/* 텍스트 */}
                <div className="w-full max-w-[424px] bg-white border border-[#E1D4D4] rounded-xl p-6">
                  <p 
                    className="text-[#483E3E] whitespace-pre-wrap break-words leading-relaxed"
                    style={{ fontFamily: 'Georgia, serif', fontSize: '18px' }}
                  >
                    {currentMemory.content}
                  </p>
                </div>
              </div>

              {/* 하단 네비게이션 */}
              <div className="flex items-center justify-center mt-8 mb-4 gap-12">
                {/* 이전 버튼 (또는 빈 공간) */}
                {currentIndex > 0 ? (
                  <button
                    onClick={handlePrev}
                    className="w-8 h-8 transition-opacity hover:opacity-70 cursor-pointer"
                  >
                    <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
                      <path d="M16.8 21L9.8 13.5L16.8 6" stroke="#322E3D" strokeWidth="3.94" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                    </svg>
                  </button>
                ) : (
                  <div className="w-8 h-8" />
                )}

                {/* 개수 표시 */}
                <div 
                  className="px-4 py-1.5 rounded-full"
                  style={{ backgroundColor: 'rgba(8, 8, 9, 0.1)' }}
                >
                  <span className="text-[#6B5C5C] text-sm font-medium">
                    {currentIndex + 1}/{totalMemories}
                  </span>
                </div>

                {/* 다음 버튼 (또는 빈 공간) */}
                {currentIndex < totalMemories - 1 ? (
                  <button
                    onClick={handleNext}
                    className="w-8 h-8 transition-opacity hover:opacity-70 cursor-pointer"
                  >
                    <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
                      <path d="M10.2 21L17.2 13.5L10.2 6" stroke="#322E3D" strokeWidth="3.94" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                    </svg>
                  </button>
                ) : (
                  <div className="w-8 h-8" />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

