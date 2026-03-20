import { useState, useEffect, useCallback } from 'react';
import { adminLogin, isSupabaseEnabled } from '@/lib/supabase';

const ADMIN_PASSWORD = '@Zozo88888888';
const STORAGE_KEY = 'youming_admin';

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 檢查是否已登入
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const openLoginModal = useCallback(() => {
    setShowLoginModal(true);
    setPassword('');
    setError('');
  }, []);

  const closeLoginModal = useCallback(() => {
    setShowLoginModal(false);
    setPassword('');
    setError('');
  }, []);

  const handleLogin = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // 使用 Supabase 或本地驗證
      const isValid = await adminLogin(password);
      
      if (isValid) {
        setIsAdmin(true);
        localStorage.setItem(STORAGE_KEY, 'true');
        setShowLoginModal(false);
        setPassword('');
        setError('');
      } else {
        setError('密碼錯誤，請重新輸入');
      }
    } catch (err) {
      console.error('登入失敗:', err);
      setError('登入過程中發生錯誤，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  }, [password]);

  const handleLogout = useCallback(() => {
    setIsAdmin(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    isAdmin,
    showLoginModal,
    password,
    error,
    isLoading,
    setPassword,
    openLoginModal,
    closeLoginModal,
    handleLogin,
    handleLogout
  };
}
