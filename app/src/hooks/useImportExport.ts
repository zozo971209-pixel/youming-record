import { useCallback } from 'react';
import type { ContentItem, Feedback } from '@/types';

export function useImportExport() {
  // 導出為JSON
  const exportToJSON = useCallback((data: ContentItem[] | Feedback[], filename: string) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  // 導出為CSV
  const exportToCSV = useCallback((data: ContentItem[], filename: string) => {
    const headers = ['ID', '標題', '副標題', '分類', '內容', '標籤', '來源數量', '瀏覽量', '狀態', '創建日期', '更新日期'];
    
    const rows = data.map(item => [
      item.id,
      item.title,
      item.subtitle,
      item.category,
      item.content.replace(/"/g, '""'),
      (item.tags || []).join(';'),
      item.sources.length,
      item.viewCount || 0,
      item.status,
      item.createdAt,
      item.updatedAt
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  // 從JSON導入
  const importFromJSON = useCallback((file: File): Promise<ContentItem[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          
          if (Array.isArray(data)) {
            resolve(data as ContentItem[]);
          } else if (data.content && Array.isArray(data.content)) {
            resolve(data.content as ContentItem[]);
          } else {
            reject(new Error('無效的數據格式'));
          }
        } catch (error) {
          reject(new Error('解析JSON失敗'));
        }
      };
      
      reader.onerror = () => reject(new Error('讀取文件失敗'));
      reader.readAsText(file);
    });
  }, []);

  // 從CSV導入
  const importFromCSV = useCallback((file: File): Promise<Partial<ContentItem>[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const lines = content.split('\n');
          const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
          
          const items: Partial<ContentItem>[] = [];
          
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const item: Partial<ContentItem> = {};
            
            headers.forEach((header, index) => {
              const value = values[index];
              switch (header) {
                case '標題':
                  item.title = value;
                  break;
                case '副標題':
                  item.subtitle = value;
                  break;
                case '分類':
                  item.category = value as any;
                  break;
                case '內容':
                  item.content = value;
                  break;
                case '標籤':
                  item.tags = value.split(';').filter(t => t);
                  break;
                case '狀態':
                  item.status = value as any;
                  break;
              }
            });
            
            if (item.title) {
              items.push(item);
            }
          }
          
          resolve(items);
        } catch (error) {
          reject(new Error('解析CSV失敗'));
        }
      };
      
      reader.onerror = () => reject(new Error('讀取文件失敗'));
      reader.readAsText(file);
    });
  }, []);

  // 導出所有數據（備份）
  const exportAllData = useCallback((content: ContentItem[], feedback: Feedback[]) => {
    const backup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      content,
      feedback
    };
    
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `youming_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  return {
    exportToJSON,
    exportToCSV,
    importFromJSON,
    importFromCSV,
    exportAllData
  };
}
