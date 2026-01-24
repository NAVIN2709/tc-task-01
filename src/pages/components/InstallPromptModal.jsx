import { useEffect, useState, useRef } from "react";

const REOPEN_INTERVAL = 20 * 1000;

const getDismissedState = () => {
  try {
    return localStorage.getItem("installPromptDismissed") === "true";
  } catch {
    return false;
  }
};

const InstallPromptModal = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(getDismissedState);
  const intervalRef = useRef(null);

  /* ================= CAPTURE EVENT ================= */
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  /* ================= MODAL LOGIC ================= */
  useEffect(() => {
    if (deferredPrompt) {
      setVisible(true);
      return;
    }

    if (isDismissed) {
      setVisible(true);

      intervalRef.current = setInterval(() => {
        setVisible(true);
      }, REOPEN_INTERVAL);

      return () => clearInterval(intervalRef.current);
    }
  }, [deferredPrompt, isDismissed]);

  /* ================= INSTALL ================= */
  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        localStorage.setItem("installPromptDismissed", "true");
        setIsDismissed(true);
        clearInterval(intervalRef.current);
      }
    }

    setVisible(false);
  };

  /* ================= SKIP ================= */
  const handleSkip = () => {
    localStorage.setItem("installPromptDismissed", "true");
    setIsDismissed(true);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-xl">
        <h2 className="text-xl font-extrabold mb-2">
          Install App 🚀
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Get faster access, full-screen experience and notifications.
        </p>

        <button
          onClick={handleInstall}
          className="w-full bg-black text-white py-3 rounded-full font-semibold mb-3"
        >
          Install App
        </button>

        <button
          onClick={handleSkip}
          className="w-full text-gray-500 py-2 text-sm"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default InstallPromptModal;
