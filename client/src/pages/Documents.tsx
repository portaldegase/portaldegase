import { useState } from "react";
import { Download, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Documents() {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const { data: documents, isLoading } = trpc.documents.list.useQuery();

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  const documentsByCategory = documents?.reduce((acc, item: any) => {
    const categoryId = item.document_categories.id;
    if (!acc[categoryId]) {
      acc[categoryId] = {
        category: item.document_categories,
        documents: [],
      };
    }
    acc[categoryId].documents.push(item.documents);
    return acc;
  }, {} as Record<number, any>) || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--degase-blue-dark)" }}>
          Documentos
        </h1>
        <p className="text-gray-600 mb-8">
          Acesse todos os documentos e recursos disponibilizados pelo DEGASE
        </p>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando documentos...</p>
          </div>
        ) : Object.keys(documentsByCategory).length > 0 ? (
          <div className="space-y-4">
            {Object.values(documentsByCategory).map((group: any) => (
              <div key={group.category.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleCategory(group.category.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  style={{ borderBottom: expandedCategories.has(group.category.id) ? "1px solid #e5e7eb" : "none" }}
                >
                  <div className="text-left flex-1">
                    <h2 className="text-lg font-bold" style={{ color: "var(--degase-blue-dark)" }}>
                      {group.category.name}
                    </h2>
                    {group.category.description && (
                      <p className="text-sm text-gray-600 mt-1">{group.category.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {group.documents.length} {group.documents.length === 1 ? "documento" : "documentos"}
                    </p>
                  </div>
                  <div className="ml-4">
                    {expandedCategories.has(group.category.id) ? (
                      <ChevronUp size={24} style={{ color: "var(--degase-blue-dark)" }} />
                    ) : (
                      <ChevronDown size={24} style={{ color: "var(--degase-blue-dark)" }} />
                    )}
                  </div>
                </button>

                {expandedCategories.has(group.category.id) && (
                  <div className="px-6 py-4 bg-gray-50 space-y-3 border-t">
                    {group.documents.map((doc: any) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText size={24} className="text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            {doc.description && (
                              <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              Tamanho: {formatFileSize(doc.fileSize)}
                            </p>
                          </div>
                        </div>
                        <a
                          href={doc.fileUrl}
                          download
                          className="ml-4 p-2 rounded-lg transition-colors"
                          style={{
                            backgroundColor: "var(--degase-blue-dark)",
                            color: "white",
                          }}
                          title="Baixar documento"
                        >
                          <Download size={20} />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">Nenhum documento disponível no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
