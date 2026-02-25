import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("degase-cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("degase-cookie-consent", "accepted");
    localStorage.setItem("degase-cookie-consent-date", new Date().toISOString());
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem("degase-cookie-consent", "rejected");
    localStorage.setItem("degase-cookie-consent-date", new Date().toISOString());
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 shadow-2xl border-t"
      style={{ backgroundColor: "var(--degase-blue-dark)" }}
      role="dialog"
      aria-label="Consentimento de cookies"
      aria-describedby="cookie-description"
    >
      <div className="container flex flex-col md:flex-row items-start md:items-center gap-4">
        <Cookie className="text-white shrink-0 hidden md:block" size={24} />
        <div className="flex-1 text-white text-sm" id="cookie-description">
          <p className="font-semibold mb-1">Controle sua privacidade</p>
          <p className="opacity-90">
            Este site utiliza cookies para melhorar sua experiência de navegação, conforme a{" "}
            <Link href="/privacidade" className="underline font-medium">Lei Geral de Proteção de Dados (LGPD)</Link>.
            Ao continuar navegando, você concorda com o uso de cookies essenciais para o funcionamento do site.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={reject} className="text-white border-white/30 hover:bg-white/10 bg-transparent">
            Rejeitar
          </Button>
          <Button size="sm" onClick={accept} style={{ backgroundColor: '#4e7dee', color: '#ffffff' }} className="text-black font-medium hover:opacity-90">
            Aceitar
          </Button>
        </div>
        <button onClick={reject} className="absolute top-2 right-2 text-white/60 hover:text-white md:hidden" aria-label="Fechar">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
