import { useEffect, useState, useRef } from "react";

const REOPEN_INTERVAL = 30 * 1000;

const getInstallRejected = () => {
  try {
    return localStorage.getItem("installRejected") === "true";
  } catch {
    return false;
  }
};

const InstallPromptModal = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [installRejected, setInstallRejected] = useState(getInstallRejected);
  const intervalRef = useRef(null);

  /* ================= CAPTURE EVENT ================= */
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Automatically hide modal if browser prompt is acted on
      e.userChoice.then(({ outcome }) => {
        if (outcome === "accepted") {
          localStorage.setItem("installRejected", "false");
          setInstallRejected(false);
        } else if (outcome === "dismissed") {
          localStorage.setItem("installRejected", "true");
          setInstallRejected(true);
        }
        setVisible(false);
        clearInterval(intervalRef.current);
      });
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

    if (installRejected) {
      setVisible(true);

      intervalRef.current = setInterval(() => {
        setVisible(true);
      }, REOPEN_INTERVAL);
    }

    return () => clearInterval(intervalRef.current);
  }, [deferredPrompt, installRejected]);

  /* ================= INSTALL ================= */
  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // trigger browser prompt
      // modal will close automatically when user acts on browser prompt
    }
  };

  /* ================= SKIP ================= */
  const handleSkip = () => {
    localStorage.setItem("installRejected", "true");
    setInstallRejected(true);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9990] bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-xl">
        <h2 className="text-xl font-extrabold mb-2">Install App 🚀</h2>

        <p className="text-sm text-gray-600 mb-6">
          Get faster access, full-screen experience and notifications.
        </p>

        <button
          onClick={handleInstall}
          className="w-full bg-yellow-400 text-black py-3 rounded-full font-semibold mb-3"
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
