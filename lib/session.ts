// 세션 ID 생성 및 관리
const SESSION_KEY = 'advent_calendar_session'

export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  let sessionId = localStorage.getItem(SESSION_KEY)
  
  if (!sessionId) {
    sessionId = generateSessionId()
    localStorage.setItem(SESSION_KEY, sessionId)
  }
  
  return sessionId
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

export function hasUploadedMemory(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('has_uploaded') === 'true'
}

export function setUploadedMemory(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('has_uploaded', 'true')
}

