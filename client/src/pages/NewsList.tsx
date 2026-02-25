import { trpc } from "@/lib/trpc";
import { Link, useSearch } from "wouter";
import { useState, useMemo } from "react";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewsList() {
  const searchString = useSearch();
  const params = useMemo(() => new URLSearchParams(searchString), [searchString]);
  const pageParam = parseInt(params.get("page") || "1");
  const [page, setPage] = useState(pageParam);
  const limit = 12;

  const { data, isLoading } = trpc.posts.list.useQuery({
    status: "published",
    limit,
    offset: (page - 1) * limit,
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <main id="main-content" className="py-8">
      <div className="container">
        <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--degase-blue-dark)" }}>
          Notícias
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : data && data.items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {data.items.map((post) => (
                <article key={post.id} className="group">
                  <Link href={`/noticias/${post.slug}`} className="block">
                    <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden mb-3">
                      {post.featuredImage ? (
                        <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "var(--degase-blue-dark)" }}>
                          <FileText className="text-white/30" size={48} />
                        </div>
                      )}
                    </div>
                    <h2 className="font-bold text-sm leading-tight group-hover:underline" style={{ color: "var(--degase-blue-dark)" }}>
                      {post.title}
                    </h2>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>
                    {post.publishedAt && (
                      <time className="text-xs text-gray-400 mt-1 block">
                        {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
                      </time>
                    )}
                  </Link>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft size={16} /> Anterior
                </Button>
                <span className="text-sm text-gray-600 px-4">
                  Página {page} de {totalPages}
                </span>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                  Próxima <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <FileText className="mx-auto mb-4 text-gray-300" size={64} />
            <p className="text-gray-500">Nenhuma notícia publicada ainda.</p>
            <p className="text-sm text-gray-400 mt-1">As notícias serão exibidas aqui após serem publicadas no painel administrativo.</p>
          </div>
        )}
      </div>
    </main>
  );
}
