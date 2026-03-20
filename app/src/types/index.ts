// 內容分類
export type ContentCategory = 
  | 'method' 
  | 'theory' 
  | 'evidence' 
  | 'practice'
  | 'research'
  | 'history'
  | 'culture'
  | 'science'
  | 'experience'
  | 'documentary';

// 內容狀態
export type ContentStatus = 'published' | 'draft';

// 來源類型
export type SourceType = 'journal' | 'book' | 'experience' | 'documentary' | 'website';

// 資料來源
export interface Source {
  title: string;
  author?: string;
  publication?: string;
  year?: string;
  url?: string;
  page?: string;
  notes?: string;
  type?: SourceType; // 來源類型（可選，用於新數據）
  verified?: boolean; // URL是否驗證可用
  verifiedAt?: string; // 最後驗證時間
}

// 標籤
export interface Tag {
  id: string;
  name: string;
  count: number;
}

// 內容評分
export interface ContentRating {
  contentId: string;
  userId: string;
  qualityScore: number; // 內容質量評分 1-5
  sourceReliability: number; // 來源可靠性評分 1-5
  createdAt: string;
}

// 內容條目
export interface ContentItem {
  id: string;
  title: string;
  subtitle: string;
  category: ContentCategory;
  content: string;
  sources: Source[];
  tags?: string[]; // 標籤列表（可選）
  relatedMethods?: string[];
  relatedTheories?: string[];
  relatedEvidence?: string[];
  imageUrl?: string;
  status: ContentStatus;
  viewCount?: number;
  createdAt: string;
  updatedAt: string;
  controversial?: boolean; // 是否為爭議性內容
  controversyNote?: string; // 爭議說明
  averageQualityScore?: number; // 平均質量評分
  averageSourceReliability?: number; // 平均來源可靠性評分
  ratingCount?: number; // 評分數量
}

// 用戶反饋
export interface Feedback {
  id: string;
  name: string;
  email: string;
  type: 'question' | 'suggestion' | 'report';
  content: string;
  reply?: string;
  status: 'pending' | 'replied';
  createdAt: string;
}

// 用戶評論
export interface Comment {
  id: string;
  contentId: string;
  author: string;
  content: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
  isResearchShare?: boolean; // 是否為研究分享
  isSourceChallenge?: boolean; // 是否質疑來源
}

// 用戶收藏
export interface Favorite {
  contentId: string;
  createdAt: string;
}

// 收藏夾
export interface Collection {
  id: string;
  name: string;
  description?: string;
  contentIds: string[];
  createdAt: string;
  updatedAt: string;
}

// 閱讀歷史
export interface ReadingHistory {
  contentId: string;
  viewedAt: string;
  viewCount: number;
}

// 用戶設置
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  language: 'zh-TW' | 'en' | 'ja';
}

// 瀏覽統計
export interface ViewStats {
  contentId: string;
  views: number;
  lastViewed: string;
}

// 管理員
export interface Admin {
  username: string;
  password: string;
  isLoggedIn: boolean;
}

// 網站配置
export interface SiteConfig {
  title: string;
  subtitle: string;
  description: string;
}

// 搜索過濾器
export interface SearchFilters {
  category?: ContentCategory | 'all';
  tags?: string[];
  sourceType?: SourceType;
  hasVerifiedSources?: boolean;
  minQualityScore?: number;
  dateRange?: {
    start?: string;
    end?: string;
  };
  hasSources?: boolean;
}

// 用戶投稿
export interface UserSubmission {
  id: string;
  title: string;
  subtitle: string;
  category: ContentCategory;
  content: string;
  sources: Source[];
  tags: string[];
  submitterName: string;
  submitterEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  createdAt: string;
  reviewedAt?: string;
}
