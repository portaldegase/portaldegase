import { MapPin, Clock, Phone, Mail, Globe } from "lucide-react";

export default function Contact() {
  return (
    <main id="main-content" className="py-8">
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--degase-blue-dark)" }}>Contato</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--degase-blue-accent)" }}>Informações de Contato</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="mt-0.5 shrink-0" style={{ color: "var(--degase-blue-light)" }} />
                <div>
                  <p className="font-medium">Endereço</p>
                  <p className="text-sm text-gray-600">Rua Taifeiro Osmar de Moraes, 111<br />Galeão - Ilha do Governador, RJ<br />CEP 21941-455</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={20} className="mt-0.5 shrink-0" style={{ color: "var(--degase-blue-light)" }} />
                <div>
                  <p className="font-medium">Horário de Funcionamento</p>
                  <p className="text-sm text-gray-600">Segunda a Sexta, das 9:00 às 17:00</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={20} className="mt-0.5 shrink-0" style={{ color: "var(--degase-blue-light)" }} />
                <div>
                  <p className="font-medium">Telefone</p>
                  <p className="text-sm text-gray-600"><a href="tel:+552123346674" className="hover:underline">(21) 2334-6674</a></p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={20} className="mt-0.5 shrink-0" style={{ color: "var(--degase-blue-light)" }} />
                <div>
                  <p className="font-medium">Ouvidoria</p>
                  <p className="text-sm text-gray-600"><a href="mailto:ouvidoria@novodegase.rj.gov.br" className="hover:underline">ouvidoria@novodegase.rj.gov.br</a></p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe size={20} className="mt-0.5 shrink-0" style={{ color: "var(--degase-blue-light)" }} />
                <div>
                  <p className="font-medium">Site Oficial</p>
                  <p className="text-sm text-gray-600"><a href="https://rj.gov.br/degase" target="_blank" rel="noopener noreferrer" className="hover:underline">rj.gov.br/degase</a></p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--degase-blue-accent)" }}>Ouvidoria</h2>
            <div className="p-6 rounded-lg bg-gray-50 border">
              <p className="text-sm text-gray-600 mb-4">
                A Ouvidoria do DEGASE é o canal de comunicação entre o cidadão e a instituição. Através dela, você pode registrar
                reclamações, sugestões, elogios e denúncias relacionadas aos serviços prestados pelo Departamento.
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Para registrar sua manifestação, entre em contato pelos canais abaixo:
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><strong>E-mail:</strong> ouvidoria@novodegase.rj.gov.br</li>
                <li><strong>Telefone:</strong> (21) 2334-6674</li>
                <li><strong>Presencial:</strong> Rua Taifeiro Osmar de Moraes, 111 - Galeão</li>
              </ul>
            </div>

            <h2 className="text-xl font-bold mt-8 mb-4" style={{ color: "var(--degase-blue-accent)" }}>SIC - Serviço de Informação ao Cidadão</h2>
            <div className="p-6 rounded-lg bg-gray-50 border">
              <p className="text-sm text-gray-600">
                O SIC atende às demandas de acesso à informação pública, conforme a Lei nº 12.527/2011 (Lei de Acesso à Informação).
                Qualquer cidadão pode solicitar informações sobre as atividades do DEGASE.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
