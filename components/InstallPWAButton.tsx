"use client";
import { useEffect, useState } from "react";

// Type for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    // Log when the component mounts
    console.log('[PWA] InstallPWAButton mounted');

    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Register service worker
      window.addEventListener("load", () => {
        console.log('[PWA] Registering service worker');
        navigator.serviceWorker.register("/service-worker.js")
          .then(registration => {
            console.log('[PWA] Service Worker registered:', registration);
          })
          .catch(error => {
            console.error('[PWA] Service Worker registration failed:', error);
          });
      });

      // Check if already installed
      if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('[PWA] App is already installed');
        return;
      }
    } else {
      console.log('[PWA] Service Workers not supported');
    }

    const handler = (e: Event) => {
      console.log('[PWA] beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      console.log('[PWA] Triggering install prompt');
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] Install prompt outcome:', outcome);
      if (outcome === "accepted") {
        setShowInstall(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!showInstall) return null;

  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full w-14 h-14 shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl transition-shadow duration-200"
      title="Install App"
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="text-gray-800 dark:text-white"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <path d="M12 8v8M8 16l4 4 4-4" />
      </svg>
    </button>
  );
}
