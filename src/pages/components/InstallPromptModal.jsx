import { useEffect, useState, useRef } from "react";

const REOPEN_INTERVAL = 30 * 1000; 

const InstallPromptModal = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  useEffect(() => {
    if (!deferredPrompt) return;

    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const showModal = () => setVisible(true);

    showModal();

    intervalRef.current = setInterval(() => {
      showModal();
    }, REOPEN_INTERVAL);

    return () => clearInterval(intervalRef.current);
  }, [deferredPrompt]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      clearInterval(intervalRef.current);
    }

    setVisible(false);
  };

  const handleSkip = () => {
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
