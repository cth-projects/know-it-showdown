"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Join() {
  const router = useRouter();

  const [code, setCode] = useState<string>("");

  return (
    <Fragment>
      <Input
        value={code}
        onChange={(e) => {
          setCode(e.currentTarget.value);
        }}
        className="max-w-60"
        type="text"
        placeholder="Enter code"
      />
      <div className="flex flex-wrap items-center gap-2 md:flex-row">
        <Button
          onClick={() => {
            router.push(`game/${code}`);
          }}
          variant="outline"
        >
          Join
        </Button>
      </div>
    </Fragment>
  );
}
