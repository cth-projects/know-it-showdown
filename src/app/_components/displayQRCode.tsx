"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QrCode } from "lucide-react";
import { useParams } from "next/navigation";
import QRCodeGenerator from "./qrCodeGenerator";
import { useEffect, useState } from "react";

export default function QRCode() {
  const param = useParams();
  const code = param.code as string;
  const [URL, setURL] = useState("");

  useEffect(() => {
    setURL(`${window.location.origin}/join/${code}`);
  }, [code]);

  return (
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
        <QRCodeGenerator url={URL} size={400}></QRCodeGenerator>
      </DialogContent>
    </Dialog>
  );
}
