import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ArrowLeft, BookOpen, ExternalLink, Link2, CircleDot, Brain, Sparkles, Heart, MessageSquare, Activity, Microscope, History, Globe, Atom, MessageCircle, FileVideo, Trash2 } from 'lucide-react';
import type { ContentItem, Comment } from '@/types';

interface ExplorePageProps {
  items: ContentItem[];
  initialCategory?: string;
  onNavigate: (page: string) => void;
  onViewDetail: (id: string) => void;
  isFavorite: (contentId: string) => boolean;
  onToggleFavorite: (contentId: string) => void;
}

const categoryConfig: Record<string, { title: string; description: string; color: string; bgColor: string; borderColor: string; icon: any }> = {
  method: {
    title: '方法',
    description: '可操作的意識技術',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    icon: CircleDot
  },
  theory: {
    title: '理論',
    description: '解釋機制的框架',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    icon: Brain
  },
  evidence: {
    title: '實證',
    description: '真實發生的記錄',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    icon: Sparkles
  },
  practice: {
    title: '實修',
    description: '實際修煉經驗與指導',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    icon: Activity
  },
  research: {
    title: '研究',
    description: '科學研究與實驗',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
    icon: Microscope
  },
  history: {
    title: '歷史',
    description: '歷史記錄與文獻',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/20',
    icon: History
  },
  culture: {
    title: '文化',
    description: '不同文化的傳統智慧',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/20',
    icon: Globe
  },
  science: {
    title: '科學',
    description: '科學理論與發現',
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/20',
    icon: Atom
  },
  experience: {
    title: '體驗',
    description: '個人體驗與見證',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
    icon: MessageCircle
  },
  documentary: {
    title: '紀錄',
    description: '紀錄片與影像資料',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    icon: FileVideo
  }
};

