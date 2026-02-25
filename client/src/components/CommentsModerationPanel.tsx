import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';

export function CommentsModerationPanel() {
  const { data: pendingComments, refetch, isLoading } = trpc.comments.getPendingComments.useQuery();
  
  const updateStatusMutation = trpc.comments.updateCommentStatus.useMutation({
    onSuccess: () => {
      toast.success('Comentário atualizado!');
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const deleteCommentMutation = trpc.comments.deleteComment.useMutation({
    onSuccess: () => {
      toast.success('Comentário deletado!');
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const handleApprove = (commentId: number) => {
    updateStatusMutation.mutate({
      commentId,
      status: 'approved',
    });
  };

  const handleReject = (commentId: number) => {
    updateStatusMutation.mutate({
      commentId,
      status: 'rejected',
    });
  };

  const handleDelete = (commentId: number) => {
    if (confirm('Tem certeza que deseja deletar este comentário?')) {
      deleteCommentMutation.mutate({ commentId });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando comentários pendentes...</div>;
  }

  if (!pendingComments || pendingComments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Nenhum comentário pendente de moderação.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Moderação de Comentários</CardTitle>
          <CardDescription>
            {pendingComments.length} comentário(s) aguardando aprovação
          </CardDescription>
        </CardHeader>
      </Card>

      {pendingComments.map((comment) => (
        <Card key={comment.id}>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{comment.authorName}</p>
                  <p className="text-sm text-gray-500">{comment.authorEmail}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Post ID: {comment.postId} • {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <Badge variant="outline" className="bg-yellow-50">
                  {comment.status}
                </Badge>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleApprove(comment.id)}
                  disabled={updateStatusMutation.isPending}
                  className="text-green-600 hover:text-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Aprovar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(comment.id)}
                  disabled={updateStatusMutation.isPending}
                  className="text-red-600 hover:text-red-700"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Rejeitar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(comment.id)}
                  disabled={deleteCommentMutation.isPending}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Deletar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
