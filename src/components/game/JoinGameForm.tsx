// src/components/game/JoinGameForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface JoinGameFormProps {
  onJoinGame: (name: string) => void;
  isLoading?: boolean;
}

export default function JoinGameForm({
  onJoinGame,
  isLoading,
}: JoinGameFormProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onJoinGame(name.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-60 flex-col gap-4"
    >
      <Input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="text-center text-lg"
        maxLength={20}
      />
      <Button
        type="submit"
        disabled={!name.trim() || isLoading}
        className="bg-[hsl(280,100%,70%)] text-white hover:bg-[hsl(280,100%,60%)]"
      >
        {isLoading ? "Joining..." : "Ready to Play!"}
      </Button>
    </form>
  );
}
