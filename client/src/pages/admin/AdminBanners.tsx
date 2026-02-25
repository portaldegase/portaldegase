import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminBanners() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  const utils = trpc.useUtils();
  const { data: banners } = trpc.banners.list.useQuery();

  const createMutation = trpc.banners.create.useMutation({
    onSuccess: () => { utils.banners.list.invalidate(); toast.success("Banner criado!"); resetForm(); },
    onError: (e) => toast.error(`Erro: ${e.message}`),
  });
  const updateMutation = trpc.banners.update.useMutation({
    onSuccess: () => { utils.banners.list.invalidate(); toast.success("Banner atualizado!"); resetForm(); },
    onError: (e) => toast.error(`Erro: ${e.message}`),
  });
  const deleteMutation = trpc.banners.delete.useMutation({
    onSuccess: () => { utils.banners.list.invalidate(); toast.success("Banner excluído!"); },
  });

  function resetForm() { setShowForm(false); setEditingId(null); setTitle(""); setSubtitle(""); setImageUrl(""); setLinkUrl(""); setIsActive(true); }

  function editBanner(b: any) { setEditingId(b.id); setTitle(b.title); setSubtitle(b.subtitle || ""); setImageUrl(b.imageUrl); setLinkUrl(b.linkUrl || ""); setIsActive(b.isActive); setShowForm(true); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) { toast.error("Título e URL da imagem são obrigatórios."); return; }
    if (editingId) { updateMutation.mutate({ id: editingId, title, subtitle: subtitle || undefined, imageUrl, linkUrl: linkUrl || undefined, isActive }); }
    else { createMutation.mutate({ title, subtitle: subtitle || undefined, imageUrl, linkUrl: linkUrl || undefined, isActive }); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--degase-blue-dark)" }}>Banners</h1>
        <Button onClick={() => setShowForm(true)} style={{ backgroundColor: "var(--degase-blue-dark)" }}><Plus size={16} className="mr-1" /> Novo Banner</Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg border mb-6 space-y-3">
          <h2 className="font-bold">{editingId ? "Editar Banner" : "Novo Banner"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium mb-1">Título *</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-md" required /></div>
            <div><label className="block text-sm font-medium mb-1">Subtítulo</label><input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full px-3 py-2 border rounded-md" /></div>
            <div><label className="block text-sm font-medium mb-1">URL da Imagem *</label><input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-3 py-2 border rounded-md" required /></div>
            <div><label className="block text-sm font-medium mb-1">URL do Link</label><input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="w-full px-3 py-2 border rounded-md" /></div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="bannerActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            <label htmlFor="bannerActive" className="text-sm">Ativo</label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" style={{ backgroundColor: "var(--degase-blue-dark)" }}>{editingId ? "Atualizar" : "Criar"}</Button>
            <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
          </div>
        </form>
      )}

      {banners && banners.length > 0 ? (
        <div className="space-y-3">
          {banners.map((b) => (
            <div key={b.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border">
              <img src={b.imageUrl} alt={b.title} className="w-24 h-16 object-cover rounded" />
              <div className="flex-1">
                <p className="font-medium text-sm">{b.title}</p>
                <p className="text-xs text-gray-500">{b.subtitle}</p>
              </div>
              <span className={`px-2 py-0.5 text-xs rounded-full ${b.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                {b.isActive ? "Ativo" : "Inativo"}
              </span>
              <div className="flex gap-1">
                <button onClick={() => editBanner(b)} className="p-1.5 hover:bg-gray-200 rounded"><Edit size={14} /></button>
                <button onClick={() => { if (confirm("Excluir?")) deleteMutation.mutate({ id: b.id }); }} className="p-1.5 hover:bg-red-100 rounded text-red-600"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg"><p className="text-gray-500">Nenhum banner cadastrado.</p></div>
      )}
    </div>
  );
}
