import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AdminServiceAnalytics() {
  const { data: servicesAnalytics } = trpc.services.getAnalytics.useQuery();

  if (!servicesAnalytics || servicesAnalytics.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhum dado de analytics disponível ainda.</p>
      </div>
    );
  }

  // Preparar dados para gráfico de barras
  const chartData = servicesAnalytics.map((item: any) => ({
    name: item.service.name,
    clicks: item.analytics?.clickCount || 0,
  })).sort((a: any, b: any) => b.clicks - a.clicks);

  // Cores para o gráfico de pizza
  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

  // Total de cliques
  const totalClicks = chartData.reduce((sum: number, item: any) => sum + item.clicks, 0);

  // Top 5 serviços
  const topServices = chartData.slice(0, 5);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Estatísticas de Serviços</h1>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <p className="text-blue-600 text-sm font-medium">Total de Cliques</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">{totalClicks}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <p className="text-green-600 text-sm font-medium">Serviços Cadastrados</p>
          <p className="text-3xl font-bold text-green-900 mt-2">{servicesAnalytics.length}</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <p className="text-purple-600 text-sm font-medium">Média de Cliques</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">
            {Math.round(totalClicks / servicesAnalytics.length)}
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Gráfico de Barras */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Cliques por Serviço</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clicks" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Pizza - Top 5 */}
        {topServices.length > 0 && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Top 5 Serviços</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topServices}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="clicks"
                >
                  {topServices.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Tabela detalhada */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Detalhes de Cada Serviço</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-200 px-4 py-2 text-left">Serviço</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Total de Cliques</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Última Visita</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Percentual</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2 font-medium">{item.name}</td>
                  <td className="border border-gray-200 px-4 py-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {item.clicks}
                    </span>
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {servicesAnalytics[index]?.analytics?.lastClickedAt
                      ? new Date(servicesAnalytics[index].analytics.lastClickedAt).toLocaleDateString("pt-BR")
                      : "Nunca"}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {totalClicks > 0 ? ((item.clicks / totalClicks) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
