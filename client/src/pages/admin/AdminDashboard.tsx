import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, MessageSquare, Share2, Settings } from 'lucide-react';

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Painel de Administração</h1>
        <p className="text-gray-600 mt-2">Gerencie seu CMS DEGASE</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              <CardTitle>Análise de Notícias</CardTitle>
            </div>
            <CardDescription>Visualize dados de engajamento e popularidade</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/analytics">
              <Button className="w-full">Acessar Analytics</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-green-500" />
              <CardTitle>Moderação de Comentários</CardTitle>
            </div>
            <CardDescription>Aprove ou rejeite comentários pendentes</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/comments">
              <Button className="w-full">Moderar Comentários</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Share2 className="w-6 h-6 text-purple-500" />
              <CardTitle>Compartilhamento em Redes Sociais</CardTitle>
            </div>
            <CardDescription>Configure e gerencie compartilhamentos automáticos</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/social">
              <Button className="w-full">Configurar Redes Sociais</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-gray-500" />
              <CardTitle>Configurações</CardTitle>
            </div>
            <CardDescription>Gerencie as configurações do portal</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/settings">
              <Button className="w-full">Acessar Configurações</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
