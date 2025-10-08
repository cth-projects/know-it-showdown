import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
  className?: string;
}

export default function QRCodeGenerator({
  url,
  size = 256,
  className = "",
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: size,
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
    }
  }, [url, size]);

  return (
    <div className={`inline-block ${className}`}>
      <canvas ref={canvasRef} />
    </div>
  );
}
