import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
  className?: string;
  useParentSize?: boolean;
}

export default function QRCodeGenerator({
  url,
  size,
  className = "",
  useParentSize = false,
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [qrSize, setQrSize] = useState(size ?? 256);

  useEffect(() => {
    if (!useParentSize || !containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const newSize = Math.min(width, height);
        setQrSize(newSize);
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    resizeObserver.observe(containerRef.current);
    window.addEventListener("resize", updateSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, [useParentSize]);

  useEffect(() => {
    if (!url || !canvasRef.current) return;

    QRCode.toCanvas(
      canvasRef.current,
      url,
      {
        width: qrSize,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      },
      (error) => {
        if (error) console.error(error);
      },
    );
  }, [url, qrSize]);

  return (
    <div
      ref={containerRef}
      className={`inline-block ${useParentSize ? "h-full w-full" : ""} ${className}`}
    >
      {!url ? (
        <div
          className="flex items-center justify-center rounded-md bg-gray-100"
          style={{ width: qrSize, height: qrSize }}
        >
          <span className="text-gray-400">Loading...</span>
        </div>
      ) : (
        <canvas className="rounded-md" ref={canvasRef} />
      )}
    </div>
  );
}
