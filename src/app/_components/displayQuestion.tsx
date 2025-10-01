"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DisplayProps = {
  question: string;
  result: number;
  showResult: boolean;
};

function Display({ question, result, showResult }: DisplayProps) {
  return (
    <div>
      <Card className="mx-auto mb-1 w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl">Question:</CardTitle>
        </CardHeader>
        <CardContent className="text-5xl">{question}</CardContent>

        {showResult ? (
          <>
            <CardHeader>
              <CardTitle className="text-2xl text-green-600">
                Correct answer:
              </CardTitle>
            </CardHeader>
            <CardContent className="text-5xl text-green-600">
              {result}
            </CardContent>
          </>
        ) : null}
      </Card>
    </div>
  );
}

export default Display;