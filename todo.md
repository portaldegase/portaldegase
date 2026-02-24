# DEGASE CMS - Project TODO

## Banco de Dados e Schema
- [x] Schema de categorias (notícias, comunicados, legislação, páginas)
- [x] Schema de posts/conteúdo com suporte WYSIWYG
- [x] Schema de tags para organização de conteúdo
- [x] Schema de páginas institucionais
- [x] Schema de banners/carrossel
- [x] Schema de vídeos institucionais
- [x] Schema de documentos de transparência
- [x] Schema de unidades do DEGASE
- [x] Schema de configurações do site

## Backend - Routers tRPC
- [x] CRUD de posts (notícias, comunicados)
- [x] CRUD de categorias
- [x] CRUD de tags
- [x] CRUD de páginas institucionais
- [x] CRUD de banners
- [x] CRUD de vídeos
- [x] CRUD de documentos de transparência
- [x] CRUD de unidades
- [x] Sistema de busca interna
- [x] Gestão de configurações do site
- [x] Controle de acesso por role (admin/user)

## Frontend Público
- [x] Header com barra gov.br, logo, busca
- [x] Banner/carrossel principal
- [x] Seção de notícias (grid 3+2 colunas)
- [x] Seção de vídeos com embed YouTube
- [x] Seção de transparência com grid de links
- [x] Seção Links Úteis e Unidades
- [x] Rodapé institucional com contato e redes sociais
- [x] Página de notícia individual
- [x] Página de listagem de notícias
- [x] Página Sobre/Institucional
- [x] Página de Serviços
- [x] Página de Legislação
- [x] Página de Transparência
- [x] Página de Contato
- [x] Sistema de busca com resultados
- [x] Identidade visual azul/branco oficial

## Painel Administrativo
- [x] Dashboard com estatísticas
- [x] Gerenciamento de notícias com editor WYSIWYG
- [x] Gerenciamento de categorias e tags
- [x] Gerenciamento de páginas institucionais
- [x] Gerenciamento de banners
- [x] Gerenciamento de vídeos
- [x] Gerenciamento de documentos
- [x] Gerenciamento de unidades
- [x] Configurações do site

## Acessibilidade WCAG 2.1
- [x] Alto contraste
- [x] Ajuste de tamanho de fonte
- [x] Navegação por teclado
- [x] Compatibilidade com leitores de tela (ARIA)
- [x] Skip navigation links

## LGPD e Segurança
- [x] Política de Privacidade
- [x] Termos de Uso
- [x] Banner de cookies com gestão de consentimento
- [x] Preparação SSL (headers de segurança)
- [x] CSP headers

## Testes
- [x] Testes unitários para routers (32 testes passando)
- [x] Testes de autenticação e autorização

## Documentação
- [x] Manual de migração de ambientes (Manus → Homologação → Produção)

## Upload de Imagens
- [x] Endpoint tRPC para upload de imagens (validação, armazenamento S3)
- [x] Integração de upload no editor WYSIWYG TipTap
- [x] Validação de tipo e tamanho de arquivo
- [x] Preview de imagem durante upload
- [x] Tratamento de erros de upload
- [x] Testes do sistema de upload (14 testes passando)

## Edição de Imagens
- [x] Instalar biblioteca react-easy-crop
- [x] Criar componente ImageEditor com crop
- [x] Adicionar controle de redimensionamento
- [x] Integrar editor no fluxo de upload
- [x] Testes de edição de imagens (46 testes passando)

## Edição de Páginas Prontas
- [x] Permitir edição de páginas institucionais no menu do CMS
- [x] Listagem de páginas editáveis no painel admin

## Administração Geral
- [x] Criar página de configurações gerais do portal
- [x] Permitir editar título do portal
- [x] Permitir editar favicon
- [x] Permitir editar logo
- [x] Permitir editar texto do rodapé
- [x] Salvar configurações no banco de dados

## Perfil de Contribuidor
- [x] Adicionar role 'contributor' ao schema
- [x] Adicionar categoryId ao schema de usuários
- [x] Implementar controle de acesso por categoria
- [x] Contributors só podem editar notícias de sua categoria
- [x] Apenas admin pode postar em todas as categorias
- [x] Página de gerenciamento de contribuidores (admin)

## Histórico de Edições
- [x] Tabelas de histórico para posts e pages no banco de dados
- [x] Funções de criação e gerenciamento de versões
- [x] Endpoints tRPC para listar e reverter versões
- [x] Componentes UI para visualizar histórico
- [x] Modal de visualização de versões
- [x] Testes do sistema de histórico (38 testes passando)
