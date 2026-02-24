import { trpc } from "@/lib/trpc";
import { FileText, Eye, FolderOpen, Video, Building2, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  const { data: postsData } = trpc.posts.list.useQuery({ limit: 5 });
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: videos } = trpc.videos.list.useQuery();
  const { data: units } = trpc.units.list.useQuery();

  const stats = [
    { label: "Notícias", value: postsData?.total ?? 0, icon: FileText, color: "#003366" },
    { label: "Categorias", value: categories?.length ?? 0, icon: FolderOpen, color: "#0066CC" },
    { label: "Vídeos", value: videos?.length ?? 0, icon: Video, color: "#1a5276" },
    { label: "Unidades", value: units?.length ?? 0, icon: Building2, color: "#C8A951" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--degase-blue-dark)" }}>
        Painel Administrativo
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 bg-white rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
              </div>
              <stat.icon size={32} style={{ color: stat.color }} className="opacity-30" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-lg border shadow-sm p-5">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "var(--degase-blue-dark)" }}>
          <BarChart3 size={20} /> Últimas Publicações
        </h2>
        {postsData && postsData.items.length > 0 ? (
          <div className="space-y-3">
            {postsData.items.map((post) => (
              <div key={post.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-sm">{post.title}</p>
                  <p className="text-xs text-gray-400">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("pt-BR") : "Rascunho"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    post.status === "published" ? "bg-green-100 text-green-700" :
                    post.status === "draft" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {post.status === "published" ? "Publicado" : post.status === "draft" ? "Rascunho" : "Arquivado"}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Eye size={12} /> {post.viewCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Nenhuma publicação ainda. Crie sua primeira notícia!</p>
        )}
      </div>
    </div>
  );
}
