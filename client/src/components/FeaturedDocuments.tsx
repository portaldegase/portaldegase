import { FileText, Download, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function FeaturedDocuments() {
  const { data: documents, isLoading } = trpc.documents.getFeatured.useQuery();
  const recordDownload = trpc.documents.recordDownload.useMutation();

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  const handleDownload = (documentId: number) => {
    recordDownload.mutate({ documentId });
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--degase-blue-dark)" }}>
          Documentos em Destaque
        </h2>
        <p className="text-gray-600 mb-8">
          Acesse os documentos mais importantes e atualizados do DEGASE
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {documents.slice(0, 5).map((doc: any) => (
            <div
              key={doc.id}
              className="bg-white rounded-lg border hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <FileText size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 line-clamp-2">{doc.name}</h3>
                    {doc.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{doc.description}</p>
                    )}
                  </div>
                </div>

                <div className="mt-auto">
                  <p className="text-xs text-gray-500 mb-4">
                    Tamanho: {formatFileSize(doc.fileSize)}
                  </p>

                  <a
                    href={doc.fileUrl}
                    download
                    onClick={() => handleDownload(doc.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white font-medium"
                    style={{ backgroundColor: "var(--degase-blue-dark)" }}
                  >
                    <Download size={16} />
                    Baixar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link href="/documentos">
            <button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors text-white font-medium"
              style={{ backgroundColor: "var(--degase-blue-dark)" }}
            >
              Exibir mais documentos
              <ArrowRight size={20} />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
