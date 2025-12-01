'use client'

import { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  backgroundColor?: string
}

export default function Modal({ isOpen, onClose, children, title, backgroundColor = 'white' }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative rounded-lg shadow-xl w-full p-6 animate-fade-in my-8"
        style={{ backgroundColor, maxWidth: '602px' }}
      >
        {title && (
          <h2 className="text-xl font-bold mb-4 pr-8" style={{ fontFamily: 'Georgia, serif' }}>{title}</h2>
        )}
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {children}
      </div>
    </div>
  )
}

