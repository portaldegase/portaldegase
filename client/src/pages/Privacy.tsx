export default function Privacy() {
  return (
    <main id="main-content" className="py-8">
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--degase-blue-dark)" }}>
          Política de Privacidade
        </h1>
        <div className="prose-degase">
          <p><em>Última atualização: {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</em></p>

          <h2>1. Introdução</h2>
          <p>
            O Departamento Geral de Ações Socioeducativas (DEGASE), órgão do Governo do Estado do Rio de Janeiro,
            está comprometido com a proteção da privacidade e dos dados pessoais de seus usuários, em conformidade
            com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD) e demais legislações aplicáveis.
          </p>

          <h2>2. Dados Coletados</h2>
          <p>Este site pode coletar os seguintes tipos de dados:</p>
          <ul>
            <li><strong>Dados de navegação:</strong> endereço IP, tipo de navegador, páginas acessadas, data e hora de acesso;</li>
            <li><strong>Cookies essenciais:</strong> necessários para o funcionamento básico do site;</li>
            <li><strong>Dados fornecidos voluntariamente:</strong> informações enviadas através de formulários de contato ou ouvidoria.</li>
          </ul>

          <h2>3. Finalidade do Tratamento</h2>
          <p>Os dados coletados são utilizados para:</p>
          <ul>
            <li>Garantir o funcionamento adequado do site;</li>
            <li>Melhorar a experiência de navegação;</li>
            <li>Atender às solicitações dos cidadãos;</li>
            <li>Cumprir obrigações legais e regulatórias;</li>
            <li>Produzir estatísticas de acesso (de forma anonimizada).</li>
          </ul>

          <h2>4. Base Legal</h2>
          <p>
            O tratamento de dados pessoais pelo DEGASE tem como base legal o cumprimento de obrigação legal (Art. 7º, II, LGPD),
            a execução de políticas públicas (Art. 7º, III, LGPD) e o legítimo interesse (Art. 7º, IX, LGPD).
          </p>

          <h2>5. Compartilhamento de Dados</h2>
          <p>
            Os dados pessoais não serão compartilhados com terceiros, exceto quando necessário para o cumprimento
            de obrigações legais ou mediante determinação judicial.
          </p>

          <h2>6. Segurança dos Dados</h2>
          <p>
            O DEGASE adota medidas técnicas e organizacionais adequadas para proteger os dados pessoais contra
            acesso não autorizado, destruição, perda, alteração ou qualquer forma de tratamento inadequado.
          </p>

          <h2>7. Direitos do Titular</h2>
          <p>Em conformidade com a LGPD, o titular dos dados tem direito a:</p>
          <ul>
            <li>Confirmar a existência de tratamento de dados;</li>
            <li>Acessar seus dados pessoais;</li>
            <li>Solicitar a correção de dados incompletos ou desatualizados;</li>
            <li>Solicitar a eliminação de dados desnecessários;</li>
            <li>Revogar o consentimento a qualquer momento;</li>
            <li>Obter informações sobre o compartilhamento de dados.</li>
          </ul>

          <h2>8. Cookies</h2>
          <p>
            Este site utiliza cookies essenciais para seu funcionamento. Cookies são pequenos arquivos de texto
            armazenados em seu dispositivo que ajudam a melhorar sua experiência de navegação.
            Ao continuar navegando, você concorda com o uso de cookies essenciais.
          </p>

          <h2>9. Contato do Encarregado de Dados (DPO)</h2>
          <p>
            Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de dados pessoais,
            entre em contato com o Encarregado de Dados do DEGASE:
          </p>
          <ul>
            <li><strong>E-mail:</strong> ouvidoria@novodegase.rj.gov.br</li>
            <li><strong>Telefone:</strong> (21) 2334-6674</li>
            <li><strong>Endereço:</strong> Rua Taifeiro Osmar de Moraes, 111 - Galeão, Ilha do Governador, RJ</li>
          </ul>

          <h2>10. Alterações nesta Política</h2>
          <p>
            Esta política pode ser atualizada periodicamente. Recomendamos que consulte esta página
            regularmente para se manter informado sobre eventuais alterações.
          </p>
        </div>
      </div>
    </main>
  );
}
