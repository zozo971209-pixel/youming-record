-- 幽明錄 Supabase 數據庫結構
-- 請在 Supabase SQL Editor 中逐段執行

-- ============================================
-- 第一步：創建主題表
-- ============================================
CREATE TABLE IF NOT EXISTS themes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  icon TEXT DEFAULT 'Eye',
  color TEXT DEFAULT 'from-blue-500 to-cyan-500',
  stats JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 第二步：創建內容區塊表
-- ============================================
CREATE TABLE IF NOT EXISTS content_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  theme_id UUID REFERENCES themes(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('intro', 'methods', 'theory', 'evidence', 'cases', 'sources')),
  title TEXT NOT NULL,
  content TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 第三步：創建引用來源表
-- ============================================
CREATE TABLE IF NOT EXISTS citations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  block_id UUID REFERENCES content_blocks(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  publication TEXT,
  year TEXT,
  page TEXT,
  line TEXT,
  url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 第四步：創建投稿表
-- ============================================
CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  submitter_name TEXT NOT NULL,
  submitter_email TEXT,
  status TEXT DEFAULT 'pending',
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- ============================================
-- 第五步：創建論壇話題表
-- ============================================
CREATE TABLE IF NOT EXISTS forum_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT '訪客',
  category TEXT DEFAULT 'general',
  is_pinned BOOLEAN DEFAULT FALSE,
  likes INTEGER DEFAULT 0,
  liked_by JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 第六步：創建論壇回覆表
-- ============================================
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT '訪客',
  likes INTEGER DEFAULT 0,
  liked_by JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 第七步：創建用戶收藏表
-- ============================================
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  theme_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, theme_id)
);

-- ============================================
-- 第八步：創建用戶閱讀歷史表
-- ============================================
CREATE TABLE IF NOT EXISTS user_reading_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  theme_id TEXT NOT NULL,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, theme_id)
);

-- ============================================
-- 第九步：創建索引
-- ============================================
CREATE INDEX IF NOT EXISTS idx_content_blocks_theme_id ON content_blocks(theme_id);
CREATE INDEX IF NOT EXISTS idx_citations_block_id ON citations(block_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_topic_id ON forum_replies(topic_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reading_history_user_id ON user_reading_history(user_id);

-- ============================================
-- 第十步：啟用 Row Level Security
-- ============================================
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reading_history ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 第十一步：創建 RLS 策略
-- ============================================

-- 主題：所有人可讀
DROP POLICY IF EXISTS "Themes are viewable by everyone" ON themes;
CREATE POLICY "Themes are viewable by everyone" ON themes FOR SELECT USING (true);

-- 內容區塊：所有人可讀
DROP POLICY IF EXISTS "Content blocks are viewable by everyone" ON content_blocks;
CREATE POLICY "Content blocks are viewable by everyone" ON content_blocks FOR SELECT USING (true);

-- 引用：所有人可讀
DROP POLICY IF EXISTS "Citations are viewable by everyone" ON citations;
CREATE POLICY "Citations are viewable by everyone" ON citations FOR SELECT USING (true);

-- 投稿：所有人可創建
DROP POLICY IF EXISTS "Submissions are creatable by everyone" ON submissions;
CREATE POLICY "Submissions are creatable by everyone" ON submissions FOR INSERT WITH CHECK (true);

-- 論壇話題：所有人可讀
DROP POLICY IF EXISTS "Forum topics are viewable by everyone" ON forum_topics;
CREATE POLICY "Forum topics are viewable by everyone" ON forum_topics FOR SELECT USING (true);

-- 論壇回覆：所有人可讀
DROP POLICY IF EXISTS "Forum replies are viewable by everyone" ON forum_replies;
CREATE POLICY "Forum replies are viewable by everyone" ON forum_replies FOR SELECT USING (true);

-- 收藏：僅本人可讀寫
DROP POLICY IF EXISTS "User favorites are viewable by owner" ON user_favorites;
CREATE POLICY "User favorites are viewable by owner" ON user_favorites FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "User favorites are editable by owner" ON user_favorites;
CREATE POLICY "User favorites are editable by owner" ON user_favorites FOR ALL USING (auth.uid() = user_id);

-- 閱讀歷史：僅本人可讀寫
DROP POLICY IF EXISTS "User reading history is viewable by owner" ON user_reading_history;
CREATE POLICY "User reading history is viewable by owner" ON user_reading_history FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "User reading history is editable by owner" ON user_reading_history;
CREATE POLICY "User reading history is editable by owner" ON user_reading_history FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 完成！
-- ============================================
