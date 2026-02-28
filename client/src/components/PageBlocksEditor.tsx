import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GripVertical, Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

interface PageBlocksEditorProps {
  pageId: number;
}

export function PageBlocksEditor({ pageId }: PageBlocksEditorProps) {
  const [editingBlockId, setEditingBlockId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [blockType, setBlockType] = useState<"services" | "documentCategories" | "images" | "text" | "html">("services");

  const blocksQuery = trpc.pageBlocks.list.useQuery({ pageId });
  const createBlockMutation = trpc.pageBlocks.create.useMutation();
  const updateBlockMutation = trpc.pageBlocks.update.useMutation();
  const deleteBlockMutation = trpc.pageBlocks.delete.useMutation();

  const blocks = blocksQuery.data || [];

  const handleAddBlock = async () => {
    try {
      await createBlockMutation.mutateAsync({
        pageId,
        blockType,
        title: editingTitle || undefined,
        description: editingDescription || undefined,
      });
      setEditingTitle("");
      setEditingDescription("");
      setBlockType("services");
      blocksQuery.refetch();
      toast.success("Bloco adicionado com sucesso");
    } catch (error) {
      toast.error("Erro ao adicionar bloco");
    }
  };

  const handleUpdateBlock = async (id: number) => {
    try {
      await updateBlockMutation.mutateAsync({
        id,
        title: editingTitle || undefined,
        description: editingDescription || undefined,
      });
      setEditingBlockId(null);
      setEditingTitle("");
      setEditingDescription("");
      blocksQuery.refetch();
      toast.success("Bloco atualizado com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar bloco");
    }
  };

  const handleDeleteBlock = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este bloco?")) return;
    try {
      await deleteBlockMutation.mutateAsync({ id });
      blocksQuery.refetch();
      toast.success("Bloco deletado com sucesso");
    } catch (error) {
      toast.error("Erro ao deletar bloco");
    }
  };

  const handleEditBlock = (block: any) => {
    setEditingBlockId(block.id);
    setEditingTitle(block.title || "");
    setEditingDescription(block.description || "");
  };

  const getBlockTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      services: "Serviços",
      documentCategories: "Categorias de Documentos",
      images: "Imagens",
      text: "Texto",
      html: "HTML",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Bloco</CardTitle>
          <CardDescription>Crie blocos personalizados com diferentes tipos de conteúdo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Tipo de Bloco</label>
              <Select value={blockType} onValueChange={(value: any) => setBlockType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="services">Serviços</SelectItem>
                  <SelectItem value="documentCategories">Categorias de Documentos</SelectItem>
                  <SelectItem value="images">Imagens</SelectItem>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Título (opcional)</label>
              <Input
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                placeholder="Título do bloco"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Descrição (opcional)</label>
            <Textarea
              value={editingDescription}
              onChange={(e) => setEditingDescription(e.target.value)}
              placeholder="Descrição do bloco"
              rows={3}
            />
          </div>
          <Button onClick={handleAddBlock} disabled={createBlockMutation.isPending}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Bloco
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blocos da Página</CardTitle>
          <CardDescription>{blocks.length} bloco(s) adicionado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {blocks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum bloco adicionado ainda</p>
          ) : (
            <div className="space-y-3">
              {blocks.map((block: any) => (
                <Card key={block.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <GripVertical className="w-4 h-4 mt-1 text-muted-foreground" />
                      <div className="flex-1">
                        {editingBlockId === block.id ? (
                          <div className="space-y-3">
                            <Input
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              placeholder="Título"
                            />
                            <Textarea
                              value={editingDescription}
                              onChange={(e) => setEditingDescription(e.target.value)}
                              placeholder="Descrição"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleUpdateBlock(block.id)}
                                disabled={updateBlockMutation.isPending}
                              >
                                Salvar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingBlockId(null)}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{getBlockTypeLabel(block.blockType)}</span>
                              <span className="text-xs bg-secondary px-2 py-1 rounded">
                                {block.blockType}
                              </span>
                            </div>
                            {block.title && <p className="text-sm font-semibold mt-1">{block.title}</p>}
                            {block.description && <p className="text-sm text-muted-foreground mt-1">{block.description}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {editingBlockId !== block.id && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditBlock(block)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteBlock(block.id)}
                        disabled={deleteBlockMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
