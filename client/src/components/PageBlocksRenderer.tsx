import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PageBlocksRendererProps {
  pageId: number;
}

export function PageBlocksRenderer({ pageId }: PageBlocksRendererProps) {
  const blocksQuery = trpc.pageBlocks.list.useQuery({ pageId });
  const servicesQuery = trpc.services.list.useQuery();
  const documentCategoriesQuery = trpc.documentCategories.list.useQuery();

  const blocks = blocksQuery.data || [];
  const services = servicesQuery.data || [];
  const documentCategories = documentCategoriesQuery.data || [];

  if (blocksQuery.isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {blocks.map((block: any) => (
        <div key={block.id}>
          {block.title && (
            <h2 className="text-2xl font-bold mb-4">{block.title}</h2>
          )}
          {block.description && (
            <p className="text-gray-600 mb-6">{block.description}</p>
          )}

          {block.blockType === "services" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service: any) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{service.description}</p>
                    {service.link && (
                      <a href={service.link} className="text-blue-600 hover:underline text-sm mt-3 inline-block">
                        Acessar →
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {block.blockType === "documentCategories" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documentCategories.map((category: any) => (
                <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {category.icon && (
                        <span className="text-2xl">{category.icon}</span>
                      )}
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {category.description && (
                      <p className="text-sm text-gray-600">{category.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {block.blockType === "images" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Renderizar imagens do banco */}
              <p className="text-gray-500">Galeria de imagens</p>
            </div>
          )}

          {block.blockType === "text" && (
            <div className="prose prose-sm max-w-none">
              {block.description}
            </div>
          )}

          {block.blockType === "html" && (
            <div dangerouslySetInnerHTML={{ __html: block.description || "" }} />
          )}
        </div>
      ))}
    </div>
  );
}
