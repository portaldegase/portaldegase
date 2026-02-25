import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Trash2, Edit2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminUsers() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const listUsers = trpc.admin.listUsers.useQuery();
  const listCategories = trpc.categories.list.useQuery();
  const updateUserRole = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      toast.success("Usuário atualizado com sucesso!");
      listUsers.refetch();
      setSelectedUserId(null);
      setSelectedRole("");
      setSelectedCategory("");
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });
  const deleteUser = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      toast.success("Usuário deletado com sucesso!");
      listUsers.refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const handleUpdateRole = async () => {
    if (!selectedUserId || !selectedRole) {
      toast.error("Selecione um usuário e um role");
      return;
    }
    await updateUserRole.mutateAsync({
      id: selectedUserId,
      role: selectedRole as "user" | "admin" | "contributor",
      categoryId: selectedRole === "contributor" ? parseInt(selectedCategory) : undefined,
    });
  };

  const handleDeleteUser = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este usuário?")) {
      await deleteUser.mutateAsync({ id });
    }
  };

  if (listUsers.isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const selectedUserData = listUsers.data?.find((u) => u.id === selectedUserId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
        <p className="text-gray-600 mt-2">Gerencie roles e permissões de usuários</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Usuários do Sistema</CardTitle>
            <CardDescription>Total de {listUsers.data?.length || 0} usuários</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {listUsers.data?.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`p-3 rounded border cursor-pointer transition ${
                    selectedUserId === user.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{user.name || "Sem nome"}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {user.role}
                        </span>
                        {user.categoryId && (
                          <span className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-700">
                            Cat. {user.categoryId}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(user.id);
                      }}
                      disabled={deleteUser.isPending}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Role Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Editar Permissões</CardTitle>
            <CardDescription>
              {selectedUserData ? `${selectedUserData.name || "Usuário"}` : "Selecione um usuário"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedUserData && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="contributor">Contribuidor</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedRole === "contributor" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Categoria Permitida</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {listCategories.data?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button
                  onClick={handleUpdateRole}
                  disabled={!selectedRole || updateUserRole.isPending}
                  className="w-full"
                  style={{ backgroundColor: "var(--degase-blue-dark)" }}
                >
                  {updateUserRole.isPending ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Atualizando...
                    </>
                  ) : (
                    <>
                      <Edit2 size={16} className="mr-2" />
                      Atualizar
                    </>
                  )}
                </Button>
              </>
            )}
            {!selectedUserData && (
              <p className="text-sm text-gray-500 text-center py-8">
                Selecione um usuário para editar suas permissões
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Role Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Descrição dos Roles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-medium">Administrador</p>
            <p className="text-sm text-gray-600">Acesso total ao sistema. Pode gerenciar todos os conteúdos e usuários.</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <p className="font-medium">Contribuidor</p>
            <p className="text-sm text-gray-600">Pode postar notícias, banners e vídeos apenas na categoria atribuída.</p>
          </div>
          <div className="border-l-4 border-gray-500 pl-4">
            <p className="font-medium">Usuário</p>
            <p className="text-sm text-gray-600">Acesso somente leitura. Pode visualizar conteúdo público.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
