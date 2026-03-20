// 脚本：将TypeScript数据导出为JSON
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取useDataStore.ts文件
const dataStorePath = path.join(__dirname, '../src/hooks/useDataStore.ts');
const content = fs.readFileSync(dataStorePath, 'utf-8');

// 提取initialContent数组
const startMarker = 'const initialContent: ContentItem[] = ';
const endMarker = '];\n\nconst initialFeedback';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find content array');
  process.exit(1);
}

let arrayContent = content.substring(startIdx + startMarker.length, endIdx + 1);

// 转换为有效的JSON
// 1. 移除类型断言
arrayContent = arrayContent.replace(/as ContentCategory/g, '');

// 2. 处理模板字符串（反引号）
// 将反引号内容转换为双引号字符串
arrayContent = arrayContent.replace(/`([^`]*)`/gs, (match, content) => {
  // 转义双引号和反斜杠
  let escaped = content
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
  return `"${escaped}"`;
});

// 3. 将单引号转换为双引号
arrayContent = arrayContent.replace(/'([^']*)'/g, '"$1"');

// 4. 确保属性名有双引号
arrayContent = arrayContent.replace(/(\w+):/g, '"$1":');

// 5. 移除尾随逗号
arrayContent = arrayContent.replace(/,(\s*[}\]])/g, '$1');

// 6. 修复多余的空格
arrayContent = arrayContent.replace(/\s+/g, ' ');

// 尝试解析
let data;
try {
  data = JSON.parse(arrayContent);
  console.log(`Successfully parsed ${data.length} items`);
} catch (e) {
  console.error('Parse error:', e.message);
  console.log('Content around error:', arrayContent.substring(Math.max(0, e.position - 100), e.position + 100));
  process.exit(1);
}

// 添加新字段（如果缺失）
data.forEach(item => {
  // 添加标签字段
  if (!item.tags) item.tags = [];
  
  // 添加来源类型
  if (item.sources) {
    item.sources.forEach(source => {
      if (!source.type) {
        // 根据来源推断类型
        if (source.publication?.includes('Journal') || source.publication?.includes('journals')) {
          source.type = 'journal';
        } else if (source.notes?.includes('個人體驗')) {
          source.type = 'experience';
        } else if (source.publication?.includes('Documentary') || source.title?.includes('紀錄片')) {
          source.type = 'documentary';
        } else if (source.url) {
          source.type = 'website';
        } else {
          source.type = 'book';
        }
      }
      if (!source.verified) source.verified = false;
    });
  }
  
  // 添加评分字段
  if (!item.viewCount) item.viewCount = 0;
  if (!item.ratingCount) item.ratingCount = 0;
  if (!item.averageQualityScore) item.averageQualityScore = 0;
  if (!item.averageSourceReliability) item.averageSourceReliability = 0;
  
  // 添加争议标记
  if (item.controversial === undefined) item.controversial = false;
});

// 保存到文件
const outputPath = path.join(__dirname, '../public/data/content.json');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`Data exported to ${outputPath}`);

// 同时创建一个压缩版本
const minifiedPath = path.join(__dirname, '../public/data/content.min.json');
fs.writeFileSync(minifiedPath, JSON.stringify(data), 'utf-8');
console.log(`Minified data exported to ${minifiedPath}`);
