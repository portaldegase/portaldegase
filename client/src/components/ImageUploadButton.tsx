import { useState, useRef } from "react";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import ImageEditor from "./ImageEditor";

interface ImageUploadButtonProps {
  onImageUpload: (url: string) => void;
  disabled?: boolean;
}

export default function ImageUploadButton({ onImageUpload, disabled = false }: ImageUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingFileName, setEditingFileName] = useState<string>("");

  const uploadMutation = trpc.upload.image.useMutation({
    onSuccess: (data) => {
      onImageUpload(data.url);
      toast.success("Imagem enviada com sucesso!");
      setPreview(null);
      setIsUploading(false);
      setShowEditor(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
      setIsUploading(false);
    },
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF.");
      return;
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Arquivo muito grande. Máximo 5MB.");
      return;
    }

    // Mostrar preview e editor
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setEditingFileName(file.name);
      setShowEditor(true);
    };
    reader.readAsDataURL(file);
  };

  const handleImageSave = async (croppedBlob: Blob) => {
    setIsUploading(true);
    try {
      const buffer = await croppedBlob.arrayBuffer();
      uploadMutation.mutate({
        file: new Uint8Array(buffer) as any,
        filename: editingFileName,
        mimetype: croppedBlob.type || 'image/jpeg',
      });
    } catch (error) {
      toast.error("Erro ao processar imagem");
      setIsUploading(false);
    }
  };

  const handleEditorCancel = () => {
    setShowEditor(false);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        disabled={isUploading || disabled || showEditor}
        className="hidden"
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading || disabled || showEditor}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 size={16} className="mr-2 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Upload size={16} className="mr-2" />
            Selecionar Imagem
          </>
        )}
      </Button>

      {uploadMutation.isError && (
        <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          <AlertCircle size={16} />
          {uploadMutation.error?.message}
        </div>
      )}

      <p className="text-xs text-gray-500">
        Máximo 5MB • JPEG, PNG, WebP ou GIF • Você poderá editar antes de enviar
      </p>

      {/* Image Editor Modal */}
      {showEditor && preview && (
        <ImageEditor
          imageSrc={preview}
          onSave={handleImageSave}
          onCancel={handleEditorCancel}
        />
      )}
    </div>
  );
}
