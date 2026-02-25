import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Video, Loader2, Trash2, Edit2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

export default function AdminMediaGallery() {
  const { user } = useAuth();
  const [fileType, setFileType] = useState<"image" | "video" | "all">("all");
  const [page, setPage] = useState(0);

  const { data: allMedia, isLoading: loadingAll, refetch } = trpc.media.getLibrary.useQuery({
    limit: 20,
    offset: page * 20,
  });

  const { data: images } = trpc.media.getByType.useQuery({
    fileType: "image",
    limit: 20,
    offset: page * 20,
  }, { enabled: fileType === "image" });

  const { data: videos } = trpc.media.getByType.useQuery({
    fileType: "video",
    limit: 20,
    offset: page * 20,
  }, { enabled: fileType === "video" });

  const deleteMediaMutation = trpc.media.deleteMedia.useMutation();

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar esta mídia?")) return;
    
    try {
      await deleteMediaMutation.mutateAsync({ id });
      toast.success("Mídia deletada com sucesso");
      refetch();
    } catch (error) {
      toast.error("Erro ao deletar mídia");
    }
  };

  const displayMedia = fileType === "all" ? allMedia : fileType === "image" ? images : videos;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "var(--degase-blue-dark)" }}>
          Galeria de Mídia
        </h1>
        <p className="text-gray-600 mt-2">
          Gerencie imagens e vídeos para usar em notícias e páginas
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={fileType === "all" ? "default" : "outline"}
              onClick={() => { setFileType("all"); setPage(0); }}
              style={fileType === "all" ? { backgroundColor: "var(--degase-blue-dark)" } : {}}
            >
              Todos
            </Button>
            <Button
              variant={fileType === "image" ? "default" : "outline"}
              onClick={() => { setFileType("image"); setPage(0); }}
              style={fileType === "image" ? { backgroundColor: "var(--degase-blue-dark)" } : {}}
            >
              <Image size={16} className="mr-2" />
              Imagens
            </Button>
            <Button
              variant={fileType === "video" ? "default" : "outline"}
              onClick={() => { setFileType("video"); setPage(0); }}
              style={fileType === "video" ? { backgroundColor: "var(--degase-blue-dark)" } : {}}
            >
              <Video size={16} className="mr-2" />
              Vídeos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grade de Mídia */}
      <Card>
        <CardHeader>
          <CardTitle>Mídia ({displayMedia?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingAll ? (
            <div className="flex justify-center py-12">
              <Loader2 size={32} className="animate-spin" style={{ color: "var(--degase-blue-dark)" }} />
            </div>
          ) : displayMedia && displayMedia.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayMedia.map((media: any) => (
                  <div
                    key={media.id}
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    style={{ borderColor: "var(--degase-gold)" }}
                  >
                    {media.fileType === "image" ? (
                      <img
                        src={media.url}
                        alt={media.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-900 flex items-center justify-center">
                        <Video size={48} className="text-white" />
                      </div>
                    )}
                    <div className="p-3">
                      <h3 className="font-semibold truncate" style={{ color: "var(--degase-blue-dark)" }}>
                        {media.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(media.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                      {media.fileSize && (
                        <p className="text-xs text-gray-500">
                          {(media.fileSize / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => navigator.clipboard.writeText(media.url)}
                        >
                          Copiar URL
                        </Button>
                        {user?.role === "admin" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(media.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginação */}
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                >
                  Anterior
                </Button>
                <span className="px-4 py-2 text-sm">
                  Página {page + 1}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={!displayMedia || displayMedia.length < 20}
                >
                  Próxima
                </Button>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-12">
              Nenhuma mídia encontrada. Comece a fazer upload de imagens e vídeos!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
