'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import UploadModal from '@/components/UploadModal'
import MemorySidebar from '@/components/MemorySidebar'
import Toast from '@/components/Toast'
import SnowEffect from '@/components/SnowEffect'
import CalendarWindow from '@/components/CalendarWindow'
import LockedDateModal from '@/components/LockedDateModal'
import { useToast } from '@/hooks/useToast'
import { useMemories } from '@/hooks/useMemories'
import { getSessionId, hasUploadedMemory, setUploadedMemory } from '@/lib/session'
import { isUploadPeriodValid, isDateUnlocked } from '@/lib/utils'

export default function Home() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedDateNumber, setSelectedDateNumber] = useState(0)
  const [sessionId, setSessionId] = useState('')
  
  const { toast, showToast, hideToast } = useToast()
  const { memories, memoryCounts, uploadMemory, fetchMemoriesByDate, fetchMemoryCounts, checkSession } = useMemories()

  useEffect(() => {
    const id = getSessionId()
    setSessionId(id)
    // 각 날짜별 추억 개수 가져오기
    fetchMemoryCounts()

    // 10분마다 메모리 개수 업데이트 (경제적)
    const interval = setInterval(() => {
      fetchMemoryCounts()
    }, 10 * 60 * 1000) // 10분 = 600,000ms

    // 클린업
    return () => clearInterval(interval)
  }, [fetchMemoryCounts])

  // 페이지가 다시 포커스될 때도 업데이트 (탭 전환 후 돌아왔을 때)
  useEffect(() => {
    const handleFocus = () => {
      fetchMemoryCounts()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [fetchMemoryCounts])

  const handleArchiveClick = async () => {
    // 업로드 기간 체크
    if (!isUploadPeriodValid()) {
      showToast('Upload period has ended.', 'error')
      return
    }

    // 테스트용: 세션 체크 비활성화
    // if (hasUploadedMemory()) {
    //   showToast('One user can upload only one memory :)', 'info')
    //   return
    // }

    // const hasUploaded = await checkSession(sessionId)
    // if (hasUploaded) {
    //   setUploadedMemory()
    //   showToast('One user can upload only one memory :)', 'info')
    //   return
    // }

    setIsUploadModalOpen(true)
  }

  const handleUpload = async (date: string, image: File, content: string) => {
    try {
      // 테스트용: 매번 새로운 세션 ID 생성 (여러 개 업로드 가능)
      const testSessionId = `test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      await uploadMemory(testSessionId, date, image, content)
      // setUploadedMemory() // 테스트용 비활성화
      showToast('Archive Complete!', 'success')
      setIsUploadModalOpen(false)
      // 업로드 후 개수 새로고침
      await fetchMemoryCounts()
    } catch (error: any) {
      showToast(error.message || 'Upload failed', 'error')
      throw error
    }
  }

  const handleDateClick = async (date: string, dateNumber: number) => {
    if (!isDateUnlocked(date)) {
      setIsLockedModalOpen(true)
      return
    }

    setSelectedDate(date)
    setSelectedDateNumber(dateNumber)
    await fetchMemoriesByDate(date)
    setIsSidebarOpen(true)
  }

  const handleDateChangeInSidebar = async (date: string, dateNumber: number) => {
    setSelectedDate(date)
    setSelectedDateNumber(dateNumber)
    await fetchMemoriesByDate(date)
  }

  // 날짜별 추억 개수 가져오기
  const getMemoryCount = (day: number): number => {
    const dateStr = `2025-12-${day.toString().padStart(2, '0')}`
    const found = memoryCounts.find(item => item.date === dateStr)
    return found ? found.count : 0
  }

  // 12월 1일~31일 창문 좌표 (피그마 기준)
  const calendarWindows = [
    { date: 1, x: 587, y: 354 },
    { date: 2, x: 643, y: 354 },
    { date: 3, x: 701, y: 354 },
    { date: 4, x: 808, y: 354 },
    { date: 5, x: 865, y: 354 },
    { date: 6, x: 532, y: 426 },
    { date: 7, x: 587, y: 426 },
    { date: 8, x: 642, y: 426 },
    { date: 9, x: 756, y: 426 },
    { date: 10, x: 811, y: 426 },
    { date: 11, x: 532, y: 501 },
    { date: 12, x: 587, y: 501 },
    { date: 13, x: 643, y: 501 },
    { date: 14, x: 754, y: 501 },
    { date: 15, x: 808, y: 501 },
    { date: 16, x: 866, y: 501 },
    { date: 17, x: 333, y: 574 },
    { date: 18, x: 389, y: 574 },
    { date: 19, x: 455, y: 574 },
    { date: 20, x: 944, y: 574 },
    { date: 21, x: 1007, y: 574 },
    { date: 22, x: 1063, y: 574 },
    { date: 23, x: 389, y: 641 },
    { date: 24, x: 532, y: 641 },
    { date: 25, x: 614, y: 641 },
    { date: 26, x: 783, y: 641 },
    { date: 27, x: 944, y: 641 },
    { date: 28, x: 455, y: 716 },
    { date: 29, x: 614, y: 716 },
    { date: 30, x: 783, y: 716 },
    { date: 31, x: 865, y: 716 },
  ]

  return (
    <>
      <main className="relative w-screen h-screen overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#E1B9E6' }}>
        {/* 고정 비율 컨테이너 (1440x1024) */}
        <div 
          className="relative"
          style={{
            width: '1440px',
            height: '1024px',
            transform: `scale(min(calc(100vw / 1440), calc(100vh / 1024)))`,
            transformOrigin: 'center center'
          }}
        >
          {/* 배경 이미지 + 로고 + 하트 컨테이너 */}
          <div 
            className="absolute inset-0 w-full h-full animate-background-fade-in transition-transform duration-[1500ms]"
            style={{
              transform: isSidebarOpen ? 'translateX(-80px)' : 'translateX(0)',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* 배경 이미지 */}
            <Image
              src="/img/Desktop - 5.png"
              alt="Background"
              width={1440}
              height={1024}
              className="w-full h-full object-cover"
              priority
            />

            {/* 상단 로고 - 배경과 함께 이동 */}
            <div 
              className={`absolute animate-logo-fade-in transition-opacity duration-[1500ms] ${isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              style={{
                left: '427px',
                top: '69px',
                width: '586px',
                height: '168px'
              }}
            >
              <Image
                src="/img/Group 39894.png"
                alt="Advent Calendar Logo"
                width={586}
                height={168}
                className="w-full h-full object-contain"
                priority
              />
            </div>

            {/* 선택된 날짜에 하트 아이콘 표시 - 배경과 함께 이동 */}
            {isSidebarOpen && selectedDateNumber > 0 && (
              <div
                className="absolute animate-fade-in"
                style={{
                  left: `${(calendarWindows.find(w => w.date === selectedDateNumber)?.x || 0) - 20}px`,
                  top: `${(calendarWindows.find(w => w.date === selectedDateNumber)?.y || 0) - 7}px`,
                }}
              >
                <Image
                  src="/img/pixel_heart.png"
                  alt="Selected"
                  width={77}
                  height={67}
                />
              </div>
            )}
          </div>

          {/* 눈내리는 효과 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <SnowEffect />
          </div>

          {/* 콘텐츠 - 피그마 좌표대로 배치 */}
          <div className={`relative w-full h-full ${isSidebarOpen ? 'pointer-events-none' : ''}`}>

            {/* Archive Memory 버튼 - 피그마 기준 중앙 하단 */}
            <div
              className={`absolute transition-opacity duration-[1500ms] ${isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              style={{
                left: '50%',
                top: '779px',
                transform: 'translateX(-50%)'
              }}
            >
              <button
                onClick={handleArchiveClick}
                className="w-[212px] h-[70px] bg-[#080809] rounded-xl border border-[#F45A7B] flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  boxShadow: '0 0 12px 4px rgba(255, 35, 152, 0.8)'
                }}
              >
                <span className="text-white text-xl font-medium">
                  Archive Memory
                </span>
              </button>
            </div>

            {/* 하단 텍스트 - 피그마: x:138, y:880, w:1164, h:48 */}
            <div
              className={`absolute transition-opacity duration-[1500ms] ${isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              style={{
                left: '138px',
                top: '880px',
                width: '1164px',
                height: '48px'
              }}
            >
              <p className="text-center text-[#8C5067] text-lg leading-relaxed uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                Advent Calendar of Your Most Cherished Moments in 2025
                <br />
                Starting December 1, you can explore the heartfelt memories others have left in the Advent Calendar.
              </p>
            </div>

            {/* 캘린더 창문들 (12월 1일~31일) */}
            {calendarWindows.map((window) => (
              <CalendarWindow
                key={window.date}
                date={window.date}
                x={window.x}
                y={window.y}
                count={getMemoryCount(window.date)}
                onClick={() => handleDateClick(`2025-12-${window.date.toString().padStart(2, '0')}`, window.date)}
              />
            ))}

          </div>
        </div>
      </main>

      {/* 모달 & 사이드바 */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />

      <MemorySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        date={selectedDate}
        memories={memories}
        onDateChange={handleDateChangeInSidebar}
      />

      <LockedDateModal
        isOpen={isLockedModalOpen}
        onClose={() => setIsLockedModalOpen(false)}
      />

      {/* 토스트 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </>
  )
}

