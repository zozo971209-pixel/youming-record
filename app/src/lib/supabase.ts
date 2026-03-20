import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase 環境變數未設置，將使用 localStorage 模式');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// 檢查是否使用 Supabase
export const isSupabaseEnabled = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};

// 管理員登入
export const adminLogin = async (password: string) => {
  if (!isSupabaseEnabled()) {
    // 本地模式驗證
    return password === '@Zozo88888888';
  }

  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('password_hash')
      .eq('id', 1)
      .single();

    if (error) throw error;
    
    // 簡單密碼比對（實際應使用 bcrypt）
    return data?.password_hash === password;
  } catch (err) {
    console.error('登入失敗:', err);
    return false;
  }
};

// 獲取主題列表
export const getThemes = async () => {
  if (!isSupabaseEnabled()) {
    const { themes } = await import('@/data/themes');
    return themes;
  }

  const { data, error } = await supabase
    .from('themes')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data || [];
};

// 獲取主題詳情（包含區塊和引用）
export const getThemeWithDetails = async (themeId: string) => {
  if (!isSupabaseEnabled()) {
    const { themes } = await import('@/data/themes');
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return null;
    
    // 從 localStorage 獲取區塊
    const sections = JSON.parse(localStorage.getItem(`sections_${themeId}`) || '[]');
    const citations = JSON.parse(localStorage.getItem(`citations_${themeId}`) || '[]');
    const stats = JSON.parse(localStorage.getItem(`stats_${themeId}`) || 'null');
    
    return {
      ...theme,
      sections: sections.length > 0 ? sections : theme.sections || [],
      citations: citations.length > 0 ? citations : theme.citations || [],
      stats: stats || theme.stats,
    };
  }

  const { data: theme, error: themeError } = await supabase
    .from('themes')
    .select('*')
    .eq('id', themeId)
    .single();

  if (themeError) throw themeError;

  const [{ data: sections }, { data: citations }, { data: stats }] = await Promise.all([
    supabase.from('sections').select('*').eq('theme_id', themeId).order('order_index'),
    supabase.from('citations').select('*').eq('theme_id', themeId),
    supabase.from('theme_stats').select('*').eq('theme_id', themeId).single(),
  ]);

  return {
    ...theme,
    sections: sections || [],
    citations: citations || [],
    stats: stats || null,
  };
};

