import { trpc } from "@/lib/trpc";
import { Building2, Users, Target, BookOpen } from "lucide-react";

export default function About() {
  const { data: page } = trpc.pages.getBySlug.useQuery({ slug: "sobre" });

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

  return (
    <main id="main-content" className="py-8">
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--degase-blue-dark)" }}>
          Sobre o DEGASE
        </h1>

        <div className="prose-degase">
          <p>
            O <strong>Departamento Geral de Ações Socioeducativas (DEGASE)</strong> é o órgão do Governo do Estado do Rio de Janeiro
            responsável pela execução das medidas socioeducativas aplicadas pelo Poder Judiciário aos adolescentes em conflito com a lei,
            conforme previsto no Estatuto da Criança e do Adolescente (ECA) e no Sistema Nacional de Atendimento Socioeducativo (SINASE).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
              <Target className="mb-3" style={{ color: "var(--degase-blue-light)" }} size={32} />
              <h3 className="font-bold mb-2" style={{ color: "var(--degase-blue-dark)" }}>Missão</h3>
              <p className="text-sm text-gray-600">
                Executar as medidas socioeducativas com eficiência, promovendo a reinserção social dos adolescentes
                através de ações educativas, profissionalizantes e de saúde.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
              <BookOpen className="mb-3" style={{ color: "var(--degase-blue-light)" }} size={32} />
              <h3 className="font-bold mb-2" style={{ color: "var(--degase-blue-dark)" }}>Visão</h3>
              <p className="text-sm text-gray-600">
                Ser referência nacional na execução de medidas socioeducativas, garantindo os direitos dos adolescentes
                e contribuindo para a construção de uma sociedade mais justa.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
              <Users className="mb-3" style={{ color: "var(--degase-blue-light)" }} size={32} />
              <h3 className="font-bold mb-2" style={{ color: "var(--degase-blue-dark)" }}>Valores</h3>
              <p className="text-sm text-gray-600">
                Respeito aos direitos humanos, transparência, ética, compromisso social, valorização dos servidores
                e promoção da cidadania.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
              <Building2 className="mb-3" style={{ color: "var(--degase-blue-light)" }} size={32} />
              <h3 className="font-bold mb-2" style={{ color: "var(--degase-blue-dark)" }}>Estrutura</h3>
              <p className="text-sm text-gray-600">
                O DEGASE conta com unidades de internação, internação provisória, semiliberdade e meio aberto
                distribuídas por todo o Estado do Rio de Janeiro.
              </p>
            </div>
          </div>

          <h2>Diretor Geral</h2>
          <p>
            <strong>Victor Hugo Poubel</strong> - O Departamento Geral de Ações Socioeducativas (Degase) tem um novo diretor-geral.
            O delegado federal assumiu a direção do órgão com o compromisso de fortalecer as políticas socioeducativas
            e modernizar a gestão do sistema.
          </p>
        </div>
      </div>
    </main>
  );
}
