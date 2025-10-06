import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AVATAR_COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-green-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-sky-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-fuchsia-500",
  "bg-pink-500",
  "bg-rose-500",
  "bg-slate-500",
  "bg-gray-500",
  "bg-zinc-500",
];

interface PlayerAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

const getColorFromName = (name: string): string => {
  const asciiSum = name
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const colorIndex = asciiSum % AVATAR_COLORS.length;
  return AVATAR_COLORS[colorIndex]!;
};

const getInitial = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

const sizeClasses = {
  sm: { avatar: "h-10 w-10", text: "text-sm", label: "text-xs" },
  md: { avatar: "h-16 w-16", text: "text-xl", label: "text-sm" },
  lg: { avatar: "h-24 w-24", text: "text-3xl", label: "text-base" },
};

export default function PlayerAvatar({ name, size = "sm" }: PlayerAvatarProps) {
  const bgColor = getColorFromName(name);
  const initial = getInitial(name);
  const classes = sizeClasses[size];

  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar className={`${classes.avatar} ${bgColor}`}>
        <AvatarFallback
          className={`${bgColor} font-semibold text-white ${classes.text}`}
        >
          {initial}
        </AvatarFallback>
      </Avatar>
      <span
        className={`${classes.label} text-center font-medium text-gray-700`}
      >
        {name}
      </span>
    </div>
  );
}
