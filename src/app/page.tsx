import { HydrateClient } from "@/trpc/server";
import React from "react";
import Join from "./_components/join";
import { Badge } from "@/components/ui/badge";
import GameInfoCard from "./_components/gameInfoCard";

export default function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-8 sm:gap-12 sm:py-16">
          <div className="flex flex-col items-center gap-2 text-center sm:gap-4">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[5rem]">
              Know-<span className="text-[hsl(280,100%,70%)]">it</span> Showdown
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge variant="secondary" className="text-xs sm:text-sm">
                Quiz Game
              </Badge>
              <Badge variant="outline" className="text-xs sm:text-sm">
                UN SDGs
              </Badge>
            </div>
          </div>

          <GameInfoCard />

          <Join />
        </div>
      </main>
    </HydrateClient>
  );
}
