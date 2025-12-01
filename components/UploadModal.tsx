'use client'

import { useState, useRef, ChangeEvent, FormEvent } from 'react'
import Modal from './Modal'
import { validateImageFile, validateContent } from '@/lib/utils'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (date: string, image: File, content: string) => Promise<void>
}

export default function UploadModal({
  isOpen,
  onClose,
  onUpload,
}: UploadModalProps) {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      return
    }

    setError(null)

    // 이미지를 1:1 정방형으로 크롭
    const reader = new FileReader()
    reader.onloadend = () => {
      const img = new Image()
      img.onload = () => {
        // Canvas 생성
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // 정방형 크기 계산 (짧은 쪽 기준)
        const size = Math.min(img.width, img.height)
        canvas.width = size
        canvas.height = size

        // 중앙 기준으로 크롭
        const startX = (img.width - size) / 2
        const startY = (img.height - size) / 2

        // 이미지 그리기
        ctx.drawImage(img, startX, startY, size, size, 0, 0, size, size)

        // Canvas를 Blob으로 변환
        canvas.toBlob((blob) => {
          if (!blob) return

          // Blob을 File로 변환
          const croppedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          })

          setSelectedImage(croppedFile)

          // Preview 설정
          setImagePreview(canvas.toDataURL())
        }, file.type)
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedDate) {
      setError('날짜를 선택해주세요.')
      return
    }

    if (!selectedImage) {
      setError('사진을 선택해주세요.')
      return
    }

    const contentValidation = validateContent(content)
    if (!contentValidation.valid) {
      setError(contentValidation.error || 'Invalid content')
      return
    }

    setIsUploading(true)

    try {
      await onUpload(selectedDate, selectedImage, content)
      
      // Reset form
      setSelectedDate('')
      setSelectedImage(null)
      setImagePreview(null)
      setContent('')
      onClose()
    } catch (err: any) {
      setError(err.message || '업로드에 실패했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const resetAndClose = () => {
    setSelectedDate('')
    setSelectedImage(null)
    setImagePreview(null)
    setContent('')
    setError(null)
    onClose()
  }

  // 12월 1일 ~ 31일 옵션 생성
  const dateOptions = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1
    return `2025-12-${day.toString().padStart(2, '0')}`
  })

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} title="Archive Memory" backgroundColor="#FCE6F2">
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        {/* 날짜 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F45A7B] focus:border-transparent transition-all cursor-pointer"
            required
          >
            <option value="">Choose a date...</option>
            {dateOptions.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        {/* 이미지 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Photo
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#F45A7B] transition-colors cursor-pointer"
          >
            {imagePreview ? (
              <div className="flex justify-center">
                <div className="w-64 h-64 overflow-hidden rounded-lg">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="text-gray-500 py-8">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Click to select a photo
              </div>
            )}
          </button>
        </div>

        {/* 글 작성 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Memory ({content.length}/500)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={500}
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F45A7B] focus:border-transparent resize-none transition-all"
            placeholder="Share your cherished moment..."
            required
          />
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* 버튼 */}
        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={resetAndClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
            style={{ fontFamily: 'Georgia, serif' }}
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-[#080809] text-white rounded-lg border border-[#F45A7B] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-default font-medium cursor-pointer"
            style={{
              boxShadow: (isUploading || !selectedImage || !content.trim() || !selectedDate) ? 'none' : '0 0 8px 2px rgba(255, 35, 152, 0.6)',
              fontFamily: 'Georgia, serif'
            }}
            disabled={isUploading || !selectedImage || !content.trim() || !selectedDate}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

