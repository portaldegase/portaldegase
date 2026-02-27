import { useState } from "react";
import { Download, FileText, ChevronDown, ChevronUp, Search, History } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";

export default function Documents() {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedVersions, setExpandedVersions] = useState<Set<number>>(new Set());
  const { data: documents, isLoading } = trpc.documents.list.useQuery();
  const { data: searchResults, isLoading: searchLoading } = trpc.documents.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );
  const recordDownload = trpc.documents.recordDownload.useMutation();

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleVersions = (documentId: number) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(documentId)) {
      newExpanded.delete(documentId);
    } else {
      newExpanded.add(documentId);
    }
    setExpandedVersions(newExpanded);
  };

  const handleDownload = (documentId: number, versionId?: number) => {
    recordDownload.mutate({ documentId, versionId });
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

  const displayDocuments = searchQuery.length > 0 ? searchResults : documents;
  const isDisplayLoading = searchQuery.length > 0 ? searchLoading : isLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--degase-blue-dark)" }}>
          Documentos
        </h1>
        <p className="text-gray-600 mb-8">
          Acesse todos os documentos e recursos disponibilizados pelo DEGASE
        </p>

        <div className="mb-8 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Buscar documentos por nome ou descrição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-2"
          />
        </div>

        {isDisplayLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando documentos...</p>
          </div>
        ) : searchQuery.length > 0 ? (
          searchResults && searchResults.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">Resultados da busca para: <strong>{searchQuery}</strong></p>
              {searchResults.map((doc: any) => (
                <DocumentCard key={doc.id} doc={doc} onDownload={handleDownload} formatFileSize={formatFileSize} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border p-12 text-center">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">Nenhum documento encontrado para "{searchQuery}"</p>
            </div>
          )
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
                      <DocumentCard key={doc.id} doc={doc} onDownload={handleDownload} formatFileSize={formatFileSize} expandedVersions={expandedVersions} toggleVersions={toggleVersions} />
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

function DocumentCard({ doc, onDownload, formatFileSize, expandedVersions, toggleVersions }: any) {
  const { data: versions } = trpc.documentVersions.list.useQuery({ documentId: doc.id });

  return (
    <div className="bg-white rounded-lg border hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex items-center justify-between p-4">
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
        <div className="flex items-center gap-2 ml-4">
          {versions && versions.length > 0 && (
            <button
              onClick={() => toggleVersions && toggleVersions(doc.id)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Ver versões anteriores"
            >
              <History size={20} style={{ color: "var(--degase-blue-dark)" }} />
            </button>
          )}
          <a
            href={doc.fileUrl}
            download
            onClick={() => onDownload(doc.id)}
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: "var(--degase-blue-dark)", color: "white" }}
            title="Baixar documento"
          >
            <Download size={20} />
          </a>
        </div>
      </div>

      {expandedVersions && expandedVersions.has(doc.id) && versions && versions.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-t space-y-2">
          <p className="text-xs font-semibold text-gray-700 mb-2">Versões anteriores:</p>
          {versions.map((version: any) => (
            <div key={version.id} className="flex items-center justify-between p-2 bg-white rounded border text-sm">
              <div>
                <p className="font-medium text-gray-900">Versão {version.versionNumber}</p>
                {version.changeDescription && (
                  <p className="text-xs text-gray-600">{version.changeDescription}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(version.fileSize)} - {new Date(version.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <a
                href={version.fileUrl}
                download
                onClick={() => onDownload(doc.id, version.id)}
                className="p-1 rounded transition-colors"
                style={{ backgroundColor: "var(--degase-blue-light)", color: "white" }}
                title="Baixar versão"
              >
                <Download size={16} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
