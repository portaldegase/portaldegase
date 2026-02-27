import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, TrendingUp, FileText } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

export default function AdminDocumentStats() {
  const { data: stats, isLoading } = trpc.documents.getDownloadStats.useQuery();
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);
  const { data: documentStats } = trpc.documents.getDocumentStats.useQuery(
    { documentId: selectedDocument! },
    { enabled: selectedDocument !== null }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "var(--degase-blue-dark)" }} />
      </div>
    );
  }

  const chartData = stats?.map((stat: any) => ({
    name: stat.documents?.name || "Desconhecido",
    downloads: stat.totalDownloads,
    documentId: stat.documentId,
  })) || [];

  const topDocuments = chartData.slice(0, 5);
  const totalDownloads = chartData.reduce((sum, item) => sum + item.downloads, 0);

  const COLORS = ["#1e40af", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--degase-blue-dark)" }}>
            Estatísticas de Downloads
          </h1>
          <p className="text-gray-600 mt-2">Acompanhe o uso dos documentos publicados</p>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total de Downloads</p>
              <p className="text-3xl font-bold mt-2" style={{ color: "var(--degase-blue-dark)" }}>
                {totalDownloads}
              </p>
            </div>
            <Download size={40} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Documentos Publicados</p>
              <p className="text-3xl font-bold mt-2" style={{ color: "var(--degase-blue-dark)" }}>
                {chartData.length}
              </p>
            </div>
            <FileText size={40} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Média de Downloads</p>
              <p className="text-3xl font-bold mt-2" style={{ color: "var(--degase-blue-dark)" }}>
                {chartData.length > 0 ? Math.round(totalDownloads / chartData.length) : 0}
              </p>
            </div>
            <TrendingUp size={40} className="text-blue-200" />
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-bold mb-4" style={{ color: "var(--degase-blue-dark)" }}>
            Top 5 Documentos Mais Baixados
          </h2>
          {topDocuments.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topDocuments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="downloads" fill="var(--degase-blue-dark)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum dado disponível</p>
          )}
        </div>

        {/* Gráfico de Pizza */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-bold mb-4" style={{ color: "var(--degase-blue-dark)" }}>
            Distribuição de Downloads
          </h2>
          {topDocuments.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topDocuments}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, downloads }) => `${name}: ${downloads}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="downloads"
                >
                  {topDocuments.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum dado disponível</p>
          )}
        </div>
      </div>

      {/* Tabela Detalhada */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold" style={{ color: "var(--degase-blue-dark)" }}>
            Todos os Documentos
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Documento</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Downloads</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Último Download</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ação</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item: any) => (
                <tr key={item.documentId} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.downloads}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {documentStats?.lastDownloadedAt
                      ? new Date(documentStats.lastDownloadedAt).toLocaleDateString("pt-BR")
                      : "Nunca"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDocument(item.documentId)}
                    >
                      Detalhes
                    </Button>
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
