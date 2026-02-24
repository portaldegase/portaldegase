import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, Eye, Plus, Minus, Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useAuth } from "@/_core/hooks/useAuth";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();
  const { highContrast, toggleHighContrast, increaseFontSize, decreaseFontSize } = useAccessibility();
  const { user, isAuthenticated } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header role="banner">
      {/* Skip Navigation */}
      <a href="#main-content" className="skip-nav">
        Pular para o conteúdo principal
      </a>

      {/* Top Bar - Gov.br style */}
      <div className="w-full text-white text-xs" style={{ backgroundColor: "var(--degase-blue-dark)" }}>
        <div className="container flex items-center justify-between py-1.5">
          <div className="flex items-center gap-3">
            <a href="https://rj.gov.br" target="_blank" rel="noopener noreferrer" className="hover:underline font-medium" aria-label="Portal rj.gov.br">
              rj.gov
            </a>
            <div className="flex items-center gap-2">
              <a href="https://www.instagram.com/degaserj" target="_blank" rel="noopener noreferrer" aria-label="Instagram do DEGASE" className="hover:opacity-80">
                <Instagram size={14} />
              </a>
              <a href="https://www.facebook.com/degaserj" target="_blank" rel="noopener noreferrer" aria-label="Facebook do DEGASE" className="hover:opacity-80">
                <Facebook size={14} />
              </a>
              <a href="https://twitter.com/RjDegase" target="_blank" rel="noopener noreferrer" aria-label="Twitter do DEGASE" className="hover:opacity-80">
                <Twitter size={14} />
              </a>
              <a href="https://www.youtube.com/@tvdegase" target="_blank" rel="noopener noreferrer" aria-label="YouTube do DEGASE" className="hover:opacity-80">
                <Youtube size={14} />
              </a>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <a href="https://transparencia.rj.gov.br" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Portal da Transparência
            </a>
            <a href="/transparencia" className="hover:underline">
              Acesso à Informação
            </a>
            <button
              onClick={toggleHighContrast}
              className="hover:underline flex items-center gap-1"
              aria-label={highContrast ? "Desativar alto contraste" : "Ativar alto contraste"}
            >
              <Eye size={12} />
              Acessibilidade
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="w-full text-white" style={{ backgroundColor: "var(--degase-blue-medium)" }}>
        <div className="container flex items-center justify-between py-3">
          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white p-2 hover:bg-white/10 rounded-md transition-colors"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" aria-label="DEGASE - Página Inicial">
            <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663378282282/eQqARgEIiuikpAao.png" alt="DEGASE - Departamento Geral de Ações Socioeducativas" className="h-12 md:h-14 object-contain" />
            <div className="hidden sm:block">
              <div className="text-[10px] uppercase tracking-wider opacity-80">Governo do Estado</div>
              <div className="text-lg font-bold leading-tight">DEGASE</div>
              <div className="text-[9px] opacity-70">Departamento Geral de Ações Socioeducativas</div>
            </div>
          </Link>

          {/* Search */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="px-3 py-1.5 rounded-l-md text-sm text-gray-800 w-48 lg:w-64 focus:outline-none"
                aria-label="Campo de busca"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-r-md text-sm font-medium"
                style={{ backgroundColor: "var(--degase-gold)" }}
                aria-label="Buscar"
              >
                Buscar
              </button>
            </form>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-md"
              aria-label="Abrir busca"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar no site..."
                className="flex-1 px-3 py-2 rounded-l-md text-sm text-gray-800"
                aria-label="Campo de busca"
                autoFocus
              />
              <button type="submit" className="px-4 py-2 rounded-r-md text-sm font-medium" style={{ backgroundColor: "var(--degase-gold)" }}>
                Buscar
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      {menuOpen && (
        <nav className="w-full text-white shadow-lg" style={{ backgroundColor: "var(--degase-blue-accent)" }} role="navigation" aria-label="Menu principal">
          <div className="container py-4">
            <ul className="space-y-1">
              {[
                { href: "/", label: "Início" },
                { href: "/noticias", label: "Notícias" },
                { href: "/sobre", label: "Sobre o DEGASE" },
                { href: "/servicos", label: "Serviços" },
                { href: "/legislacao", label: "Legislação" },
                { href: "/transparencia", label: "Transparência" },
                { href: "/unidades", label: "Unidades" },
                { href: "/contato", label: "Contato" },
              ].map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-white/10 rounded-md transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {isAuthenticated && (
                <li className="border-t border-white/20 mt-2 pt-2">
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-white/10 rounded-md transition-colors font-medium">
                    Painel Administrativo
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>
      )}

      {/* Accessibility Floating Bar */}
      <div className="fixed right-0 top-1/3 z-50 flex flex-col gap-1" role="toolbar" aria-label="Ferramentas de acessibilidade">
        <button
          onClick={toggleHighContrast}
          className="p-2 text-white rounded-l-md shadow-md text-xs"
          style={{ backgroundColor: "var(--degase-blue-light)" }}
          aria-label={highContrast ? "Desativar alto contraste" : "Ativar alto contraste"}
          title={highContrast ? "Desativar alto contraste" : "Ativar alto contraste"}
        >
          <Eye size={18} />
        </button>
        <button
          onClick={increaseFontSize}
          className="p-2 text-white rounded-l-md shadow-md text-xs"
          style={{ backgroundColor: "var(--degase-blue-light)" }}
          aria-label="Aumentar tamanho da fonte"
          title="Aumentar fonte"
        >
          <Plus size={18} />
        </button>
        <button
          onClick={decreaseFontSize}
          className="p-2 text-white rounded-l-md shadow-md text-xs"
          style={{ backgroundColor: "var(--degase-blue-light)" }}
          aria-label="Diminuir tamanho da fonte"
          title="Diminuir fonte"
        >
          <Minus size={18} />
        </button>
      </div>
    </header>
  );
}
