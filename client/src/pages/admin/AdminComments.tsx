import { CommentsModerationPanel } from '@/components/CommentsModerationPanel';

export function AdminComments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Moderação de Comentários</h1>
        <p className="text-gray-600 mt-2">Aprove ou rejeite comentários pendentes de publicação</p>
      </div>
      <CommentsModerationPanel />
    </div>
  );
}
