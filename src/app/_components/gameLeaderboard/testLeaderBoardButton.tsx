"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function TestLeaderboardButton() {
  const router = useRouter();
  const handleClick = () => {

     router.push(`/SeedDbLeaderBoard`);
  };

  return (
    
        <Button
          onClick={handleClick}
        >
          Test Leaderboard
        </Button>
    
  );
}