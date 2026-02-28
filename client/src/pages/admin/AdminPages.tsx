import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";
import { useAutosave } from "@/hooks/useAutosave";
import { trpc } from "@/lib/trpc";
import { PageBlocksEditor } from "@/components/PageBlocksEditor";

function slugify(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminPages() {
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [showInMenu, setShowInMenu] = useState(false);
  const [menuLabel, setMenuLabel] = useState("");

  const utils = trpc.useUtils();
  const { data: pages } = trpc.pages.list.useQuery();

  const createMutation = trpc.pages.create.useMutation({
    onSuccess: () => { utils.pages.list.invalidate(); toast.success("Página criada!"); resetForm(); },
    onError: (e) => toast.error(`Erro: ${e.message}`),
  });

  const updateMutation = trpc.pages.update.useMutation({
    onSuccess: () => { utils.pages.list.invalidate(); toast.success("Página atualizada!"); resetForm(); },
    onError: (e) => toast.error(`Erro: ${e.message}`),
  });

  const deleteMutation = trpc.pages.delete.useMutation({
    onSuccess: () => { utils.pages.list.invalidate(); toast.success("Página excluída!"); },
    onError: (e) => toast.error(`Erro: ${e.message}`),
  });

  const saveDraftMutation = trpc.pages.saveDraftPage.useMutation();
  const getPageHistoryQuery = editingId ? trpc.pages.getPageHistory.useQuery({ pageId: editingId }) : null;
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);

  const { isSaving, lastSaved, saveNow } = useAutosave(
    { title, content, excerpt, menuLabel, showInMenu },
    {
      key: `page_draft_${editingId || 'new'}`,
      debounceMs: 3000,
      onSave: async (data: any) => {
        if (!title.trim() || !content.trim()) return;
        await saveDraftMutation.mutateAsync({
          id: editingId || undefined,
          title,
          content,
          excerpt,
          menuLabel,
          showInMenu,
          slug: editingId ? undefined : slugify(title),
        });
        setLastSavedTime(new Date());
      },
    }
  );

  function resetForm() {
    setShowEditor(false); setEditingId(null); setTitle(""); setSlug(""); setContent(""); setExcerpt(""); setStatus("draft"); setShowInMenu(false); setMenuLabel("");
  }

  function editPage(page: any) {
    setEditingId(page.id); setTitle(page.title); setSlug(page.slug); setContent(page.content); setExcerpt(page.excerpt || ""); setStatus(page.status); setShowInMenu(page.showInMenu); setMenuLabel(page.menuLabel || ""); setShowEditor(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) { toast.error("Título e conteúdo são obrigatórios."); return; }
    const data = { title, slug: slug || slugify(title), content, excerpt: excerpt || undefined, status: status as any, showInMenu, menuLabel: menuLabel || undefined };
    if (editingId) { updateMutation.mutate({ id: editingId, ...data }); }
    else { createMutation.mutate(data); }
  }

  if (showEditor) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--degase-blue-dark)" }}>{editingId ? "Editar Página" : "Nova Página"}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <Clock size={14} />
              {isSaving ? (
                <span>Salvando rascunho...</span>
              ) : lastSavedTime ? (
                <span>Último salvamento: {lastSavedTime.toLocaleTimeString('pt-BR')}</span>
              ) : (
                <span>Rascunho será salvo automaticamente</span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {editingId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVersionHistory(!showVersionHistory)}
              >
                Histórico de Versões
              </Button>
            )}
            <Button variant="outline" onClick={resetForm}>Cancelar</Button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug (URL)</label>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="auto-gerado" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Resumo</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full px-3 py-2 border rounded-md h-20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full px-3 py-2 border rounded-md">
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="showInMenu" checked={showInMenu} onChange={(e) => setShowInMenu(e.target.checked)} />
              <label htmlFor="showInMenu" className="text-sm">Exibir no menu</label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rótulo no Menu</label>
              <input type="text" value={menuLabel} onChange={(e) => setMenuLabel(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Conteúdo *</label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" style={{ backgroundColor: "var(--degase-blue-dark)" }}>
              {editingId ? "Atualizar" : "Criar Página"}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
          </div>
        </form>
        {editingId && (
          <div className="mt-8 pt-8 border-t">
            <h2 className="text-lg font-bold mb-4">Blocos Personalizados</h2>
            <PageBlocksEditor pageId={editingId} />
          </div>
        )}

        {showVersionHistory && getPageHistoryQuery && getPageHistoryQuery.data && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
            <h2 className="text-lg font-bold mb-4">Historico de Versoes</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getPageHistoryQuery.data.length > 0 ? (
                getPageHistoryQuery.data.map((version: any) => (
                  <div key={version.id} className="p-3 bg-white rounded border text-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{version.changeDescription}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(version.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Nenhuma versao anterior</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--degase-blue-dark)" }}>Páginas Institucionais</h1>
        <Button onClick={() => setShowEditor(true)} style={{ backgroundColor: "var(--degase-blue-dark)" }}>
          <Plus size={16} className="mr-1" /> Nova Página
        </Button>
      </div>

      {pages && pages.length > 0 ? (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Título</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-sm">{page.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">/{page.slug}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${page.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {page.status === "published" ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => editPage(page)} className="p-1.5 hover:bg-gray-200 rounded"><Edit size={14} /></button>
                      <button onClick={() => { if (confirm("Excluir esta página?")) deleteMutation.mutate({ id: page.id }); }} className="p-1.5 hover:bg-red-100 rounded text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">Nenhuma página criada.</p>
          <Button onClick={() => setShowEditor(true)} style={{ backgroundColor: "var(--degase-blue-dark)" }}>
            <Plus size={16} className="mr-1" /> Criar Primeira Página
          </Button>
        </div>
      )}
    </div>
  );
}
