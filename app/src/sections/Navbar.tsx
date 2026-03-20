import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Menu, X, User, LogOut, Shield, Loader2 } from 'lucide-react';

interface NavbarProps {
  isAdmin: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
  onAdminClick: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navbar({ isAdmin, onLoginClick, onLogout, onAdminClick, onNavigate, currentPage }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const navItems = [
    { id: 'home', label: '首頁' },
    { id: 'themes', label: '主題探索' },
    { id: 'forum', label: '討論區' },
    { id: 'submission', label: '投稿' },
    { id: 'favorites', label: '收藏' },
    { id: 'history', label: '歷史紀錄' },
    { id: 'feedback', label: '聯絡我們' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent group-hover:from-amber-300 group-hover:to-orange-400 transition-all">
              幽明錄
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === item.id
                    ? 'text-amber-400 bg-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {!isAdmin ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLoginClick}
                className="text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
              >
                <User className="w-4 h-4 mr-2" />
                管理員登入
              </Button>
            ) : (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdminMenu(!showAdminMenu)}
                  className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  管理
                </Button>
                
                {showAdminMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 rounded-lg shadow-xl border border-slate-700 py-1">
                    <button
                      onClick={() => {
                        onAdminClick();
                        setShowAdminMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      後台管理
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setShowAdminMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      退出登入
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800/50">
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-2 rounded-lg text-left text-sm font-medium transition-all duration-200 ${
                    currentPage === item.id
                      ? 'text-amber-400 bg-amber-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {!isAdmin ? (
                <button
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 rounded-lg text-left text-sm text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-colors"
                >
                  <User className="w-4 h-4 inline mr-2" />
                  管理員登入
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onAdminClick();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 rounded-lg text-left text-sm text-amber-400 hover:bg-amber-500/10 transition-colors"
                  >
                    <Shield className="w-4 h-4 inline mr-2" />
                    後台管理
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 rounded-lg text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    退出登入
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  password: string;
  onPasswordChange: (value: string) => void;
  onLogin: () => void;
  error: string;
  isLoading?: boolean;
}

export function LoginModal({ isOpen, onClose, password, onPasswordChange, onLogin, error, isLoading }: LoginModalProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      onLogin();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-slate-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-amber-400">管理員登入</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              請輸入管理員密碼
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="輸入密碼..."
              disabled={isLoading}
              className="bg-slate-950 border-slate-700 text-slate-200 placeholder:text-slate-600 focus:border-amber-500/50 disabled:opacity-50"
            />
          </div>
          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}
          <Button
            onClick={onLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-semibold disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                登入中...
              </>
            ) : (
              '登入'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
