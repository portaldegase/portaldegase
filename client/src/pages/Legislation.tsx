import { trpc } from "@/lib/trpc";
import { Scale, ExternalLink } from "lucide-react";

export default function Legislation() {
  const { data: page } = trpc.pages.getBySlug.useQuery({ slug: "legislacao" });

  if (page) {
    return (
      <main id="main-content" className="py-8">
        <div className="container max-w-4xl">
          <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--degase-blue-dark)" }}>{page.title}</h1>
          <div className="prose-degase" dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </main>
    );
  }

  const laws = [
    { title: "Estatuto da Criança e do Adolescente (ECA)", desc: "Lei nº 8.069/1990 - Dispõe sobre a proteção integral à criança e ao adolescente.", url: "http://www.planalto.gov.br/ccivil_03/leis/l8069.htm" },
    { title: "SINASE - Sistema Nacional de Atendimento Socioeducativo", desc: "Lei nº 12.594/2012 - Institui o Sistema Nacional de Atendimento Socioeducativo.", url: "http://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12594.htm" },
    { title: "Constituição Federal", desc: "Artigos 227 e 228 - Direitos da criança e do adolescente.", url: "http://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm" },
    { title: "Lei de Acesso à Informação", desc: "Lei nº 12.527/2011 - Regula o acesso a informações públicas.", url: "http://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm" },
    { title: "LGPD - Lei Geral de Proteção de Dados", desc: "Lei nº 13.709/2018 - Dispõe sobre a proteção de dados pessoais.", url: "http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" },
    { title: "Resolução CONANDA nº 119/2006", desc: "Dispõe sobre o Sistema Nacional de Atendimento Socioeducativo.", url: "#" },
  ];

  return (
    <main id="main-content" className="py-8">
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--degase-blue-dark)" }}>Legislação</h1>
        <p className="text-gray-600 mb-8">Principais marcos legais que regem o sistema socioeducativo brasileiro.</p>
        <div className="space-y-4">
          {laws.map((law) => (
            <a
              key={law.title}
              href={law.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <Scale size={24} className="mt-1 shrink-0" style={{ color: "var(--degase-blue-light)" }} />
                <div className="flex-1">
                  <h2 className="font-bold group-hover:underline" style={{ color: "var(--degase-blue-dark)" }}>
                    {law.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">{law.desc}</p>
                </div>
                <ExternalLink size={16} className="mt-1 shrink-0 text-gray-400" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
