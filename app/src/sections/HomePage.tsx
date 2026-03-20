import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Eye } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in-element');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          <div className="text-center space-y-10">
            {/* Badge */}
            <div className="fade-in-element inline-flex items-center px-4 py-2 rounded-full bg-slate-900 border border-slate-700 text-slate-400 text-sm">
              <Sparkles className="w-4 h-4 mr-2 text-amber-400" />
              意識的邊界，遠比想像更寬廣
            </div>

            {/* Title */}
            <h1 className="fade-in-element text-5xl md:text-7xl font-bold tracking-tight" style={{ animationDelay: '100ms' }}>
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                幽明錄
              </span>
            </h1>

            {/* Subtitle */}
            <p className="fade-in-element text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: '200ms' }}>
              那些遊走於可見與不可見之間的知識<br />
              等待被重新發現
            </p>

            {/* Description */}
            <p className="fade-in-element text-slate-500 max-w-xl mx-auto leading-relaxed" style={{ animationDelay: '300ms' }}>
              清醒夢、拙火定、薩滿旅程——這些古老的意識技術，正被現代科學重新驗證。
              我們收集方法、梳理理論、呈現實證，讓每一條線索都有跡可循。
            </p>

            {/* CTA Buttons */}
            <div className="fade-in-element flex flex-col sm:flex-row items-center justify-center gap-4 pt-4" style={{ animationDelay: '400ms' }}>
              <Button
                size="lg"
                onClick={() => onNavigate('themes')}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-semibold px-8 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all"
              >
                開始探索
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate('feedback')}
                className="border-slate-700 text-slate-400 hover:bg-slate-900 hover:text-slate-200 hover:border-slate-600 px-8 transition-all"
              >
                聯絡我們
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="py-24 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="fade-in-element text-center space-y-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-700" />
              <Eye className="w-5 h-5 text-slate-600" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-700" />
            </div>
            
            <blockquote className="text-2xl md:text-3xl text-slate-300 font-light leading-relaxed">
              「幽」是隱藏，是意識深處尚未被照亮的地帶；<br />
              「明」是顯現，是方法、理論與實證交織出的理解。
            </blockquote>
            
            <p className="text-slate-500 max-w-2xl mx-auto">
              我們相信，人類對自身意識的了解才剛剛開始。
              那些曾被歸為神秘主義的體驗，正逐漸被神經科學、量子物理學和意識研究納入視野。
            </p>
          </div>
        </div>
      </div>

      {/* Connection Section - Final Words */}
      <div className="py-24 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-200 mb-6">
            方法背後有理論，理論有實證支撐
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed max-w-2xl mx-auto">
            在幽明錄，每個方法都不是孤立的存在。
            你可以從「清醒夢誘導」出發，了解它背後的「協調客觀還原理論」，
            再查看「互動式做夢實驗」如何驗證這一切。
          </p>
        </div>
      </div>
    </div>
  );
}
