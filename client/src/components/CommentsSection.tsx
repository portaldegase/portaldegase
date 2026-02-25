import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

interface CommentsSectionProps {
  postId: number;
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: comments, refetch } = trpc.comments.getCommentsByPostId.useQuery({ postId });
  const createCommentMutation = trpc.comments.createComment.useMutation({
    onSuccess: () => {
      toast.success('Comentário enviado! Aguardando aprovação.');
      setAuthorName('');
      setAuthorEmail('');
      setContent('');
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao enviar comentário: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authorName.trim() || !authorEmail.trim() || !content.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsSubmitting(true);
    try {
      await createCommentMutation.mutateAsync({
        postId,
        authorName,
        authorEmail,
        content,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Deixe um Comentário</CardTitle>
          <CardDescription>Sua opinião é importante para nós</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <Input
                type="text"
                placeholder="Seu nome"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comentário</label>
              <Textarea
                placeholder="Escreva seu comentário aqui..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar Comentário'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {comments && comments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comentários ({comments.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{comment.authorName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-700">{comment.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {comments && comments.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Nenhum comentário aprovado ainda.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
