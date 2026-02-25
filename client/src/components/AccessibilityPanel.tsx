import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ isOpen, onClose }) => {
  const [librasEnabled, setLibrasEnabled] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Persistir configurações no localStorage
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      const settings = JSON.parse(saved);
      setLibrasEnabled(settings.libras || false);
      setVoiceEnabled(settings.voice || false);
      setHighContrast(settings.highContrast || false);
      setFontSize(settings.fontSize || 100);
    }
  }, []);

  // Salvar configurações
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify({
      libras: librasEnabled,
      voice: voiceEnabled,
      highContrast: highContrast,
      fontSize: fontSize,
    }));

    // Aplicar contraste alto
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    // Aplicar tamanho de fonte
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [librasEnabled, voiceEnabled, highContrast, fontSize]);

  // Função para ler texto em voz alta
  const speakText = (text: string) => {
    if (!voiceEnabled && text.length > 50) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleLibrasToggle = () => {
    setLibrasEnabled(!librasEnabled);
    if (!librasEnabled) {
      speakText('Intérprete de Libras ativado');
    }
  };

  const handleVoiceToggle = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled) {
      speakText('Narração de voz ativada');
    } else {
      window.speechSynthesis.cancel();
    }
  };

  const handleHighContrastToggle = () => {
    setHighContrast(!highContrast);
    speakText(highContrast ? 'Contraste alto desativado' : 'Contraste alto ativado');
  };

  const handleReadPageContent = () => {
    const mainContent = document.querySelector('main') || document.querySelector('body');
    if (mainContent) {
      const text = mainContent.innerText;
      speakText(text);
    }
  };

  const handleResetSettings = () => {
    setLibrasEnabled(false);
    setVoiceEnabled(false);
    setHighContrast(false);
    setFontSize(100);
    window.speechSynthesis.cancel();
    localStorage.removeItem('accessibility-settings');
    speakText('Configurações de acessibilidade restauradas');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Acessibilidade</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fechar painel de acessibilidade"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={librasEnabled}
                onChange={handleLibrasToggle}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                aria-label="Ativar intérprete de Libras"
              />
              <span className="text-gray-900 font-medium">🤟 Intérprete de Libras</span>
            </label>
            <p className="text-sm text-gray-600 ml-8">
              Ativa um intérprete virtual em Libras para conteúdo importante
            </p>
            {librasEnabled && (
              <div className="ml-8 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  ✓ Intérprete de Libras ativado.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={handleVoiceToggle}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                aria-label="Ativar narração de voz"
              />
              <span className="text-gray-900 font-medium">
                {voiceEnabled ? <Volume2 size={20} className="inline mr-2" /> : <VolumeX size={20} className="inline mr-2" />}
                Narração de Voz
              </span>
            </label>
            <p className="text-sm text-gray-600 ml-8">
              Ativa a leitura em voz alta do conteúdo da página
            </p>
            {voiceEnabled && (
              <div className="ml-8 space-y-2">
                <button
                  onClick={handleReadPageContent}
                  disabled={isSpeaking}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm font-medium"
                >
                  {isSpeaking ? '🔊 Lendo...' : '▶ Ler página em voz alta'}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={highContrast}
                onChange={handleHighContrastToggle}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                aria-label="Ativar contraste alto"
              />
              <span className="text-gray-900 font-medium">
                {highContrast ? <Eye size={20} className="inline mr-2" /> : <EyeOff size={20} className="inline mr-2" />}
                Contraste Alto
              </span>
            </label>
            <p className="text-sm text-gray-600 ml-8">
              Aumenta o contraste para melhor legibilidade
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-gray-900 font-medium block">
              📝 Tamanho da Fonte: {fontSize}%
            </label>
            <input
              type="range"
              min="80"
              max="150"
              step="10"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              aria-label="Ajustar tamanho da fonte"
            />
          </div>

          <button
            onClick={handleResetSettings}
            className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
          >
            ↺ Restaurar Configurações Padrão
          </button>
        </div>
      </div>
    </div>
  );
};