export function ExplorePage({ items, initialCategory = 'all', onNavigate, onViewDetail, isFavorite, onToggleFavorite }: ExplorePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(initialCategory);

  useEffect(() => {
    setActiveTab(initialCategory);
  }, [initialCategory]);

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && item.category === activeTab;
  });

  // 按主題分組的項目
  const dreamItems = filteredItems.filter(i => 
    i.title.includes('清醒夢') || i.title.includes('做夢') || i.title.includes('Orch')
  );
  const energyItems = filteredItems.filter(i => 
    i.title.includes('拙火') || i.title.includes('薩滿') || i.title.includes('靜坐') || i.title.includes('源場')
  );
  const consciousnessItems = filteredItems.filter(i => 
    i.title.includes('抑制器') || i.title.includes('全息') || i.title.includes('星門')
  );

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center text-slate-500 hover:text-slate-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首頁
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-200 mb-4">
            探索
          </h1>
          <p className="text-slate-500 max-w-2xl">
            方法、理論、實證相互交織，點擊任一主題，查看它與其他內容的關聯
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-600" />
            <Input
              type="text"
              placeholder="搜索主題、標籤..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:border-amber-500/50"
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="bg-slate-900 border border-slate-800 flex-wrap h-auto gap-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-200 text-slate-500">
                全部
              </TabsTrigger>
              <TabsTrigger value="method" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 text-slate-500">
                方法
              </TabsTrigger>
              <TabsTrigger value="theory" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 text-slate-500">
                理論
              </TabsTrigger>
              <TabsTrigger value="evidence" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 text-slate-500">
                實證
              </TabsTrigger>
              <TabsTrigger value="practice" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 text-slate-500">
                實修
              </TabsTrigger>
              <TabsTrigger value="research" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-slate-500">
                研究
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-rose-500/20 data-[state=active]:text-rose-400 text-slate-500">
                歷史
              </TabsTrigger>
              <TabsTrigger value="culture" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400 text-slate-500">
                文化
              </TabsTrigger>
              <TabsTrigger value="science" className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400 text-slate-500">
                科學
              </TabsTrigger>
              <TabsTrigger value="experience" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400 text-slate-500">
                體驗
              </TabsTrigger>
              <TabsTrigger value="documentary" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 text-slate-500">
                紀錄
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-slate-500 text-sm">
          找到 {filteredItems.length} 個結果
        </div>

        {/* Topic Groups */}
        {(activeTab === 'all' || activeTab === 'method') && dreamItems.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-300 mb-6 flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-400 mr-3" />
              意識與夢境
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dreamItems.map((item) => (
                <ContentCard 
                  key={item.id} 
                  item={item} 
                  onClick={() => onViewDetail(item.id)}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={() => onToggleFavorite(item.id)}
                />
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'method') && energyItems.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-300 mb-6 flex items-center">
              <span className="w-2 h-2 rounded-full bg-amber-400 mr-3" />
              身體與能量
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {energyItems.map((item) => (
                <ContentCard 
                  key={item.id} 
                  item={item} 
                  onClick={() => onViewDetail(item.id)}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={() => onToggleFavorite(item.id)}
                />
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'theory' || activeTab === 'evidence') && consciousnessItems.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-300 mb-6 flex items-center">
              <span className="w-2 h-2 rounded-full bg-purple-400 mr-3" />
              意識的擴展
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {consciousnessItems.map((item) => (
                <ContentCard 
                  key={item.id} 
                  item={item} 
                  onClick={() => onViewDetail(item.id)}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={() => onToggleFavorite(item.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Items */}
        {filteredItems.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-300 mb-6 flex items-center">
              <span className="w-2 h-2 rounded-full bg-slate-400 mr-3" />
              其他內容
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems
                .filter(item => !dreamItems.includes(item) && !energyItems.includes(item) && !consciousnessItems.includes(item))
                .map((item) => (
                  <ContentCard 
                    key={item.id} 
                    item={item} 
                    onClick={() => onViewDetail(item.id)}
                    isFavorite={isFavorite(item.id)}
                    onToggleFavorite={() => onToggleFavorite(item.id)}
                  />
                ))}
            </div>
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-600 mb-4">沒有找到相關內容</p>
            <Button
              variant="outline"
              onClick={() => {setSearchQuery(''); setActiveTab('all');}}
              className="border-slate-700 text-slate-500 hover:bg-slate-900 hover:text-slate-300"
            >
              清除搜索
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface ContentCardProps {
  item: ContentItem;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function ContentCard({ item, onClick, isFavorite, onToggleFavorite }: ContentCardProps) {
  const config = categoryConfig[item.category];
  const Icon = config.icon;

  return (
    <div
      onClick={onClick}
      className="group bg-slate-900/50 rounded-xl p-5 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all duration-300 hover:bg-slate-900"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${config.bgColor} ${config.color} border-0 text-xs`}>
            {config.title}
          </Badge>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-400 fill-red-400' : 'text-slate-600'}`} />
          </button>
        </div>
      </div>
      
      <h3 
        className="text-lg font-semibold text-slate-200 mb-1 group-hover:text-amber-400 transition-colors"
      >
        {item.title}
      </h3>
      
      <p className="text-slate-500 text-sm mb-3 line-clamp-2">
        {item.subtitle}
      </p>

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="text-xs text-slate-600 bg-slate-800/50 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="text-xs text-slate-600">+{item.tags.length - 3}</span>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center">
          <BookOpen className="w-3 h-3 mr-1" />
          {item.sources.length} 個來源
        </div>
        {(item.relatedMethods?.length || item.relatedTheories?.length || item.relatedEvidence?.length) ? (
          <div className="flex items-center text-amber-500/70">
            <Link2 className="w-3 h-3 mr-1" />
            有關聯
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface ContentDetailProps {
  item: ContentItem | undefined;
  relatedItems: ContentItem[];
  comments: Comment[];
  isFavorite: boolean;
  onNavigate: (page: string) => void;
  onViewDetail: (id: string) => void;
  onBack: () => void;
  onToggleFavorite: () => void;
  onAddComment: (contentId: string, author: string, content: string) => void;
  onLikeComment: (commentId: string) => { success: boolean; message: string };
  onDeleteComment: (commentId: string) => void;
  hasLikedComment: (commentId: string) => boolean;
  isAdmin?: boolean;
  onRateContent?: (contentId: string, qualityScore: number, sourceReliability: number) => { success: boolean; message: string };
  hasRatedContent?: (contentId: string) => boolean;
  getAverageRatings?: (contentId: string) => { qualityScore: number; sourceReliability: number; count: number } | null;
}

export function ContentDetail({ 
  item, 
  relatedItems, 
  comments,
  isFavorite,
  onNavigate, 
  onViewDetail, 
  onBack,
  onToggleFavorite,
  onAddComment,
  onLikeComment,
  onDeleteComment,
  hasLikedComment,
  isAdmin = false,
  onRateContent,
  hasRatedContent,
  getAverageRatings
}: ContentDetailProps) {
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [qualityRating, setQualityRating] = useState(0);
  const [reliabilityRating, setReliabilityRating] = useState(0);
  const [showRatingForm, setShowRatingForm] = useState(false);

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">內容不存在或已被刪除</p>
          <Button onClick={() => onNavigate('explore')} className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950">
            返回探索
          </Button>
        </div>
      </div>
    );
  }

  const config = categoryConfig[item.category];

  // 將內容按段落分割並渲染
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // 標題行（【】包裹）
      if (trimmedLine.startsWith('【') && trimmedLine.endsWith('】')) {
        return (
          <h3 key={index} className="text-xl font-bold text-amber-400 mt-10 mb-4">
            {trimmedLine.slice(1, -1)}
          </h3>
        );
      }
      
      // 小標題（以數字或特定詞開頭）
      if (/^\d+\./.test(trimmedLine) && trimmedLine.length < 50) {
        return (
          <h4 key={index} className="text-lg font-semibold text-slate-300 mt-6 mb-3">
            {trimmedLine}
          </h4>
        );
      }
      
      // 列表項
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
        return (
          <li key={index} className="text-slate-400 ml-6 mb-2 leading-relaxed">
            {trimmedLine.slice(1).trim()}
          </li>
        );
      }
      
      // 空行
      if (!trimmedLine) {
        return <div key={index} className="h-4" />;
      }
      
      // 普通段落
      return (
        <p key={index} className="text-slate-400 mb-4 leading-relaxed">
          {trimmedLine}
        </p>
      );
    });
  };

  const handleSubmitComment = () => {
    if (commentAuthor.trim() && commentContent.trim()) {
      onAddComment(item.id, commentAuthor, commentContent);
      setCommentContent('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-slate-500 hover:text-slate-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
              <config.icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <Badge className={`${config.bgColor} ${config.color} border-0`}>
              {config.title}
            </Badge>
            <button
              onClick={onToggleFavorite}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-400 fill-red-400' : 'text-slate-600'}`} />
            </button>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-200 mb-3">
            {item.title}
          </h1>
          
          <p className="text-xl text-slate-500">
            {item.subtitle}
          </p>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {item.tags.map((tag, index) => (
                <span key={index} className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-invert max-w-none">
          {renderContent(item.content)}
        </div>

        {/* Related Content */}
        {relatedItems.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-800/50">
            <h3 className="text-lg font-bold text-slate-300 mb-6 flex items-center">
              <Link2 className="w-5 h-5 mr-2 text-amber-400" />
              相關內容
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedItems.map((related) => {
                const relatedConfig = categoryConfig[related.category];
                return (
                  <div
                    key={related.id}
                    onClick={() => onViewDetail(related.id)}
                    className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <relatedConfig.icon className={`w-4 h-4 ${relatedConfig.color}`} />
                      <span className={`text-xs ${relatedConfig.color}`}>{relatedConfig.title}</span>
                    </div>
                    <h4 className="font-semibold text-slate-300 hover:text-amber-400 transition-colors">
                      {related.title}
                    </h4>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-16 pt-8 border-t border-slate-800/50">
          <h3 className="text-lg font-bold text-slate-300 mb-6 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-amber-400" />
            評論 ({comments.length})
          </h3>

          {/* Comment Form */}
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-500 mb-2">暱稱</label>
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder="輸入您的暱稱..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 focus:border-amber-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-2">評論內容</label>
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="分享您的想法..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 focus:border-amber-500/50 focus:outline-none resize-none"
                />
              </div>
              <Button
                onClick={handleSubmitComment}
                disabled={!commentAuthor.trim() || !commentContent.trim()}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 disabled:opacity-50"
              >
                發表評論
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-slate-500 text-center py-4">暫無評論，成為第一個評論的人吧！</p>
            ) : (
              comments.map((comment) => {
                const isLiked = hasLikedComment(comment.id);
                return (
                  <div key={comment.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 font-medium">{comment.author}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600 text-sm">
                          {new Date(comment.createdAt).toLocaleDateString('zh-TW')}
                        </span>
                        {(isAdmin || comment.author === commentAuthor) && (
                          <button
                            onClick={() => onDeleteComment(comment.id)}
                            className="text-slate-600 hover:text-red-400 text-sm transition-colors"
                            title="刪除評論"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-400 mb-3">{comment.content}</p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          const result = onLikeComment(comment.id);
                          if (!result.success) {
                            alert(result.message);
                          }
                        }}
                        disabled={isLiked}
                        className={`flex items-center text-sm transition-colors ${
                          isLiked 
                            ? 'text-amber-400 cursor-default' 
                            : 'text-slate-500 hover:text-amber-400'
                        }`}
                      >
                        <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-amber-400' : ''}`} />
                        {comment.likes}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Rating Section */}
        {onRateContent && hasRatedContent && getAverageRatings && (
          <div className="mt-16 pt-8 border-t border-slate-800/50">
            <h3 className="text-lg font-bold text-slate-300 mb-6 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-amber-400" />
              內容評分
            </h3>
            
            {/* Average Ratings Display */}
            {(() => {
              const avgRatings = getAverageRatings(item.id);
              return avgRatings ? (
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">內容質量</p>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-amber-400">{avgRatings.qualityScore}</span>
                        <span className="text-slate-600 ml-1">/5</span>
                      </div>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Sparkles 
                            key={star} 
                            className={`w-4 h-4 ${star <= Math.round(avgRatings.qualityScore) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">來源可靠性</p>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-emerald-400">{avgRatings.sourceReliability}</span>
                        <span className="text-slate-600 ml-1">/5</span>
                      </div>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <BookOpen 
                            key={star} 
                            className={`w-4 h-4 ${star <= Math.round(avgRatings.sourceReliability) ? 'text-emerald-400 fill-emerald-400' : 'text-slate-700'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-3">基於 {avgRatings.count} 位用戶的評分</p>
                </div>
              ) : (
                <p className="text-slate-500 text-sm mb-4">暫無評分，成為第一個評分的人吧！</p>
              );
            })()}
            
            {/* Rating Form */}
            {!hasRatedContent(item.id) ? (
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                {!showRatingForm ? (
                  <Button
                    onClick={() => setShowRatingForm(true)}
                    variant="outline"
                    className="border-slate-700 text-slate-400 hover:bg-slate-800"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    我要評分
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-500 mb-2">內容質量</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setQualityRating(star)}
                            className="p-1 transition-colors"
                          >
                            <Sparkles 
                              className={`w-6 h-6 ${star <= qualityRating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 mb-2">來源可靠性</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setReliabilityRating(star)}
                            className="p-1 transition-colors"
                          >
                            <BookOpen 
                              className={`w-6 h-6 ${star <= reliabilityRating ? 'text-emerald-400 fill-emerald-400' : 'text-slate-700'}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          if (qualityRating > 0 && reliabilityRating > 0) {
                            onRateContent(item.id, qualityRating, reliabilityRating);
                            setShowRatingForm(false);
                            setQualityRating(0);
                            setReliabilityRating(0);
                          }
                        }}
                        disabled={qualityRating === 0 || reliabilityRating === 0}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 disabled:opacity-50"
                      >
                        提交評分
                      </Button>
                      <Button
                        onClick={() => {
                          setShowRatingForm(false);
                          setQualityRating(0);
                          setReliabilityRating(0);
                        }}
                        variant="outline"
                        className="border-slate-700 text-slate-400"
                      >
                        取消
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">您已經評分過了</p>
            )}
          </div>
        )}

        {/* Sources */}
        <div className="mt-16 pt-8 border-t border-slate-800/50">
          <h3 className="text-lg font-bold text-slate-300 mb-6 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-amber-400" />
            資料來源
          </h3>
          <div className="space-y-4">
            {item.sources.map((source, index) => (
              <div key={index} className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-500 flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-slate-300 font-medium">{source.title}</p>
                      {/* 來源類型標籤 */}
                      {source.type && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          source.type === 'journal' ? 'bg-blue-500/20 text-blue-400' :
                          source.type === 'book' ? 'bg-emerald-500/20 text-emerald-400' :
                          source.type === 'experience' ? 'bg-pink-500/20 text-pink-400' :
                          source.type === 'documentary' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-slate-700 text-slate-400'
                        }`}>
                          {source.type === 'journal' ? '期刊' :
                           source.type === 'book' ? '書籍' :
                           source.type === 'experience' ? '體驗' :
                           source.type === 'documentary' ? '紀錄' :
                           source.type === 'website' ? '網站' : '其他'}
                        </span>
                      )}
                      {/* URL驗證狀態 */}
                      {source.url && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          source.verified 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-slate-700 text-slate-500'
                        }`}>
                          {source.verified ? '✓ 已驗證' : '未驗證'}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-500 mt-1 space-y-0.5">
                      {source.author && <p>作者：{source.author}</p>}
                      {source.publication && <p>出版：{source.publication}</p>}
                      {source.year && <p>年份：{source.year}</p>}
                      {source.page && <p>頁碼：{source.page}</p>}
                      {source.notes && <p className="text-slate-600 italic">{source.notes}</p>}
                    </div>
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-amber-500 hover:text-amber-400 mt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        查看來源
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-center">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-slate-700 text-slate-500 hover:bg-slate-900 hover:text-slate-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </Button>
        </div>
      </div>
    </div>
  );
}
