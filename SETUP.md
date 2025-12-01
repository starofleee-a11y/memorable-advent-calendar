# 프로젝트 설정 가이드

## Supabase 프로젝트 생성 및 설정

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 접속
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - Name: Advent Calendar
   - Database Password: 안전한 비밀번호 생성
   - Region: Northeast Asia (Seoul) 또는 가까운 지역
4. "Create new project" 클릭

### 2. 데이터베이스 스키마 설정

1. Supabase Dashboard → SQL Editor
2. `supabase/schema.sql` 파일의 내용 복사
3. SQL Editor에 붙여넣기
4. "RUN" 버튼 클릭하여 실행

### 3. Storage 버킷 생성

1. Supabase Dashboard → Storage
2. "New Bucket" 클릭
3. Bucket 설정:
   ```
   Name: memories
   Public bucket: ✅ (체크)
   File size limit: 10485760 (10MB)
   Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
   ```
4. "Create bucket" 클릭

### 4. Storage Policies 설정

#### Upload Policy

1. Storage → memories bucket → Policies
2. "New Policy" 클릭
3. Policy 설정:
   ```
   Policy name: Allow public upload
   Allowed operation: INSERT
   Target roles: public
   USING expression: true
   WITH CHECK expression: true
   ```

#### Read Policy

1. "New Policy" 클릭
2. Policy 설정:
   ```
   Policy name: Allow public read
   Allowed operation: SELECT
   Target roles: public
   USING expression: true
   ```

### 5. 환경 변수 설정

1. Supabase Dashboard → Settings → API
2. 다음 값들 복사:
   - Project URL
   - anon public key

3. 프로젝트 루트에 `.env.local` 파일 생성:
   ```bash
   cp env.template.txt .env.local
   ```

4. `.env.local` 파일 수정:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

## 로컬 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 배포 (Vercel)

### 1. GitHub에 코드 푸시

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Vercel 배포

1. [Vercel](https://vercel.com) 접속
2. "Import Project" 클릭
3. GitHub 저장소 선택
4. Environment Variables 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anon Key
5. "Deploy" 클릭

## 데이터베이스 확인

### memories 테이블 확인

Supabase Dashboard → Table Editor → memories

### Storage 파일 확인

Supabase Dashboard → Storage → memories

## 트러블슈팅

### 이미지 업로드 실패

1. Storage bucket이 public인지 확인
2. Storage policies가 제대로 설정되었는지 확인
3. 파일 크기가 10MB 이하인지 확인
4. 허용된 MIME type인지 확인

### 추억 업로드 실패

1. 데이터베이스 스키마가 제대로 생성되었는지 확인
2. 트리거가 활성화되어 있는지 확인
3. RLS(Row Level Security)가 활성화되어 있는지 확인
4. policies가 제대로 설정되었는지 확인

### 환경 변수 오류

1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 변수명이 `NEXT_PUBLIC_`으로 시작하는지 확인
3. 개발 서버를 재시작했는지 확인

## 유용한 SQL 쿼리

### 모든 추억 조회

```sql
SELECT * FROM memories ORDER BY created_at DESC;
```

### 날짜별 추억 개수

```sql
SELECT date, COUNT(*) as count 
FROM memories 
GROUP BY date 
ORDER BY date;
```

### 특정 세션의 업로드 확인

```sql
SELECT * FROM memories WHERE user_session_id = 'YOUR_SESSION_ID';
```

### 모든 데이터 초기화 (개발 중에만!)

```sql
DELETE FROM memories;
```

