import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, BookOpen, Flag, House, MapPinned, TriangleAlert } from 'lucide-react';
import { AppHeader } from '@/components/ui/app-header';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/', label: 'Início', icon: House },
  { to: '/schools', label: 'Escolas', icon: MapPinned },
  { to: '/learn', label: 'Aprender', icon: BookOpen },
  { to: '/campaigns', label: 'Campanhas', icon: Flag },
  { to: '/reports', label: 'Relatos', icon: TriangleAlert },
];

export default function AppShell() {
  // 💡 ESTADOS: Controlam o comportamento da interface
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isTrackingIndicators, setIsTrackingIndicators] = useState(false);

  // 🛠️ FUNÇÕES: Executam a lógica de controle
  const handleReportClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Impede a navegação imediata se quiser abrir um modal/função primeiro
    setIsReportModalOpen(true);
    console.log('Função disparada: Abrindo fluxo de relato de risco.');
  };

  const handleIndicatorsClick = () => {
    setIsTrackingIndicators(true);
    console.log('Função disparada: Registrando clique em indicadores.');
    // Simula uma ação de 1 segundo antes de liberar ou processar algo
    setTimeout(() => setIsTrackingIndicators(false), 1000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader
        actions={
          <>
            {/* NavLink controlando função ao ser clicado */}
            <NavLink
              to="/indicators"
              onClick={handleIndicatorsClick}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-primary-text hover:bg-muted",
                isTrackingIndicators && "opacity-50 pointer-events-none"
              )}
            >
              <BarChart3 className="size-4" />
              <span className="hidden sm:inline">
                {isTrackingIndicators ? 'Carregando...' : 'Indicadores'}
              </span>
            </NavLink>

            {/* Botão/NavLink disparando a função de Relato */}
            <NavLink
              to="/reports"
              onClick={handleReportClick}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              <TriangleAlert className="size-4" />
              Relatar risco
            </NavLink>
          </>
        }
      >
        <nav className="hidden items-center gap-5 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium transition-colors',
                  isActive ? 'text-primary-text' : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </AppHeader>

      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* ⚠️ Interface condicional controlada pelo TSX */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg bg-background p-6 shadow-lg border">
            <h3 className="text-lg font-bold">Iniciar Relato</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Deseja prosseguir para o formulário de relato seguro?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button 
                onClick={() => setIsReportModalOpen(false)}
                className="px-3 py-1.5 text-sm rounded bg-muted hover:bg-muted/80"
              >
                Cancelar
              </button>
              <NavLink
                to="/reports"
                onClick={() => setIsReportModalOpen(false)}
                className="px-3 py-1.5 text-sm rounded bg-primary text-primary-foreground font-medium"
              >
                Confirmar
              </NavLink>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md justify-around">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex min-h-11 flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium',
                  isActive ? 'text-primary-text' : 'text-muted-foreground'
                )
              }
            >
              <item.icon className="size-5" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

