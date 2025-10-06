import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Medal, Trophy } from "lucide-react";
import PlayerAvatarWithScore from "./playerAvatarWithScore";

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
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 1:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 2:
        return <Award className="h-8 w-8 text-amber-600" />;
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
    <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {answers.map((answer, index) => (
              <div
                key={`${answer.name}-${index}`}
                className="flex flex-col items-center gap-3"
              >
                <div className="relative">
                  <PlayerAvatarWithScore
                    name={answer.name}
                    score={answer.score}
                    startFrom={100}
                    size="md"
                    duration={1000}
                  />
                  {index < 3 && (
                    <div className="absolute -top-2 -right-2">
                      {getMedalIcon(index)}
                    </div>
                  )}
                </div>
                {index >= 3 && (
                  <span className="text-sm font-medium text-gray-500">
                    #{index + 1}
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
