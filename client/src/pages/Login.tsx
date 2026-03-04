diff --git a/client/src/pages/Login.tsx b/client/src/pages/Login.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..f0ecdb0185bb182b0a263a8820e28396cdbb0d29
--- /dev/null
+++ b/client/src/pages/Login.tsx
@@ -0,0 +1,52 @@
+import { useState, type FormEvent } from "react";
+import { useLocation } from "wouter";
+import { trpc } from "@/lib/trpc";
+import { Button } from "@/components/ui/button";
+import { Input } from "@/components/ui/input";
+
+export default function Login() {
+  const [, setLocation] = useLocation();
+  const [email, setEmail] = useState("");
+  const [password, setPassword] = useState("");
+  const [error, setError] = useState("");
+
+  const loginMutation = trpc.auth.login.useMutation({
+    onSuccess: () => {
+      setLocation("/admin");
+    },
+    onError: err => {
+      setError(err.message || "Falha ao autenticar");
+    },
+  });
+
+  const onSubmit = async (e: FormEvent) => {
+    e.preventDefault();
+    setError("");
+    await loginMutation.mutateAsync({ email, password });
+  };
+
+  return (
+    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
+      <form onSubmit={onSubmit} className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4">
+        <h1 className="text-2xl font-bold text-gray-900">Entrar no Painel</h1>
+        <p className="text-sm text-gray-600">Autenticação local (servidor próprio)</p>
+
+        <div>
+          <label className="text-sm font-medium">E-mail</label>
+          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
+        </div>
+
+        <div>
+          <label className="text-sm font-medium">Senha</label>
+          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
+        </div>
+
+        {error && <p className="text-sm text-red-600">{error}</p>}
+
+        <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
+          {loginMutation.isPending ? "Entrando..." : "Entrar"}
+        </Button>
+      </form>
+    </div>
+  );
+}
