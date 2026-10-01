import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock3, MapPin, Navigation, ShieldCheck, TriangleAlert } from 'lucide-react';
import { collection } from '@/lib/fab-sdk';
import type { Row } from '@/lib/fab-sdk';
import { AppImage } from '@/components/ui/app-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';

type School = Row & {
  name: string;
  address?: string;
  status?: string;
  arrival_guidance?: string;
  dismissal_guidance?: string;
};

type Material = Row & {
  title: string;
  body?: string;
  category?: string;
  image?: string;
};

type Report = Row & {
  title: string;
  category?: string;
  status?: string;
  created_at?: string;
};

function plainText(value?: string) {
  if (!value) return '';
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function dateLabel(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date);
}

export default function Home() {
  const [schools, setSchools] = useState<School[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      collection<School>('school').list({ filter: { status: 'Ativa' }, limit: 3, sort: 'name' }),
      collection<School>('school').list({
        filter: { status: 'Ativa', name: { contains: 'Colégio Estadual Cívico-Militar Alcides Munhoz' } },
        limit: 10,
        sort: 'name',
      }),
      collection<Material>('educational_material').list({ sort: 'display_order', limit: 3 }),
      collection<Report>('hazard_report').list({ sort: '-created_at', limit: 3 }),
    ])
      .then(([schoolRows, featuredSchoolRows, materialRows, reportRows]) => {
        if (!active) return;
        const combinedSchools = [...schoolRows];
        for (const school of featuredSchoolRows) {
          if (!combinedSchools.some((row) => row.id === school.id)) combinedSchools.push(school);
        }
        setSchools(combinedSchools);
        setMaterials(materialRows);
        setReports(reportRows);
      })
      .catch((error) => {
        if (active) toast.error(error instanceof Error ? error.message : 'Não foi possível carregar as informações.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-8 sm:pt-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-semibold text-primary-text">Segurança no entorno escolar</p>
            <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Caminhos mais seguros começam com atenção.
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
              Orientações e informações da comunidade para tornar a chegada e a saída da escola mais tranquilas.
            </p>
          </div>
          <Button asChild className="w-fit rounded-full">
            <Link to="/reports">
              <TriangleAlert className="mr-2 size-4" />
              Relatar uma situação
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="rounded-xl border-border bg-card shadow-none">
            <CardContent className="flex gap-4 p-5 sm:p-6">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-primary-text">
                <Clock3 className="size-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold">Na entrada</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {schools.find((school) => school.arrival_guidance)?.arrival_guidance
                    ? plainText(schools.find((school) => school.arrival_guidance)?.arrival_guidance)
                    : materials[0]
                      ? plainText(materials[0].body)
                      : 'Orientações de chegada serão exibidas quando forem cadastradas pela escola.'}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl border-border bg-card shadow-none">
            <CardContent className="flex gap-4 p-5 sm:p-6">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-primary-text">
                <ShieldCheck className="size-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold">Na saída</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {schools.find((school) => school.dismissal_guidance)?.dismissal_guidance
                    ? plainText(schools.find((school) => school.dismissal_guidance)?.dismissal_guidance)
                    : materials[1]
                      ? plainText(materials[1].body)
                      : 'Orientações de saída serão exibidas quando forem cadastradas pela escola.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <Card className="overflow-hidden rounded-xl border-border bg-card shadow-none">
          <CardContent className="p-5 sm:p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Colégio Estadual Cívico-Militar Alcides Munhoz</h2>
              <Button asChild variant="outline" className="w-fit rounded-full">
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=-25.226222,-50.603333"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Navigation className="size-4" />
                  Como chegar
                </a>
              </Button>
            </div>
            <div className="overflow-hidden rounded-lg border">
              <iframe
                title="Mapa do Colégio Estadual Cívico-Militar Alcides Munhoz"
                src="https://maps.google.com/maps?q=-25.226222,-50.603333&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="h-72 w-full border-0 sm:h-96"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="border-y bg-muted/30 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Informação local</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">Escolas da região</h2>
            </div>
            <Button asChild variant="ghost" className="shrink-0 rounded-full">
              <Link to="/schools">
                Ver todas <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <Skeleton key={item} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : schools.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {schools.map((school) => (
                <Card
                  key={school.id}
                  className="rounded-xl border-border shadow-none transition-colors hover:bg-accent/40"
                >
                  <CardContent className="flex items-start gap-3 p-5">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-primary-text" />
                    <div className="min-w-0">
                      <h3 className="font-semibold">{school.name}</h3>
                      {school.address && <p className="mt-1 text-sm text-muted-foreground">{school.address}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={MapPin}
              title="Escolas em atualização"
              description="As escolas da região aparecerão aqui quando forem cadastradas."
              action={
                <Button asChild variant="outline">
                  <a href="https://earth.google.com/web/search/-25.226222,-50.603333" target="_blank" rel="noreferrer">
                    Consultar no Google Earth
                  </a>
                </Button>
              }
            />
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Prevenção no dia a dia</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">Aprender também protege</h2>
          </div>
          <Button asChild variant="ghost" className="shrink-0 rounded-full">
            <Link to="/learn">
              Mais orientações <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <Skeleton key={item} className="h-60 rounded-xl" />
            ))}
          </div>
        ) : materials.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {materials.map((material) => (
              <Card key={material.id} className="overflow-hidden rounded-xl border-border pt-0 shadow-none">
                {material.image ? (
                  <AppImage
                    slot={`material-${material.id}`}
                    prompt="orientação de segurança no trânsito escolar"
                    src={material.image}
                    alt={material.title}
                    className="h-40 w-full"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-muted">
                    <BookOpen className="size-8 text-muted-foreground" />
                  </div>
                )}
                <CardContent className="p-5">
                  {material.category && (
                    <p className="mb-2 text-xs font-semibold text-primary-text">{material.category}</p>
                  )}
                  <h3 className="font-semibold">{material.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {plainText(material.body)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <BookOpen className="mx-auto size-7 text-muted-foreground" />
            <p className="mt-3 font-medium">Novos materiais educativos em breve</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Enquanto isso, consulte as orientações para entrada e saída acima.
            </p>
          </div>
        )}
      </section>

      <section className="border-t bg-muted/30 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Acompanhe a comunidade</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">Relatos recentes</h2>
            </div>
            <Button asChild variant="ghost" className="shrink-0 rounded-full">
              <Link to="/reports">
                Ver relatos <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
          {loading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <Skeleton key={item} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : reports.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <Card key={report.id} className="rounded-xl border-border shadow-none">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="min-w-0 font-semibold">{report.title}</h3>
                      {dateLabel(report.created_at) && (
                        <span className="shrink-0 text-xs text-muted-foreground">{dateLabel(report.created_at)}</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {[report.category, report.status].filter(Boolean).join(' · ')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-7 text-center">
              <p className="font-medium">Ainda não há relatos publicados</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Percebeu um risco no entorno escolar? Compartilhe para ajudar a comunidade.
              </p>
              <Button asChild variant="outline" className="mt-4 rounded-full">
                <Link to="/reports">Fazer um relato</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

