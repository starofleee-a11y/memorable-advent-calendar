'use client'

import { useState, useCallback } from 'react'
import { Memory, DateMemoryCount } from '@/types'

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [memoryCounts, setMemoryCounts] = useState<DateMemoryCount[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // 특정 날짜의 추억 조회
  const fetchMemoriesByDate = useCallback(async (date: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/memories?date=${date}`)
      const data = await response.json()
      
      if (response.ok) {
        setMemories(data.memories || [])
        return data.memories || []
      } else {
        console.warn('Failed to fetch memories:', data.error)
        setMemories([])
        return []
      }
    } catch (error) {
      console.warn('Error fetching memories:', error)
      setMemories([])
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 모든 날짜별 추억 개수 조회
  const fetchMemoryCounts = useCallback(async () => {
    try {
      const response = await fetch('/api/memories/count')
      const data = await response.json()
      
      if (response.ok) {
        setMemoryCounts(data.data || [])
        return data.data || []
      } else {
        console.warn('Failed to fetch memory counts:', data.error)
        setMemoryCounts([])
        return []
      }
    } catch (error) {
      console.warn('Error fetching memory counts:', error)
      setMemoryCounts([])
      return []
    }
  }, [])

  // 추억 업로드
  const uploadMemory = useCallback(async (
    sessionId: string,
    date: string,
    image: File,
    content: string
  ) => {
    const formData = new FormData()
    formData.append('sessionId', sessionId)
    formData.append('date', date)
    formData.append('image', image)
    formData.append('content', content)

    const response = await fetch('/api/memories', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Upload failed')
    }

    return data.data
  }, [])

  // 세션 업로드 여부 확인
  const checkSession = useCallback(async (sessionId: string) => {
    try {
      const response = await fetch(`/api/check-session?sessionId=${sessionId}`)
      const data = await response.json()
      
      if (response.ok) {
        return data.hasUploaded || false
      } else {
        console.warn('Failed to check session:', data.error)
        return false
      }
    } catch (error) {
      console.warn('Error checking session:', error)
      return false
    }
  }, [])

  return {
    memories,
    memoryCounts,
    isLoading,
    fetchMemoriesByDate,
    fetchMemoryCounts,
    uploadMemory,
    checkSession,
  }
}

