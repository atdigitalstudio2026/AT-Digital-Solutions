import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { openWhatsAppChat } from '../utils/whatsapp';
import { 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  Menu, 
  X, 
  LayoutGrid, 
  Zap, 
  ShieldCheck, 
  LogOut,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentRoute, navigateTo, cartCount, user, logout } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActiveRoute = (name: string) => currentRoute.name === name;

  const handleNavClick = (route: string) => {
    navigateTo(route);
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  };

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#07070c]/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40 py-3.5'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('/')}
          className="flex items-center gap-3 text-left group focus:outline-none"
          id="nav-logo"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7c5cff] via-[#ff4fd8] to-[#00e0c6] flex items-center justify-center text-[#0a0a12] font-display font-bold text-sm tracking-tight shadow-md shadow-[#7c5cff]/30 group-hover:scale-105 transition-transform">
            AT
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              AT Digital Solution
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-[#00e0c6]/10 text-[#00e0c6] border border-[#00e0c6]/20 font-semibold">
                Fast v3.4
              </span>
            </span>
            <span className="text-[11px] text-[#9291ab] hidden sm:inline -mt-0.5">
              Solusi Software & Ekosistem Bisnis Modern
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleNavClick('/')}
            className={`text-sm font-medium transition-colors relative py-1 ${
              isActiveRoute('home')
                ? 'text-white font-semibold'
                : 'text-[#9291ab] hover:text-white'
            }`}
          >
            Beranda
            {isActiveRoute('home') && (
              <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7c5cff] to-[#00e0c6] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('/catalog')}
            className={`text-sm font-medium transition-colors relative py-1 flex items-center gap-1.5 ${
              isActiveRoute('catalog')
                ? 'text-white font-semibold'
                : 'text-[#9291ab] hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Katalog Aplikasi
            {isActiveRoute('catalog') && (
              <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7c5cff] to-[#00e0c6] rounded-full" />
            )}
          </button>

          {user && (
            <button
              onClick={() => handleNavClick('/dashboard')}
              className={`text-sm font-medium transition-colors relative py-1 flex items-center gap-1.5 ${
                isActiveRoute('dashboard')
                  ? 'text-white font-semibold'
                  : 'text-[#9291ab] hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-[#ffb84f]" />
              Dashboard Saya
              {isActiveRoute('dashboard') && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-[#7c5cff] to-[#00e0c6] rounded-full" />
              )}
            </button>
          )}
        </nav>

        {/* Right Actions: Search / Cart / WhatsApp / Auth */}
        <div className="flex items-center gap-2.5">
          {/* WhatsApp Direct Chat Button */}
          <button
            onClick={() => openWhatsAppChat()}
            className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-xs font-semibold transition-all hover:scale-105"
            title="Chat Langsung via WhatsApp"
            id="nav-whatsapp-btn"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>WhatsApp</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
          </button>

          {/* Quick Search Shortcut */}
          <button
            onClick={() => handleNavClick('/catalog')}
            className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[#9291ab] hover:text-white transition-all text-sm flex items-center gap-2"
            title="Cari software"
            id="nav-search-btn"
          >
            <Search className="w-4 h-4" />
            <span className="hidden lg:inline text-xs text-[#615f78]">Cari aplikasi...</span>
          </button>

          {/* Cart Icon with badge */}
          <button
            onClick={() => handleNavClick('/cart')}
            className="relative p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[#edecf6] transition-all hover:scale-105"
            title="Keranjang belanja"
            id="nav-cart-btn"
          >
            <ShoppingBag className="w-4 h-4 text-[#edecf6]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-[#ff4fd8] text-[#0a0a12] text-[11px] font-bold flex items-center justify-center shadow-lg shadow-[#ff4fd8]/50 animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile or Login CTA */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white transition-all"
                id="nav-user-dropdown"
              >
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    referrerPolicy="no-referrer" 
                    className="w-7 h-7 rounded-lg object-cover border border-white/20" 
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#7c5cff] to-[#00e0c6] flex items-center justify-center font-bold text-xs text-[#0a0a12]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold hidden sm:inline max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#9291ab]" />
              </button>

              {/* User Dropdown */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 p-1.5 bg-[#0f0f18]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl z-50 text-sm">
                  <div className="p-2.5 border-b border-white/10 mb-1">
                    <p className="font-semibold text-white text-xs truncate">{user.name}</p>
                    <p className="text-[11px] text-[#9291ab] truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => handleNavClick('/dashboard')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-xl hover:bg-white/5 text-[#edecf6] transition-colors text-xs font-medium"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#ffb84f]" />
                    Aplikasi & Lisensi Saya
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-xl hover:bg-red-500/10 text-red-400 transition-colors text-xs font-medium mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Keluar dari Akun
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('/auth')}
              className="gradient-btn px-4 py-2 rounded-xl text-xs font-bold font-display tracking-tight flex items-center gap-1.5"
              id="nav-login-btn"
            >
              <UserIcon className="w-3.5 h-3.5" />
              Masuk / Daftar
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/[0.03] border border-white/10 text-[#9291ab]"
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 bg-[#0a0a14]/95 backdrop-blur-2xl border-b border-white/10 space-y-3">
          <button
            onClick={() => handleNavClick('/')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between ${
              isActiveRoute('home') ? 'bg-white/10 text-white' : 'text-[#9291ab]'
            }`}
          >
            <span>Beranda</span>
            <span className="text-xs text-[#00e0c6]">Utama</span>
          </button>

          <button
            onClick={() => handleNavClick('/catalog')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between ${
              isActiveRoute('catalog') ? 'bg-white/10 text-white' : 'text-[#9291ab]'
            }`}
          >
            <span className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              Katalog Software
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
              Semua Kategori
            </span>
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              openWhatsAppChat();
            }}
            className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              Konsultasi WhatsApp
            </span>
            <span className="text-xs text-[#25D366] font-mono">Online</span>
          </button>

          {user ? (
            <button
              onClick={() => handleNavClick('/dashboard')}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between ${
                isActiveRoute('dashboard') ? 'bg-white/10 text-white' : 'text-[#9291ab]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#ffb84f]" />
                Dashboard Pengguna
              </span>
              <span className="text-xs text-[#00e0c6]">Lisensi Aktif</span>
            </button>
          ) : (
            <button
              onClick={() => handleNavClick('/auth')}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#7c5cff] to-[#ff4fd8] text-white flex items-center justify-center gap-2"
            >
              <UserIcon className="w-4 h-4" />
              Masuk atau Buat Akun Baru
            </button>
          )}

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-[#615f78] px-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00e0c6]" /> 100% Bebas Malware & Virus
            </span>
            <span className="font-mono">Fast Execution</span>
          </div>
        </div>
      )}
    </header>
  );
};
