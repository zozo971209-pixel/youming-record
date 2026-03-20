import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Save, 
  Plus,
  MessageSquare, 
  CheckCircle,
  Clock,
  Database,
  Upload,
  Download,
  Send,
  XCircle,
  Eye,
  Layout,
  FileText,
  Settings,
  ChevronDown,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { themes as defaultThemes, type Theme, type ContentSection, type Citation } from '@/data/themes';
import type { Feedback, UserSubmission } from '@/types';
import { 
  isSupabaseEnabled, 
  getThemes, 
  createTheme, 
  updateTheme, 
  deleteTheme,
  createSection,
  updateSection,
  deleteSection,
  createCitation,
  updateCitation,
  deleteCitation,
  updateStats,
  getSubmissions,
  updateSubmissionStatus,
  getDiscussions,
  createReply
} from '@/lib/supabase';
import { toast } from 'sonner';

interface AdminPageProps {
  onNavigate: (page: string) => void;
  feedback: Feedback[];
  submissions: UserSubmission[];
  onReplyFeedback: (id: string, reply: string) => void;
  onDeleteFeedback: (id: string) => void;
  onApproveSubmission: (id: string, adminNote?: string) => void;
  onRejectSubmission: (id: string, adminNote?: string) => void;
}

const STORAGE_KEY_THEMES = 'youming_themes';

