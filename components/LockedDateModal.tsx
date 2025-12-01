'use client'

import Image from 'next/image'

interface LockedDateModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LockedDateModal({ isOpen, onClose }: LockedDateModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center animate-fade-in">
      {/* 검은색 오버레이 */}
      <div
        className="absolute inset-0 bg-[#080809] opacity-80"
        onClick={onClose}
      />

      {/* 팝업 박스 */}
      <div
        className="relative rounded-[14px] animate-fade-in"
        style={{
          width: '602px',
          height: '269px',
          backgroundColor: '#FCE6F2',
        }}
      >
        {/* X 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-8 top-8 w-6 h-6 hover:opacity-70 transition-opacity cursor-pointer"
          aria-label="Close"
        >
          <Image
            src="/img/x btn.png"
            alt="Close"
            width={23}
            height={23}
          />
        </button>

        {/* 내용 */}
        <div className="flex flex-col items-center px-12 pt-12">
          {/* 문 아이콘 */}
          <Image
            src="/img/material-symbols_door-open-outline.png"
            alt="Door icon"
            width={37}
            height={37}
            className="mb-2"
          />

          {/* 텍스트 */}
          <p className="text-[#080809] text-center font-medium" style={{ fontFamily: 'Georgia, serif', fontSize: '22px' }}>
            It will open at midnight on that day.
          </p>
        </div>

        {/* 하단 버튼 */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8">
          <button
            onClick={onClose}
            className="bg-[#080809] text-white rounded-lg px-12 py-2 border border-[#F45A7B] hover:scale-105 transition-all cursor-pointer"
            style={{
              width: '418px',
              height: '43px',
              boxShadow: '0 0 8px 2px rgba(255, 35, 152, 0.6)',
            }}
          >
            <span className="font-medium" style={{ fontFamily: 'Georgia, serif', fontSize: '18px' }}>Got it, I can&apos;t wait!!</span>
          </button>
        </div>
      </div>
    </div>
  )
}

