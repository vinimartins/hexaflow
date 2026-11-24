import { useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { ResolvedTheme, ThemePreference } from '../utils/themeLogic';

interface NavbarProps {
  onSelectPoc: () => void;
  resolvedTheme: ResolvedTheme;
  preference: ThemePreference;
  onToggleTheme: () => void;
}

const NAV_ITEMS = [
  { label: 'Por que B2B', href: '#gargalo' },
  { label: 'Esteira ITIL', href: '#esteira' },
  { label: 'Governança', href: '#diferenciais' },
  { label: 'Case AEEPET', href: '#case-aeepet' },
  { label: 'Implantação', href: '#planos' },
];

export function HexaFlowLogo() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-sky-400"
    >
      <polygon
        points="12,2 20.66,7 20.66,17 12,22 3.34,17 3.34,7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <polygon
        points="12,6.5 16.76,9.25 16.76,14.75 12,17.5 7.24,14.75 7.24,9.25"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeOpacity="0.65"
        strokeLinejoin="round"
      />
      <path d="M12 2V6.5M20.66 17L16.76 14.75M3.34 17L7.24 14.75" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export function Navbar({ onSelectPoc, resolvedTheme, preference, onToggleTheme }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDark = resolvedTheme === 'dark';
  const toggleLabel = isDark
    ? 'Alternar para tema claro (atual: escuro)'
    : 'Alternar para tema escuro (atual: claro)';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#040507]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 sm:gap-8 px-4 py-3.5 sm:px-6">
        {/* Zone 1: Brand wordmark only */}
        <a
          href="#topo"
          className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-slate-50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-md"
        >
          <HexaFlowLogo />
          <span>HexaFlow</span>
        </a>

        {/* Zone 2: 5 concise single-line nav links */}
        <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-300 hover:text-slate-50 transition-colors duration-150 whitespace-nowrap shrink-0 underline-offset-4 hover:underline decoration-sky-400/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Theme toggle + 1 primary action + mobile trigger */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            data-testid="theme-toggle"
            onClick={onToggleTheme}
            aria-label={toggleLabel}
            title={
              preference === 'system'
                ? `Tema do sistema (${isDark ? 'Escuro' : 'Claro'}) · Clique para alternar`
                : `Tema ${isDark ? 'Escuro' : 'Claro'} · Clique para alternar`
            }
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-800 bg-[#0A0B0E] text-slate-300 hover:border-slate-600 hover:text-slate-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-sky-400" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4 text-sky-400" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onSelectPoc();
            }}
            className="hidden sm:inline-flex items-center justify-center rounded-md bg-sky-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-300 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#040507]"
          >
            Agendar Diagnóstico B2B
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex md:hidden items-center justify-center rounded-md border border-slate-800 bg-[#0A0B0E] p-2 text-slate-200 hover:border-slate-700 hover:text-white transition-colors min-h-[40px] min-w-[40px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0A0B0E] px-4 py-4">
          <nav aria-label="Navegação mobile" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800/60 hover:text-white transition-colors min-h-[44px] flex items-center"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onSelectPoc();
              }}
              className="mt-2 w-full rounded-md bg-sky-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-sky-300 transition-colors min-h-[44px] cursor-pointer"
            >
              Agendar Diagnóstico B2B
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
