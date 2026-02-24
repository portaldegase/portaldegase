import { trpc } from "@/lib/trpc";
import { useSearch } from "wouter";
import { Link } from "wouter";
import { useMemo } from "react";
import { Search, FileText, BookOpen } from "lucide-react";

export default function SearchResults() {
  const searchString = useSearch();
  const params = useMemo(() => new URLSearchParams(searchString), [searchString]);
  const query = params.get("q") || "";

  const { data, isLoading } = trpc.search.query.useQuery(
    { q: query },
    { enabled: query.length > 0 }
  );

  return (
    <main id="main-content" className="py-8">
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--degase-blue-dark)" }}>
          Resultados da Busca
        </h1>
        {query && (
          <p className="text-gray-600 mb-6">
            Resultados para: <strong>"{query}"</strong>
          </p>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse p-4 bg-gray-100 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : !query ? (
          <div className="text-center py-16">
            <Search className="mx-auto mb-4 text-gray-300" size={64} />
            <p className="text-gray-500">Digite um termo para buscar no site.</p>
          </div>
        ) : (
          <>
            {data?.posts && data.posts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "var(--degase-blue-accent)" }}>
                  <FileText size={20} /> Notícias ({data.posts.length})
                </h2>
                <div className="space-y-3">
                  {data.posts.map((post: any) => (
                    <Link key={post.id} href={`/noticias/${post.slug}`} className="block p-4 bg-gray-50 rounded-lg border hover:shadow-md transition-shadow">
                      <h3 className="font-medium" style={{ color: "var(--degase-blue-dark)" }}>{post.title}</h3>
                      {post.excerpt && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>}
                      {post.publishedAt && (
                        <time className="text-xs text-gray-400 mt-1 block">
                          {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
                        </time>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {data?.pages && data.pages.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "var(--degase-blue-accent)" }}>
                  <BookOpen size={20} /> Páginas ({data.pages.length})
                </h2>
                <div className="space-y-3">
                  {data.pages.map((page: any) => (
                    <Link key={page.id} href={`/pagina/${page.slug}`} className="block p-4 bg-gray-50 rounded-lg border hover:shadow-md transition-shadow">
                      <h3 className="font-medium" style={{ color: "var(--degase-blue-dark)" }}>{page.title}</h3>
                      {page.excerpt && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{page.excerpt}</p>}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {(!data?.posts || data.posts.length === 0) && (!data?.pages || data.pages.length === 0) && (
              <div className="text-center py-16">
                <Search className="mx-auto mb-4 text-gray-300" size={64} />
                <p className="text-gray-500">Nenhum resultado encontrado para "{query}".</p>
                <p className="text-sm text-gray-400 mt-1">Tente usar termos diferentes ou mais genéricos.</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
