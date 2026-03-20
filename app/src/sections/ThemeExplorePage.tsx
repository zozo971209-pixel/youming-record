import { useState } from 'react';
import { ArrowRight, Eye, Orbit, Brain, Wind, Sparkles, Zap } from 'lucide-react';
import type { Theme } from '@/data/themes';

interface ThemeExplorePageProps {
  onNavigate: (page: string) => void;
  onSelectTheme: (themeSlug: string) => void;
  themes: Theme[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye,
  Orbit,
  Brain,
  Wind,
  Sparkles,
  Zap,
};

export function ThemeExplorePage({ onNavigate, onSelectTheme, themes }: ThemeExplorePageProps) {
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center text-slate-500 hover:text-slate-300 mb-6 transition-colors"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            返回首頁
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-200 mb-4">
            探索主題
          </h1>
          <p className="text-slate-500 max-w-xl">
            選擇一個主題深入了解。每個主題都包含簡介、方法、理論、實證與完整來源。
          </p>
        </div>
      </div>

      {/* Theme Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {themes.map((theme) => {
            const Icon = iconMap[theme.icon] || Eye;
            const isHovered = hoveredTheme === theme.id;
            
            return (
              <div
                key={theme.id}
                onClick={() => onSelectTheme(theme.slug)}
                onMouseEnter={() => setHoveredTheme(theme.id)}
                onMouseLeave={() => setHoveredTheme(null)}
                className="group relative bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-600 cursor-pointer transition-all duration-300 overflow-hidden"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="relative p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${theme.color} flex items-center justify-center`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex items-center text-sm text-slate-500 group-hover:text-amber-400 transition-colors">
                      <span>深入了解</span>
                      <ArrowRight className={`w-4 h-4 ml-1 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-slate-200 mb-2 group-hover:text-amber-400 transition-colors">
                    {theme.title}
                  </h2>
                  <p className="text-sm text-slate-500 mb-4">{theme.subtitle}</p>
                  
                  {/* Description */}
                  <p className="text-slate-400 mb-6 line-clamp-2">
                    {theme.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4 pt-6 border-t border-slate-800">
                    {theme.stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-lg font-bold text-slate-200">
                          {stat.value}
                          <span className="text-xs text-slate-500 ml-0.5">{stat.unit}</span>
                        </div>
                        <div className="text-xs text-slate-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Coming Soon */}
        <div className="mt-12 text-center">
          <p className="text-slate-600">
            更多主題正在整理中...
          </p>
        </div>
      </div>
    </div>
  );
}
