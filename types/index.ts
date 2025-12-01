// 데이터베이스 타입 정의

export interface Memory {
  id: string
  date: string // YYYY-MM-DD 형식
  user_session_id: string // 세션 ID
  image_url: string // Supabase Storage URL
  content: string // 글 내용 (최대 500자)
  created_at: string
  updated_at: string
}

export interface MemoryUploadData {
  date: string
  image: File
  content: string
}

export interface DateMemoryCount {
  date: string
  count: number
}

export interface ToastMessage {
  message: string
  type: 'success' | 'error' | 'info'
}

// API 응답 타입
export interface ApiResponse<T> {
  data?: T
  error?: string
}

// 날짜별 추억 조회 응답
export interface MemoriesResponse {
  memories: Memory[]
  total: number
}

// 업로드 가능 여부 체크
export interface UploadEligibility {
  canUpload: boolean
  reason?: string
}

