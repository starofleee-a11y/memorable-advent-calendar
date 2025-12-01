# Advent Calendar 2025

크리스마스까지의 특별한 순간들을 기록하는 어드밴트 캘린더 웹사이트

## 📋 주요 기능

1. **추억 업로드**
   - "Archive Memory" 버튼으로 날짜 선택 및 사진/글 업로드
   - 한 날짜당 최대 5개의 추억까지 아카이브 가능
   - 한 사용자(세션)당 1개의 추억만 업로드 가능
   - 글은 500자 이내로 제한

2. **시간 제한**
   - 2025년 12월 31일 자정까지만 업로드 가능
   - 각 날짜별 아카이브는 해당 날짜 자정부터 공개

3. **추억 조회**
   - 날짜 호버시 등록된 추억 개수 (n/5) 툴팁 표시
   - 날짜 클릭시 좌측 사이드바로 해당 날짜의 추억들 조회
   - 자정 전 날짜 클릭시 안내 메시지 표시

4. **토스트 알림**
   - 업로드 완료시 "Archive Complete!" 메시지 (2초)
   - 이미 업로드한 사용자의 재업로드 시도시 안내 메시지 (2초)

## 🛠️ 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **State Management**: React Hooks

## 📦 설치 및 실행

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정

`env.template.txt` 파일을 참고하여 `.env.local` 파일을 생성합니다:

```bash
cp env.template.txt .env.local
```

`.env.local` 파일을 열고 Supabase 프로젝트의 값으로 교체:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase 설정

#### 데이터베이스 설정

Supabase Dashboard의 SQL Editor에서 `supabase/schema.sql` 파일의 내용을 실행합니다.

#### Storage 설정

1. Supabase Dashboard → Storage → New Bucket
2. Bucket 설정:
   - Name: `memories`
   - Public: ✅ (체크)
   - File size limit: 10MB
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`

3. Storage Policies 설정:
   - 모든 사용자가 memories 버킷에 파일 업로드 가능
   - 모든 사용자가 memories 버킷의 파일 읽기 가능

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 📁 프로젝트 구조

```
advent-calendar/
├── app/
│   ├── api/
│   │   ├── check-session/
│   │   │   └── route.ts          # 세션 업로드 여부 확인
│   │   └── memories/
│   │       ├── route.ts           # 추억 CRUD
│   │       └── count/
│   │           └── route.ts       # 날짜별 추억 개수 조회
│   ├── layout.tsx                 # 루트 레이아웃
│   ├── page.tsx                   # 메인 페이지
│   └── globals.css                # 글로벌 스타일
├── components/
│   ├── Toast.tsx                  # 토스트 알림 컴포넌트
│   ├── Modal.tsx                  # 기본 모달 컴포넌트
│   ├── UploadModal.tsx            # 추억 업로드 모달
│   └── MemorySidebar.tsx          # 추억 조회 사이드바
├── lib/
│   ├── supabase.ts                # Supabase 클라이언트
│   ├── session.ts                 # 세션 관리
│   └── utils.ts                   # 유틸리티 함수
├── types/
│   └── index.ts                   # TypeScript 타입 정의
├── supabase/
│   └── schema.sql                 # 데이터베이스 스키마
└── public/                        # 정적 파일
```

## 🗄️ 데이터베이스 스키마

### memories 테이블

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | UUID | 기본 키 |
| date | DATE | 추억 날짜 |
| user_session_id | TEXT | 세션 ID |
| image_url | TEXT | 이미지 URL |
| content | TEXT | 글 내용 (최대 500자) |
| created_at | TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | 수정 시간 |

### 제약 조건

- 날짜당 최대 5개 추억 (트리거로 제어)
- 세션당 1개 추억만 업로드 가능 (트리거로 제어)
- 글 내용은 500자 이내 (CHECK 제약)

## 🎨 디자인

피그마 디자인에 맞춰 UI를 구현할 예정입니다.

## 📝 API 엔드포인트

### GET /api/memories?date={date}
특정 날짜의 추억 조회

### POST /api/memories
새로운 추억 업로드
- FormData: date, sessionId, content, image

### GET /api/memories/count
모든 날짜별 추억 개수 조회

### GET /api/check-session?sessionId={sessionId}
세션이 이미 업로드했는지 확인

## 🚀 배포

Vercel에 배포하는 것을 권장합니다:

1. GitHub에 코드 푸시
2. Vercel에서 프로젝트 import
3. 환경 변수 설정 (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
4. 배포

## 📄 라이센스

Private Project

# memorable-advent-calendar
