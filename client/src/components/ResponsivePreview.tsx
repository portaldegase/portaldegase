import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Monitor, Tablet, Smartphone, Eye } from "lucide-react";
import { Streamdown } from "streamdown";

interface ResponsivePreviewProps {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
}

type DeviceType = "desktop" | "tablet" | "mobile";

const DEVICE_SIZES: Record<DeviceType, { width: number; label: string; icon: React.ReactNode }> = {
  desktop: { width: 1920, label: "Desktop (1920px)", icon: <Monitor size={16} /> },
  tablet: { width: 768, label: "Tablet (768px)", icon: <Tablet size={16} /> },
  mobile: { width: 375, label: "Mobile (375px)", icon: <Smartphone size={16} /> },
};

export default function ResponsivePreview({ title, content, excerpt, featuredImage }: ResponsivePreviewProps) {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>("desktop");
  const device = DEVICE_SIZES[selectedDevice];

  return (
    <Card className="border-l-4" style={{ borderLeftColor: "var(--degase-blue-light)" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye size={20} style={{ color: "var(--degase-blue-dark)" }} />
          Pré-visualização Responsiva
        </CardTitle>
        <CardDescription>
          Visualize como a notícia aparecerá em diferentes dispositivos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seletor de Dispositivo */}
        <Tabs value={selectedDevice} onValueChange={(v) => setSelectedDevice(v as DeviceType)}>
          <TabsList className="grid w-full grid-cols-3">
            {Object.entries(DEVICE_SIZES).map(([key, { label, icon }]) => (
              <TabsTrigger key={key} value={key} className="flex items-center gap-1">
                {icon}
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Preview Container */}
          {Object.entries(DEVICE_SIZES).map(([key, { width }]) => (
            <TabsContent key={key} value={key} className="mt-4">
              <div className="flex justify-center bg-gray-100 p-4 rounded-lg overflow-auto">
                <div
                  style={{
                    width: `${width}px`,
                    backgroundColor: "white",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                  className="rounded-lg overflow-hidden"
                >
                  {/* Preview Content */}
                  <div className="p-6 space-y-4">
                    {/* Featured Image */}
                    {featuredImage && (
                      <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={featuredImage}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Title */}
                    <h1
                      className="text-3xl font-bold"
                      style={{ color: "var(--degase-blue-dark)" }}
                    >
                      {title}
                    </h1>

                    {/* Excerpt */}
                    {excerpt && (
                      <p className="text-lg text-gray-600 italic border-l-4 pl-4" style={{ borderLeftColor: "var(--degase-gold)" }}>
                        {excerpt}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="text-sm text-gray-500 flex gap-4">
                      <span>
                        Publicado em {new Date().toLocaleDateString("pt-BR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="prose prose-sm max-w-none">
                      <Streamdown>{content}</Streamdown>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-500">
                        © 2024 DEGASE - Departamento Geral de Ações Socioeducativas
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm text-blue-900">
                  Largura da visualização: <strong>{width}px</strong>
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Dicas de Responsividade */}
        <div className="p-4 bg-amber-50 rounded border border-amber-200">
          <p className="text-sm text-amber-900 font-medium mb-2">💡 Dicas de Responsividade:</p>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• Imagens devem ser legíveis em todos os tamanhos</li>
            <li>• Texto deve ter contraste adequado</li>
            <li>• Links e botões devem ser clicáveis em mobile</li>
            <li>• Conteúdo não deve ser cortado nas laterais</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
