import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface CommentsSectionProps {
  postId: number;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: comments, isLoading, refetch } = trpc.comments.getPostComments.useQuery({ postId });
  const createCommentMutation = trpc.comments.createComment.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authorName.trim() || !authorEmail.trim() || !content.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setIsSubmitting(true);
    try {
      await createCommentMutation.mutateAsync({
        postId,
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim(),
        content: content.trim(),
      });
      
      toast.success("Comentário enviado para moderação!");
      setAuthorName("");
      setAuthorEmail("");
      setContent("");
      refetch();
    } catch (error) {
      toast.error("Erro ao enviar comentário");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 mt-8">
      {/* Formulário de Comentário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle size={20} style={{ color: "var(--degase-blue-dark)" }} />
            Deixe um Comentário
          </CardTitle>
          <CardDescription>
            Seu comentário será moderado antes de ser publicado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Nome *
                </label>
                <input
                  id="name"
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: "var(--degase-gold)", focusRing: "2px solid var(--degase-gold)" }}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  E-mail *
                </label>
                <input
                  id="email"
                  type="email"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: "var(--degase-gold)", focusRing: "2px solid var(--degase-gold)" }}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                Comentário *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Digite seu comentário aqui..."
                rows={4}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-none"
                style={{ borderColor: "var(--degase-gold)", focusRing: "2px solid var(--degase-gold)" }}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: "var(--degase-blue-dark)" }}
              className="text-white hover:opacity-90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Comentário"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de Comentários */}
      <Card>
        <CardHeader>
          <CardTitle>Comentários ({comments?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 size={24} className="animate-spin" style={{ color: "var(--degase-blue-dark)" }} />
            </div>
          ) : comments && comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment: any) => (
                <div key={comment.id} className="p-4 border rounded-lg" style={{ borderColor: "var(--degase-gold)" }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold" style={{ color: "var(--degase-blue-dark)" }}>
                        {comment.authorName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString("pt-BR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <CheckCircle size={20} style={{ color: "var(--degase-gold)" }} />
                  </div>
                  <p className="mt-2 text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Nenhum comentário publicado ainda. Seja o primeiro a comentar!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
