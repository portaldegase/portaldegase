'use client';

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface PageBlocksEditorProps {
  pageId: number;
}

export function PageBlocksEditor({ pageId }: PageBlocksEditorProps) {
  const [blockType, setBlockType] = useState<"services" | "documentCategories" | "images" | "text" | "html">("services");
  const [blockTitle, setBlockTitle] = useState("");
  const [blockDescription, setBlockDescription] = useState("");

  const { data: blocks = [], refetch } = trpc.pageBlocks.list.useQuery({ pageId });
  const createMutation = trpc.pageBlocks.create.useMutation();
  const deleteMutation = trpc.pageBlocks.delete.useMutation();

  const handleAddBlock = async () => {
    if (!blockTitle.trim()) {
      toast.error("Título é obrigatório");
      return;
    }

    try {
      await createMutation.mutateAsync({
        pageId,
        blockType,
        title: blockTitle,
        description: blockDescription || undefined,
      });
      setBlockTitle("");
      setBlockDescription("");
      setBlockType("services");
      await refetch();
      toast.success("Bloco adicionado com sucesso");
    } catch (error) {
      toast.error("Erro ao adicionar bloco");
    }
  };

  const handleDeleteBlock = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este bloco?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      await refetch();
      toast.success("Bloco deletado com sucesso");
    } catch (error) {
      toast.error("Erro ao deletar bloco");
    }
  };

  const blockTypeLabels: Record<string, string> = {
    services: "Serviços",
    documentCategories: "Categorias de Documentos",
    images: "Imagens",
    text: "Texto",
    html: "HTML",
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
              <label className="text-sm font-medium block mb-2">Tipo de Bloco</label>
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
              <label className="text-sm font-medium block mb-2">Título *</label>
              <Input
                value={blockTitle}
                onChange={(e) => setBlockTitle(e.target.value)}
                placeholder="Título do bloco"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Descrição (opcional)</label>
            <Textarea
              value={blockDescription}
              onChange={(e) => setBlockDescription(e.target.value)}
              placeholder="Descrição do bloco"
              rows={3}
            />
          </div>
          <Button onClick={handleAddBlock} disabled={createMutation.isPending}>
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
                <Card key={block.id} className="p-4 bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium">{block.title}</h3>
                      <p className="text-sm text-gray-600">{blockTypeLabels[block.blockType] || block.blockType}</p>
                      {block.description && (
                        <p className="text-sm text-gray-500 mt-2">{block.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBlock(block.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
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
