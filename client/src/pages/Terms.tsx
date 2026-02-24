export default function Terms() {
  return (
    <main id="main-content" className="py-8">
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--degase-blue-dark)" }}>
          Termos de Uso
        </h1>
        <div className="prose-degase">
          <p><em>Última atualização: {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</em></p>

          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e utilizar este site, você concorda com os presentes Termos de Uso.
            Caso não concorde com algum dos termos, recomendamos que não utilize o site.
          </p>

          <h2>2. Objetivo do Site</h2>
          <p>
            Este site tem como objetivo disponibilizar informações institucionais do Departamento Geral de Ações
            Socioeducativas (DEGASE), incluindo notícias, serviços, legislação, transparência pública e canais de contato.
          </p>

          <h2>3. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo publicado neste site, incluindo textos, imagens, logotipos, ícones e demais materiais,
            é de propriedade do Governo do Estado do Rio de Janeiro e do DEGASE, protegido pela legislação brasileira
            de direitos autorais e propriedade intelectual.
          </p>

          <h2>4. Uso Permitido</h2>
          <p>O conteúdo deste site pode ser utilizado para:</p>
          <ul>
            <li>Consulta e informação pessoal;</li>
            <li>Fins educacionais e de pesquisa, desde que citada a fonte;</li>
            <li>Reprodução jornalística, desde que citada a fonte.</li>
          </ul>

          <h2>5. Uso Proibido</h2>
          <p>É expressamente proibido:</p>
          <ul>
            <li>Utilizar o conteúdo para fins comerciais sem autorização;</li>
            <li>Modificar ou alterar o conteúdo de forma que desvirtue seu sentido original;</li>
            <li>Utilizar mecanismos automatizados para coleta massiva de dados;</li>
            <li>Tentar acessar áreas restritas do site sem autorização.</li>
          </ul>

          <h2>6. Responsabilidades</h2>
          <p>
            O DEGASE se esforça para manter as informações atualizadas e precisas, mas não garante a
            ausência de erros ou omissões. O uso das informações é de responsabilidade do usuário.
          </p>

          <h2>7. Links Externos</h2>
          <p>
            Este site pode conter links para sites externos. O DEGASE não se responsabiliza pelo conteúdo,
            políticas de privacidade ou práticas de sites de terceiros.
          </p>

          <h2>8. Legislação Aplicável</h2>
          <p>
            Estes Termos de Uso são regidos pela legislação brasileira, em especial pela Lei nº 13.709/2018 (LGPD),
            Lei nº 12.527/2011 (Lei de Acesso à Informação) e demais normas aplicáveis.
          </p>

          <h2>9. Contato</h2>
          <p>
            Para dúvidas sobre estes Termos de Uso, entre em contato através do e-mail
            ouvidoria@novodegase.rj.gov.br ou pelo telefone (21) 2334-6674.
          </p>
        </div>
      </div>
    </main>
  );
}