// 創建主題
export const createTheme = async (theme: any) => {
  if (!isSupabaseEnabled()) {
    const themes = JSON.parse(localStorage.getItem('themes') || '[]');
    themes.push(theme);
    localStorage.setItem('themes', JSON.stringify(themes));
    return theme;
  }

  const { data, error } = await supabase
    .from('themes')
    .insert(theme)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 更新主題
export const updateTheme = async (themeId: string, updates: any) => {
  if (!isSupabaseEnabled()) {
    const themes = JSON.parse(localStorage.getItem('themes') || '[]');
    const index = themes.findIndex((t: any) => t.id === themeId);
    if (index >= 0) {
      themes[index] = { ...themes[index], ...updates };
      localStorage.setItem('themes', JSON.stringify(themes));
    }
    return themes[index];
  }

  const { data, error } = await supabase
    .from('themes')
    .update(updates)
    .eq('id', themeId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 刪除主題
export const deleteTheme = async (themeId: string) => {
  if (!isSupabaseEnabled()) {
    const themes = JSON.parse(localStorage.getItem('themes') || '[]');
    const filtered = themes.filter((t: any) => t.id !== themeId);
    localStorage.setItem('themes', JSON.stringify(filtered));
    return true;
  }

  const { error } = await supabase
    .from('themes')
    .delete()
    .eq('id', themeId);

  if (error) throw error;
  return true;
};

// 區塊操作
export const createSection = async (section: any) => {
  if (!isSupabaseEnabled()) {
    const sections = JSON.parse(localStorage.getItem(`sections_${section.theme_id}`) || '[]');
    sections.push({ ...section, id: crypto.randomUUID() });
    localStorage.setItem(`sections_${section.theme_id}`, JSON.stringify(sections));
    return section;
  }

  const { data, error } = await supabase
    .from('sections')
    .insert(section)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateSection = async (sectionId: string, updates: any) => {
  if (!isSupabaseEnabled()) {
    // 本地模式更新
    const allKeys = Object.keys(localStorage).filter(k => k.startsWith('sections_'));
    for (const key of allKeys) {
      const sections = JSON.parse(localStorage.getItem(key) || '[]');
      const index = sections.findIndex((s: any) => s.id === sectionId);
      if (index >= 0) {
        sections[index] = { ...sections[index], ...updates };
        localStorage.setItem(key, JSON.stringify(sections));
        return sections[index];
      }
    }
    return null;
  }

  const { data, error } = await supabase
    .from('sections')
    .update(updates)
    .eq('id', sectionId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteSection = async (sectionId: string) => {
  if (!isSupabaseEnabled()) {
    const allKeys = Object.keys(localStorage).filter(k => k.startsWith('sections_'));
    for (const key of allKeys) {
      const sections = JSON.parse(localStorage.getItem(key) || '[]');
      const filtered = sections.filter((s: any) => s.id !== sectionId);
      localStorage.setItem(key, JSON.stringify(filtered));
    }
    return true;
  }

  const { error } = await supabase
    .from('sections')
    .delete()
    .eq('id', sectionId);

  if (error) throw error;
  return true;
};

// 引用操作
export const createCitation = async (citation: any) => {
  if (!isSupabaseEnabled()) {
    const citations = JSON.parse(localStorage.getItem(`citations_${citation.theme_id}`) || '[]');
    citations.push({ ...citation, id: crypto.randomUUID() });
    localStorage.setItem(`citations_${citation.theme_id}`, JSON.stringify(citations));
    return citation;
  }

  const { data, error } = await supabase
    .from('citations')
    .insert(citation)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCitation = async (citationId: string, updates: any) => {
  if (!isSupabaseEnabled()) {
    const allKeys = Object.keys(localStorage).filter(k => k.startsWith('citations_'));
    for (const key of allKeys) {
      const citations = JSON.parse(localStorage.getItem(key) || '[]');
      const index = citations.findIndex((c: any) => c.id === citationId);
      if (index >= 0) {
        citations[index] = { ...citations[index], ...updates };
        localStorage.setItem(key, JSON.stringify(citations));
        return citations[index];
      }
    }
    return null;
  }

  const { data, error } = await supabase
    .from('citations')
    .update(updates)
    .eq('id', citationId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCitation = async (citationId: string) => {
  if (!isSupabaseEnabled()) {
    const allKeys = Object.keys(localStorage).filter(k => k.startsWith('citations_'));
    for (const key of allKeys) {
      const citations = JSON.parse(localStorage.getItem(key) || '[]');
      const filtered = citations.filter((c: any) => c.id !== citationId);
      localStorage.setItem(key, JSON.stringify(filtered));
    }
    return true;
  }

  const { error } = await supabase
    .from('citations')
    .delete()
    .eq('id', citationId);

  if (error) throw error;
  return true;
};

// 統計數據操作
export const updateStats = async (themeId: string, stats: any) => {
  if (!isSupabaseEnabled()) {
    localStorage.setItem(`stats_${themeId}`, JSON.stringify({ ...stats, theme_id: themeId }));
    return stats;
  }

  const { data, error } = await supabase
    .from('theme_stats')
    .upsert({ ...stats, theme_id: themeId })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 投稿操作
export const createSubmission = async (submission: any) => {
  if (!isSupabaseEnabled()) {
    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    submissions.push({ ...submission, id: crypto.randomUUID(), status: 'pending', created_at: new Date().toISOString() });
    localStorage.setItem('submissions', JSON.stringify(submissions));
    return submission;
  }

  const { data, error } = await supabase
    .from('submissions')
    .insert(submission)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getSubmissions = async () => {
  if (!isSupabaseEnabled()) {
    return JSON.parse(localStorage.getItem('submissions') || '[]');
  }

  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updateSubmissionStatus = async (submissionId: string, status: string) => {
  if (!isSupabaseEnabled()) {
    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    const index = submissions.findIndex((s: any) => s.id === submissionId);
    if (index >= 0) {
      submissions[index].status = status;
      localStorage.setItem('submissions', JSON.stringify(submissions));
    }
    return submissions[index];
  }

  const { data, error } = await supabase
    .from('submissions')
    .update({ status })
    .eq('id', submissionId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 討論區操作
export const createDiscussion = async (discussion: any) => {
  if (!isSupabaseEnabled()) {
    const discussions = JSON.parse(localStorage.getItem('discussions') || '[]');
    discussions.push({ 
      ...discussion, 
      id: crypto.randomUUID(), 
      created_at: new Date().toISOString(),
      replies: 0 
    });
    localStorage.setItem('discussions', JSON.stringify(discussions));
    return discussion;
  }

  const { data, error } = await supabase
    .from('discussions')
    .insert(discussion)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getDiscussions = async () => {
  if (!isSupabaseEnabled()) {
    return JSON.parse(localStorage.getItem('discussions') || '[]');
  }

  const { data, error } = await supabase
    .from('discussions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createReply = async (reply: any) => {
  if (!isSupabaseEnabled()) {
    const replies = JSON.parse(localStorage.getItem(`replies_${reply.discussion_id}`) || '[]');
    replies.push({ ...reply, id: crypto.randomUUID(), created_at: new Date().toISOString() });
    localStorage.setItem(`replies_${reply.discussion_id}`, JSON.stringify(replies));
    
    // 更新討論回覆數
    const discussions = JSON.parse(localStorage.getItem('discussions') || '[]');
    const index = discussions.findIndex((d: any) => d.id === reply.discussion_id);
    if (index >= 0) {
      discussions[index].replies = (discussions[index].replies || 0) + 1;
      localStorage.setItem('discussions', JSON.stringify(discussions));
    }
    
    return reply;
  }

  const { data, error } = await supabase
    .from('replies')
    .insert(reply)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getReplies = async (discussionId: string) => {
  if (!isSupabaseEnabled()) {
    return JSON.parse(localStorage.getItem(`replies_${discussionId}`) || '[]');
  }

  const { data, error } = await supabase
    .from('replies')
    .select('*')
    .eq('discussion_id', discussionId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};
