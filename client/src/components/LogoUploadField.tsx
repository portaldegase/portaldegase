import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface LogoUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
}

export function LogoUploadField({ value, onChange }: LogoUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const uploadImage = trpc.upload.uploadImage.useMutation();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type)) {
      toast.error("Formato inválido. Use PNG, JPEG, WebP ou GIF.");
      return;
    }

    // Validar tamanho (máximo 2MB para logo)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 2MB.");
      return;
    }

    setIsUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await uploadImage.mutateAsync({
        fileName: `logo-${Date.now()}.${file.type.split("/")[1]}`,
        fileData: new Uint8Array(arrayBuffer),
        contentType: file.type,
      });
      onChange(result.url);
      toast.success("Logo enviado com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar logo");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label htmlFor="logo-upload" className="cursor-pointer">
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
            id="logo-upload"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
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
          <img src={value} alt="Logo preview" className="h-20 object-contain" />
          <p className="text-xs text-gray-500 mt-2 break-all">{value}</p>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Formatos suportados: PNG, JPEG, WebP, GIF (máximo 2MB)
      </p>
    </div>
  );
}
