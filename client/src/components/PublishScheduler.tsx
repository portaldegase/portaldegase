import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Calendar, X, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PublishSchedulerProps {
  postId: number;
  currentStatus: string;
  scheduledAt?: Date | null;
  onScheduled?: () => void;
}

export default function PublishScheduler({ postId, currentStatus, scheduledAt, onScheduled }: PublishSchedulerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    scheduledAt ? format(new Date(scheduledAt), "yyyy-MM-dd") : ""
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    scheduledAt ? format(new Date(scheduledAt), "HH:mm") : "09:00"
  );

  const scheduleMutation = trpc.posts.schedule.useMutation({
    onSuccess: () => {
      toast.success("Post agendado com sucesso!");
      setIsOpen(false);
      onScheduled?.();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const cancelMutation = trpc.posts.cancelSchedule.useMutation({
    onSuccess: () => {
      toast.success("Agendamento cancelado!");
      onScheduled?.();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Selecione data e hora");
      return;
    }

    const dateTimeString = `${selectedDate}T${selectedTime}:00`;
    const scheduledDateTime = new Date(dateTimeString);

    if (scheduledDateTime <= new Date()) {
      toast.error("Data/hora deve ser no futuro");
      return;
    }

    await scheduleMutation.mutateAsync({
      id: postId,
      scheduledAt: scheduledDateTime,
    });
  };

  const handleCancel = async () => {
    if (!confirm("Tem certeza que deseja cancelar o agendamento?")) return;
    await cancelMutation.mutateAsync({ id: postId });
  };

  const isScheduled = currentStatus === "scheduled";

  return (
    <Card className="border-l-4" style={{ borderLeftColor: "var(--degase-blue-light)" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar size={20} style={{ color: "var(--degase-blue-dark)" }} />
          Agendar Publicacao
        </CardTitle>
        <CardDescription>
          {isScheduled && scheduledAt
            ? `Agendado para ${format(new Date(scheduledAt), "dd MMM yyyy HH:mm", { locale: ptBR })}`
            : "Defina uma data e hora para publicar automaticamente"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isScheduled && scheduledAt ? (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm font-medium text-blue-900">
                <Clock size={16} className="inline mr-2" />
                Publicacao agendada para {format(new Date(scheduledAt), "EEEE, dd 'de' MMMM 'de' yyyy 'as' HH:mm", { locale: ptBR })}
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              className="w-full"
            >
              {cancelMutation.isPending ? (
                <>
                  <Loader2 size={14} className="mr-1 animate-spin" />
                  Cancelando...
                </>
              ) : (
                <>
                  <X size={14} className="mr-1" />
                  Cancelar Agendamento
                </>
              )}
            </Button>
          </div>
        ) : (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" style={{ backgroundColor: "var(--degase-blue-dark)" }}>
                <Calendar size={14} className="mr-2" />
                Agendar Publicacao
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agendar Publicacao</DialogTitle>
                <DialogDescription>
                  Escolha a data e hora para publicar este post automaticamente
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="publish-date">Data de Publicacao</Label>
                  <Input
                    id="publish-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={format(new Date(), "yyyy-MM-dd")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publish-time">Hora de Publicacao</Label>
                  <Input
                    id="publish-time"
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <p className="text-sm text-blue-900">
                    {selectedDate && selectedTime
                      ? `O post sera publicado em ${format(
                          new Date(`${selectedDate}T${selectedTime}`),
                          "EEEE, dd 'de' MMMM 'de' yyyy 'as' HH:mm",
                          { locale: ptBR }
                        )}`
                      : "Selecione data e hora"}
                  </p>
                </div>
                <Button
                  onClick={handleSchedule}
                  disabled={scheduleMutation.isPending || !selectedDate || !selectedTime}
                  className="w-full"
                  style={{ backgroundColor: "var(--degase-blue-dark)" }}
                >
                  {scheduleMutation.isPending ? (
                    <>
                      <Loader2 size={14} className="mr-1 animate-spin" />
                      Agendando...
                    </>
                  ) : (
                    <>
                      <Calendar size={14} className="mr-1" />
                      Confirmar Agendamento
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
