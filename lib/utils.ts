import { format, isBefore, isAfter, startOfDay } from 'date-fns'

// 업로드 가능 기간 체크 (25/12/31 자정까지)
export function isUploadPeriodValid(): boolean {
  const now = new Date()
  const deadline = new Date('2025-12-31T23:59:59')
  return isBefore(now, deadline)
}

// 날짜가 공개 가능한지 체크 (해당 날짜 자정 이후)
export function isDateUnlocked(dateString: string): boolean {
  // 테스트용: 12월 1일은 항상 공개
  if (dateString === '2025-12-01') {
    return true
  }
  
  const now = new Date()
  const targetDate = startOfDay(new Date(dateString))
  return isAfter(now, targetDate) || now.getTime() === targetDate.getTime()
}

// 날짜 포맷팅
export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

// 이미지 파일 유효성 검사
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 10 * 1024 * 1024 // 10MB
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'JPG, PNG, GIF, WEBP 형식만 업로드 가능합니다.' }
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: '파일 크기는 10MB를 초과할 수 없습니다.' }
  }
  
  return { valid: true }
}

// 글 내용 유효성 검사
export function validateContent(content: string): { valid: boolean; error?: string } {
  if (!content.trim()) {
    return { valid: false, error: '내용을 입력해주세요.' }
  }
  
  if (content.length > 500) {
    return { valid: false, error: '내용은 500자를 초과할 수 없습니다.' }
  }
  
  return { valid: true }
}

// 날짜 배열 생성 (12월 1일 ~ 12월 31일)
export function generateCalendarDates(): string[] {
  const dates: string[] = []
  for (let day = 1; day <= 31; day++) {
    dates.push(`2025-12-${day.toString().padStart(2, '0')}`)
  }
  return dates
}

