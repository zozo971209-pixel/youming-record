import { useState } from 'react';
import { Navbar, LoginModal } from './sections/Navbar';
import { HomePage } from './sections/HomePage';
import { ThemeExplorePage } from './sections/ThemeExplorePage';
import { ThemeDetailPage } from './sections/ThemeDetailPage';
import { FeedbackPage } from './sections/FeedbackPage';
import { AdminPage } from './sections/AdminPage';
import { SubmissionPage } from './sections/SubmissionPage';
import { ForumPage } from './sections/ForumPage';
import { FavoritesPage } from './sections/FavoritesPage';
import { HistoryPage } from './sections/HistoryPage';
import { useDataStore } from './hooks/useDataStore';
import { useAuth } from './hooks/useAuth';
import { themes, getThemeBySlug } from '@/data/themes';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

type PageType = 'home' | 'themes' | 'theme-detail' | 'feedback' | 'admin' | 'favorites' | 'history' | 'submission' | 'forum';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedThemeSlug, setSelectedThemeSlug] = useState<string | null>(null);
  
  const { 
    isLoaded: isDataLoaded,
    feedback,
    submissions,
    forumTopics,
    addFeedback,
    replyFeedback,
    deleteFeedback,
    addSubmission,
    approveSubmission,
    rejectSubmission,
    addForumTopic,
    addForumReply,
    likeForumTopic,
    likeForumReply,
  } = useDataStore();
  
  const {
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
  } = useAuth();

  const [isSettingsLoaded] = useState(true);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageType);
    setSelectedThemeSlug(null);
  };

  const handleSelectTheme = (slug: string) => {
    setSelectedThemeSlug(slug);
    setCurrentPage('theme-detail');
    
    // 記錄瀏覽歷史
    const stored = localStorage.getItem('youming_history');
    const history = stored ? JSON.parse(stored) : [];
    const newHistory = [{ slug, visitedAt: new Date().toISOString() }, ...history.filter((h: {slug: string}) => h.slug !== slug)].slice(0, 50);
    localStorage.setItem('youming_history', JSON.stringify(newHistory));
  };

  const handleAdminClick = () => {
    if (isAdmin) {
      setCurrentPage('admin');
    }
  };

  // 等待所有數據加載
  if (!isDataLoaded || !isSettingsLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">加載中...</p>
        </div>
      </div>
    );
  }

  // 獲取當前選中的主題
  const selectedTheme = selectedThemeSlug ? getThemeBySlug(selectedThemeSlug) : null;

  // 渲染當前頁面
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onNavigate={handleNavigate} 
          />
        );
      
      case 'themes':
        return (
          <ThemeExplorePage 
            themes={themes}
            onNavigate={handleNavigate}
            onSelectTheme={handleSelectTheme}
          />
        );
      
      case 'theme-detail':
        if (!selectedTheme) {
          return (
            <ThemeExplorePage 
              themes={themes}
              onNavigate={handleNavigate}
              onSelectTheme={handleSelectTheme}
            />
          );
        }
        return (
          <ThemeDetailPage 
            theme={selectedTheme}
            onNavigate={handleNavigate}
            onBack={() => setCurrentPage('themes')}
          />
        );
      
      case 'feedback':
        return (
          <FeedbackPage 
            onNavigate={handleNavigate}
            onSubmit={addFeedback}
          />
        );
      
      case 'admin':
        return isAdmin ? (
          <AdminPage 
            onNavigate={handleNavigate}
            feedback={feedback}
            submissions={submissions}
            onReplyFeedback={replyFeedback}
            onDeleteFeedback={deleteFeedback}
            onApproveSubmission={approveSubmission}
            onRejectSubmission={rejectSubmission}
          />
        ) : (
          <HomePage 
            onNavigate={handleNavigate} 
          />
        );

      case 'favorites':
        return (
          <FavoritesPage 
            onNavigate={handleNavigate}
            onSelectTheme={handleSelectTheme}
          />
        );
      
      case 'history':
        return (
          <HistoryPage 
            onNavigate={handleNavigate}
            onSelectTheme={handleSelectTheme}
          />
        );

      case 'submission':
        return (
          <SubmissionPage
            onNavigate={handleNavigate}
            onSubmit={addSubmission}
          />
        );

      case 'forum':
        return (
          <ForumPage
            onNavigate={handleNavigate}
            topics={forumTopics}
            currentUser="訪客"
            onAddTopic={addForumTopic}
            onAddReply={addForumReply}
            onLikeTopic={likeForumTopic}
            onLikeReply={likeForumReply}
          />
        );
      
      default:
        return (
          <HomePage 
            onNavigate={handleNavigate} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar 
        isAdmin={isAdmin}
        onLoginClick={openLoginModal}
        onLogout={handleLogout}
        onAdminClick={handleAdminClick}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      
      <main>
        {renderPage()}
      </main>
      
      <LoginModal 
        isOpen={showLoginModal}
        onClose={closeLoginModal}
        password={password}
        onPasswordChange={setPassword}
        onLogin={handleLogin}
        error={error}
        isLoading={isLoading}
      />
      
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#e2e8f0',
            border: '1px solid #1e293b'
          }
        }}
      />
    </div>
  );
}

export default App;
