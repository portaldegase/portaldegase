import { trpc } from "@/lib/trpc";
import { Shield, Users, BookOpen, Briefcase, Heart, GraduationCap } from "lucide-react";

export default function Services() {
  const { data: page } = trpc.pages.getBySlug.useQuery({ slug: "servicos" });

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

  const services = [
    { icon: Shield, title: "Medidas Socioeducativas", desc: "Execução das medidas de internação, internação provisória, semiliberdade e liberdade assistida." },
    { icon: GraduationCap, title: "Educação", desc: "Programas educacionais para adolescentes em cumprimento de medidas socioeducativas." },
    { icon: Briefcase, title: "Profissionalização", desc: "Cursos profissionalizantes e capacitação para inserção no mercado de trabalho." },
    { icon: Heart, title: "Saúde", desc: "Atendimento de saúde integral, incluindo saúde mental e acompanhamento psicossocial." },
    { icon: Users, title: "Assistência Social", desc: "Acompanhamento social dos adolescentes e suas famílias durante o cumprimento das medidas." },
    { icon: BookOpen, title: "Cultura e Esporte", desc: "Atividades culturais, artísticas e esportivas como ferramentas de ressocialização." },
  ];

  return (
    <main id="main-content" className="py-8">
      <div className="container">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--degase-blue-dark)" }}>Serviços</h1>
        <p className="text-gray-600 mb-8">Conheça os serviços oferecidos pelo DEGASE no atendimento socioeducativo.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.title} className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <s.icon size={36} className="mb-4" style={{ color: "var(--degase-blue-light)" }} />
              <h2 className="text-lg font-bold mb-2" style={{ color: "var(--degase-blue-dark)" }}>{s.title}</h2>
              <p className="text-sm text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
