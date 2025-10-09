"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { QuestionEvent } from "@/types";
import CountdownTimer from "./countdownTimer";
import { CheckCircle2, Clock, Sparkles, Users, Zap } from "lucide-react";

interface QuestionCardProps {
  question: QuestionEvent["currentQuestion"];
  questionIndex: number;
  totalQuestions: number;
  questionEndTimestamp: string;
  onSubmitAnswer: (answer: number) => void;
  isSubmitted?: boolean;
  playerAnswer?: number;
}

export default function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  questionEndTimestamp,
  onSubmitAnswer,
  isSubmitted = false,
  playerAnswer,
}: QuestionCardProps) {
  const [numberAnswer, setNumberAnswer] = useState<string>("");

  useEffect(() => {
    setNumberAnswer("");
  }, [question]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (rawValue === "") {
      setNumberAnswer("");
      return;
    }

    const parsed = Number.parseInt(rawValue, 10);
    if (isNaN(parsed)) {
      return;
    }

    const numericValue = Math.max(
      0,
      Math.min(100, Number.parseInt(rawValue, 10)),
    );

    setNumberAnswer(numericValue.toString());
  };

  const handleSubmit = () => {
    const finalAnswer =
      numberAnswer === "" ? 0 : Number.parseInt(numberAnswer, 10);
    onSubmitAnswer(finalAnswer);
  };

  const renderWaitingOverlay = () => {
    return (
      <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900/95 via-violet-900/95 to-fuchsia-900/95 p-4 backdrop-blur-sm duration-500">
        <div className="relative w-full max-w-lg">
          <div className="absolute -inset-4 animate-pulse rounded-3xl bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-fuchsia-500/20 blur-2xl" />

          <div className="relative space-y-8 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-950/80 to-violet-950/80 p-8 shadow-2xl backdrop-blur-xl md:p-12">
            <div className="relative mx-auto w-fit">
              <div className="animate-spin-slow absolute -inset-8 rounded-full bg-gradient-to-r from-purple-500/30 via-violet-500/30 to-fuchsia-500/30 blur-xl" />
              <div className="animate-in zoom-in relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/50 duration-700 md:h-28 md:w-28">
                <CheckCircle2
                  className="h-12 w-12 text-white md:h-14 md:w-14"
                  strokeWidth={2.5}
                />
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 animate-pulse text-yellow-300" />
              </div>
            </div>

            <div className="space-y-4 text-center">
              <h2 className="animate-in slide-in-from-bottom-4 text-3xl font-black tracking-tight text-white duration-700 md:text-4xl">
                Answer Locked In!
              </h2>

              <div className="animate-in slide-in-from-bottom-4 mx-auto w-fit delay-150 duration-700">
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-500 p-1 shadow-xl shadow-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/60">
                  <div className="rounded-xl bg-gradient-to-br from-purple-950 to-violet-950 px-8 py-6 md:px-12 md:py-8">
                    <div className="flex items-center justify-center gap-2 text-sm font-semibold tracking-wider text-purple-300 uppercase md:text-base">
                      <Zap className="h-4 w-4" />
                      Your Answer
                    </div>
                    <div className="mt-2 text-6xl font-black text-white md:text-7xl">
                      {playerAnswer}
                    </div>
                  </div>
                  <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
              </div>
            </div>

            <div className="animate-in slide-in-from-bottom-4 space-y-3 delay-300 duration-700">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
                    <Users className="h-5 w-5 text-purple-300" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-white">
                      Waiting for Players
                    </p>
                    <p className="text-xs text-purple-200/70">
                      Other players are still answering...
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-fuchsia-400" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                    <Clock className="h-5 w-5 text-emerald-300" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-white">
                      Get Ready!
                    </p>
                    <p className="text-xs text-emerald-200/70">
                      Next question coming up soon
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-in fade-in border-t border-white/10 pt-6 text-center delay-500 duration-700">
              <p className="text-xs font-medium tracking-wider text-purple-300 uppercase">
                Pro Tip
              </p>
              <p className="mt-2 text-sm leading-relaxed text-purple-100/80">
                The closer your answer to the correct value, the less points you
                earn!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {isSubmitted && renderWaitingOverlay()}

      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-2 shadow-2xl transition-all hover:shadow-purple-500/10">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500/10 to-violet-500/10 px-4 py-2 ring-1 ring-purple-500/20">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  Question {questionIndex + 1} of {totalQuestions}
                </span>
              </div>
              <CountdownTimer targetTimestamp={questionEndTimestamp} />
            </div>

            <CardTitle className="text-2xl leading-tight font-black tracking-tight text-balance md:text-3xl lg:text-4xl">
              {question.question}
            </CardTitle>

            <CardDescription className="flex items-center justify-center gap-3 pt-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500/15 to-violet-500/15 px-4 py-2 text-sm font-bold text-purple-600 ring-2 ring-purple-500/30 md:text-base dark:text-purple-400">
                <Zap className="h-4 w-4" />
                {question.category.title}
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-6 md:px-8">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                  Enter Your Guess
                </p>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 animate-pulse rounded-2xl bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-fuchsia-500/20 blur-lg" />
                <Input
                  type="number"
                  value={numberAnswer}
                  onChange={handleInputChange}
                  disabled={isSubmitted}
                  placeholder="?"
                  className="relative h-28 w-full rounded-2xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-50/50 to-violet-50/50 text-center text-6xl font-black tracking-tight shadow-lg transition-all focus:scale-105 focus:border-purple-500 focus:shadow-purple-500/20 disabled:opacity-50 md:h-32 md:text-7xl dark:from-purple-950/30 dark:to-violet-950/30"
                  min="0"
                  max="100"
                  onKeyUp={(e) => {
                    if (
                      e.key === "Enter" &&
                      !isSubmitted &&
                      numberAnswer !== ""
                    ) {
                      handleSubmit();
                    }
                  }}
                />
              </div>

              <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-500/30" />
                <span className="font-medium">Range: 0 to 100</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-purple-500/30" />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 border-t bg-gradient-to-br from-purple-50/50 to-violet-50/50 px-6 py-6 md:px-8 dark:from-purple-950/20 dark:to-violet-950/20">
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitted ||
                numberAnswer === "" ||
                isNaN(Number.parseInt(numberAnswer))
              }
              size="lg"
              className="group relative h-16 w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 text-lg font-black tracking-wide text-white uppercase shadow-lg shadow-purple-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40 disabled:opacity-50 disabled:hover:scale-100"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Zap className="h-5 w-5" />
                Lock In Answer
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform group-hover:translate-x-full group-hover:duration-1000" />
            </Button>

            <p className="text-muted-foreground text-center text-xs">
              Press Enter or click the button to submit
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
