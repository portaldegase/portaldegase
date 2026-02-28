import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { PageBlocksRenderer } from "@/components/PageBlocksRenderer";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const { slug } = useParams<{ slug: string }>();
  const pageQuery = trpc.pages.getBySlug.useQuery({ slug: slug || "" });

  if (pageQuery.isLoading) {
    return (
      <div className="container mx-auto py-12">
        <Skeleton className="h-12 w-1/3 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!pageQuery.data) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-2xl font-bold">Página não encontrada</h1>
        <p className="text-gray-600 mt-2">A página que você está procurando não existe.</p>
      </div>
    );
  }

  const page = pageQuery.data;

  return (
    <div className="container mx-auto py-12">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
          {page.excerpt && (
            <p className="text-lg text-gray-600">{page.excerpt}</p>
          )}
        </header>

        {page.featuredImage && (
          <img
            src={page.featuredImage}
            alt={page.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        <div className="prose prose-lg max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>

        {page.id && (
          <div className="border-t pt-8">
            <PageBlocksRenderer pageId={page.id} />
          </div>
        )}
      </article>
    </div>
  );
}
