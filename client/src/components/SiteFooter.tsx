import { Link } from "wouter";
import { MapPin, Clock, Phone, Mail, Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer role="contentinfo" className="text-white" style={{ backgroundColor: "var(--degase-blue-dark)" }}>
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663378282282/eQqARgEIiuikpAao.png" alt="DEGASE" className="h-12 object-contain brightness-0 invert" />
              <div>
                <div className="text-xs uppercase tracking-wider opacity-70">Governo do Estado do Rio de Janeiro</div>
                <div className="font-bold text-lg">DEGASE</div>
              </div>
            </div>
            <p className="text-sm opacity-80 mb-4">
              Departamento Geral de Ações Socioeducativas - Responsável pela execução das medidas socioeducativas no Estado do Rio de Janeiro.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://www.instagram.com/degaserj" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-80 p-1.5 bg-white/10 rounded-full">
                <Instagram size={16} />
              </a>
              <a href="https://www.facebook.com/degaserj" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-80 p-1.5 bg-white/10 rounded-full">
                <Facebook size={16} />
              </a>
              <a href="https://twitter.com/RjDegase" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:opacity-80 p-1.5 bg-white/10 rounded-full">
                <Twitter size={16} />
              </a>
              <a href="https://www.youtube.com/@tvdegase" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:opacity-80 p-1.5 bg-white/10 rounded-full">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 opacity-70" />
                <span>Rua Taifeiro Osmar de Moraes, 111, Galeão - Ilha do Governador, RJ - CEP 21941-455</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={16} className="shrink-0 opacity-70" />
                <span>Seg-Sex 9:00-17:00</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 opacity-70" />
                <a href="tel:+552123346674" className="hover:underline">(21) 2334-6674</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 opacity-70" />
                <a href="mailto:ouvidoria@novodegase.rj.gov.br" className="hover:underline">ouvidoria@novodegase.rj.gov.br</a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/sobre" className="hover:underline opacity-80 hover:opacity-100">Sobre o DEGASE</Link></li>
              <li><Link href="/noticias" className="hover:underline opacity-80 hover:opacity-100">Notícias</Link></li>
              <li><Link href="/transparencia" className="hover:underline opacity-80 hover:opacity-100">Transparência</Link></li>
              <li><Link href="/legislacao" className="hover:underline opacity-80 hover:opacity-100">Legislação</Link></li>
              <li><Link href="/unidades" className="hover:underline opacity-80 hover:opacity-100">Unidades</Link></li>
              <li><Link href="/contato" className="hover:underline opacity-80 hover:opacity-100">Contato</Link></li>
              <li><Link href="/privacidade" className="hover:underline opacity-80 hover:opacity-100">Política de Privacidade</Link></li>
              <li><Link href="/termos" className="hover:underline opacity-80 hover:opacity-100">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-4 flex flex-col md:flex-row items-center justify-between text-xs opacity-70">
          <p>&copy; {new Date().getFullYear()} DEGASE - Departamento Geral de Ações Socioeducativas. Todos os direitos reservados.</p>
          <p className="mt-2 md:mt-0">Governo do Estado do Rio de Janeiro</p>
        </div>
      </div>
    </footer>
  );
}
