import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const unitTypes = [
  { value: "internacao", label: "Internação" },
  { value: "internacao_provisoria", label: "Internação Provisória" },
  { value: "semiliberdade", label: "Semiliberdade" },
  { value: "meio_aberto", label: "Meio Aberto" },
];

export default function AdminUnits() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<string>("internacao");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [visitDays, setVisitDays] = useState("");

  const utils = trpc.useUtils();
  const { data: units } = trpc.units.list.useQuery();

  const createMutation = trpc.units.create.useMutation({
    onSuccess: () => { utils.units.list.invalidate(); toast.success("Unidade criada!"); resetForm(); },
    onError: (e) => toast.error(`Erro: ${e.message}`),
  });
  const updateMutation = trpc.units.update.useMutation({
    onSuccess: () => { utils.units.list.invalidate(); toast.success("Unidade atualizada!"); resetForm(); },
    onError: (e) => toast.error(`Erro: ${e.message}`),
  });
  const deleteMutation = trpc.units.delete.useMutation({
    onSuccess: () => { utils.units.list.invalidate(); toast.success("Unidade excluída!"); },
  });

  function resetForm() { setShowForm(false); setEditingId(null); setName(""); setType("internacao"); setAddress(""); setPhone(""); setEmail(""); setVisitDays(""); }

  function editUnit(u: any) { setEditingId(u.id); setName(u.name); setType(u.type); setAddress(u.address || ""); setPhone(u.phone || ""); setEmail(u.email || ""); setVisitDays(u.visitDays || ""); setShowForm(true); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { toast.error("Nome é obrigatório."); return; }
    const data = { name, type: type as any, address: address || undefined, phone: phone || undefined, email: email || undefined, visitDays: visitDays || undefined };
    if (editingId) { updateMutation.mutate({ id: editingId, ...data }); }
    else { createMutation.mutate(data); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--degase-blue-dark)" }}>Unidades</h1>
        <Button onClick={() => setShowForm(true)} style={{ backgroundColor: "var(--degase-blue-dark)" }}><Plus size={16} className="mr-1" /> Nova Unidade</Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg border mb-6 space-y-3">
          <h2 className="font-bold">{editingId ? "Editar Unidade" : "Nova Unidade"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium mb-1">Nome *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-md" required /></div>
            <div><label className="block text-sm font-medium mb-1">Tipo *</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 border rounded-md">
                {unitTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium mb-1">Endereço</label><input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 border rounded-md" /></div>
            <div><label className="block text-sm font-medium mb-1">Telefone</label><input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border rounded-md" /></div>
            <div><label className="block text-sm font-medium mb-1">E-mail</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md" /></div>
            <div><label className="block text-sm font-medium mb-1">Dias de Visita</label><input type="text" value={visitDays} onChange={(e) => setVisitDays(e.target.value)} className="w-full px-3 py-2 border rounded-md" /></div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" style={{ backgroundColor: "var(--degase-blue-dark)" }}>{editingId ? "Atualizar" : "Criar"}</Button>
            <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
          </div>
        </form>
      )}

      {units && units.length > 0 ? (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Endereço</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {units.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-sm">{u.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{unitTypes.find(t => t.value === u.type)?.label}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell truncate max-w-xs">{u.address || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => editUnit(u)} className="p-1.5 hover:bg-gray-200 rounded"><Edit size={14} /></button>
                      <button onClick={() => { if (confirm("Excluir?")) deleteMutation.mutate({ id: u.id }); }} className="p-1.5 hover:bg-red-100 rounded text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg"><p className="text-gray-500">Nenhuma unidade cadastrada.</p></div>
      )}
    </div>
  );
}
