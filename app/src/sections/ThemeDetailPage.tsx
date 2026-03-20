import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, BookOpen, FlaskConical, Lightbulb, FileText, Bookmark, ExternalLink } from 'lucide-react';
import type { Theme, Citation } from '@/data/themes';

interface ThemeDetailPageProps {
  theme: Theme;
  onNavigate: (page: string) => void;
  onBack: () => void;
}

const sectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  intro: BookOpen,
  methods: FlaskConical,
  theory: Lightbulb,
  evidence: FileText,
  cases: Bookmark,
  sources: ExternalLink,
};

const sectionLabels: Record<string, string> = {
  intro: '簡介',
  methods: '方法',
  theory: '理論',
  evidence: '實證',
  cases: '案例',
  sources: '來源',
};

// 引用標註組件（預留給未來使用）
// function CitationMarker({ citation, onClick }: { citation: Citation; onClick: () => void }) {
//   return (
//     <sup
//       onClick={onClick}
//       className="inline-flex items-center justify-center w-4 h-4 text-[10px] bg-amber-500/20 text-amber-400 rounded cursor-pointer hover:bg-amber-500/30 transition-colors ml-0.5"
//       title={citation.title}
//     >
//       {citation.number}
//     </sup>
//   );
// }

// 引用彈出詳情
function CitationPopup({ citation, onClose }: { citation: Citation; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <span className="text-2xl font-bold text-amber-400">[{citation.number}]</span>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">✕</button>
        </div>
        <h3 className="text-lg font-semibold text-slate-200 mb-3">{citation.title}</h3>
        <div className="space-y-2 text-sm text-slate-400">
          {citation.author && <p><span className="text-slate-500">作者：</span>{citation.author}</p>}
          {citation.publication && <p><span className="text-slate-500">出版：</span>{citation.publication}</p>}
          {citation.year && <p><span className="text-slate-500">年份：</span>{citation.year}</p>}
          {citation.page && <p><span className="text-slate-500">頁碼：</span>{citation.page}</p>}
          {citation.line && <p><span className="text-slate-500">行號：</span>{citation.line}</p>}
        </div>
        {citation.url && (
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-4 text-amber-400 hover:text-amber-300 text-sm"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            查看來源
          </a>
        )}
      </div>
    </div>
  );
}

// 引用標註處理函數（預留給未來使用）
// function renderContentWithCitations(content: string, citations: Citation[] = []) {
//   const citationMap = new Map(citations.map(c => [c.number, c]));
//   const parts = content.split(/(\[\d+\])/g);
//   return parts.map((part, index) => {
//     const match = part.match(/\[(\d+)\]/);
//     if (match) {
//       const num = parseInt(match[1]);
//       const citation = citationMap.get(num);
//       if (citation) {
//         return <CitationMarker key={index} citation={citation} onClick={() => {}} />;
//       }
//     }
//     return <span key={index}>{part}</span>;
//   });
// }

