import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowLeft, Send, CheckCircle, MessageSquare, Lightbulb, AlertTriangle } from 'lucide-react';
import type { Feedback } from '@/types';

interface FeedbackPageProps {
  onNavigate: (page: string) => void;
  onSubmit: (feedback: Omit<Feedback, 'id' | 'createdAt' | 'status'>) => void;
}

export function FeedbackPage({ onNavigate, onSubmit }: FeedbackPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'question' as const,
    content: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.content.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit(formData);
    setShowSuccess(true);
    setIsSubmitting(false);
    
    setFormData({
      name: '',
      email: '',
      type: 'question',
      content: ''
    });
  };

  const feedbackTypes = [
    { value: 'question', label: '問題諮詢', icon: MessageSquare, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    { value: 'suggestion', label: '建議反饋', icon: Lightbulb, color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
    { value: 'report', label: '錯誤回報', icon: AlertTriangle, color: 'text-red-400', bgColor: 'bg-red-500/10' }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center text-slate-500 hover:text-slate-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首頁
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-200 mb-4">
            聯絡我們
          </h1>
          
          <p className="text-slate-500 max-w-2xl">
            如果您有任何問題、建議或發現內容有誤，歡迎與我們聯繫。
            您的反饋將幫助我們做得更好。
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-400">
                    姓名 <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="請輸入您的姓名"
                    required
                    className="bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:border-amber-500/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-400">
                    電子郵箱 <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                    className="bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-slate-400">
                  反饋類型 <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="bg-slate-900 border-slate-800 text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800">
                    {feedbackTypes.map((type) => (
                      <SelectItem 
                        key={type.value} 
                        value={type.value}
                        className="text-slate-300 hover:bg-slate-800 focus:bg-slate-800"
                      >
                        <div className="flex items-center">
                          <type.icon className={`w-4 h-4 mr-2 ${type.color}`} />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-slate-400">
                  詳細內容 <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="請詳細描述您的問題、建議或發現的錯誤..."
                  required
                  rows={6}
                  className="bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-600 resize-none focus:border-amber-500/50"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-semibold"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    提交中...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send className="w-5 h-5 mr-2" />
                    提交反饋
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h3 className="text-lg font-semibold text-slate-300 mb-4">反饋類型說明</h3>
              <div className="space-y-4">
                {feedbackTypes.map((type) => (
                  <div key={type.value} className="flex items-start">
                    <div className={`w-8 h-8 rounded-lg ${type.bgColor} flex items-center justify-center mr-3 flex-shrink-0`}>
                      <type.icon className={`w-4 h-4 ${type.color}`} />
                    </div>
                    <div>
                      <div className="text-slate-300 font-medium">{type.label}</div>
                      <div className="text-sm text-slate-600">
                        {type.value === 'question' && '對內容有疑問或需要更多信息'}
                        {type.value === 'suggestion' && '對網站或內容提出建議'}
                        {type.value === 'report' && '報告內容錯誤或連結失效'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h3 className="text-lg font-semibold text-slate-300 mb-4">回覆時間</h3>
              <p className="text-slate-500 text-sm">
                我們會認真閱讀每一條反饋，並在必要時通過郵件回覆您。
              </p>
              <div className="text-sm text-slate-600 mt-3">
                <p>一般回覆時間：3-5個工作日</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-200">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <span className="text-xl font-bold text-slate-200">提交成功</span>
            </DialogTitle>
            <DialogDescription className="text-center text-slate-500">
              感謝您的反饋！我們會盡快查看並處理您的意見。
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => setShowSuccess(false)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950"
            >
              確定
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
