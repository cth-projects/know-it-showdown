"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { pusherClient } from "@/lib/pusher-client";
import { type Channel } from "pusher-js";

interface PusherContextType {
  pusher: typeof pusherClient;
  subscribe: (channelName: string) => Channel;
  unsubscribe: (channelName: string) => void;
}

const PusherContext = createContext<PusherContextType | null>(null);

export function PusherProvider({ children }: { children: ReactNode }) {
  const [channels] = useState<Map<string, Channel>>(new Map());

  const subscribe = (channelName: string) => {
    if (channels.has(channelName)) {
      return channels.get(channelName)!;
    }
    const channel = pusherClient.subscribe(channelName);
    channels.set(channelName, channel);
    return channel;
  };

  const unsubscribe = (channelName: string) => {
    if (channels.has(channelName)) {
      pusherClient.unsubscribe(channelName);
      channels.delete(channelName);
    }
  };

  useEffect(() => {
    return () => {
      channels.forEach((_, channelName) => {
        pusherClient.unsubscribe(channelName);
      });
      channels.clear();
    };
  }, [channels]);

  return (
    <PusherContext.Provider
      value={{ pusher: pusherClient, subscribe, unsubscribe }}
    >
      {children}
    </PusherContext.Provider>
  );
}

export const usePusherContext = () => {
  const context = useContext(PusherContext);
  if (!context) {
    throw new Error("usePusherContext must be used within PusherProvider");
  }
  return context;
};
