/**
 * 數據遷移腳本：將 localStorage 數據遷移到 Supabase
 * 
 * 使用方法：
 * 1. 確保已設置環境變數 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY
 * 2. 運行：npx tsx scripts/migrate-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import { themes as defaultThemes } from '../src/data/themes';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('錯誤：請設置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY 環境變數');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateThemes() {
  console.log('開始遷移主題數據...');
  
  for (const theme of defaultThemes) {
    console.log(`遷移主題：${theme.title}`);
    
    // 1. 創建主題
    const { data: themeData, error: themeError } = await supabase
      .from('themes')
      .upsert({
        id: theme.slug,
        title: theme.title,
        subtitle: theme.subtitle,
        description: theme.description,
        icon: theme.icon,
        color: theme.color,
        order_index: defaultThemes.indexOf(theme),
      })
      .select()
      .single();
    
    if (themeError) {
      console.error(`創建主題失敗 ${theme.title}:`, themeError);
      continue;
    }
    
    console.log(`  ✓ 主題創建成功：${themeData.id}`);
    
    // 2. 創建統計數據
    if (theme.stats && theme.stats.length > 0) {
      const statsMap: Record<string, any> = {
        '誘導成功率': 'success_rate',
        '相關研究': 'research_count',
        '實驗參與者': 'participant_count',
        '平均持續時間': 'avg_duration',
      };
      
      const statsData: any = {
        theme_id: theme.slug,
      };
      
      for (const stat of theme.stats) {
        const key = statsMap[stat.label];
        if (key) {
          if (key === 'avg_duration') {
            statsData[key] = stat.value;
          } else {
            statsData[key] = parseFloat(stat.value) || 0;
          }
        }
      }
      
      const { error: statsError } = await supabase
        .from('theme_stats')
        .upsert(statsData);
      
      if (statsError) {
        console.error(`  ✗ 統計數據創建失敗:`, statsError);
      } else {
        console.log(`  ✓ 統計數據創建成功`);
      }
    }
    
    // 3. 創建區塊
    if (theme.sections && theme.sections.length > 0) {
      for (let i = 0; i < theme.sections.length; i++) {
        const section = theme.sections[i];
        const { data: sectionData, error: sectionError } = await supabase
          .from('sections')
          .upsert({
            id: section.id,
            theme_id: theme.slug,
            type: section.type,
            title: section.title,
            content: section.content,
            order_index: i,
          })
          .select()
          .single();
        
        if (sectionError) {
          console.error(`  ✗ 區塊創建失敗 ${section.title}:`, sectionError);
          continue;
        }
        
        console.log(`  ✓ 區塊創建成功：${section.title}`);
        
        // 4. 創建引用
        if (section.citations && section.citations.length > 0) {
          for (const citation of section.citations) {
            const { error: citationError } = await supabase
              .from('citations')
              .upsert({
                id: citation.id,
                theme_id: theme.slug,
                section_id: section.id,
                number: citation.number,
                title: citation.title,
                author: citation.author,
                year: parseInt(citation.year) || new Date().getFullYear(),
                source: citation.publication,
                page: citation.page,
                url: citation.url,
              });
            
            if (citationError) {
              console.error(`    ✗ 引用創建失敗 ${citation.title}:`, citationError);
            } else {
              console.log(`    ✓ 引用創建成功：[${citation.number}] ${citation.title.substring(0, 30)}...`);
            }
          }
        }
      }
    }
  }
  
  console.log('\n遷移完成！');
}

async function migrateAdminSettings() {
  console.log('\n設置管理員密碼...');
  
  const { error } = await supabase
    .from('admin_settings')
    .upsert({
      id: 1,
      password_hash: '@Zozo88888888',
    });
  
  if (error) {
    console.error('設置管理員密碼失敗:', error);
  } else {
    console.log('✓ 管理員密碼設置成功');
  }
}

async function main() {
  console.log('=== 幽明錄數據遷移工具 ===\n');
  
  try {
    await migrateThemes();
    await migrateAdminSettings();
    console.log('\n所有數據遷移完成！');
  } catch (error) {
    console.error('遷移過程中發生錯誤:', error);
    process.exit(1);
  }
}

main();
