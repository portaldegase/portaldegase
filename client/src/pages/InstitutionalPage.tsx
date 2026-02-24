import { trpc } from "@/lib/trpc";
import { useParams } from "wouter";

export default function InstitutionalPage() {
  const params = useParams<{ slug: string }>();
  const { data: page, isLoading } = trpc.pages.getBySlug.useQuery({ slug: params.slug || "" });

  if (isLoading) {
    return (
      <main id="main-content" className="py-8">
        <div className="container max-w-4xl animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      </main>
    );
  }

  if (!page) {
    return (
      <main id="main-content" className="py-8">
        <div className="container max-w-4xl">
          <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--degase-blue-dark)" }}>
            Página não encontrada
          </h1>
          <p className="text-gray-500">Esta página ainda não foi criada. Acesse o painel administrativo para criá-la.</p>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="py-8">
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--degase-blue-dark)" }}>
          {page.title}
        </h1>
        <div className="prose-degase" dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </main>
  );
}
