-- Advent Calendar 데이터베이스 스키마

-- memories 테이블 생성
CREATE TABLE IF NOT EXISTS memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  user_session_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_memories_date ON memories(date);
CREATE INDEX IF NOT EXISTS idx_memories_user_session ON memories(user_session_id);
CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at);

-- 날짜별 추억 개수 제한을 위한 함수
CREATE OR REPLACE FUNCTION check_memory_count_per_date()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM memories WHERE date = NEW.date) >= 5 THEN
    RAISE EXCEPTION 'Maximum 5 memories per date exceeded';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성: 날짜당 5개 제한
CREATE TRIGGER memory_count_limit
BEFORE INSERT ON memories
FOR EACH ROW
EXECUTE FUNCTION check_memory_count_per_date();

-- 세션당 1개 업로드 제한을 위한 함수
CREATE OR REPLACE FUNCTION check_one_memory_per_session()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM memories WHERE user_session_id = NEW.user_session_id) THEN
    RAISE EXCEPTION 'One user can upload only one memory';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성: 세션당 1개 제한
CREATE TRIGGER session_upload_limit
BEFORE INSERT ON memories
FOR EACH ROW
EXECUTE FUNCTION check_one_memory_per_session();

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_memories_updated_at
BEFORE UPDATE ON memories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) 활성화
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽을 수 있도록 허용
CREATE POLICY "Anyone can read memories"
ON memories FOR SELECT
USING (true);

-- 인증된 사용자만 삽입할 수 있도록 허용 (익명 키 사용)
CREATE POLICY "Anyone can insert memories"
ON memories FOR INSERT
WITH CHECK (true);

-- Storage bucket 생성 (Supabase Dashboard에서 수동으로 생성 필요)
-- Bucket name: memories
-- Public: true
-- File size limit: 10MB
-- Allowed MIME types: image/jpeg, image/png, image/gif, image/webp

-- Storage policies는 Supabase Dashboard에서 설정:
-- 1. 모든 사용자가 memories 버킷에 업로드 가능
-- 2. 모든 사용자가 memories 버킷의 파일 읽기 가능

