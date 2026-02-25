import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const sections = [
  "institucional", "participacao", "acoes", "auditorias",
  "convenios", "licitacoes", "receitas", "servidores",
  "classificadas", "sic", "faq", "dados-abertos"
];

export default function AdminTransparency() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [section, setSection] = useState("institucional");

  const utils = trpc.useUtils();
  const { data: items } = trpc.transparency.list.useQuery();

  const createMutation = trpc.transparency.create.useMutation({
    onSuccess: () => { utils.transparency.list.invalidate(); toast.success("Item criado!"); resetForm(); },
    onError: (e) => toast.error(`Erro: ${e.message}`),
  });
  const updateMutation = trpc.transparency.update.useMutation({
    onSuccess: () => { utils.transparency.list.invalidate(); toast.success("Item atualizado!"); resetForm(); },
    onError: (e) => toast.error(`Erro: ${e.message}`),
  });
  const deleteMutation = trpc.transparency.delete.useMutation({
    onSuccess: () => { utils.transparency.list.invalidate(); toast.success("Item excluído!"); },
  });

  function resetForm() { setShowForm(false); setEditingId(null); setTitle(""); setDescription(""); setLinkUrl(""); setSection("institucional"); }

  function editItem(item: any) { setEditingId(item.id); setTitle(item.title); setDescription(item.description || ""); setLinkUrl(item.linkUrl || ""); setSection(item.section); setShowForm(true); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { toast.error("Título é obrigatório."); return; }
    if (editingId) { updateMutation.mutate({ id: editingId, title, description: description || undefined, linkUrl: linkUrl || undefined, section }); }
    else { createMutation.mutate({ title, description: description || undefined, linkUrl: linkUrl || undefined, section }); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--degase-blue-dark)" }}>Transparência</h1>
        <Button onClick={() => setShowForm(true)} style={{ backgroundColor: "var(--degase-blue-dark)" }}><Plus size={16} className="mr-1" /> Novo Item</Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg border mb-6 space-y-3">
          <h2 className="font-bold">{editingId ? "Editar Item" : "Novo Item"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium mb-1">Título *</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-md" required /></div>
            <div><label className="block text-sm font-medium mb-1">Seção *</label>
              <select value={section} onChange={(e) => setSection(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                {sections.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium mb-1">URL do Link</label><input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="w-full px-3 py-2 border rounded-md" /></div>
            <div><label className="block text-sm font-medium mb-1">Descrição</label><input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-md" /></div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" style={{ backgroundColor: "var(--degase-blue-dark)" }}>{editingId ? "Atualizar" : "Criar"}</Button>
            <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
          </div>
        </form>
      )}

      {items && items.length > 0 ? (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Título</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Seção</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Link</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-sm">{item.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{item.section}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell truncate max-w-xs">{item.linkUrl || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => editItem(item)} className="p-1.5 hover:bg-gray-200 rounded"><Edit size={14} /></button>
                      <button onClick={() => { if (confirm("Excluir?")) deleteMutation.mutate({ id: item.id }); }} className="p-1.5 hover:bg-red-100 rounded text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg"><p className="text-gray-500">Nenhum item de transparência cadastrado.</p></div>
      )}
    </div>
  );
}
