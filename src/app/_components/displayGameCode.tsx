"use client";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { ClipboardCheckIcon, ClipboardIcon } from "lucide-react";
import { useParams } from "next/navigation";

export default function Gamecode() {
  const param = useParams();
  const code = param.code as string;
  const [copy, isCopied] = useCopyToClipboard();

  return (
    <div>
      <Button
        variant="outline"
        className="mb-5 h-9 gap-2 text-sm"
        onClick={() => copy(code)}
      >
        {code}
        {isCopied ? <ClipboardCheckIcon /> : <ClipboardIcon />}
      </Button>
    </div>
  );
}