export function AdminPage({
  onNavigate,
  feedback,
  submissions: propSubmissions,
  onReplyFeedback,
  onDeleteFeedback,
  onApproveSubmission,
  onRejectSubmission,
}: AdminPageProps) {
  const [activeTab, setActiveTab] = useState('themes');
  const [localThemes, setLocalThemes] = useState<Theme[]>(defaultThemes);
  const [isLoading, setIsLoading] = useState(false);
  const [usingSupabase, setUsingSupabase] = useState(false);
  
  // 主題相關狀態
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [selectedSection, setSelectedSection] = useState<ContentSection | null>(null);
  const [showThemeDialog, setShowThemeDialog] = useState(false);
  const [showSectionDialog, setShowSectionDialog] = useState(false);
  const [showNewThemeDialog, setShowNewThemeDialog] = useState(false);
  const [showNewSectionDialog, setShowNewSectionDialog] = useState(false);
  const [showCitationDialog, setShowCitationDialog] = useState(false);
  const [expandedThemes, setExpandedThemes] = useState<Set<string>>(new Set());
  
  // 引用相關
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  
  // 投稿和反饋
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [viewingSubmission, setViewingSubmission] = useState<UserSubmission | null>(null);
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  const [submissionNote, setSubmissionNote] = useState('');
  const [replyingFeedback, setReplyingFeedback] = useState<Feedback | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  
  // 導入導出
  const [importError, setImportError] = useState('');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 初始化：檢查 Supabase 狀態並加載數據
  useEffect(() => {
    const init = async () => {
      const enabled = isSupabaseEnabled();
      setUsingSupabase(enabled);
      
      if (enabled) {
        await loadThemesFromSupabase();
        await loadSubmissionsFromSupabase();
      } else {
        // 從 localStorage 加載
        const stored = localStorage.getItem(STORAGE_KEY_THEMES);
        if (stored) {
          setLocalThemes(JSON.parse(stored));
        }
        // 加載投稿
        const storedSubmissions = localStorage.getItem('submissions');
        if (storedSubmissions) {
          setSubmissions(JSON.parse(storedSubmissions));
        }
      }
    };
    init();
  }, []);

  // 從 Supabase 加載主題
  const loadThemesFromSupabase = async () => {
    setIsLoading(true);
    try {
      const themes = await getThemes();
      if (themes && themes.length > 0) {
        // 轉換 Supabase 格式為本地格式
        const formattedThemes = await Promise.all(themes.map(async (t: any) => {
          const themeData = await getThemeWithDetails(t.id);
          return formatThemeFromSupabase(themeData);
        }));
        setLocalThemes(formattedThemes);
      }
    } catch (error) {
      console.error('加載主題失敗:', error);
      toast.error('加載主題失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // 從 Supabase 加載投稿
  const loadSubmissionsFromSupabase = async () => {
    try {
      const data = await getSubmissions();
      if (data) {
        const formatted = data.map((s: any) => ({
          id: s.id,
          title: s.title,
          subtitle: s.content.substring(0, 100) + '...',
          content: s.content,
          submitterName: s.author,
          submitterEmail: s.email,
          category: s.category,
          status: s.status,
          createdAt: s.created_at,
        }));
        setSubmissions(formatted);
      }
    } catch (error) {
      console.error('加載投稿失敗:', error);
    }
  };

  // 格式化 Supabase 主題數據為本地格式
  const formatThemeFromSupabase = (data: any): Theme => {
    return {
      id: data.id,
      slug: data.id,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      icon: data.icon,
      color: data.color,
      stats: data.stats ? [
        { label: '誘導成功率', value: String(data.stats.success_rate), unit: '%' },
        { label: '相關研究', value: String(data.stats.research_count), unit: '篇' },
        { label: '實驗參與者', value: String(data.stats.participant_count), unit: '人' },
        { label: '平均持續時間', value: data.stats.avg_duration, unit: '' },
      ] : [],
      sections: (data.sections || []).map((s: any) => ({
        id: s.id,
        type: s.type,
        title: s.title,
        content: s.content,
        citations: (data.citations || [])
          .filter((c: any) => c.section_id === s.id)
          .map((c: any) => ({
            id: c.id,
            number: c.number,
            title: c.title,
            author: c.author,
            publication: c.source,
            year: String(c.year),
            page: c.page,
            url: c.url,
          })),
      })),
    };
  };

  const saveThemes = (newThemes: Theme[]) => {
    setLocalThemes(newThemes);
    if (!usingSupabase) {
      localStorage.setItem(STORAGE_KEY_THEMES, JSON.stringify(newThemes));
    }
  };

  const toggleThemeExpand = (themeId: string) => {
    const newExpanded = new Set(expandedThemes);
    if (newExpanded.has(themeId)) {
      newExpanded.delete(themeId);
    } else {
      newExpanded.add(themeId);
    }
    setExpandedThemes(newExpanded);
  };

  // 新增主題
  const handleNewTheme = () => {
    setSelectedTheme({
      id: crypto.randomUUID(),
      slug: '',
      title: '',
      subtitle: '',
      description: '',
      icon: 'Eye',
      color: 'from-blue-500 to-cyan-500',
      stats: [],
      sections: []
    });
    setShowNewThemeDialog(true);
  };

  const handleSaveNewTheme = async () => {
    if (!selectedTheme || !selectedTheme.title || !selectedTheme.slug) return;
    
    setIsLoading(true);
    try {
      if (usingSupabase) {
        await createTheme({
          id: selectedTheme.slug,
          title: selectedTheme.title,
          subtitle: selectedTheme.subtitle,
          description: selectedTheme.description,
          icon: selectedTheme.icon,
          color: selectedTheme.color,
          order_index: localThemes.length,
        });
      }
      
      const newThemes = [...localThemes, selectedTheme];
      saveThemes(newThemes);
      setShowNewThemeDialog(false);
      setSelectedTheme(null);
      toast.success('主題創建成功');
    } catch (error) {
      console.error('創建主題失敗:', error);
      toast.error('創建主題失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // 編輯主題
  const handleEditTheme = (theme: Theme) => {
    setSelectedTheme({ ...theme });
    setShowThemeDialog(true);
  };

  const handleSaveTheme = async () => {
    if (!selectedTheme) return;
    
    setIsLoading(true);
    try {
      if (usingSupabase) {
        await updateTheme(selectedTheme.id, {
          title: selectedTheme.title,
          subtitle: selectedTheme.subtitle,
          description: selectedTheme.description,
          icon: selectedTheme.icon,
          color: selectedTheme.color,
        });
      }
      
      const newThemes = localThemes.map(t => 
        t.id === selectedTheme.id ? selectedTheme : t
      );
      saveThemes(newThemes);
      setShowThemeDialog(false);
      setSelectedTheme(null);
      toast.success('主題保存成功');
    } catch (error) {
      console.error('保存主題失敗:', error);
      toast.error('保存主題失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // 刪除主題
  const handleDeleteTheme = async (themeId: string) => {
    if (!confirm('確定要刪除這個主題嗎？此操作不可恢復。')) return;
    
    setIsLoading(true);
    try {
      if (usingSupabase) {
        await deleteTheme(themeId);
      }
      
      const newThemes = localThemes.filter(t => t.id !== themeId);
      saveThemes(newThemes);
      toast.success('主題已刪除');
    } catch (error) {
      console.error('刪除主題失敗:', error);
      toast.error('刪除主題失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // 新增區塊
  const handleNewSection = (theme: Theme) => {
    setSelectedTheme(theme);
    setSelectedSection({
      id: crypto.randomUUID(),
      type: 'intro',
      title: '',
      content: '',
      citations: []
    });
    setCitations([]);
    setShowNewSectionDialog(true);
  };

  const handleSaveNewSection = async () => {
    if (!selectedTheme || !selectedSection || !selectedSection.title) return;
    
    setIsLoading(true);
    try {
      if (usingSupabase) {
        await createSection({
          theme_id: selectedTheme.id,
          type: selectedSection.type,
          title: selectedSection.title,
          content: selectedSection.content,
          order_index: selectedTheme.sections.length,
        });
      }
      
      const sectionWithCitations = { ...selectedSection, citations };
      const newThemes = localThemes.map(t => {
        if (t.id === selectedTheme.id) {
          return {
            ...t,
            sections: [...t.sections, sectionWithCitations]
          };
        }
        return t;
      });
      saveThemes(newThemes);
      setShowNewSectionDialog(false);
      setSelectedSection(null);
      setCitations([]);
      toast.success('區塊創建成功');
    } catch (error) {
      console.error('創建區塊失敗:', error);
      toast.error('創建區塊失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // 編輯區塊
  const handleEditSection = (theme: Theme, section: ContentSection) => {
    setSelectedTheme(theme);
    setSelectedSection({ ...section });
    setCitations(section.citations || []);
    setShowSectionDialog(true);
  };

  const handleSaveSection = async () => {
    if (!selectedTheme || !selectedSection) return;
    
    setIsLoading(true);
    try {
      if (usingSupabase) {
        await updateSection(selectedSection.id, {
          type: selectedSection.type,
          title: selectedSection.title,
          content: selectedSection.content,
        });
      }
      
      const sectionWithCitations = { ...selectedSection, citations };
      const newThemes = localThemes.map(t => {
        if (t.id === selectedTheme.id) {
          return {
            ...t,
            sections: t.sections.map(s => 
              s.id === selectedSection.id ? sectionWithCitations : s
            )
          };
        }
        return t;
      });
      saveThemes(newThemes);
      setShowSectionDialog(false);
      setSelectedSection(null);
      setCitations([]);
      toast.success('區塊保存成功');
    } catch (error) {
      console.error('保存區塊失敗:', error);
      toast.error('保存區塊失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // 刪除區塊
  const handleDeleteSection = async (themeId: string, sectionId: string) => {
    if (!confirm('確定要刪除這個區塊嗎？')) return;
    
    setIsLoading(true);
    try {
      if (usingSupabase) {
        await deleteSection(sectionId);
      }
      
      const newThemes = localThemes.map(t => {
        if (t.id === themeId) {
          return {
            ...t,
            sections: t.sections.filter(s => s.id !== sectionId)
          };
        }
        return t;
      });
      saveThemes(newThemes);
      toast.success('區塊已刪除');
    } catch (error) {
      console.error('刪除區塊失敗:', error);
      toast.error('刪除區塊失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // 引用管理
  const handleAddCitation = () => {
    const newCitation: Citation = {
      id: crypto.randomUUID(),
      number: citations.length + 1,
      title: '',
      author: '',
      publication: '',
      year: '',
      page: '',
      line: '',
      url: ''
    };
    setSelectedCitation(newCitation);
    setShowCitationDialog(true);
  };

  const handleEditCitation = (citation: Citation) => {
    setSelectedCitation({ ...citation });
    setShowCitationDialog(true);
  };

  const handleSaveCitation = async () => {
    if (!selectedCitation || !selectedCitation.title) return;
    
    try {
      const existingIndex = citations.findIndex(c => c.id === selectedCitation.id);
      let newCitations;
      if (existingIndex >= 0) {
        newCitations = citations.map((c, i) => i === existingIndex ? selectedCitation : c);
      } else {
        newCitations = [...citations, selectedCitation];
      }
      setCitations(newCitations);
      
      if (usingSupabase && selectedTheme) {
        await createCitation({
          theme_id: selectedTheme.id,
          number: selectedCitation.number,
          title: selectedCitation.title,
          author: selectedCitation.author,
          year: parseInt(selectedCitation.year) || new Date().getFullYear(),
          source: selectedCitation.publication,
          page: selectedCitation.page,
          url: selectedCitation.url,
        });
      }
      
      setShowCitationDialog(false);
      setSelectedCitation(null);
    } catch (error) {
      console.error('保存引用失敗:', error);
      toast.error('保存引用失敗');
    }
  };

  const handleDeleteCitation = async (citationId: string) => {
    try {
      setCitations(citations.filter(c => c.id !== citationId));
      
      if (usingSupabase) {
        await deleteCitation(citationId);
      }
    } catch (error) {
      console.error('刪除引用失敗:', error);
      toast.error('刪除引用失敗');
    }
  };

  // 導出導入
  const handleExportThemes = () => {
    const jsonStr = JSON.stringify(localThemes, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `youming_themes_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('數據導出成功');
  };

  const handleImportThemes = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        setImportError('');
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        if (Array.isArray(data)) {
          saveThemes(data as Theme[]);
          setShowImportDialog(false);
          toast.success('數據導入成功');
        } else {
          setImportError('無效的數據格式：必須是主題數組');
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        setImportError('解析JSON失敗');
      }
    };
    reader.onerror = () => setImportError('讀取文件失敗');
    reader.readAsText(file);
  };

  // 投稿和反饋
  const handleViewSubmission = (submission: UserSubmission) => {
    setViewingSubmission(submission);
    setSubmissionNote('');
    setShowSubmissionDialog(true);
  };

  const handleApproveSubmission = async () => {
    if (viewingSubmission) {
      setIsLoading(true);
      try {
        if (usingSupabase) {
          await updateSubmissionStatus(viewingSubmission.id, 'approved');
        }
        onApproveSubmission(viewingSubmission.id, submissionNote);
        await loadSubmissionsFromSupabase();
        setShowSubmissionDialog(false);
        setViewingSubmission(null);
        toast.success('投稿已通過');
      } catch (error) {
        console.error('審核失敗:', error);
        toast.error('審核失敗');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRejectSubmission = async () => {
    if (viewingSubmission) {
      setIsLoading(true);
      try {
        if (usingSupabase) {
          await updateSubmissionStatus(viewingSubmission.id, 'rejected');
        }
        onRejectSubmission(viewingSubmission.id, submissionNote);
        await loadSubmissionsFromSupabase();
        setShowSubmissionDialog(false);
        setViewingSubmission(null);
        toast.success('投稿已拒絕');
      } catch (error) {
        console.error('審核失敗:', error);
        toast.error('審核失敗');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReply = (feedbackItem: Feedback) => {
    setReplyingFeedback(feedbackItem);
    setReplyText(feedbackItem.reply || '');
    setShowReplyDialog(true);
  };

  const handleSaveReply = () => {
    if (replyingFeedback) {
      onReplyFeedback(replyingFeedback.id, replyText);
      setShowReplyDialog(false);
      setReplyingFeedback(null);
      toast.success('回覆已保存');
    }
  };

  const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;
  const pendingFeedback = feedback.filter(f => f.status !== 'replied').length;
  const totalSections = localThemes.reduce((acc, t) => acc + t.sections.length, 0);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center text-slate-500 hover:text-slate-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首頁
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-200 mb-2">
                後台管理
              </h1>
              <p className="text-slate-500">
                管理網站主題內容、審核投稿、處理反饋
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {!usingSupabase && (
                <div className="flex items-center text-amber-400 text-sm mr-4">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span>本地模式</span>
                </div>
              )}
              <div className="text-right">
                <div className="text-2xl font-bold text-amber-400">{localThemes.length}</div>
                <div className="text-sm text-slate-500">主題</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-400">{totalSections}</div>
                <div className="text-sm text-slate-500">區塊</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-950 border border-slate-700 mb-8 flex-wrap h-auto p-1">
            <TabsTrigger value="themes" className="text-slate-400 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 hover:text-slate-200">
              <Layout className="w-4 h-4 mr-2" />
              主題管理
              <Badge variant="secondary" className="ml-2 bg-slate-800 text-slate-500">{localThemes.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="submissions" className="text-slate-400 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 hover:text-slate-200">
              <Send className="w-4 h-4 mr-2" />
              投稿審核
              <Badge variant="secondary" className={`ml-2 ${pendingSubmissions > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
                {pendingSubmissions}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="text-slate-400 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 hover:text-slate-200">
              <MessageSquare className="w-4 h-4 mr-2" />
              用戶反饋
              <Badge variant="secondary" className={`ml-2 ${pendingFeedback > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
                {pendingFeedback}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="system" className="text-slate-400 data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 hover:text-slate-200">
              <Settings className="w-4 h-4 mr-2" />
              系統設置
            </TabsTrigger>
          </TabsList>

          {/* 主題管理 */}
          <TabsContent value="themes">
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center">
                <h2 className="text-lg font-bold text-slate-300 mr-4">主題列表</h2>
                {usingSupabase && (
                  <Button 
                    onClick={loadThemesFromSupabase} 
                    variant="outline" 
                    size="sm" 
                    className="border-slate-700 text-slate-400 hover:bg-slate-800"
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    刷新
                  </Button>
                )}
              </div>
              <Button onClick={handleNewTheme} className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950" disabled={isLoading}>
                <Plus className="w-4 h-4 mr-2" />
                新增主題
              </Button>
            </div>
            
            <div className="space-y-4">
              {localThemes.map((theme) => {
                const isExpanded = expandedThemes.has(theme.id);
                return (
                  <div key={theme.id} className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
                    <div className="flex items-center justify-between p-4">
                      <div 
                        className="flex items-center flex-1 cursor-pointer"
                        onClick={() => toggleThemeExpand(theme.id)}
                      >
                        <button className="mr-2 text-slate-500">
                          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                        </button>
                        <div>
                          <div className="font-medium text-slate-300">{theme.title}</div>
                          <div className="text-sm text-slate-500">{theme.subtitle} · {theme.sections.length} 個區塊</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditTheme(theme)}
                          className="p-2 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                          disabled={isLoading}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTheme(theme.id)}
                          className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="border-t border-slate-800">
                        <div className="px-4 py-2 bg-slate-950/30 flex justify-between items-center">
                          <span className="text-sm text-slate-500">區塊列表</span>
                          <button
                            onClick={() => handleNewSection(theme)}
                            className="text-sm text-amber-400 hover:text-amber-300 flex items-center"
                            disabled={isLoading}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            新增區塊
                          </button>
                        </div>
                        {theme.sections.map((section) => (
                          <div
                            key={section.id}
                            className="flex items-center justify-between px-4 py-3 pl-12 border-t border-slate-800/50 hover:bg-slate-800/30"
                          >
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 text-slate-600 mr-3" />
                              <div>
                                <div className="text-sm text-slate-400">{section.title}</div>
                                <div className="text-xs text-slate-600">
                                  {section.type === 'intro' && '簡介'}
                                  {section.type === 'methods' && '方法'}
                                  {section.type === 'theory' && '理論'}
                                  {section.type === 'evidence' && '實證'}
                                  {section.type === 'cases' && '案例'}
                                  {section.type === 'sources' && '來源'}
                                  {section.citations && section.citations.length > 0 && ` · ${section.citations.length} 個引用`}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleEditSection(theme, section)}
                                className="p-2 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                                disabled={isLoading}
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteSection(theme.id, section.id)}
                                className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                disabled={isLoading}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* 投稿審核 */}
          <TabsContent value="submissions">
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2 flex-wrap gap-y-2">
                        <span className="text-slate-300 font-medium">{submission.title}</span>
                        <Badge variant="secondary" className={
                          submission.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : 
                          submission.status === 'approved' ? 'bg-green-500/10 text-green-400' : 
                          'bg-red-500/10 text-red-400'
                        }>
                          {submission.status === 'pending' && <><Clock className="w-3 h-3 mr-1" /> 待審核</>}
                          {submission.status === 'approved' && <><CheckCircle className="w-3 h-3 mr-1" /> 已通過</>}
                          {submission.status === 'rejected' && <><XCircle className="w-3 h-3 mr-1" /> 已拒絕</>}
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-sm mb-2">{submission.subtitle}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span>投稿人：{submission.submitterName}</span>
                        <span>{new Date(submission.createdAt).toLocaleString('zh-TW')}</span>
                      </div>
                    </div>
                    <button onClick={() => handleViewSubmission(submission)} className="p-2 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {submissions.length === 0 && (
                <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800">
                  <Send className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-600">暫無投稿</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* 用戶反饋 */}
          <TabsContent value="feedback">
            <div className="space-y-4">
              {feedback.map((item) => (
                <div key={item.id} className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2 flex-wrap gap-y-2">
                        <span className="text-slate-300 font-medium">{item.name}</span>
                        <span className="text-slate-600 text-sm">{item.email}</span>
                        <Badge variant="secondary" className={
                          item.type === 'question' ? 'bg-blue-500/10 text-blue-400' :
                          item.type === 'suggestion' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-red-500/10 text-red-400'
                        }>
                          {item.type === 'question' && '問題'}
                          {item.type === 'suggestion' && '建議'}
                          {item.type === 'report' && '錯誤'}
                        </Badge>
                      </div>
                      <p className="text-slate-400">{item.content}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleReply(item)} className="p-2 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDeleteFeedback(item.id)} className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {item.reply && (
                    <div className="mt-4 pl-4 border-l-2 border-amber-500/30">
                      <div className="text-sm text-amber-400 mb-1">管理員回覆：</div>
                      <p className="text-slate-400">{item.reply}</p>
                    </div>
                  )}
                </div>
              ))}
              {feedback.length === 0 && (
                <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800">
                  <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-600">暫無用戶反饋</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* 系統設置 */}
          <TabsContent value="system">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                <h2 className="text-xl font-bold text-slate-300 mb-6 flex items-center">
                  <Download className="w-5 h-5 mr-2 text-amber-400" />
                  導出數據
                </h2>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Database className="w-5 h-5 mr-2 text-blue-400" />
                      <span className="text-slate-300">導出主題數據</span>
                    </div>
                    <Button onClick={handleExportThemes} variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:bg-slate-800">
                      <Download className="w-4 h-4 mr-2" />
                      導出
                    </Button>
                  </div>
                  <p className="text-sm text-slate-600">導出所有主題和區塊內容為 JSON 格式</p>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                <h2 className="text-xl font-bold text-slate-300 mb-6 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-green-400" />
                  導入數據
                </h2>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Database className="w-5 h-5 mr-2 text-blue-400" />
                      <span className="text-slate-300">從 JSON 導入</span>
                    </div>
                    <Button onClick={() => setShowImportDialog(true)} variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:bg-slate-800">
                      <Upload className="w-4 h-4 mr-2" />
                      導入
                    </Button>
                  </div>
                  <p className="text-sm text-slate-600">從 JSON 文件導入主題數據（會覆蓋現有數據）</p>
                </div>
              </div>

              {/* Supabase 狀態 */}
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 md:col-span-2">
                <h2 className="text-xl font-bold text-slate-300 mb-6 flex items-center">
                  <Database className="w-5 h-5 mr-2 text-blue-400" />
                  數據庫狀態
                </h2>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-slate-300 font-medium">
                        {usingSupabase ? '已連接到 Supabase' : '本地存儲模式'}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        {usingSupabase 
                          ? '數據將同步到雲端數據庫' 
                          : '數據僅存儲在瀏覽器中，請設置 Supabase 環境變數以啟用雲端同步'}
                      </p>
                    </div>
                    <Badge className={usingSupabase ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}>
                      {usingSupabase ? '已連接' : '未連接'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 新增主題對話框 */}
      <Dialog open={showNewThemeDialog} onOpenChange={setShowNewThemeDialog}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-200 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-amber-400">新增主題</DialogTitle>
          </DialogHeader>
          {selectedTheme && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-slate-400">標題 <span className="text-red-400">*</span></Label>
                <Input value={selectedTheme.title} onChange={(e) => setSelectedTheme({ ...selectedTheme, title: e.target.value })} className="bg-slate-950 border-slate-700 text-slate-200" placeholder="例如：清醒夢" />
              </div>
              <div>
                <Label className="text-slate-400">Slug <span className="text-red-400">*</span> (URL標識)</Label>
                <Input value={selectedTheme.slug} onChange={(e) => setSelectedTheme({ ...selectedTheme, slug: e.target.value })} className="bg-slate-950 border-slate-700 text-slate-200" placeholder="例如：lucid-dreaming" />
              </div>
              <div>
                <Label className="text-slate-400">副標題</Label>
                <Input value={selectedTheme.subtitle} onChange={(e) => setSelectedTheme({ ...selectedTheme, subtitle: e.target.value })} className="bg-slate-950 border-slate-700 text-slate-200" placeholder="例如：Lucid Dreaming" />
              </div>
              <div>
                <Label className="text-slate-400">描述</Label>
                <Textarea value={selectedTheme.description} onChange={(e) => setSelectedTheme({ ...selectedTheme, description: e.target.value })} className="bg-slate-950 border-slate-700 text-slate-200" rows={3} placeholder="簡短描述這個主題..." />
              </div>
              <div>
                <Label className="text-slate-400">圖標</Label>
                <select value={selectedTheme.icon} onChange={(e) => setSelectedTheme({ ...selectedTheme, icon: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200">
                  <option value="Eye">Eye (眼睛)</option>
                  <option value="Orbit">Orbit (軌道)</option>
                  <option value="Brain">Brain (大腦)</option>
                  <option value="Wind">Wind (風)</option>
                  <option value="Sparkles">Sparkles (火花)</option>
                  <option value="Zap">Zap (閃電)</option>
                </select>
              </div>
              <div>
                <Label className="text-slate-400">漸變色</Label>
                <select value={selectedTheme.color} onChange={(e) => setSelectedTheme({ ...selectedTheme, color: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200">
                  <option value="from-blue-500 to-cyan-500">藍色-青色</option>
                  <option value="from-purple-500 to-pink-500">紫色-粉色</option>
                  <option value="from-amber-500 to-orange-500">琥珀-橙色</option>
                  <option value="from-emerald-500 to-teal-500">翡翠-青色</option>
                  <option value="from-rose-500 to-red-500">玫瑰-紅色</option>
                  <option value="from-indigo-500 to-violet-500">靛藍-紫羅蘭</option>
                </select>
              </div>
              
              {/* 統計數據 */}
              <div className="border-t border-slate-800 pt-4">
                <Label className="text-slate-400 mb-2 block">統計數據（最多4個）</Label>
                <div className="space-y-3">
                  {(selectedTheme.stats || []).map((stat, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input 
                        value={stat.label} 
                        onChange={(e) => {
                          const newStats = [...(selectedTheme.stats || [])];
                          newStats[index] = { ...stat, label: e.target.value };
                          setSelectedTheme({ ...selectedTheme, stats: newStats });
                        }} 
                        className="bg-slate-950 border-slate-700 text-slate-200 flex-1" 
                        placeholder="標籤，例如：誘導成功率"
                      />
                      <Input 
                        value={stat.value} 
                        onChange={(e) => {
                          const newStats = [...(selectedTheme.stats || [])];
                          newStats[index] = { ...stat, value: e.target.value };
                          setSelectedTheme({ ...selectedTheme, stats: newStats });
                        }} 
                        className="bg-slate-950 border-slate-700 text-slate-200 w-24" 
                        placeholder="數值"
                      />
                      <Input 
                        value={stat.unit || ''} 
                        onChange={(e) => {
                          const newStats = [...(selectedTheme.stats || [])];
                          newStats[index] = { ...stat, unit: e.target.value };
                          setSelectedTheme({ ...selectedTheme, stats: newStats });
                        }} 
                        className="bg-slate-950 border-slate-700 text-slate-200 w-20" 
                        placeholder="單位"
                      />
                      <button 
                        onClick={() => {
                          const newStats = (selectedTheme.stats || []).filter((_, i) => i !== index);
                          setSelectedTheme({ ...selectedTheme, stats: newStats });
                        }}
                        className="p-2 text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {(selectedTheme.stats || []).length < 4 && (
                    <Button 
                      onClick={() => {
                        const newStats = [...(selectedTheme.stats || []), { label: '', value: '', unit: '' }];
                        setSelectedTheme({ ...selectedTheme, stats: newStats });
                      }}
                      variant="outline" 
                      size="sm" 
                      className="border-slate-700 text-slate-400 hover:bg-slate-800"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      添加統計
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowNewThemeDialog(false)} className="border-slate-700 text-slate-400 hover:bg-slate-800">取消</Button>
                <Button onClick={handleSaveNewTheme} disabled={!selectedTheme.title || !selectedTheme.slug || isLoading} className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950">
                  <Save className="w-4 h-4 mr-2" />
                  創建
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 編輯主題對話框 */}
      <Dialog open={showThemeDialog} onOpenChange={setShowThemeDialog}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-200 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-amber-400">編輯主題</DialogTitle>
          </DialogHeader>
          {selectedTheme && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-slate-400">標題</Label>
                <Input value={selectedTheme.title} onChange={(e) => setSelectedTheme({ ...selectedTheme, title: e.target.value })} className="bg-slate-950 border-slate-700 text-slate-200" />
              </div>
              <div>
                <Label className="text-slate-400">Slug (URL標識)</Label>
                <Input value={selectedTheme.slug} onChange={(e) => setSelectedTheme({ ...selectedTheme, slug: e.target.value })} className="bg-slate-950 border-slate-700 text-slate-200" />
              </div>
              <div>
                <Label className="text-slate-400">副標題</Label>
                <Input value={selectedTheme.subtitle} onChange={(e) => setSelectedTheme({ ...selectedTheme, subtitle: e.target.value })} className="bg-slate-950 border-slate-700 text-slate-200" />
              </div>
              <div>
                <Label className="text-slate-400">描述</Label>
                <Textarea value={selectedTheme.description} onChange={(e) => setSelectedTheme({ ...selectedTheme, description: e.target.value })} className="bg-slate-950 border-slate-700 text-slate-200" rows={3} />
              </div>
              <div>
                <Label className="text-slate-400">圖標</Label>
                <select value={selectedTheme.icon} onChange={(e) => setSelectedTheme({ ...selectedTheme, icon: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200">
                  <option value="Eye">Eye (眼睛)</option>
                  <option value="Orbit">Orbit (軌道)</option>
                  <option value="Brain">Brain (大腦)</option>
                  <option value="Wind">Wind (風)</option>
                  <option value="Sparkles">Sparkles (火花)</option>
                  <option value="Zap">Zap (閃電)</option>
                </select>
              </div>
              <div>
                <Label className="text-slate-400">漸變色</Label>
                <select value={selectedTheme.color} onChange={(e) => setSelectedTheme({ ...selectedTheme, color: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200">
                  <option value="from-blue-500 to-cyan-500">藍色-青色</option>
                  <option value="from-purple-500 to-pink-500">紫色-粉色</option>
                  <option value="from-amber-500 to-orange-500">琥珀-橙色</option>
                  <option value="from-emerald-500 to-teal-500">翡翠-青色</option>
                  <option value="from-rose-500 to-red-500">玫瑰-紅色</option>
                  <option value="from-indigo-500 to-violet-500">靛藍-紫羅蘭</option>
                </select>
              </div>
              
              {/* 統計數據 */}
              <div className="border-t border-slate-800 pt-4">
                <Label className="text-slate-400 mb-2 block">統計數據（最多4個）</Label>
                <div className="space-y-3">
                  {(selectedTheme.stats || []).map((stat, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input 
                        value={stat.label} 
                        onChange={(e) => {
                          const newStats = [...(selectedTheme.stats || [])];
                          newStats[index] = { ...stat, label: e.target.value };
                          setSelectedTheme({ ...selectedTheme, stats: newStats });
                        }} 
                        className="bg-slate-950 border-slate-700 text-slate-200 flex-1" 
                        placeholder="標籤，例如：誘導成功率"
                      />
                      <Input 
                        value={stat.value} 
                        onChange={(e) => {
                          const newStats = [...(selectedTheme.stats || [])];
                          newStats[index] = { ...stat, value: e.target.value };
                          setSelectedTheme({ ...selectedTheme, stats: newStats });
                        }} 
                        className="bg-slate-950 border-slate-700 text-slate-200 w-24" 
                        placeholder="數值"
                      />
                      <Input 
                        value={stat.unit || ''} 
                        onChange={(e) => {
                          const newStats = [...(selectedTheme.stats || [])];
                          newStats[index] = { ...stat, unit: e.target.value };
                          setSelectedTheme({ ...selectedTheme, stats: newStats });
                        }} 
                        className="bg-slate-950 border-slate-700 text-slate-200 w-20" 
                        placeholder="單位"
                      />
                      <button 
                        onClick={() => {
                          const newStats = (selectedTheme.stats || []).filter((_, i) => i !== index);
                          setSelectedTheme({ ...selectedTheme, stats: newStats });
                        }}
                        className="p-2 text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {(selectedTheme.stats || []).length < 4 && (
                    <Button 
                      onClick={() => {
                        const newStats = [...(selectedTheme.stats || []), { label: '', value: '', unit: '' }];
                        setSelectedTheme({ ...selectedTheme, stats: newStats });
                      }}
                      variant="outline" 
                      size="sm" 
                      className="border-slate-700 text-slate-400 hover:bg-slate-800"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      添加統計
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowThemeDialog(false)} className="border-slate-700 text-slate-400 hover:bg-slate-800">取消</Button>
                <Button onClick={handleSaveTheme} disabled={isLoading} className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950">
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 新增區塊對話框 */}
      <Dialog open={showNewSectionDialog} onOpenChange={setShowNewSectionDialog}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-200 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-amber-400">新增區塊</DialogTitle>
          </DialogHeader>
          {selectedSection && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-slate-400">區塊類型</Label>
                <select value={selectedSection.type} onChange={(e) => setSelectedSection({ ...selectedSection, type: e.target.value as any })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200">
                  <option value="intro">簡介</option>
                  <option value="methods">方法</option>
                  <option value="theory">理論</option>
                  <option value="evidence">實證</option>
                  <option value="cases">案例</option>
                  <option value="sources">來源</option>
                </select>
              </div>
              <div>
                <Label className="text-slate-400">標題 <span className="text-red-400">*</span></Label>
                <Input value={selectedSection.title} onChange={(e) => setSelectedSection({ ...selectedSection, title: e.target.value })} className="bg-slate-950 border-slate-700 text-slate-200" placeholder="例如：什麼是清醒夢" />
              </div>
              <div>
                <Label className="text-slate-400">內容</Label>
                <Textarea value={selectedSection.content} onChange={(e) => setSelectedSection({ ...selectedSection, content: e.target.value })} className="bg-slate-950 border-slate-700 text-slate-200 font-mono text-sm" rows={15} placeholder="輸入區塊內容..." />
                <p className="text-xs text-slate-600 mt-2">使用【標題】格式創建小標題，使用 - 創建列表項</p>
              </div>
              
              {/* 引用管理 */}
              <div className="border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-slate-400">引用列表 ({citations.length})</Label>
                  <Button onClick={handleAddCitation} variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:bg-slate-800">
                    <Plus className="w-3 h-3 mr-1" />
                    添加引用
                  </Button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {citations.map((citation) => (
                    <div key={citation.id} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <div className="flex-1 min-w-0">
                        <span className="text-amber-400 font-bold mr-2">[{citation.number}]</span>
                        <span className="text-slate-400 text-sm truncate">{citation.title}</span>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        <button onClick={() => handleEditCitation(citation)} className="p-1.5 rounded text-slate-500 hover:text-amber-400 hover:bg-amber-500/10">
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleDeleteCitation(citation.id)} className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {citations.length === 0 && <p className="text-slate-600 text-sm text-center py-4">暫無引用</p>}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowNewSectionDialog(false)} className="border-slate-700 text-slate-400 hover:bg-slate-800">取消</Button>
                <Button onClick={handleSaveNewSection} disabled={!selectedSection.title || isLoading} className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950">
                  <Save className="w-4 h-4 mr-2" />
                  創建
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 編輯區塊對話框 */}
      <Dialog open={showSectionDialog} onOpenChange={setShowSectionDialog}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-200 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-amber-400">編輯區塊：{selectedSection?.title}</DialogTitle>
          </DialogHeader>
          {selectedSection && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-slate-400">區塊類型</Label>
                <select value={selectedSection.type} onChange={(e) => setSelectedSection({ ...selectedSection, type: e.target.value as any })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200">
                  <option value="intro">簡介</option>
                  <option value="methods">方法</option>
                  <option value="theory">理論</option>
                  <option value="evidence">實證</option>
                  <option value="cases">案例</option>
                  <option value="sources">來源</option>
                </select>
              </div>
              <div>
                <Label className="text-slate-400">標題</Label>
                <Input value={selectedSection.title} onChange={(e) => setSelectedSection({ ...selectedSection, title: e.target.value })} className="bg-slate-950 border-slate-700 text-slate-200" />
              </div>
              <div>
                <Label className="text-slate-400">內容</Label>
                <Textarea value={selectedSection.content} onChange={(e) => setSelectedSection({ ...selectedSection, content: e.target.value })} className="bg-slate-950 border-slate-700 text-slate-200 font-mono text-sm" rows={15} />
                <p className="text-xs text-slate-600 mt-2">使用【標題】格式創建小標題，使用 - 創建列表項</p>
              </div>
              
              {/* 引用管理 */}
              <div className="border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-slate-400">引用列表 ({citations.length})</Label>
                  <Button onClick={handleAddCitation} variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:bg-slate-800">
                    <Plus className="w-3 h-3 mr-1" />
                    添加引用
                  </Button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {citations.map((citation) => (
                    <div key={citation.id} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <div className="flex-1 min-w-0">
                        <span className="text-amber-400 font-bold mr-2">[{citation.number}]</span>
                        <span className="text-slate-400 text-sm truncate">{citation.title}</span>
                        {citation.author && <span className="text-slate-600 text-xs ml-2">- {citation.author}</span>}
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        <button onClick={() => handleEditCitation(citation)} className="p-1.5 rounded text-slate-500 hover:text-amber-400 hover:bg-amber-500/10">
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleDeleteCitation(citation.id)} className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {citations.length === 0 && <p className="text-slate-600 text-sm text-center py-4">暫無引用</p>}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowSectionDialog(false)} className="border-slate-700 text-slate-400 hover:bg-slate-800">取消</Button>
                <Button onClick={handleSaveSection} disabled={isLoading} className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950">
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 引用編輯對話框 */}
      <Dialog open={showCitationDialog} onOpenChange={setShowCitationDialog}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-200 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-amber-400">
              {selectedCitation?.id && citations.find(c => c.id === selectedCitation.id) ? '編輯引用' : '新增引用'}
            </DialogTitle>
          </DialogHeader>
          {selectedCitation && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-slate-400">編號</Label>
                <Input type="number" value={selectedCitation.number} onChange={(e) => setSelectedCitation({ ...selectedCitation, number: parseInt(e.target.value) || 1 })} className="bg-slate-950 border-slate-700 text-slate-200" />
              </div>
              <div>
                <Label className="text-slate-400">標題 <span className="text-red-400">*</span></Label>
                <Input value={selectedCitation.title} onChange={(e) => setSelectedCitation({ ...selectedCitation, title: e.target.value })} className="bg-slate-950 border-slate-700 text-slate-200" placeholder="文獻標題" />
              </div>
              <div>
                <Label className="text-slate-400">作者</Label>
                <Input value={selectedCitation.author || ''} onChange={(e) => setSelectedCitation({ ...selectedCitation, author: e.target.value })} className="bg-slate-950 border-slate-700 text-slate-200" placeholder="例如：LaBerge, S." />
              </div>
              <div>
                <Label className="text-slate-400">出版物</Label>
                <Input value={selectedCitation.publication || ''} onChange={(e) => setSelectedCitation({ ...selectedCitation, publication: e.target.value })} className="bg-slate-950 border-slate-700 text-slate-200" placeholder="例如：Sleep" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-slate-400">年份</Label>
                  <Input value={selectedCitation.year || ''} onChange={(e) => setSelectedCitation({ ...selectedCitation, year: e.target.value })} className="bg-slate-950 border-slate-700 text-slate-200" placeholder="2024" />
                </div>
                <div>
                  <Label className="text-slate-400">頁碼</Label>
                  <Input value={selectedCitation.page || ''} onChange={(e) => setSelectedCitation({ ...selectedCitation, page: e.target.value })} className="bg-slate-950 border-slate-700 text-slate-200" placeholder="p.123" />
                </div>
                <div>
                  <Label className="text-slate-400">行號</Label>
                  <Input value={selectedCitation.line || ''} onChange={(e) => setSelectedCitation({ ...selectedCitation, line: e.target.value })} className="bg-slate-950 border-slate-700 text-slate-200" placeholder="l.45" />
                </div>
              </div>
              <div>
                <Label className="text-slate-400">URL</Label>
                <Input value={selectedCitation.url || ''} onChange={(e) => setSelectedCitation({ ...selectedCitation, url: e.target.value })} className="bg-slate-950 border-slate-700 text-slate-200" placeholder="https://..." />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="verified" checked={selectedCitation.verified || false} onChange={(e) => setSelectedCitation({ ...selectedCitation, verified: e.target.checked })} className="rounded border-slate-700 bg-slate-950" />
                <Label htmlFor="verified" className="text-slate-400">已驗證</Label>
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowCitationDialog(false)} className="border-slate-700 text-slate-400 hover:bg-slate-800">取消</Button>
                <Button onClick={handleSaveCitation} disabled={!selectedCitation.title} className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950">
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 投稿審核對話框 */}
      <Dialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-200 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-amber-400">審核投稿</DialogTitle>
          </DialogHeader>
          {viewingSubmission && (
            <div className="space-y-6 py-4">
              <div>
                <Label className="text-slate-500 text-sm">標題</Label>
                <p className="text-slate-300 text-lg">{viewingSubmission.title}</p>
              </div>
              <div>
                <Label className="text-slate-500 text-sm">內容</Label>
                <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 mt-1 max-h-64 overflow-y-auto">
                  <p className="text-slate-400 whitespace-pre-wrap">{viewingSubmission.content}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-500 text-sm">投稿人</Label>
                  <p className="text-slate-300">{viewingSubmission.submitterName}</p>
                </div>
                <div>
                  <Label className="text-slate-500 text-sm">電子郵件</Label>
                  <p className="text-slate-300">{viewingSubmission.submitterEmail || '無'}</p>
                </div>
              </div>
              {viewingSubmission.status === 'pending' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-slate-400">管理員備註</Label>
                    <Textarea value={submissionNote} onChange={(e) => setSubmissionNote(e.target.value)} placeholder="輸入備註（可選）..." rows={3} className="bg-slate-950 border-slate-700 text-slate-200 resize-none" />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setShowSubmissionDialog(false)} className="border-slate-700 text-slate-400 hover:bg-slate-800">取消</Button>
                    <Button onClick={handleRejectSubmission} disabled={isLoading} className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
                      <XCircle className="w-4 h-4 mr-2" />
                      拒絕
                    </Button>
                    <Button onClick={handleApproveSubmission} disabled={isLoading} className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      通過
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 反饋回覆對話框 */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-amber-400">回覆反饋</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {replyingFeedback && (
              <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                <div className="text-sm text-slate-500 mb-2">{replyingFeedback.name} 的反饋：</div>
                <p className="text-slate-400">{replyingFeedback.content}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-slate-400">回覆內容</Label>
              <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="輸入回覆內容..." rows={4} className="bg-slate-950 border-slate-700 text-slate-200 resize-none" />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowReplyDialog(false)} className="border-slate-700 text-slate-400 hover:bg-slate-800">取消</Button>
              <Button onClick={handleSaveReply} disabled={!replyText.trim()} className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950">
                <Save className="w-4 h-4 mr-2" />
                保存回覆
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 導入對話框 */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-amber-400">導入數據</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-400">選擇文件</Label>
              <Input ref={fileInputRef} type="file" accept=".json" onChange={handleImportThemes} className="bg-slate-950 border-slate-700 text-slate-200" />
              <p className="text-xs text-slate-600">支持 JSON 格式，會覆蓋現有數據</p>
            </div>
            {importError && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"><p className="text-red-400 text-sm">{importError}</p></div>}
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => { setShowImportDialog(false); setImportError(''); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="border-slate-700 text-slate-400 hover:bg-slate-800">取消</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
