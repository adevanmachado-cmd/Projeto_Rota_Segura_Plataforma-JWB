import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Car,
  Clock3,
  Heart,
  MapPin,
  Navigation,
  Search,
  Shield,
  ShieldCheck,
  TriangleAlert,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { collection } from '@/lib/fab-sdk';
import type { Row } from '@/lib/fab-sdk';
import { AppImage } from '@/components/ui/app-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

type RiskCategory = 'trafego' | 'infraestrutura' | 'seguranca' | 'outro';

interface ReportFormData {
  title: string;
  category: RiskCategory;
  description: string;
  location: string;
  severity: 'baixa' | 'media' | 'alta';
}

interface TipCategory {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface InfoItem {
  icon: LucideIcon;
  title: string;
  description: string;
  details: string[];
}

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

function ReportForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState<ReportFormData>({
    title: '',
    category: 'trafego',
    description: '',
    location: '',
    severity: 'media',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const field = name as keyof ReportFormData;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.log('Relato enviado:', formData);
      toast.success('Relato enviado com sucesso! Obrigado por contribuir com a segurança.');
      setFormData({
        title: '',
        category: 'trafego',
        description: '',
        location: '',
        severity: 'media',
      });
      onClose();
    } catch (error) {
      toast.error('Erro ao enviar o relato. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="size-5 text-red-600" />
            </div>
            <div>
              <CardTitle>Relatar um Problema ou Risco</CardTitle>
              <CardDescription>Ajude a comunidade compartilhando riscos no entorno escolar</CardDescription>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Fechar relatório">
            <TriangleAlert className="size-5" />
          </button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium">
                Título do Relato *
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: Semáforo com defeito na avenida principal"
                className="w-full rounded-lg border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="category" className="mb-2 block text-sm font-medium">
                Categoria *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-lg border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="trafego">🚦 Problema de Trânsito</option>
                <option value="infraestrutura">🏗️ Infraestrutura / Via</option>
                <option value="seguranca">🚨 Segurança</option>
                <option value="outro">📝 Outro</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className="mb-2 block text-sm font-medium">
                Localização *
              </label>
              <div className="flex gap-2">
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Rua, avenida ou ponto de referência"
                  className="flex-1 rounded-lg border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button type="button" variant="outline" size="sm" className="shrink-0">
                  <MapPin className="size-4" />
                </Button>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium">
                Descrição do Problema *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Descreva quando ocorre, como pode afetar os estudantes e por que representa risco para a comunidade."
                className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="severity" className="mb-2 block text-sm font-medium">
                Nível de Risco
              </label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                className="w-full rounded-lg border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="baixa">🟢 Baixo</option>
                <option value="media">🟡 Médio</option>
                <option value="alta">🔴 Alto</option>
              </select>
            </div>

            <div className="flex gap-3 border-t pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1 gap-2">
                <TriangleAlert className="size-4" />
                {isSubmitting ? 'Enviando...' : 'Enviar Relato'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function NeighborhoodInfo() {
  const infoItems: InfoItem[] = [
    {
      icon: MapPin,
      title: 'Localização da Escola',
      description: 'Colégio Estadual Cívico-Militar Alcides Munhoz',
      details: [
        'Endereço: região escolar e entorno de acesso principal.',
        'Horário de entrada: 7:00 às 7:30',
        'Horário de saída: 17:00 às 17:30',
        'Maior fluxo de estudantes e veículos no início e fim do dia.',
      ],
    },
    {
      icon: AlertTriangle,
      title: 'Pontos de Atenção',
      description: 'Áreas de maior risco no entorno',
      details: [
        'Cruzamentos com alta circulação de veículos.',
        'Trechos sem visibilidade adequada para pedestres.',
        'Locais com presença de congestionamento e manobras arriscadas.',
        'Necessidade de atenção redobrada em dias de chuva ou mais movimento.',
      ],
    },
    {
      icon: Zap,
      title: 'Infraestrutura de Segurança',
      description: 'Recursos disponíveis na região',
      details: [
        'Faixas de pedestres sinalizadas em pontos estratégicos.',
        'Iluminação pública e áreas com maior monitoramento.',
        'Acesso com cuidado para entrada e saída dos estudantes.',
        'Possibilidade de reforço de sinalização e orientação.',
      ],
    },
    {
      icon: Car,
      title: 'Fluxo de Trânsito',
      description: 'Horários de pico e condições gerais',
      details: [
        'Pico matinal e vespertino com maior concentração de veículos.',
        'Zona de atenção constante, principalmente no entorno imediato.',
        'Atenção redobrada na travessia em frente ao colégio.',
        'Respeito à velocidade e às sinalizações reduz riscos.',
      ],
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold text-primary-text">Contexto Local</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight">Informações sobre o Entorno Escolar</h2>
        <p className="mt-2 text-base text-muted-foreground">
          Conheça as características, riscos e recursos de segurança do entorno da escola.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {infoItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="rounded-xl border-border shadow-none transition-colors hover:bg-accent/30">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="mt-1">{item.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {item.details.map((detail, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-primary-text">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function SafetyTips() {
  const categories: TipCategory[] = [
    { id: 'transit', label: 'Segurança Viária', icon: Shield },
    { id: 'prevention', label: 'Prevenção de Acidentes', icon: AlertTriangle },
    { id: 'first-aid', label: 'Primeiros Socorros', icon: Heart },
  ];

  const tips = {
    transit: [
      {
        title: 'Conhecer a rota',
        content:
          'Sempre utilize o mesmo caminho para ir e voltar da escola. Conhecer bem o trajeto ajuda a identificar pontos de risco e evitar situações perigosas.',
      },
      {
        title: 'Travessia segura',
        content:
          'Nunca atravesse fora da faixa, entre carros estacionados ou em momento de trânsito intenso. Olhe para os dois lados e aguarde o sinal abrir completamente.',
      },
      {
        title: 'Atenção ao semáforo',
        content:
          'Espere sempre o sinal verde para pedestres. Mesmo com sinal permitido, faça a verificação final antes de atravessar.',
      },
      {
        title: 'Visibilidade',
        content:
          'Use roupas chamativas ou com fita refletiva. Motoristas percebem melhor alunos mais visíveis, principalmente à noite e em dias de chuva.',
      },
      {
        title: 'Evite distrações',
        content:
          'Fones, celulares e qualquer atenção desviada podem levar a acidentes. Mantenha foco durante a travessia e o caminho até a escola.',
      },
      {
        title: 'Respeite as regras',
        content:
          'Não corra, não pule a fila de pedestres e siga sempre as orientações dos adultos e sinalizações locais.',
      },
    ],
    prevention: [
      {
        title: 'Ir acompanhado',
        content:
          'Sempre preferir ir com um responsável, familiar ou em grupo. A companhia ajuda a reduzir riscos e facilita pedir ajuda em situações simples.',
      },
      {
        title: 'Identificar ponto seguro',
        content:
          'Escolha locais próximos com presença de pessoas, comércio ou vigilância para esperar ou pedir ajuda.',
      },
      {
        title: 'Informar o trajeto',
        content:
          'Avise a família ou responsável por onde vai passar e o horário previsto de chegada e saída da escola.',
      },
      {
        title: 'Evitar itens visíveis',
        content:
          'Evite expor objetos de valor, como celulares, joias e relógios caros, em momentos de movimentação intensa.',
      },
      {
        title: 'Conhecer os riscos locais',
        content:
          'Observe pontos de maior risco, como cruzamentos com pouca visibilidade, vias sem calçada, ou áreas mal iluminadas.',
      },
      {
        title: 'Confiar no instinto',
        content:
          'Se algo parece estranho, procure um local seguro, peça ajuda a um adulto ou a algum responsável da escola.',
      },
    ],
    'first-aid': [
      {
        title: 'Ferimentos leves',
        content:
          'Lave com água e sabão, seque com gaze limpa, aplique antisséptico e cubra a região. Se o sangramento persistir, procure atendimento médico.',
      },
      {
        title: 'Queimaduras',
        content:
          'Coloque água fria por 15 a 20 minutos. Não aplique manteiga ou gelo direto. Se a área for grande ou profunda, procure ajuda médica.',
      },
      {
        title: 'Desmaio',
        content:
          'Deite a pessoa com as pernas elevadas. Verifique se está respirando e detalhe se há outra dificuldade. Chame ajuda se não melhorar.',
      },
      {
        title: 'Engasgo',
        content:
          'Apoie a pessoa para frente e aplique golpes nas costas. Se não houver melhora, chame ajuda imediatamente.',
      },
      {
        title: 'RCP',
        content:
          'Se não houver respiração, faça compressões torácicas firmes e rápidas até a chegada de profissionais de saúde.',
      },
      {
        title: 'Inchaço e contusão',
        content:
          'Aplique gelo envolto em pano e eleve a região afetada. Se houver dor forte ou aumento do inchaço, procure atendimento médico.',
      },
    ],
  };

  return (
    <section className="border-y bg-muted/30 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8">
          <p className="text-sm font-semibold text-primary-text">Educação e Prevenção</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight">Dicas de Segurança</h2>
          <p className="mt-2 text-base text-muted-foreground">
            Orientações sobre segurança viária, prevenção de acidentes e primeiros socorros para a comunidade escolar.
          </p>
        </div>

        <div className="mb-8 grid gap-3 md:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.id} className="flex items-center justify-center gap-2 rounded-lg border bg-card px-3 py-3 text-sm font-medium text-muted-foreground">
                <Icon className="size-4 text-primary" />
                {category.label}
              </div>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {tips.transit.map((item, idx) => (
            <Card key={`transit-${idx}`} className="rounded-xl border-border shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {tips.prevention.map((item, idx) => (
            <Card key={`prevention-${idx}`} className="rounded-xl border-border shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {tips['first-aid'].map((item, idx) => (
            <Card key={`first-aid-${idx}`} className="rounded-xl border-border shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [schools, setSchools] = useState<School[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Abre busca no Google
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
      setSearchQuery('');
    }
  };

  return (
    <div>
      {/* SEÇÃO HERO COM IMAGEM DE FUNDO */}
      <section
        className="relative min-h-96 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/image_c4385570.jpg)',
        }}
      >
        {/* Overlay semitransparente */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Conteúdo da seção hero */}
        <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-8 sm:pt-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm font-semibold text-white">Segurança no entorno escolar</p>
              <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Caminhos mais seguros começam com atenção.
              </h1>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-gray-100">
                Orientações e informações da comunidade para tornar a chegada e a saída da escola mais tranquilas.
              </p>
            </div>
            <Button type="button" className="w-fit rounded-full" onClick={() => setIsReportFormOpen(true)}>
              <TriangleAlert className="mr-2 size-4" />
              Relatar uma situação
            </Button>
          </div>

          {/* BUSCA DO GOOGLE */}
          <div className="mt-8 max-w-2xl">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquise sobre segurança viária, rotas, escolas..."
                  className="w-full rounded-lg border-0 bg-white px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button type="submit" variant="default" size="lg" className="gap-2 rounded-lg">
                <Search className="size-4" />
                <span className="hidden sm:inline">Buscar</span>
              </Button>
            </form>
            <p className="mt-2 text-xs text-gray-200">Busca via Google para informações adicionais sobre segurança viária</p>
          </div>
        </div>
      </section>

      <ReportForm isOpen={isReportFormOpen} onClose={() => setIsReportFormOpen(false)} />

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

      <NeighborhoodInfo />

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
                <Card key={school.id} className="rounded-xl border-border shadow-none transition-colors hover:bg-accent/40">
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

      <SafetyTips />

      <section className="border-t py-12">
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
              <Button type="button" variant="outline" className="mt-4 rounded-full" onClick={() => setIsReportFormOpen(true)}>
                Fazer um relato
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
