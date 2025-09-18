"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Fragment } from "react/jsx-runtime";
import { usePusherContext } from "@/contexts/PusherContext";
import { useState, useEffect } from "react";

export default function playerlist() {
    const { subscribe, unsubscribe } = usePusherContext();
    var players:any[] = ["janne", "loffe", "carlsson"]; /*Testdata*/

    useEffect(() => {
    const channel = subscribe("player-list");

    channel.bind("list-updated", (playerlist:any[]) => {
        players = playerlist;
    });

    return () => {
        channel.unbind_all();
        unsubscribe("player-list");
    };
    }, [subscribe, unsubscribe]);
    
  return (
    <div>
    <ScrollArea className="h-[200px] w-[400px] rounded-md border">
      <div className="grid justify-items-center p-4">
        <h4 className="mb-5 text-sm leading-none font-medium">Players</h4>
        
        {players.map((item) => (
          <Fragment key={item}>
            <div className="text-sm">{item}</div>
            <Separator className="my-2" />
          </Fragment>
        ))}
      </div>
    </ScrollArea>
    <div>
        Player count: {players.length}
    </div>
    </div>
  )
}