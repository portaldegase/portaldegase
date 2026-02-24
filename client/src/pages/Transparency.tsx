import { trpc } from "@/lib/trpc";
import { Building2, Users, ClipboardList, Shield, Handshake, FileText, DollarSign, Scale, HelpCircle, Database } from "lucide-react";
import { Link } from "wouter";

const defaultItems = [
  { title: "Institucional", icon: Building2, section: "institucional" },
  { title: "Participação Social", icon: Users, section: "participacao" },
  { title: "Ações e Programas", icon: ClipboardList, section: "acoes" },
  { title: "Auditorias", icon: Shield, section: "auditorias" },
  { title: "Convênios e Transferências", icon: Handshake, section: "convenios" },
  { title: "Licitações e Contratos", icon: FileText, section: "licitacoes" },
  { title: "Receitas e Despesas", icon: DollarSign, section: "receitas" },
  { title: "Servidores", icon: Users, section: "servidores" },
  { title: "Informações Classificadas", icon: Scale, section: "classificadas" },
  { title: "Serviço de Informação ao Cidadão - SIC", icon: HelpCircle, section: "sic" },
  { title: "Perguntas Frequentes", icon: HelpCircle, section: "faq" },
  { title: "Dados Abertos", icon: Database, section: "dados-abertos" },
];

export default function Transparency() {
  const { data: items } = trpc.transparency.list.useQuery();

  return (
    <main id="main-content" className="py-8">
      <div className="container">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--degase-blue-dark)" }}>Transparência</h1>
        <p className="text-gray-600 mb-8">
          Acesse informações sobre a gestão pública do DEGASE, em conformidade com a Lei de Acesso à Informação (LAI).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {defaultItems.map((item) => (
            <div
              key={item.section}
              className="flex flex-col items-center justify-center p-6 rounded-lg text-white text-center hover:opacity-90 transition-opacity cursor-pointer"
              style={{ backgroundColor: "var(--degase-blue-medium)" }}
            >
              <item.icon size={32} className="mb-3 opacity-80" />
              <span className="text-sm font-medium">{item.title}</span>
            </div>
          ))}
        </div>

        {items && items.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--degase-blue-dark)" }}>Documentos e Links</h2>
            <div className="space-y-3">
              {items.map((item: any) => (
                <a
                  key={item.id}
                  href={item.linkUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-gray-50 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium" style={{ color: "var(--degase-blue-dark)" }}>{item.title}</h3>
                  {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
