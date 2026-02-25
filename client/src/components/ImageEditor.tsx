import { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCw, ZoomIn, ZoomOut, X } from "lucide-react";
import { toast } from "sonner";

interface ImageEditorProps {
  imageSrc: string;
  onSave: (croppedImage: Blob) => void;
  onCancel: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ImageEditor({ imageSrc, onSave, onCancel }: ImageEditorProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImage = useCallback(async (): Promise<Blob | null> => {
    if (!croppedAreaPixels || !canvasRef.current) return null;

    try {
      const image = new Image();
      image.src = imageSrc;

      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const maxSize = 2000;
      const scale = Math.min(maxSize / croppedAreaPixels.width, maxSize / croppedAreaPixels.height, 1);

      canvas.width = croppedAreaPixels.width * scale;
      canvas.height = croppedAreaPixels.height * scale;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width * scale,
        croppedAreaPixels.height * scale
      );

      ctx.restore();

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg", 0.9);
      });
    } catch (error) {
      console.error("Erro ao cortar imagem:", error);
      toast.error("Erro ao processar imagem");
      return null;
    }
  }, [imageSrc, croppedAreaPixels, rotation]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const croppedBlob = await getCroppedImage();
      if (croppedBlob) {
        onSave(croppedBlob);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleAspectRatioChange = (ratio: string) => {
    if (ratio === "free") {
      setAspectRatio(undefined);
    } else {
      setAspectRatio(parseFloat(ratio));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-bold">Editar Imagem</h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Fechar editor"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cropper */}
        <div className="relative bg-gray-100 h-96 overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            showGrid={true}
          />
        </div>

        {/* Controls */}
        <div className="p-4 space-y-4 border-t">
          {/* Zoom Control */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Zoom: {Math.round(zoom * 100)}%</label>
            <div className="flex items-center gap-3">
              <ZoomOut size={18} className="text-gray-600" />
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                min={1}
                max={3}
                step={0.1}
                className="flex-1"
              />
              <ZoomIn size={18} className="text-gray-600" />
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Proporção</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleAspectRatioChange("free")}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  aspectRatio === undefined
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Livre
              </button>
              <button
                onClick={() => handleAspectRatioChange("1")}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  aspectRatio === 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                1:1 (Quadrado)
              </button>
              <button
                onClick={() => handleAspectRatioChange("16/9")}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  aspectRatio === 16 / 9
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                16:9 (Widescreen)
              </button>
              <button
                onClick={() => handleAspectRatioChange("4/3")}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  aspectRatio === 4 / 3
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                4:3 (Padrão)
              </button>
              <button
                onClick={() => handleAspectRatioChange("3/2")}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  aspectRatio === 3 / 2
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                3:2 (Paisagem)
              </button>
              <button
                onClick={() => handleAspectRatioChange("9/16")}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  aspectRatio === 9 / 16
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                9:16 (Retrato)
              </button>
            </div>
          </div>

          {/* Rotation */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Rotação: {rotation}°</label>
            <Button
              onClick={handleRotate}
              variant="outline"
              className="w-full"
            >
              <RotateCw size={16} className="mr-2" />
              Girar 90°
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1"
              style={{ backgroundColor: "var(--degase-blue-dark)" }}
            >
              {isSaving ? "Processando..." : "Salvar Imagem"}
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
