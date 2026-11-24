import { HexaFlowLogo } from './Navbar';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#040507] py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <HexaFlowLogo />
            <span className="text-sm font-semibold text-slate-100">HexaFlow</span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className="text-xs text-slate-400">Autonomous Engineering Ops</span>
          </div>

          <nav aria-label="Links do rodapé" className="flex flex-wrap items-center gap-5 text-xs text-slate-400">
            <a href="#gargalo" className="hover:text-slate-200 transition-colors">Por que B2B</a>
            <a href="#esteira" className="hover:text-slate-200 transition-colors">Esteira ITIL</a>
            <a href="#diferenciais" className="hover:text-slate-200 transition-colors">Governança</a>
            <a href="#case-aeepet" className="hover:text-slate-200 transition-colors">Case AEEPET</a>
            <a href="#planos" className="hover:text-slate-200 transition-colors">Implantação</a>
            <a href="#faq" className="hover:text-slate-200 transition-colors">FAQ Técnico</a>
          </nav>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-slate-800/80 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} HexaFlow Autonomous Engineering Ops. Governança ITIL, Arquitetura Hexagonal, DRY e Clean Code.
          </p>
          <p>
            Operação piloto Cliente Zero: <span className="text-slate-300">SaaS AEEPET</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
