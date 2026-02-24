import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

export default function AdminVideos() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const utils = trpc.useUtils();
  const { data: videos } = trpc.videos.list.useQuery();

  const createMutation = trpc.videos.create.useMutation({
    onSuccess: () => { utils.videos.list.invalidate(); toast.success("Vídeo adicionado!"); resetForm(); },
    onError: (e) => toast.error(`Erro: ${e.message}`),
  });
  const updateMutation = trpc.videos.update.useMutation({
    onSuccess: () => { utils.videos.list.invalidate(); toast.success("Vídeo atualizado!"); resetForm(); },
    onError: (e) => toast.error(`Erro: ${e.message}`),
  });
  const deleteMutation = trpc.videos.delete.useMutation({
    onSuccess: () => { utils.videos.list.invalidate(); toast.success("Vídeo excluído!"); },
  });

  function resetForm() { setShowForm(false); setEditingId(null); setTitle(""); setYoutubeUrl(""); setDescription(""); setIsFeatured(false); }

  function editVideo(v: any) { setEditingId(v.id); setTitle(v.title); setYoutubeUrl(v.youtubeUrl); setDescription(v.description || ""); setIsFeatured(v.isFeatured); setShowForm(true); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !youtubeUrl.trim()) { toast.error("Título e URL do YouTube são obrigatórios."); return; }
    if (editingId) { updateMutation.mutate({ id: editingId, title, youtubeUrl, description: description || undefined, isFeatured }); }
    else { createMutation.mutate({ title, youtubeUrl, description: description || undefined, isFeatured }); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--degase-blue-dark)" }}>Vídeos</h1>
        <Button onClick={() => setShowForm(true)} style={{ backgroundColor: "var(--degase-blue-dark)" }}><Plus size={16} className="mr-1" /> Novo Vídeo</Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg border mb-6 space-y-3">
          <h2 className="font-bold">{editingId ? "Editar Vídeo" : "Novo Vídeo"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium mb-1">Título *</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-md" required /></div>
            <div><label className="block text-sm font-medium mb-1">URL do YouTube *</label><input type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className="w-full px-3 py-2 border rounded-md" required placeholder="https://www.youtube.com/watch?v=..." /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Descrição</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-md h-20" /></div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="videoFeatured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            <label htmlFor="videoFeatured" className="text-sm">Destaque na página inicial</label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" style={{ backgroundColor: "var(--degase-blue-dark)" }}>{editingId ? "Atualizar" : "Adicionar"}</Button>
            <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
          </div>
        </form>
      )}

      {videos && videos.length > 0 ? (
        <div className="space-y-3">
          {videos.map((v) => (
            <div key={v.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border">
              <div className="flex-1">
                <p className="font-medium text-sm flex items-center gap-1">
                  {v.isFeatured && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                  {v.title}
                </p>
                <p className="text-xs text-gray-500 truncate">{v.youtubeUrl}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => editVideo(v)} className="p-1.5 hover:bg-gray-200 rounded"><Edit size={14} /></button>
                <button onClick={() => { if (confirm("Excluir?")) deleteMutation.mutate({ id: v.id }); }} className="p-1.5 hover:bg-red-100 rounded text-red-600"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg"><p className="text-gray-500">Nenhum vídeo cadastrado.</p></div>
      )}
    </div>
  );
}
