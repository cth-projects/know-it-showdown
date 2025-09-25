"use client";

import { useState } from "react";
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

interface CurrentQuestion {
  question: string;
  categoryName: string;
}

interface QuestionCardProps {
  question: CurrentQuestion;
  questionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  onSubmitAnswer: (answer: number) => void;
  isSubmitted?: boolean;
  playerAnswer?: number;
}

export default function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  timeLeft,
  onSubmitAnswer,
  isSubmitted = false,
  playerAnswer,
}: QuestionCardProps) {
  const [numberAnswer, setNumberAnswer] = useState<string>("0");

  const clampAnswer = (value: number): number => {
    if (value < 0) return 0;
    if (value > 100) return 100;
    return value;
  };

  const handleSubmit = () => {
    let numericAnswer = parseInt(numberAnswer);

    if (isNaN(numericAnswer) || numberAnswer.trim() === "") {
      numericAnswer = 0;
    }

    const clampedAnswer = clampAnswer(numericAnswer);
    onSubmitAnswer(clampedAnswer);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setNumberAnswer("");
      return;
    }

    const numericValue = parseInt(value);

    if (!isNaN(numericValue)) {
      setNumberAnswer(value);
    }
  };

  const renderAnswerInput = () => {
    return (
      <div className="space-y-2">
        <Input
          type="number"
          placeholder="0"
          value={numberAnswer}
          onChange={handleInputChange}
          disabled={isSubmitted}
          className="mx-auto flex max-w-28 p-4 text-center text-lg"
          min="0"
          max="100"
          onKeyUp={(e) => {
            if (e.key === "Enter" && !isSubmitted) {
              handleSubmit();
            }
          }}
        />
        {numberAnswer &&
          !isNaN(parseInt(numberAnswer)) &&
          (parseInt(numberAnswer) < 0 || parseInt(numberAnswer) > 100) && (
            <p className="text-center text-sm text-yellow-400">
              Will be clamped to: {clampAnswer(parseInt(numberAnswer))}
            </p>
          )}
      </div>
    );
  };

  const getTimerColor = () => {
    if (timeLeft > 10) return "text-green-400";
    if (timeLeft > 5) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader className="text-center">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Question {questionIndex + 1} of {totalQuestions}
          </div>
          <div className={`text-2xl font-bold ${getTimerColor()}`}>
            {timeLeft > 0 ? `${timeLeft}s` : "Time's up!"}
          </div>
        </div>
        <CardTitle className="text-xl md:text-2xl">
          {question.question}
        </CardTitle>
        <CardDescription>
          <span className="inline-block rounded-full bg-[hsl(280,100%,70%)]/20 px-3 py-1 text-sm text-[hsl(280,100%,70%)]">
            {question.categoryName}
          </span>
          <div className="mt-2">Enter a number between 0-100</div>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">{renderAnswerInput()}</CardContent>

      <CardFooter className="flex justify-between">
        {isSubmitted ? (
          <div className="w-full text-center">
            <p className="font-semibold text-green-400">
              ✓ Answer submitted: {playerAnswer}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Waiting for other players...
            </p>
          </div>
        ) : (
          <>
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitted ||
                timeLeft <= 0 ||
                !numberAnswer.trim() ||
                isNaN(parseInt(numberAnswer))
              }
              className="mx-auto flex bg-[hsl(280,100%,70%)] hover:bg-[hsl(280,100%,60%)]"
            >
              Submit Answer
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
