import { ArrowLeft, Heart, Eye, Orbit, Brain, Wind, Sparkles, Zap } from 'lucide-react';
import { themes } from '@/data/themes';

interface FavoritesPageProps {
  onNavigate: (page: string) => void;
  onSelectTheme: (slug: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye,
  Orbit,
  Brain,
  Wind,
  Sparkles,
  Zap,
};

export function FavoritesPage({ onNavigate, onSelectTheme }: FavoritesPageProps) {
  // 從 localStorage 讀取收藏
  const getFavorites = (): string[] => {
    const stored = localStorage.getItem('youming_favorites');
    return stored ? JSON.parse(stored) : [];
  };

  const favorites = getFavorites();
  const favoriteThemes = themes.filter(t => favorites.includes(t.slug));

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center text-slate-500 hover:text-slate-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首頁
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-slate-200">
              我的收藏
            </h1>
          </div>
          
          <p className="text-slate-500">
            共收藏 {favoriteThemes.length} 個主題
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favoriteThemes.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">還沒有收藏任何主題</p>
            <button
              onClick={() => onNavigate('themes')}
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-lg font-medium hover:from-amber-400 hover:to-orange-400 transition-colors"
            >
              去探索主題
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {favoriteThemes.map((theme) => {
              const Icon = iconMap[theme.icon] || Eye;
              return (
                <div
                  key={theme.id}
                  onClick={() => onSelectTheme(theme.slug)}
                  className="group bg-slate-900/50 rounded-xl p-6 border border-slate-800 hover:border-slate-600 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${theme.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-200 mb-1 group-hover:text-amber-400 transition-colors">
                    {theme.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-3">{theme.subtitle}</p>
                  <p className="text-slate-400 text-sm line-clamp-2">
                    {theme.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
