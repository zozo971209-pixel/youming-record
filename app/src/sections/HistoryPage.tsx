import { ArrowLeft, Clock, Eye, Orbit, Brain, Wind, Sparkles, Zap, Trash2 } from 'lucide-react';
import { themes, type Theme } from '@/data/themes';
import { useState, useEffect } from 'react';

interface HistoryPageProps {
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

interface HistoryItem {
  slug: string;
  visitedAt: string;
}

export function HistoryPage({ onNavigate, onSelectTheme }: HistoryPageProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('youming_history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('youming_history');
    setHistory([]);
  };

  // 獲取歷史主題（按訪問時間排序）
  const historyThemes = history
    .map(h => {
      const theme = themes.find(t => t.slug === h.slug);
      return theme ? { ...theme, visitedAt: h.visitedAt } : null;
    })
    .filter((t): t is Theme & { visitedAt: string } => t !== null)
    .sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime());

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
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-amber-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-slate-200">
                歷史紀錄
              </h1>
            </div>
            {historyThemes.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                清空紀錄
              </button>
            )}
          </div>
          
          <p className="text-slate-500">
            共 {historyThemes.length} 條瀏覽紀錄
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {historyThemes.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">暫無瀏覽紀錄</p>
            <button
              onClick={() => onNavigate('themes')}
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-lg font-medium hover:from-amber-400 hover:to-orange-400 transition-colors"
            >
              去探索主題
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {historyThemes.map((theme) => {
              const Icon = iconMap[theme.icon] || Eye;
              return (
                <div
                  key={theme.id}
                  onClick={() => onSelectTheme(theme.slug)}
                  className="group flex items-center bg-slate-900/50 rounded-xl p-4 border border-slate-800 hover:border-slate-600 cursor-pointer transition-all"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${theme.color} flex items-center justify-center mr-4 flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                      {theme.title}
                    </h3>
                    <p className="text-sm text-slate-500 truncate">
                      {theme.description}
                    </p>
                  </div>
                  
                  <div className="text-right ml-4 flex-shrink-0">
                    <div className="text-sm text-slate-500">
                      {new Date(theme.visitedAt).toLocaleDateString('zh-TW')}
                    </div>
                    <div className="text-xs text-slate-600">
                      {new Date(theme.visitedAt).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
