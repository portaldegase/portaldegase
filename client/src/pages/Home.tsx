import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowRight, Play, Building2, FileText, Users, Scale, DollarSign, HelpCircle, Database, Shield, Handshake, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";

function BannerSection() {
  const [currentBanner, setCurrentBanner] = useState(0);

  const activeBanners = useMemo(() => [
    { id: 0, title: "Escola de Gestão Socioeducativa Paulo Freire", subtitle: "Formação continuada para profissionais do sistema socioeducativo", imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663378282282/uNiLAdRNGIEljZJZ.webp", linkUrl: "#" }
  ], []);

  return (
    <section aria-label="Banners em destaque" className="relative">
      <div className="w-full overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
        <div className="container py-6 md:py-10 flex items-center">
          <div className="flex-1">
            <h2 className="text-xl md:text-3xl font-bold text-black leading-tight" style={{display: 'none'}}>
              {activeBanners[currentBanner]?.title}
            </h2>
            {activeBanners[currentBanner]?.subtitle && (
              <p className="mt-2 text-sm md:text-base text-black/80">
                {activeBanners[currentBanner]?.subtitle}
              </p>
            )}
          </div>
          {activeBanners[currentBanner]?.imageUrl && (
            <img
              src={activeBanners[currentBanner].imageUrl}
              alt={activeBanners[currentBanner].title}
              className="hidden md:block h-24 lg:h-32 object-contain rounded-lg" style={{width: '768px', height: '176px', maxWidth: '100%'}}
            />
          )}
        </div>
      </div>
      {activeBanners.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {activeBanners.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => setCurrentBanner(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentBanner ? "bg-white" : "bg-white/50"}`}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function NewsSection() {
  // Placeholder news if no data
  const placeholderNews = useMemo(() => [
    { id: 1, title: "Nova unidade do Degase oferece mais infraestrutura, segurança e fortalece o atendimento regionalizado", excerpt: "Governo do Estado inaugura Centro de Socioeducação em São Gonçalo e amplia atendimento a adolescentes.", slug: "nova-unidade-degase", featuredImage: null },
    { id: 2, title: "Degase firma cooperação técnica com Fundação Casa para fortalecer políticas socioeducativas", excerpt: "Parceria visa modernizar a gestão e ampliar a proteção a adolescentes em cumprimento de medidas socioeducativas.", slug: "cooperacao-fundacao-casa", featuredImage: null },
    { id: 3, title: "DEGASE certifica 620 agentes no Curso de Capacitação do RAS por meio da DIVCAP", excerpt: "Investimento em formação fortalece a segurança institucional e a gestão do sistema socioeducativo.", slug: "certificacao-agentes", featuredImage: null },
    { id: 4, title: "Degase executará obras de adequação estrutural e expansão da rede socioeducativa em 2026", excerpt: "Governo do Estado inicia, em 2026, obras de reestruturação em unidades do Degase.", slug: "obras-expansao", featuredImage: null },
    { id: 5, title: "DEGASE participa de debates no Congresso Nacional sobre os impactos do PL 1473/2025", excerpt: "Fortalecimento das Políticas Públicas Direcionadas ao Atendimento Socioeducativo.", slug: "debates-congresso", featuredImage: null },
  ], []);

  const items = placeholderNews;
  const topNews = items.slice(0, 3);
  const bottomNews = items.slice(3, 5);

  return (
    <section aria-labelledby="news-heading" className="py-10 bg-white">
      <div className="container">
        {/* Top 3 news in grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {topNews.map((item: any) => (
            <article key={item.id} className="group">
              <Link href={`/noticias/${item.slug}`} className="block">
                <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden mb-3">
                  {item.featuredImage ? (
                    <img src={item.featuredImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "var(--degase-blue-dark)" }}>
                      <FileText className="text-white/30" size={48} />
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-sm md:text-base leading-tight group-hover:underline" style={{ color: "var(--degase-blue-dark)" }}>
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mt-2 line-clamp-3">{item.excerpt}</p>
              </Link>
            </article>
          ))}
        </div>

        {/* Bottom 2 news */}
        {bottomNews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {bottomNews.map((item: any) => (
              <article key={item.id} className="group flex gap-4">
                <div className="w-40 h-28 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                  {item.featuredImage ? (
                    <img src={item.featuredImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "var(--degase-blue-dark)" }}>
                      <FileText className="text-white/30" size={32} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Link href={`/noticias/${item.slug}`}>
                    <h3 className="font-bold text-sm leading-tight group-hover:underline" style={{ color: "var(--degase-blue-dark)" }}>
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-3">{item.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/noticias">
            <Button variant="outline" className="border-2 font-semibold text-xs uppercase tracking-wider" style={{ borderColor: "var(--degase-blue-dark)", color: "var(--degase-blue-dark)" }}>
              Veja a lista completa de notícias
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function VideosSection() {
  const videoUrl = "https://www.youtube.com/embed/FkQqOZXU3xk?rel=0";

  return (
    <section aria-labelledby="videos-heading" className="py-10" style={{ backgroundColor: "var(--degase-gray-light)" }}>
      <div className="container">
        <h2 id="videos-heading" className="text-2xl md:text-3xl font-bold text-center mb-2" style={{ color: "var(--degase-blue-light)" }}>
          Vídeos
        </h2>
        <div className="w-16 h-1 mx-auto mb-8" style={{ backgroundColor: "var(--degase-blue-dark)" }} />

        <div className="max-w-2xl mx-auto">
          <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={videoUrl}
              title="TV Degase"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="text-center mt-6">
          <a href="https://www.youtube.com/@tvdegase" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-2 font-semibold text-xs uppercase tracking-wider" style={{ borderColor: "var(--degase-blue-dark)", color: "var(--degase-blue-dark)" }}>
              Veja a lista completa de vídeos
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

function TransparencySection() {
  const transparencyLinks = [
    { label: "Institucional", icon: Building2, href: "/transparencia" },
    { label: "Participação Social", icon: Users, href: "/transparencia" },
    { label: "Ações e Programas", icon: ClipboardList, href: "/transparencia" },
    { label: "Auditorias", icon: Shield, href: "/transparencia" },
    { label: "Convênios e Transferências", icon: Handshake, href: "/transparencia" },
    { label: "Licitações e Contratos", icon: FileText, href: "/transparencia" },
    { label: "Receitas e Despesas", icon: DollarSign, href: "/transparencia" },
    { label: "Servidores", icon: Users, href: "/transparencia" },
    { label: "Informações Classificadas", icon: Scale, href: "/transparencia" },
    { label: "Serviço de Informação ao Cidadão - SIC", icon: HelpCircle, href: "/transparencia" },
    { label: "Perguntas Frequentes", icon: HelpCircle, href: "/transparencia" },
    { label: "Dados Abertos", icon: Database, href: "/transparencia" },
  ];

  return (
    <section aria-labelledby="transparency-heading" className="py-10 text-white" style={{ backgroundColor: "var(--degase-blue-dark)" }}>
      <div className="container">
        <h2 id="transparency-heading" className="text-2xl md:text-3xl font-bold text-center mb-2">
          Transparência
        </h2>
        <div className="w-16 h-1 mx-auto mb-8" style={{ backgroundColor: "var(--degase-gold)" }} />

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Director Info */}
          <div>
            <div className="text-xs uppercase tracking-wider opacity-70 mb-1">Diretor Geral</div>
            <h3 className="text-xl font-bold mb-3">Victor Hugo Poubel</h3>
            <p className="text-sm opacity-80 mb-4">
              O Departamento Geral de Ações Socioeducativas (Degase) tem um novo diretor-geral. O delegado federal...
            </p>
            <div className="flex gap-2">
              <Link href="/sobre">
                <Button size="sm" variant="outline" className="text-white border-white/30 hover:bg-white/10 bg-transparent text-xs">
                  Saiba Mais
                </Button>
              </Link>
              <Button size="sm" variant="outline" className="text-white border-white/30 hover:bg-white/10 bg-transparent text-xs">
                Agenda
              </Button>
            </div>

            <div className="mt-6 space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <span className="opacity-70">📍</span>
                Rua Taifeiro Osmar de Moraes, 111, Galeão - Ilha do Governador, RJ - CEP 21941-455
              </p>
              <p className="flex items-center gap-2">
                <span className="opacity-70">🕐</span>
                Seg-Sex 9:00-17:00
              </p>
              <p className="flex items-center gap-2">
                <span className="opacity-70">📞</span>
                (21) 2334-6674
              </p>
              <p className="flex items-center gap-2">
                <span className="opacity-70">✉️</span>
                ouvidoria@novodegase.rj.gov.br
              </p>
            </div>
          </div>

          {/* Transparency Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {transparencyLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center p-4 rounded-lg text-center text-sm font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "var(--degase-blue-medium)" }}
              >
                <item.icon size={24} className="mb-2 opacity-80" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function UnitsSection() {
  const displayUnits: any[] = [];

  return (
    <section aria-labelledby="units-heading" className="py-10 bg-white">
      <div className="container">
        <h2 id="units-heading" className="text-2xl md:text-3xl font-bold text-center mb-2" style={{ color: "var(--degase-blue-light)" }}>
          Links Úteis
        </h2>
        <div className="w-16 h-1 mx-auto mb-4" style={{ backgroundColor: "var(--degase-blue-dark)" }} />

        <h3 className="text-xl font-bold text-center mb-6" style={{ color: "var(--degase-blue-dark)" }}>
          Unidades do Degase
        </h3>

        {displayUnits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {displayUnits.map((unit: any) => (
              <div key={unit.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-sm" style={{ color: "var(--degase-blue-dark)" }}>{unit.name}</h4>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-sm">As unidades serão carregadas após cadastro no painel administrativo.</p>
        )}

        <div className="text-center mt-6">
          <Link href="/unidades">
            <Button variant="outline" className="border-2 font-semibold text-xs uppercase tracking-wider" style={{ borderColor: "var(--degase-blue-dark)", color: "var(--degase-blue-dark)" }}>
              Ver todas as unidades
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main id="main-content" role="main">
      <BannerSection />
      <NewsSection />
      <VideosSection />
      <TransparencySection />
      <UnitsSection />
    </main>
  );
}