export function ThemeDetailPage({ theme, onBack }: ThemeDetailPageProps) {
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [showNav, setShowNav] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // 滾動監聽，更新當前區塊
  useEffect(() => {
    const handleScroll = () => {
      const sections = theme.sections.map(s => document.getElementById(s.id));
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(section.id);
          break;
        }
      }

      setShowNav(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [theme.sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const allCitations = theme.sections.flatMap(s => s.citations || []);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Fixed Navigation */}
      {showNav && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="flex items-center text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span className="text-sm">{theme.title}</span>
              </button>
              <div className="flex items-center space-x-1">
                {theme.sections.map((section) => {
                  const Icon = sectionIcons[section.type];
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 mr-1.5" />
                      {sectionLabels[section.type]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className={`relative overflow-hidden ${showNav ? 'pt-16' : ''}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.color} opacity-10`} />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="inline-flex items-center text-slate-500 hover:text-slate-300 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回主題列表
          </button>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-200 mb-2">
              {theme.title}
            </h1>
            <p className="text-xl text-slate-500">{theme.subtitle}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {theme.stats.map((stat, index) => (
              <div key={index} className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                <div className="text-2xl md:text-3xl font-bold text-slate-200">
                  {stat.value}
                  <span className="text-sm text-slate-500 ml-1">{stat.unit}</span>
                </div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="text-lg text-slate-400 max-w-2xl">
            {theme.description}
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div ref={contentRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {theme.sections.map((section) => {
          const Icon = sectionIcons[section.type];
          
          return (
            <section
              key={section.id}
              id={section.id}
              className="mb-16 scroll-mt-24"
            >
              {/* Section Header */}
              <div className="flex items-center mb-6">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${theme.color} flex items-center justify-center mr-4`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-200">{section.title}</h2>
              </div>

              {/* Section Content */}
              <div className="prose prose-invert prose-slate max-w-none">
                {section.content.split('\n\n').map((paragraph, pIndex) => {
                  // 處理標題
                  if (paragraph.startsWith('【') && paragraph.endsWith('】')) {
                    return (
                      <h3 key={pIndex} className="text-xl font-semibold text-amber-400 mt-8 mb-4">
                        {paragraph.slice(1, -1)}
                      </h3>
                    );
                  }
                  
                  // 處理列表
                  if (paragraph.includes('\n- ')) {
                    const [title, ...items] = paragraph.split('\n');
                    return (
                      <div key={pIndex} className="my-4">
                        {title && !title.startsWith('-') && (
                          <p className="text-slate-300 mb-2">{title}</p>
                        )}
                        <ul className="list-disc list-inside space-y-1 text-slate-400">
                          {items.filter(i => i.startsWith('- ')).map((item, iIndex) => (
                            <li key={iIndex}>{item.slice(2)}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  }

                  // 處理分隔線
                  if (paragraph === '---') {
                    return <hr key={pIndex} className="border-slate-800 my-8" />;
                  }

                  // 普通段落
                  return (
                    <p key={pIndex} className="text-slate-400 leading-relaxed mb-4 whitespace-pre-line">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Section Citations */}
              {section.citations && section.citations.length > 0 && (
                <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <h4 className="text-sm font-semibold text-slate-500 mb-3">本節引用</h4>
                  <div className="flex flex-wrap gap-2">
                    {section.citations.map((citation) => (
                      <button
                        key={citation.id}
                        onClick={() => setSelectedCitation(citation)}
                        className="inline-flex items-center px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-400 hover:text-amber-400 transition-colors"
                      >
                        <span className="text-amber-500 mr-1">[{citation.number}]</span>
                        <span className="truncate max-w-[200px]">{citation.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}

        {/* All Citations Section */}
        {allCitations.length > 0 && (
          <section className="mt-16 pt-8 border-t border-slate-800">
            <h2 className="text-2xl font-bold text-slate-200 mb-6">完整引用列表</h2>
            <div className="space-y-4">
              {allCitations.map((citation) => (
                <div key={citation.id} className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <div className="flex items-start">
                    <span className="text-amber-400 font-bold mr-3">[{citation.number}]</span>
                    <div>
                      <p className="text-slate-300 font-medium">{citation.title}</p>
                      <div className="text-sm text-slate-500 mt-1">
                        {citation.author && <span>{citation.author} · </span>}
                        {citation.publication && <span>{citation.publication} · </span>}
                        {citation.year && <span>{citation.year}</span>}
                        {(citation.page || citation.line) && (
                          <span className="text-slate-600">
                            {' '}({citation.page && `p.${citation.page}`}{citation.line && `, l.${citation.line}`})
                          </span>
                        )}
                      </div>
                      {citation.url && (
                        <a
                          href={citation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center mt-2 text-xs text-amber-400 hover:text-amber-300"
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
          </section>
        )}
      </div>

      {/* Citation Popup */}
      {selectedCitation && (
        <CitationPopup
          citation={selectedCitation}
          onClose={() => setSelectedCitation(null)}
        />
      )}
    </div>
  );
}
