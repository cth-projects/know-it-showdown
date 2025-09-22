"use client";

import { api } from "@/trpc/react"; 
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CreateGameButton() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  
  const createGame = api.game.create.useMutation({
    onSuccess: (data) => {
      console.log("Game created successfully:", data);
      
      if (data.success && data.game) {
        // Navigate to the presenter page with the room code
        router.push(`/presenter/${data.game.gameCode}/lobby`);
      }
      
      setIsCreating(false);
    },
    onError: (error) => {
      console.error("Failed to create game:", error);
      alert("Failed to create game. Please try again.");
      setIsCreating(false);
    }
  });

  const handleCreateGame = () => {
    setIsCreating(true);
    createGame.mutate(); 
  };

  return (
    
        <Button
          onClick={handleCreateGame}
          disabled={isCreating}
          variant="outline"
        >
          {isCreating ? "Creating Game..." : "Create Game"}
        </Button>
    
  );
}

