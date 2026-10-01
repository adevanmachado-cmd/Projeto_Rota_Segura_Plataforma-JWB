import { useEffect, useState } from 'react';
import { ArrowRight, CalendarDays, Check, Flag, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { collection, type Row } from '@/lib/fab-client';
import { ApiError } from '@/lib/fab-client';
import { AppImage } from '@/components/ui/app-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';

type Campaign = Row & {
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: 'Planejada' | 'Em andamento' | 'Encerrada';
};

type Quiz = Row & { campaign?: string; title: string; description?: string };

type Challenge = Row & {
  campaign?: string;
  campaign__label?: string;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  instructions?: string;
};

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : dateFormatter.format(date);
}

function plainText(value?: string) {
  if (!value) return '';
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function CampaignCard({
  campaign,
  challengeCount,
  onOpen,
}: {
  campaign: Campaign;
  challengeCount: number;
  onOpen: () => void;
}) {
  const dates = [formatDate(campaign.start_date), formatDate(campaign.end_date)].filter(Boolean);
  const isActive = campaign.status === 'Em andamento';

  return (
    <Card className="overflow-hidden rounded-xl border-border py-0 shadow-none transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-44 overflow-hidden bg-muted">
        <AppImage
          slot={`campaign-${campaign.id}`}
          prompt="school road safety awareness campaign, families and safe street crossing"
          alt="Comunidade participando de uma campanha de segurança no trânsito escolar"
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <Badge variant={isActive ? 'default' : 'secondary'} className="rounded-full">
            {campaign.status}
          </Badge>
          <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            <Sparkles className="size-3.5" />
            {challengeCount} {challengeCount === 1 ? 'desafio' : 'desafios'}
          </span>
        </div>
      </div>
      <CardContent className="space-y-4 p-5">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{campaign.title}</h2>
          {plainText(campaign.description) && (
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {plainText(campaign.description)}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {dates.length > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              {dates.join(' — ')}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4" />
            Aberta à comunidade
          </span>
        </div>
        <Button variant="outline" className="w-full rounded-full" onClick={onOpen}>
          Ver desafios e questionários
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function CampaignQuizzes({ campaignId }: { campaignId?: string }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  useEffect(() => {
    if (!campaignId) {
      setQuizzes([]);
      return;
    }
    collection<Quiz>('quiz')
      .list({ filter: { campaign: campaignId }, sort: 'title', limit: 50 })
      .then(setQuizzes)
      .catch(() => setQuizzes([]));
  }, [campaignId]);
  return quizzes.length ? (
    <div className="mt-2 space-y-3">
      {quizzes.map((quiz) => (
        <article key={quiz.id} className="rounded-lg border p-3">
          <h4 className="font-medium">{quiz.title}</h4>
          {quiz.description && <p className="mt-1 text-sm text-muted-foreground">{plainText(quiz.description)}</p>}
        </article>
      ))}
    </div>
  ) : (
    <p className="mt-2 text-sm text-muted-foreground">Nenhum questionário vinculado.</p>
  );
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      collection<Campaign>('campaign').list({ filter: { status: 'Em andamento' }, sort: '-created_at', limit: 50 }),
      collection<Challenge>('challenge').list({ sort: '-created_at', limit: 100 }),
    ])
      .then(([campaignRows, challengeRows]) => {
        if (!mounted) return;
        setCampaigns(campaignRows);
        setChallenges(challengeRows);
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        const message = e instanceof ApiError ? e.message : 'Não foi possível carregar as campanhas. Tente novamente.';
        setError(message);
        toast.error(message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const activeCount = campaigns.filter((item) => item.status === 'Em andamento').length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      <section className="mb-10 overflow-hidden rounded-2xl border bg-card">
        <div className="grid items-center gap-6 md:grid-cols-[1.05fr_0.95fr]">
          <div className="px-6 py-8 sm:px-9 sm:py-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-primary-text">
              <Flag className="size-3.5" />
              Comunidade em movimento
            </div>
            <h1 className="max-w-xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Ruas mais seguras começam com a gente.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
              Acompanhe iniciativas locais e participe de ações para tornar os caminhos da escola mais seguros.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <Check className="size-4 text-primary-text" />
                Atitudes que protegem vidas
              </span>
            </div>
          </div>
          <div className="relative h-56 min-w-0 md:h-full md:min-h-72">
            <AppImage
              slot="campaigns-community"
              prompt="diverse school community taking part in a safe streets awareness event"
              alt="Comunidade reunida por caminhos mais seguros para as escolas"
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent md:bg-gradient-to-l md:from-transparent md:via-black/10 md:to-black/25" />
          </div>
        </div>
      </section>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary-text">Participe</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">Campanhas e desafios</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ações para transformar a segurança no entorno escolar em um compromisso coletivo.
          </p>
        </div>
        {!loading && campaigns.length > 0 && (
          <div className="rounded-xl border bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">Em andamento</p>
            <p className="mt-0.5 text-2xl font-bold tabular-nums">{activeCount}</p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="overflow-hidden rounded-xl border">
              <Skeleton className="h-44 w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-card p-6 text-sm text-destructive">{error}</div>
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={Flag}
          title="Novas campanhas em breve"
          description="Ainda não há campanhas publicadas. Enquanto isso, explore orientações para contribuir com um trânsito mais seguro."
          action={
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/learn">Explorar materiais</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns
            .filter((campaign) => campaign.status === 'Em andamento')
            .map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                challengeCount={challenges.filter((challenge) => challenge.campaign === campaign.id).length}
                onOpen={() => setSelectedCampaign(campaign)}
              />
            ))}
        </div>
      )}

      <Dialog open={Boolean(selectedCampaign)} onOpenChange={(open) => !open && setSelectedCampaign(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCampaign?.title}</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-5">
            <section>
              <h3 className="font-semibold">Desafios</h3>
              {challenges.filter((item) => item.campaign === selectedCampaign?.id).length ? (
                <div className="mt-2 space-y-3">
                  {challenges
                    .filter((item) => item.campaign === selectedCampaign?.id)
                    .map((item) => (
                      <article key={item.id} className="rounded-lg border p-3">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">{plainText(item.description)}</p>
                        {item.instructions && <p className="mt-2 text-sm">{plainText(item.instructions)}</p>}
                      </article>
                    ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Nenhum desafio vinculado.</p>
              )}
            </section>
            <section>
              <h3 className="font-semibold">Questionários</h3>
              <CampaignQuizzes campaignId={selectedCampaign?.id} />
            </section>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedCampaign(null)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <section className="mt-12 flex flex-col gap-5 rounded-2xl bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold">Percebeu uma situação de risco?</h2>
          <p className="mt-2 text-sm leading-6 opacity-90">
            Compartilhe o que acontece no caminho da escola e ajude a comunidade a priorizar melhorias.
          </p>
        </div>
        <Button asChild variant="secondary" className="shrink-0 rounded-full">
          <Link to="/reports">
            Enviar relato <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}

