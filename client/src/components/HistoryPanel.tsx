import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, RotateCcw, Eye, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HistoryPanelProps {
  postId?: number;
  pageId?: number;
  onReverted?: () => void;
}

export default function HistoryPanel({ postId, pageId, onReverted }: HistoryPanelProps) {
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const isPost = !!postId;
  const itemId = postId || pageId;

  const historyQuery = isPost
    ? trpc.history.getPostHistory.useQuery({ postId: postId! }, { enabled: !!postId })
    : trpc.history.getPageHistory.useQuery({ pageId: pageId! }, { enabled: !!pageId });

  const selectedVersionQuery = selectedHistoryId
    ? (isPost
        ? trpc.history.getPostHistoryById.useQuery({ historyId: selectedHistoryId })
        : trpc.history.getPageHistoryById.useQuery({ historyId: selectedHistoryId }))
    : null;

  const revertMutation = isPost
    ? trpc.history.revertPostToVersion.useMutation({
        onSuccess: () => {
          toast.success("Post revertido com sucesso!");
          historyQuery.refetch();
          setSelectedHistoryId(null);
          onReverted?.();
        },
        onError: (error) => {
          toast.error(`Erro: ${error.message}`);
        },
      })
    : trpc.history.revertPageToVersion.useMutation({
        onSuccess: () => {
          toast.success("Pagina revertida com sucesso!");
          historyQuery.refetch();
          setSelectedHistoryId(null);
          onReverted?.();
        },
        onError: (error) => {
          toast.error(`Erro: ${error.message}`);
        },
      });

  const handleRevert = async () => {
    if (!selectedHistoryId || !itemId) return;
    if (!confirm("Tem certeza que deseja reverter para esta versao?")) return;

    if (isPost) {
      await (revertMutation as any).mutateAsync({
        postId: itemId,
        historyId: selectedHistoryId,
      });
    } else {
      await (revertMutation as any).mutateAsync({
        pageId: itemId,
        historyId: selectedHistoryId,
      });
    }
  };

  if (!itemId) return null;

  return (
    <Card className="border-l-4" style={{ borderLeftColor: "var(--degase-blue-light)" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock size={20} style={{ color: "var(--degase-blue-dark)" }} />
          Historico de Edicoes
        </CardTitle>
        <CardDescription>
          Total de {historyQuery.data?.length || 0} versoes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {historyQuery.isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="animate-spin" />
          </div>
        ) : historyQuery.data && historyQuery.data.length > 0 ? (
          <>
            <div className="space-y-2 max-h-64 overflow-y-auto border rounded p-2">
              {historyQuery.data.map((version) => (
                <div
                  key={version.id}
                  onClick={() => setSelectedHistoryId(version.id)}
                  className={`p-2 rounded cursor-pointer transition text-sm ${
                    selectedHistoryId === version.id
                      ? "bg-blue-100 border-l-2 border-blue-500"
                      : "hover:bg-gray-100 border-l-2 border-transparent"
                  }`}
                >
                  <div className="font-medium">{version.title}</div>
                  <div className="text-xs text-gray-600">
                    {format(new Date(version.createdAt), "dd MMM yyyy HH:mm", { locale: ptBR })}
                  </div>
                  {version.changeDescription && (
                    <div className="text-xs text-gray-500 italic">{version.changeDescription}</div>
                  )}
                </div>
              ))}
            </div>

            {selectedVersionQuery?.data && (
              <div className="border-t pt-3 space-y-2">
                <div className="text-sm">
                  <p className="font-medium">Titulo:</p>
                  <p className="text-gray-600">{selectedVersionQuery.data.title}</p>
                </div>
                {selectedVersionQuery.data.changeDescription && (
                  <div className="text-sm">
                    <p className="font-medium">Mudanca:</p>
                    <p className="text-gray-600">{selectedVersionQuery.data.changeDescription}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye size={14} className="mr-1" />
                        Visualizar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{selectedVersionQuery.data.title}</DialogTitle>
                        <DialogDescription>
                          Versao de {format(new Date(selectedVersionQuery.data.createdAt), "dd MMM yyyy HH:mm", { locale: ptBR })}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="prose prose-sm max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: selectedVersionQuery.data.content }} />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="sm"
                    className="flex-1"
                    style={{ backgroundColor: "var(--degase-blue-dark)" }}
                    onClick={handleRevert}
                    disabled={revertMutation.isPending}
                  >
                    {revertMutation.isPending ? (
                      <>
                        <Loader2 size={14} className="mr-1 animate-spin" />
                        Revertendo...
                      </>
                    ) : (
                      <>
                        <RotateCcw size={14} className="mr-1" />
                        Reverter
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">Nenhuma versao anterior encontrada</p>
        )}
      </CardContent>
    </Card>
  );
}
