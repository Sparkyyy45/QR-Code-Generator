import { useState, useRef, useCallback, useEffect } from "react";
import QRCode from "qrcode";

export function App() {
  const [url, setUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [downloaded, setDownloaded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Customization state - Color: Black | Blue | Red
  const [activeColor, setActiveColor] = useState<"black" | "blue" | "red">("black");
  const [logoFile, setLogoFile] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colors = {
    black: "#000000",
    blue: "#2563EB",
    red: "#DC2626"
  };

  const generateQR = useCallback(async () => {
    if (!url.trim()) {
      setQrDataUrl("");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // 1024px for high quality
      const size = 1024;
      canvas.width = size;
      canvas.height = size;

      await QRCode.toCanvas(canvas, url, {
        width: size,
        margin: 2,
        color: { dark: colors[activeColor], light: "#FFFFFF" }, // Background is actually white on the QR itself
        errorCorrectionLevel: logoFile ? "H" : "M",
      });

      if (logoFile) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              const logoSize = size * 0.22;
              const x = (size - logoSize) / 2;
              const y = (size - logoSize) / 2;

              const pad = size * 0.03;
              ctx.fillStyle = "#FFFFFF";
              ctx.beginPath();
              ctx.roundRect(x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2, size * 0.06);
              ctx.fill();

              ctx.drawImage(img, x, y, logoSize, logoSize);
              resolve();
            };
            img.onerror = reject;
            img.src = logoFile;
          });
        }
      }
      setQrDataUrl(canvas.toDataURL("image/png"));
    } catch (err) {
      console.error("QR Generation failed", err);
    }
  }, [url, activeColor, logoFile]);

  useEffect(() => {
    const t = setTimeout(generateQR, 200); // 200ms delay as requested
    return () => clearTimeout(t);
  }, [generateQR]);

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `qr-code-${Date.now()}.png`;
    link.href = qrDataUrl;
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const copyQR = async () => {
    if (!qrDataUrl) return;
    try {
      const r = await fetch(qrDataUrl);
      const blob = await r.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogoFile(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden">
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleLogoUpload}
      />

      {/* Minimal Top Nav */}
      <nav className="fixed top-0 w-full max-w-6xl mx-auto px-6 py-6 flex justify-between items-center z-50 mix-blend-multiply">
        <span className="text-sm font-medium tracking-tight text-ink">QR Generator</span>
        <div className="flex gap-6 text-sm text-ink-muted">
          <a href="#" className="hover:text-ink transition-smooth">Docs</a>
          <a href="#" className="hover:text-ink transition-smooth">GitHub</a>
        </div>
      </nav>

      {/* Main Content Area - Enforcing vertical rhythm */}
      <main className="w-full max-w-xl px-6 flex flex-col items-center pb-32" style={{ paddingTop: '120px' }}>

        {/* Header Block */}
        <div className="text-center animate-in">
          <h1 className="text-[64px] font-bold leading-[0.9] tracking-[-0.04em] text-ink mb-3 bg-clip-text text-transparent bg-gradient-to-b from-black to-black/80 font-satoshi">
            QR Generator
          </h1>
          <p className="text-base text-ink-muted font-normal tracking-wide">
            Create elegant QR codes instantly.
          </p>
        </div>

        {/* Input Block - 48px spacing from title */}
        <div className="w-full mt-12 animate-in delay-100 relative group">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your URL here"
            className="w-full bg-transparent text-[20px] text-center py-3 border-b border-black/10 transition-smooth placeholder:text-black/30 focus:border-black"
          />
        </div>

        {/* Controls - Segmented Toggle + Logo */}
        <div className="mt-8 flex gap-4 animate-in delay-200">
          {/* Segmented Color Control */}
          <div className="bg-black/5 p-1 rounded-full flex relative">
            {(['black', 'blue', 'red'] as const).map((color) => (
              <button
                key={color}
                onClick={() => setActiveColor(color)}
                className={`relative z-10 px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-smooth ${activeColor === color ? 'bg-white shadow-sm text-black' : 'text-ink-muted hover:text-ink'}`}
              >
                {color}
              </button>
            ))}
          </div>

          {/* Logo Button */}
          <button
            onClick={() => logoFile ? setLogoFile(null) : fileInputRef.current?.click()}
            className="px-4 py-1.5 rounded-full text-xs font-medium bg-white border border-black/10 text-ink-muted hover:text-ink hover:border-black/20 transition-smooth"
          >
            {logoFile ? "Remove Logo" : "+ Logo"}
          </button>
        </div>

        {/* QR Card Block - 64px from input */}
        <div className={`mt-16 w-full flex flex-col items-center transition-all duration-500 ease-out ${url ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>

          {/* Glass Card */}
          <div className="glass-card rounded-[28px] p-10 flex items-center justify-center relative">
            <div className={`transition-opacity duration-300 ${qrDataUrl ? 'opacity-100' : 'opacity-80'}`}>
              <img
                src={qrDataUrl}
                alt="QR Code"
                className="w-64 h-64 mix-blend-multiply block"
              />
            </div>

            {/* Download Button - Floating slightly over bottom right or separate? Design says Primary/Secondary actions below. */}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-10">
            <button
              onClick={downloadQR}
              className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transition-smooth"
            >
              {downloaded ? "Saved" : "Download PNG"}
            </button>
            <button
              onClick={copyQR}
              className="bg-transparent text-ink border border-black/10 px-6 py-3 rounded-full text-sm font-medium hover:bg-black/5 active:scale-95 transition-smooth"
            >
              {copied ? "Copied" : "Copy to Clipboard"}
            </button>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full text-center py-8 mt-auto">
        <span className="text-[12px] font-medium text-ink opacity-50 tracking-wide">
          Secure • Fast • Client-side
        </span>
      </footer>

    </div>
  );
}
