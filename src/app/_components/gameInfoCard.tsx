"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Target, Trophy, Zap, ChevronDown } from "lucide-react";

export default function GameInfoCard() {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (window.innerHeight >= 740 && detailsRef.current) {
      detailsRef.current.open = true;
    }
  }, []);

  return (
    <Card className="w-full max-w-2xl border-white/10 bg-white/5 backdrop-blur">
      <CardContent className="space-y-4 p-4 text-white sm:space-y-6 sm:p-6">
        <div className="space-y-2 text-center">
          <p className="text-sm sm:text-lg">
            Test your knowledge of the UN&apos;s 17 Sustainable Development
            Goals! Answer questions where every answer is a number between{" "}
            <span className="font-semibold text-[hsl(280,100%,70%)]">
              0 and 100
            </span>
            .
          </p>
        </div>

        <Separator className="bg-white/10" />

        <details ref={detailsRef} className="group space-y-3 sm:space-y-4">
          <summary className="flex cursor-pointer list-none items-center justify-center gap-2 text-center text-xs font-semibold tracking-wide text-white/70 uppercase sm:text-sm [&::-webkit-details-marker]:hidden">
            How It Works
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
          </summary>

          <div className="grid gap-2 pt-2 sm:grid-cols-3 sm:gap-3">
            <div className="flex flex-col items-center gap-1.5 rounded-lg bg-white/5 p-3 text-center sm:gap-2 sm:p-4">
              <Target className="h-5 w-5 text-[hsl(280,100%,70%)] sm:h-6 sm:w-6" />
              <div className="text-sm font-medium sm:text-base">
                Guess Close
              </div>
              <div className="text-xs text-white/70 sm:text-sm">
                Points = distance from answer
              </div>
            </div>

            <div className="flex flex-col items-center gap-1.5 rounded-lg bg-white/5 p-3 text-center sm:gap-2 sm:p-4">
              <Zap className="h-5 w-5 text-[hsl(280,100%,70%)] sm:h-6 sm:w-6" />
              <div className="text-sm font-medium sm:text-base">
                Exact Bonus
              </div>
              <div className="text-xs text-white/70 sm:text-sm">
                Exactly right = -10 points
              </div>
            </div>

            <div className="flex flex-col items-center gap-1.5 rounded-lg bg-white/5 p-3 text-center sm:gap-2 sm:p-4">
              <Trophy className="h-5 w-5 text-[hsl(280,100%,70%)] sm:h-6 sm:w-6" />
              <div className="text-sm font-medium sm:text-base">
                Lowest Wins
              </div>
              <div className="text-xs text-white/70 sm:text-sm">
                Lowest total score wins
              </div>
            </div>
          </div>
        </details>

        <p className="text-center text-xs text-white/70 sm:text-sm">
          No accounts needed—create a game and share the code, or join an
          existing game!
        </p>
      </CardContent>
    </Card>
  );
}
