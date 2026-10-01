import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, CarFront, CircleHelp, Footprints, ShieldCheck } from 'lucide-react';
import { collection } from '@/lib/fab-sdk';
import type { Row } from '@/lib/fab-sdk';
import { AppImage } from '@/components/ui/app-image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

type Material = Row & {
  title: string;
  body?: string;
  category?: string;
  image?: string;
};

const categoryIcons: Record<string, typeof Footprints> = {
  Pedestres: Footprints,
  Ciclistas: ShieldCheck,
  Motoristas: CarFront,
  Responsáveis: CircleHelp,
  'Entorno escolar': BookOpen,
};

export default function Learn() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    collection<Material>('educational_material')
      .list({ sort: 'display_order', limit: 30 })
      .then(setMaterials)
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Não foi possível carregar os materiais. Tente novamente.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      <header className="mb-9 max-w-2xl">
        <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary-text">
          <BookOpen className="size-5" />
        </div>
        <p className="mb-2 text-sm font-semibold text-primary-text">Segurança começa com informação</p>
        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Aprenda a cuidar do caminho</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Orientações práticas para tornar a chegada e a saída da escola mais seguras para todos.
        </p>
      </header>

      <section aria-label="Materiais educativos">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <Skeleton key={item} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <Card className="rounded-xl border-destructive/30">
            <CardContent className="py-8 text-center text-sm text-destructive">{error}</CardContent>
          </Card>
        ) : materials.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Novos materiais em breve"
            description="Estamos preparando dicas e conteúdos para ajudar a proteger a comunidade escolar."
            action={
              <Link
                to="/schools"
                className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary-text hover:underline"
              >
                Conheça as escolas <ArrowRight className="size-4" />
              </Link>
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {materials.map((material) => {
              const CategoryIcon = categoryIcons[material.category ?? ''] ?? BookOpen;
              return (
                <Card
                  key={material.id}
                  className="overflow-hidden rounded-xl border-border pt-0 gap-0 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  {material.image ? (
                    <AppImage
                      slot={`material-${material.id}`}
                      prompt="safe school traffic education"
                      alt={material.title}
                      src={material.image}
                      className="h-44 w-full"
                    />
                  ) : (
                    <div
                      className="flex h-44 items-center justify-center bg-muted text-primary-text"
                      aria-hidden="true"
                    >
                      <CategoryIcon className="size-10" />
                    </div>
                  )}
                  <CardContent className="flex flex-1 flex-col py-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge variant="secondary">{material.category || 'Segurança no trânsito'}</Badge>
                    </div>
                    <h2 className="text-lg font-bold leading-snug">{material.title}</h2>
                    {material.body && (
                      <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                        {material.body
                          .replace(/<[^>]*>/g, ' ')
                          .replace(/\s+/g, ' ')
                          .trim()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-10 rounded-xl border bg-card p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-primary-text">
            <ShieldCheck className="size-5" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold">Viu uma situação de risco?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Compartilhe o que acontece no entorno escolar para ajudar a comunidade.
            </p>
          </div>
        </div>
        <Link
          to="/reports"
          className="mt-4 inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-primary-text hover:underline sm:mt-0"
        >
          Enviar relato <ArrowRight className="size-4" />
        </Link>
      </section>
    </div>
  );
}

