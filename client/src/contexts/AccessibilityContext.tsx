import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type FontSize = "small" | "normal" | "large" | "xlarge";

interface AccessibilityState {
  highContrast: boolean;
  fontSize: FontSize;
  toggleHighContrast: () => void;
  setFontSize: (size: FontSize) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const AccessibilityContext = createContext<AccessibilityState | undefined>(undefined);

const FONT_SIZES: FontSize[] = ["small", "normal", "large", "xlarge"];

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("degase-high-contrast") === "true";
    }
    return false;
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("degase-font-size") as FontSize) || "normal";
    }
    return "normal";
  });

  useEffect(() => {
    const html = document.documentElement;
    if (highContrast) {
      html.classList.add("high-contrast");
    } else {
      html.classList.remove("high-contrast");
    }
    localStorage.setItem("degase-high-contrast", String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    const html = document.documentElement;
    FONT_SIZES.forEach(s => html.classList.remove(`font-size-${s}`));
    html.classList.add(`font-size-${fontSize}`);
    localStorage.setItem("degase-font-size", fontSize);
  }, [fontSize]);

  const toggleHighContrast = useCallback(() => setHighContrast(prev => !prev), []);

  const setFontSize = useCallback((size: FontSize) => setFontSizeState(size), []);

  const increaseFontSize = useCallback(() => {
    setFontSizeState(prev => {
      const idx = FONT_SIZES.indexOf(prev);
      return idx < FONT_SIZES.length - 1 ? FONT_SIZES[idx + 1] : prev;
    });
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSizeState(prev => {
      const idx = FONT_SIZES.indexOf(prev);
      return idx > 0 ? FONT_SIZES[idx - 1] : prev;
    });
  }, []);

  return (
    <AccessibilityContext.Provider value={{ highContrast, fontSize, toggleHighContrast, setFontSize, increaseFontSize, decreaseFontSize }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return ctx;
}
