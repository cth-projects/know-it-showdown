import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Medal, Trophy } from "lucide-react";

export default function ListPlayerAnswerResults() {
  const param = useParams();
  const code = param.code as string;
  const { data } = api.answers.getAnswersFromCurrentQuestion.useQuery(
    {
      gameCode: code,
    },
    { refetchOnMount: "always" },
  );
  const [answers, setAnswers] = useState(data?.answers ?? null);

  useEffect(() => {
    setAnswers(data?.answers ?? null);
    setAnswers((a) => a?.sort((b, a) => b.score - a.score) ?? null);
  }, [answers, data]);
  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return null;
    }
  };

  if (!answers) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-xl font-semibold text-gray-600">
            Loading results...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-3">
      {/* Results */}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {answers.map((answer, index) => (
            <div
              key={`${answer.name}-${index}`}
              className={`flex items-center justify-between rounded-lg p-4 transition-all duration-200 ${index < 3 ? "border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50" : "bg-gray-50 hover:bg-gray-100"} `}
            >
              {/* Rank and Name */}
              <div className="flex flex-1 items-center gap-4">
                <div className="flex w-10 items-center justify-center">
                  {index < 3 ? (
                    getMedalIcon(index)
                  ) : (
                    <span className="text-lg font-bold text-gray-400">
                      #{index + 1}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-gray-800">
                    {answer.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Answer: <span className="font-medium">{answer.answer}</span>
                  </p>
                </div>
              </div>
              {/* Score */}
              <CardContent>{answer.score} points</CardContent>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
