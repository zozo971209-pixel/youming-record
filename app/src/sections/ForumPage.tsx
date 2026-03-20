import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MessageSquare, Plus, ThumbsUp, User, Clock, Filter } from 'lucide-react';

interface ForumTopic {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  replies: ForumReply[];
  likes: number;
  likedBy: string[];
  createdAt: string;
  isPinned?: boolean;
}

interface ForumReply {
  id: string;
  content: string;
  author: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
}

interface ForumPageProps {
  onNavigate: (page: string) => void;
  topics: ForumTopic[];
  currentUser: string;
  onAddTopic: (topic: Omit<ForumTopic, 'id' | 'replies' | 'likes' | 'likedBy' | 'createdAt'>) => void;
  onAddReply: (topicId: string, content: string, author: string) => void;
  onLikeTopic: (topicId: string, userId: string) => void;
  onLikeReply: (topicId: string, replyId: string, userId: string) => void;
}

const categories = [
  { value: 'all', label: '全部' },
  { value: 'general', label: '綜合討論' },
  { value: 'experience', label: '體驗分享' },
  { value: 'question', label: '問題求助' },
  { value: 'research', label: '研究交流' },
  { value: 'resource', label: '資源分享' },
];

export function ForumPage({ 
  onNavigate, 
  topics, 
  currentUser, 
  onAddTopic, 
  onAddReply, 
  onLikeTopic,
  onLikeReply 
}: ForumPageProps) {
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('general');
  const [newReplyContent, setNewReplyContent] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = topics
    .filter(t => filterCategory === 'all' || t.category === filterCategory)
    .filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleSubmitTopic = () => {
    if (!newTopicTitle.trim() || !newTopicContent.trim()) return;
    
    onAddTopic({
      title: newTopicTitle.trim(),
      content: newTopicContent.trim(),
      author: currentUser,
      category: newTopicCategory,
    });
    
    setNewTopicTitle('');
    setNewTopicContent('');
    setShowNewTopicForm(false);
  };

  const handleSubmitReply = () => {
    if (!newReplyContent.trim() || !selectedTopic) return;
    
    onAddReply(selectedTopic.id, newReplyContent.trim(), currentUser);
    setNewReplyContent('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (selectedTopic) {
    return (
      <div className="min-h-screen bg-slate-950">
        {/* Header */}
        <div className="border-b border-slate-800/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
              onClick={() => setSelectedTopic(null)}
              className="inline-flex items-center text-slate-500 hover:text-slate-300 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回列表
            </button>
            
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedTopic.category === 'general' ? 'bg-slate-700 text-slate-300' :
                selectedTopic.category === 'experience' ? 'bg-emerald-500/20 text-emerald-400' :
                selectedTopic.category === 'question' ? 'bg-amber-500/20 text-amber-400' :
                selectedTopic.category === 'research' ? 'bg-blue-500/20 text-blue-400' :
                'bg-purple-500/20 text-purple-400'
              }`}>
                {categories.find(c => c.value === selectedTopic.category)?.label}
              </span>
              {selectedTopic.isPinned && (
                <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
                  置頂
                </span>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-slate-200 mb-4">
              {selectedTopic.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {selectedTopic.author}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatDate(selectedTopic.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Original Post */}
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 mb-6">
            <p className="text-slate-300 whitespace-pre-wrap">{selectedTopic.content}</p>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => onLikeTopic(selectedTopic.id, currentUser)}
                className={`flex items-center text-sm transition-colors ${
                  selectedTopic.likedBy.includes(currentUser)
                    ? 'text-amber-400'
                    : 'text-slate-500 hover:text-amber-400'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 mr-1 ${selectedTopic.likedBy.includes(currentUser) ? 'fill-amber-400' : ''}`} />
                {selectedTopic.likes}
              </button>
            </div>
          </div>

          {/* Replies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-300">
              回覆 ({selectedTopic.replies.length})
            </h3>
            
            {selectedTopic.replies.length === 0 ? (
              <p className="text-slate-500 text-center py-8">暫無回覆，成為第一個回覆的人吧！</p>
            ) : (
              selectedTopic.replies.map((reply) => (
                <div key={reply.id} className="bg-slate-900/50 rounded-xl p-5 border border-slate-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-slate-300 font-medium">{reply.author}</p>
                      <p className="text-xs text-slate-600">{formatDate(reply.createdAt)}</p>
                    </div>
                  </div>
                  <p className="text-slate-400 whitespace-pre-wrap">{reply.content}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => onLikeReply(selectedTopic.id, reply.id, currentUser)}
                      className={`flex items-center text-sm transition-colors ${
                        reply.likedBy.includes(currentUser)
                          ? 'text-amber-400'
                          : 'text-slate-500 hover:text-amber-400'
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 mr-1 ${reply.likedBy.includes(currentUser) ? 'fill-amber-400' : ''}`} />
                      {reply.likes}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Reply Form */}
          <div className="mt-6 bg-slate-900/50 rounded-xl p-5 border border-slate-800">
            <h4 className="text-sm font-medium text-slate-400 mb-3">發表回覆</h4>
            <textarea
              value={newReplyContent}
              onChange={(e) => setNewReplyContent(e.target.value)}
              placeholder="分享您的想法..."
              rows={4}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 focus:border-amber-500/50 focus:outline-none resize-none mb-3"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitReply}
                disabled={!newReplyContent.trim()}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 disabled:opacity-50"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                發表回覆
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-200 mb-4">
                討論區
              </h1>
              <p className="text-slate-500">
                與志同道合的朋友交流想法與體驗
              </p>
            </div>
            <Button
              onClick={() => setShowNewTopicForm(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950"
            >
              <Plus className="w-4 h-4 mr-2" />
              發布話題
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="搜索話題..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-600"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:border-amber-500/50 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* New Topic Form */}
        {showNewTopicForm && (
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 mb-6">
            <h3 className="text-lg font-semibold text-slate-300 mb-4">發布新話題</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-500 mb-2">分類</label>
                <select
                  value={newTopicCategory}
                  onChange={(e) => setNewTopicCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-amber-500/50 focus:outline-none"
                >
                  {categories.filter(c => c.value !== 'all').map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-2">標題</label>
                <Input
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="輸入話題標題..."
                  className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-2">內容</label>
                <textarea
                  value={newTopicContent}
                  onChange={(e) => setNewTopicContent(e.target.value)}
                  placeholder="輸入話題內容..."
                  rows={6}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 focus:border-amber-500/50 focus:outline-none resize-none"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowNewTopicForm(false)}
                  className="border-slate-700 text-slate-400 hover:bg-slate-800"
                >
                  取消
                </Button>
                <Button
                  onClick={handleSubmitTopic}
                  disabled={!newTopicTitle.trim() || !newTopicContent.trim()}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 mr-2" />
                  發布
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Topics List */}
        <div className="space-y-4">
          {filteredTopics.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500">暫無話題，成為第一個發布的人吧！</p>
            </div>
          ) : (
            filteredTopics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className="bg-slate-900/50 rounded-xl p-5 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        topic.category === 'general' ? 'bg-slate-700 text-slate-300' :
                        topic.category === 'experience' ? 'bg-emerald-500/20 text-emerald-400' :
                        topic.category === 'question' ? 'bg-amber-500/20 text-amber-400' :
                        topic.category === 'research' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {categories.find(c => c.value === topic.category)?.label}
                      </span>
                      {topic.isPinned && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                          置頂
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2 hover:text-amber-400 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-3">
                      {topic.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {topic.author}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(topic.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        {topic.replies.length} 回覆
                      </div>
                      <div className="flex items-center">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {topic.likes}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// 添加 Send 圖標導入
import { Send } from 'lucide-react';
