import { useState, useEffect, useCallback } from 'react';
import type { UserSettings, Favorite, Comment, ReadingHistory, ContentRating } from '@/types';

const STORAGE_KEY_SETTINGS = 'youming_settings';
const STORAGE_KEY_FAVORITES = 'youming_favorites';
const STORAGE_KEY_COMMENTS = 'youming_comments';
const STORAGE_KEY_USER_ID = 'youming_user_id';
const STORAGE_KEY_LIKED_COMMENTS = 'youming_liked_comments';
const STORAGE_KEY_READING_HISTORY = 'youming_reading_history';
const STORAGE_KEY_CONTENT_RATINGS = 'youming_content_ratings';

const defaultSettings: UserSettings = {
  theme: 'dark',
  fontSize: 'medium',
  language: 'zh-TW'
};

// 生成唯一用戶ID
function getOrCreateUserId(): string {
  let userId = localStorage.getItem(STORAGE_KEY_USER_ID);
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(STORAGE_KEY_USER_ID, userId);
  }
  return userId;
}

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likedComments, setLikedComments] = useState<string[]>([]);
  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>([]);
  const [contentRatings, setContentRatings] = useState<ContentRating[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  // 加載設置
  useEffect(() => {
    const storedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
    const storedFavorites = localStorage.getItem(STORAGE_KEY_FAVORITES);
    const storedComments = localStorage.getItem(STORAGE_KEY_COMMENTS);
    const storedLikedComments = localStorage.getItem(STORAGE_KEY_LIKED_COMMENTS);
    const currentUserId = getOrCreateUserId();
    setUserId(currentUserId);

    if (storedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) });
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }

    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error('Failed to parse favorites:', e);
      }
    }

    if (storedComments) {
      try {
        setComments(JSON.parse(storedComments));
      } catch (e) {
        console.error('Failed to parse comments:', e);
      }
    }

    if (storedLikedComments) {
      try {
        setLikedComments(JSON.parse(storedLikedComments));
      } catch (e) {
        console.error('Failed to parse liked comments:', e);
      }
    }

    const storedReadingHistory = localStorage.getItem(STORAGE_KEY_READING_HISTORY);
    if (storedReadingHistory) {
      try {
        setReadingHistory(JSON.parse(storedReadingHistory));
      } catch (e) {
        console.error('Failed to parse reading history:', e);
      }
    }

    const storedRatings = localStorage.getItem(STORAGE_KEY_CONTENT_RATINGS);
    if (storedRatings) {
      try {
        setContentRatings(JSON.parse(storedRatings));
      } catch (e) {
        console.error('Failed to parse content ratings:', e);
      }
    }

    setIsLoaded(true);
  }, []);

  // 保存設置
  const saveSettings = useCallback((newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
  }, [settings]);

  // 字體大小
  const setFontSize = useCallback((size: UserSettings['fontSize']) => {
    saveSettings({ fontSize: size });
  }, [saveSettings]);

  // 語言設置
  const setLanguage = useCallback((lang: UserSettings['language']) => {
    saveSettings({ language: lang });
  }, [saveSettings]);

  // 收藏功能
  const addFavorite = useCallback((contentId: string) => {
    const newFavorite: Favorite = {
      contentId,
      createdAt: new Date().toISOString()
    };
    const updated = [...favorites, newFavorite];
    setFavorites(updated);
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(updated));
  }, [favorites]);

  const removeFavorite = useCallback((contentId: string) => {
    const updated = favorites.filter(f => f.contentId !== contentId);
    setFavorites(updated);
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(updated));
  }, [favorites]);

  const isFavorite = useCallback((contentId: string) => {
    return favorites.some(f => f.contentId === contentId);
  }, [favorites]);

  const toggleFavorite = useCallback((contentId: string) => {
    if (isFavorite(contentId)) {
      removeFavorite(contentId);
    } else {
      addFavorite(contentId);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  const getFavorites = useCallback(() => {
    return favorites;
  }, [favorites]);

  // 評論功能
  const addComment = useCallback((contentId: string, author: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      contentId,
      author,
      content,
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString()
    };
    const updated = [...comments, newComment];
    setComments(updated);
    localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(updated));
    return newComment;
  }, [comments]);

  const getCommentsByContentId = useCallback((contentId: string) => {
    return comments.filter(c => c.contentId === contentId);
  }, [comments]);

  const getAllComments = useCallback(() => {
    return comments;
  }, [comments]);

  // 點讚功能 - 防止重複點讚
  const likeComment = useCallback((commentId: string) => {
    // 檢查是否已經點過讚
    if (likedComments.includes(commentId)) {
      return { success: false, message: '您已經點過讚了' };
    }

    const updatedComments = comments.map(c => 
      c.id === commentId ? { ...c, likes: c.likes + 1 } : c
    );
    setComments(updatedComments);
    localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(updatedComments));

    // 記錄用戶已點讚
    const updatedLiked = [...likedComments, commentId];
    setLikedComments(updatedLiked);
    localStorage.setItem(STORAGE_KEY_LIKED_COMMENTS, JSON.stringify(updatedLiked));

    return { success: true, message: '點讚成功' };
  }, [comments, likedComments]);

  // 檢查用戶是否已點讚
  const hasLikedComment = useCallback((commentId: string) => {
    return likedComments.includes(commentId);
  }, [likedComments]);

  // 刪除評論
  const deleteComment = useCallback((commentId: string) => {
    const updated = comments.filter(c => c.id !== commentId);
    setComments(updated);
    localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(updated));
    
    // 同時從已點讚列表中移除
    const updatedLiked = likedComments.filter(id => id !== commentId);
    setLikedComments(updatedLiked);
    localStorage.setItem(STORAGE_KEY_LIKED_COMMENTS, JSON.stringify(updatedLiked));
  }, [comments, likedComments]);

  // 管理員刪除評論（不需要檢查是否點過讚）
  const adminDeleteComment = useCallback((commentId: string) => {
    const updated = comments.filter(c => c.id !== commentId);
    setComments(updated);
    localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(updated));
  }, [comments]);

  // 閱讀歷史功能
  const addToReadingHistory = useCallback((contentId: string) => {
    const existingIndex = readingHistory.findIndex(h => h.contentId === contentId);
    let updated: ReadingHistory[];
    
    if (existingIndex >= 0) {
      // 更新現有記錄
      updated = [...readingHistory];
      updated[existingIndex] = {
        ...updated[existingIndex],
        viewedAt: new Date().toISOString(),
        viewCount: updated[existingIndex].viewCount + 1
      };
    } else {
      // 添加新記錄
      updated = [...readingHistory, {
        contentId,
        viewedAt: new Date().toISOString(),
        viewCount: 1
      }];
    }
    
    // 只保留最近50條記錄
    if (updated.length > 50) {
      updated = updated.sort((a, b) => 
        new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
      ).slice(0, 50);
    }
    
    setReadingHistory(updated);
    localStorage.setItem(STORAGE_KEY_READING_HISTORY, JSON.stringify(updated));
  }, [readingHistory]);

  const getReadingHistory = useCallback(() => {
    return readingHistory.sort((a, b) => 
      new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
    );
  }, [readingHistory]);

  const clearReadingHistory = useCallback(() => {
    setReadingHistory([]);
    localStorage.removeItem(STORAGE_KEY_READING_HISTORY);
  }, []);

  // 內容評分功能
  const rateContent = useCallback((contentId: string, qualityScore: number, sourceReliability: number) => {
    // 檢查是否已經評分過
    const existingIndex = contentRatings.findIndex(
      r => r.contentId === contentId && r.userId === userId
    );
    
    const newRating: ContentRating = {
      contentId,
      userId,
      qualityScore,
      sourceReliability,
      createdAt: new Date().toISOString()
    };
    
    let updated: ContentRating[];
    if (existingIndex >= 0) {
      updated = [...contentRatings];
      updated[existingIndex] = newRating;
    } else {
      updated = [...contentRatings, newRating];
    }
    
    setContentRatings(updated);
    localStorage.setItem(STORAGE_KEY_CONTENT_RATINGS, JSON.stringify(updated));
    return { success: true, message: '評分成功' };
  }, [contentRatings, userId]);

  const hasRatedContent = useCallback((contentId: string) => {
    return contentRatings.some(r => r.contentId === contentId && r.userId === userId);
  }, [contentRatings, userId]);

  const getContentRating = useCallback((contentId: string) => {
    return contentRatings.find(r => r.contentId === contentId && r.userId === userId);
  }, [contentRatings, userId]);

  const getAverageRatings = useCallback((contentId: string) => {
    const ratings = contentRatings.filter(r => r.contentId === contentId);
    if (ratings.length === 0) return null;
    
    const avgQuality = ratings.reduce((sum, r) => sum + r.qualityScore, 0) / ratings.length;
    const avgReliability = ratings.reduce((sum, r) => sum + r.sourceReliability, 0) / ratings.length;
    
    return {
      qualityScore: Math.round(avgQuality * 10) / 10,
      sourceReliability: Math.round(avgReliability * 10) / 10,
      count: ratings.length
    };
  }, [contentRatings]);

  return {
    settings,
    isLoaded,
    userId,
    setFontSize,
    setLanguage,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    getFavorites,
    addComment,
    getCommentsByContentId,
    getAllComments,
    likeComment,
    hasLikedComment,
    deleteComment,
    adminDeleteComment,
    addToReadingHistory,
    getReadingHistory,
    clearReadingHistory,
    rateContent,
    hasRatedContent,
    getContentRating,
    getAverageRatings
  };
}
