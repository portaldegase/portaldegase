import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Newspaper, MessageSquare, BarChart3, Share2 } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">DEGASE - CMS de Notícias</h1>
          <p className="text-lg text-blue-100">Departamento Geral de Ações Socioeducativas</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold mb-4">Bem-vindo ao Portal de Notícias</h2>
            <p className="text-gray-600 mb-6">
              Este é o sistema de gerenciamento de conteúdo (CMS) da DEGASE, desenvolvido para publicar e compartilhar 
              notícias, informações e atualizações sobre as ações socioeducativas.
            </p>
            
            {!isAuthenticated ? (
              <div className="flex gap-4">
                <a href={getLoginUrl()}>
                  <Button size="lg">Fazer Login</Button>
                </a>
                <Button size="lg" variant="outline">Saiba Mais</Button>
              </div>
            ) : (
              <div className="flex gap-4">
                {isAdmin && (
                  <Link href="/admin">
                    <Button size="lg">Ir para Painel de Admin</Button>
                  </Link>
                )}
                <Button size="lg" variant="outline">Ver Notícias</Button>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Funcionalidades Principais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Newspaper className="w-6 h-6 text-blue-600" />
                  <CardTitle className="text-lg">Notícias</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Publique e gerencie notícias sobre as ações socioeducativas da DEGASE
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                  <CardTitle className="text-lg">Comentários</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Permita que leitores comentem nas notícias com moderação
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                  <CardTitle className="text-lg">Análise</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Visualize dados de engajamento e popularidade das notícias
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Share2 className="w-6 h-6 text-orange-600" />
                  <CardTitle className="text-lg">Compartilhamento</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Compartilhe notícias automaticamente em redes sociais
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recent News Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Últimas Notícias</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Notícia {i}</CardTitle>
                  <CardDescription>Publicada há 2 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
                  </p>
                  <Button variant="outline" className="w-full">Ler Mais</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Admin Section */}
        {isAdmin && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Área Administrativa</h2>
            <div className="bg-blue-50 rounded-lg p-8 border border-blue-200">
              <p className="text-gray-700 mb-6">
                Você está logado como administrador. Acesse o painel de administração para gerenciar notícias, 
                comentários, análise de dados e configurações de redes sociais.
              </p>
              <Link href="/admin">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Acessar Painel de Administração
                </Button>
              </Link>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Sobre DEGASE</h3>
              <p className="text-gray-400">
                Departamento Geral de Ações Socioeducativas
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Links Rápidos</h3>
              <ul className="text-gray-400 space-y-2">
                <li><a href="#" className="hover:text-white">Notícias</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
                <li><a href="#" className="hover:text-white">Política de Privacidade</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Redes Sociais</h3>
              <ul className="text-gray-400 space-y-2">
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2026 DEGASE. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
