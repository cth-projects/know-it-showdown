"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface GameSettingsProps {
  value: {
    timePerQuestion: number;
    questionCount: number;
  };
  onChange: (settings: {
    timePerQuestion: number;
    questionCount: number;
  }) => void;
}

// TIME AND QUESTION ALTERNATIVES
const TIME_OPTIONS = [30, 60, 90, 120];
const QUESTION_OPTIONS = [5, 10, 15, 20];

export function GameSettings({ value, onChange }: GameSettingsProps) {
  const handleTimeChange = (newTime: number) => {
    onChange({
      ...value,
      timePerQuestion: newTime,
    });
  };

  const handleQuestionCountChange = (newCount: number) => {
    onChange({
      ...value,
      questionCount: newCount,
    });
  };

  return (
    <div className="border-border/40 bg-card/15 flex w-full max-w-sm flex-col items-center gap-3 rounded-lg border p-5 shadow-sm backdrop-blur-sm">
      {/* Time per Question Section */}
      <div className="w-full space-y-2.5">
        <Label className="text-muted-foreground block text-center text-xs font-medium tracking-wide uppercase">
          Time per Question
        </Label>
        <Separator className="my-2" />
        <div className="flex justify-center gap-2">
          {TIME_OPTIONS.map((time) => (
            <Button
              key={time}
              variant={value.timePerQuestion === time ? "default" : "ghost"}
              size="sm"
              onClick={() => handleTimeChange(time)}
              className={`h-9 min-w-[50px] text-xs font-medium transition-all ${
                value.timePerQuestion === time
                  ? "bg-purple-600 text-white shadow-md hover:bg-purple-700"
                  : "hover:bg-muted"
              }`}
            >
              {time}s
            </Button>
          ))}
        </div>
      </div>

      {/* Number of Questions Section */}
      <div className="w-full space-y-2.5">
        <Label className="text-muted-foreground block text-center text-xs font-medium tracking-wide uppercase">
          Number of Questions
        </Label>
        <Separator className="my-2" />
        <div className="flex justify-center gap-2">
          {QUESTION_OPTIONS.map((count) => (
            <Button
              key={count}
              variant={value.questionCount === count ? "default" : "ghost"}
              size="sm"
              onClick={() => handleQuestionCountChange(count)}
              className={`h-9 min-w-[50px] text-xs font-medium transition-all ${
                value.questionCount === count
                  ? "bg-purple-600 text-white shadow-md hover:bg-purple-700"
                  : "hover:bg-muted"
              }`}
            >
              {count}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
