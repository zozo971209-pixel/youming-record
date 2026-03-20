import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Plus, Trash2, CheckCircle } from 'lucide-react';
import type { ContentCategory, Source } from '@/types';

interface SubmissionPageProps {
  onNavigate: (page: string) => void;
  onSubmit: (submission: {
    title: string;
    subtitle: string;
    category: ContentCategory;
    content: string;
    sources: Source[];
    tags: string[];
    submitterName: string;
    submitterEmail: string;
  }) => void;
}

const categories: { value: ContentCategory; label: string }[] = [
  { value: 'method', label: '方法' },
  { value: 'theory', label: '理論' },
  { value: 'evidence', label: '實證' },
  { value: 'practice', label: '實修' },
  { value: 'research', label: '研究' },
  { value: 'history', label: '歷史' },
  { value: 'culture', label: '文化' },
  { value: 'science', label: '科學' },
  { value: 'experience', label: '體驗' },
  { value: 'documentary', label: '紀錄' },
];

export function SubmissionPage({ onNavigate, onSubmit }: SubmissionPageProps) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<ContentCategory>('method');
  const [content, setContent] = useState('');
  const [sources, setSources] = useState<Source[]>([{ title: '' }]);
  const [tags, setTags] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleAddSource = () => {
    setSources([...sources, { title: '' }]);
  };

  const handleRemoveSource = (index: number) => {
    setSources(sources.filter((_, i) => i !== index));
  };

  const handleSourceChange = (index: number, field: keyof Source, value: string) => {
    const newSources = [...sources];
    newSources[index] = { ...newSources[index], [field]: value };
    setSources(newSources);
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || !submitterName.trim()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      subtitle: subtitle.trim(),
      category,
      content: content.trim(),
      sources: sources.filter(s => s.title.trim()),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      submitterName: submitterName.trim(),
      submitterEmail: submitterEmail.trim(),
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-200 mb-4">投稿成功！</h2>
            <p className="text-slate-500 mb-8">
              感謝您的投稿，我們會盡快審核您的內容。
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => onNavigate('home')}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950"
              >
                返回首頁
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setTitle('');
                  setSubtitle('');
                  setContent('');
                  setSources([{ title: '' }]);
                  setTags('');
                }}
                className="border-slate-700 text-slate-400 hover:bg-slate-800"
              >
                繼續投稿
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center text-slate-500 hover:text-slate-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首頁
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-200 mb-4">
            投稿
          </h1>
          <p className="text-slate-500">
            分享您的知識與見解，豐富幽明錄的內容
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Basic Info */}
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
            <h2 className="text-lg font-semibold text-slate-300 mb-4">基本信息</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-500 mb-2">標題 <span className="text-red-400">*</span></label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="輸入標題..."
                  className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-2">副標題</label>
                <Input
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="輸入副標題..."
                  className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-2">分類 <span className="text-red-400">*</span></label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ContentCategory)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-amber-500/50 focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
            <h2 className="text-lg font-semibold text-slate-300 mb-4">內容 <span className="text-red-400">*</span></h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="輸入詳細內容..."
              rows={12}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 focus:border-amber-500/50 focus:outline-none resize-none"
            />
            <p className="text-xs text-slate-600 mt-2">
              提示：使用 【標題】 來創建小標題，使用 - 來創建列表項
            </p>
          </div>

          {/* Sources */}
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
            <h2 className="text-lg font-semibold text-slate-300 mb-4">資料來源</h2>
            <div className="space-y-4">
              {sources.map((source, index) => (
                <div key={index} className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-500">來源 {index + 1}</span>
                    {sources.length > 1 && (
                      <button
                        onClick={() => handleRemoveSource(index)}
                        className="text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Input
                      value={source.title}
                      onChange={(e) => handleSourceChange(index, 'title', e.target.value)}
                      placeholder="來源標題..."
                      className="bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-600"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={source.author || ''}
                        onChange={(e) => handleSourceChange(index, 'author', e.target.value)}
                        placeholder="作者..."
                        className="bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-600"
                      />
                      <Input
                        value={source.publication || ''}
                        onChange={(e) => handleSourceChange(index, 'publication', e.target.value)}
                        placeholder="出版..."
                        className="bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={source.year || ''}
                        onChange={(e) => handleSourceChange(index, 'year', e.target.value)}
                        placeholder="年份..."
                        className="bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-600"
                      />
                      <Input
                        value={source.url || ''}
                        onChange={(e) => handleSourceChange(index, 'url', e.target.value)}
                        placeholder="URL..."
                        className="bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={handleAddSource}
                className="w-full border-slate-700 text-slate-400 hover:bg-slate-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                添加來源
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
            <h2 className="text-lg font-semibold text-slate-300 mb-4">標籤</h2>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="輸入標籤，用逗號分隔..."
              className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600"
            />
          </div>

          {/* Submitter Info */}
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
            <h2 className="text-lg font-semibold text-slate-300 mb-4">投稿人信息</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-500 mb-2">暱稱 <span className="text-red-400">*</span></label>
                <Input
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  placeholder="輸入您的暱稱..."
                  className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-2">電子郵件</label>
                <Input
                  type="email"
                  value={submitterEmail}
                  onChange={(e) => setSubmitterEmail(e.target.value)}
                  placeholder="輸入您的電子郵件..."
                  className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim() || !submitterName.trim()}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 disabled:opacity-50"
            >
              <Send className="w-4 h-4 mr-2" />
              提交投稿
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
