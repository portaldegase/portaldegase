import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export function AdminAnalytics() {
  const [days] = useState(30);
  const { data: topPosts, isLoading: loadingTop } = trpc.analytics.getTopPosts.useQuery({ limit: 10 });
  const { data: viewsData, isLoading: loadingViews } = trpc.analytics.getPostViewsLastDays.useQuery({ days });

  const totalViews = topPosts?.reduce((sum, post) => sum + (post.viewCount || 0), 0) || 0;
  const averageViews = topPosts && topPosts.length > 0 ? Math.round(totalViews / topPosts.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Análise de Notícias</h1>
        <p className="text-gray-600 mt-2">Visualize dados de engajamento e popularidade das suas notícias</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total de Visualizações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalViews.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-gray-500 mt-1">Últimos {days} dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Notícias Publicadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{topPosts?.length || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Com dados de visualização</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Média de Visualizações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageViews.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-gray-500 mt-1">Por notícia</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 10 Notícias Mais Visualizadas</CardTitle>
          <CardDescription>Ranking de notícias por número de visualizações</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingTop ? (
            <div className="text-center py-8">Carregando dados...</div>
          ) : topPosts && topPosts.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topPosts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="postId" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="viewCount" fill="#0088FE" name="Visualizações" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">Nenhum dado disponível</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visualizações por Período</CardTitle>
          <CardDescription>Tendência de visualizações nos últimos {days} dias</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingViews ? (
            <div className="text-center py-8">Carregando dados...</div>
          ) : viewsData && viewsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="viewCount" stroke="#00C49F" name="Visualizações" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-500">Nenhum dado disponível</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes de Notícias</CardTitle>
          <CardDescription>Informações detalhadas de cada notícia</CardDescription>
        </CardHeader>
        <CardContent>
          {topPosts && topPosts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">ID da Notícia</th>
                    <th className="text-left py-2 px-4">Visualizações</th>
                    <th className="text-left py-2 px-4">Visitantes Únicos</th>
                    <th className="text-left py-2 px-4">Última Visualização</th>
                  </tr>
                </thead>
                <tbody>
                  {topPosts.map((post) => (
                    <tr key={post.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">#{post.postId}</td>
                      <td className="py-2 px-4">{post.viewCount?.toLocaleString('pt-BR') || 0}</td>
                      <td className="py-2 px-4">{post.uniqueVisitors?.toLocaleString('pt-BR') || 0}</td>
                      <td className="py-2 px-4">{post.lastViewedAt ? new Date(post.lastViewedAt).toLocaleDateString('pt-BR') : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">Nenhum dado disponível</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
