import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { X, Download } from "lucide-react";

// Minimal typing for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_KEY = "pwa_prompt_dismissed";

export const PWAInstallPrompt: React.FC = () => {
  const { user } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [canShowAfterDelay, setCanShowAfterDelay] = useState(false);

  useEffect(() => {
    // Hide if already installed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) return;

    const handler = (e: Event) => {
      e.preventDefault();
      const bpEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(bpEvent);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () => window.removeEventListener("beforeinstallprompt", handler as EventListener);
  }, [user]);

  // When user logs in, reset dismissal and start a delay before showing the prompt
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (user) {
      sessionStorage.removeItem(DISMISS_KEY);
      setCanShowAfterDelay(false);
      // Wait ~8s after login to avoid showing during initial toast/navigation
      timer = setTimeout(() => setCanShowAfterDelay(true), 8000);
    } else {
      setCanShowAfterDelay(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [user]);

  // Show prompt only after delay and if not dismissed
  useEffect(() => {
    const dismissed = sessionStorage.getItem(DISMISS_KEY) === "true";
    if (user && deferredPrompt && canShowAfterDelay && !dismissed) {
      setVisible(true);
    }
  }, [user, deferredPrompt, canShowAfterDelay]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setVisible(false);
      setDeferredPrompt(null);
    } else {
      sessionStorage.setItem(DISMISS_KEY, "true");
      setVisible(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setVisible(false);
  };

  if (!visible || !deferredPrompt) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-[10000] px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative p-6 space-y-4">
        <button
          onClick={handleDismiss}
          aria-label="Close"
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 flex-shrink-0 rounded-full bg-white flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm">
            <img
              src="/logo-512x512.png"
              alt="TrustBridge logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Install TrustBridge AI</h3>
            <p className="text-sm text-gray-600">Install TrustBridge AI as an app on your device for a better experience. Get quick access, and faster loads.</p>
          </div>
        </div>

        <div className="flex items-center justify-between space-x-3 pt-2">
          <button
            onClick={handleInstall}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition-colors"
          >
            <Download size={18} />
            Install App
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};
