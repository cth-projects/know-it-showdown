"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { ClipboardCheckIcon, ClipboardIcon, QrCode } from "lucide-react";
import { useParams } from "next/navigation";
import QRCodeGenerator from "./qrCodeGenerator";
import { useEffect, useState } from "react";

export default function Gamecode() {
  const param = useParams();
  const code = param.code as string;
  const [copy, isCopied] = useCopyToClipboard();
  const [URL, setURL] = useState("");

  useEffect(() => {
    setURL(`${window.location.origin}/join/${code}`);
  }, [code]);

  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        className="mb-5 h-9 gap-2 text-sm"
        onClick={() => copy(code)}
      >
        {code}
        {isCopied ? <ClipboardCheckIcon /> : <ClipboardIcon />}
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mb-5 h-9 gap-2 text-sm">
            <QrCode></QrCode>
          </Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col items-center">
          <DialogHeader>
            <DialogTitle>Scan to join</DialogTitle>
          </DialogHeader>
          <QRCodeGenerator
            url={URL}
            size={400}
          ></QRCodeGenerator>
        </DialogContent>
      </Dialog>
    </div>
  );
}
