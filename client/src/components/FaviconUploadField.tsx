import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface FaviconUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
}

export function FaviconUploadField({ value, onChange }: FaviconUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const uploadImage = trpc.upload.uploadImage.useMutation();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!["image/x-icon", "image/png", "image/jpeg"].includes(file.type)) {
      toast.error("Formato inválido. Use ICO, PNG ou JPEG.");
      return;
    }

    // Validar tamanho (máximo 1MB para favicon)
    if (file.size > 1 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 1MB.");
      return;
    }

    setIsUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await uploadImage.mutateAsync({
        fileName: `favicon-${Date.now()}.${file.type.split("/")[1]}`,
        fileData: new Uint8Array(arrayBuffer),
        contentType: file.type,
      });
      onChange(result.url);
      toast.success("Favicon enviado com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar favicon");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label htmlFor="favicon-upload" className="cursor-pointer">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            {isUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Upload size={16} />
                <span>Escolher arquivo</span>
              </>
            )}
          </div>
          <input
            id="favicon-upload"
            type="file"
            accept="image/x-icon,image/png,image/jpeg"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
            className="text-red-600 hover:text-red-700"
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {value && (
        <div className="border rounded-lg p-3 bg-gray-50">
          <img src={value} alt="Favicon preview" className="h-8 w-8 object-contain" />
          <p className="text-xs text-gray-500 mt-2 break-all">{value}</p>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Formatos suportados: ICO, PNG, JPEG (máximo 1MB)
      </p>
    </div>
  );
}
