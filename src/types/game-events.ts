interface BaseGameEvent {
  newState: "LOBBY" | "QUESTION" | "RESULT" | "FINAL_RESULT";
  currentQuestionIndex: number;
  totalQuestions: number;
  timestamp: string;
}

export interface QuestionEvent extends BaseGameEvent {
  newState: "QUESTION";
  currentQuestion: {
    question: string;
    category: {
      title: string;
      sdgNumber: number;
      description: string;
      color: string;
    };
  };
}

export interface ResultEvent extends BaseGameEvent {
  newState: "RESULT";
  questionResult: {
    question: string;
    answer: number;
    category: {
      title: string;
      sdgNumber: number;
      description: string;
      color: string;
    };
  };
  playerResults: {
    name: string;
    answer: number;
    scoreForQuestion: number;
    currentScore: number;
  }[];
}

export interface FinalResultEvent extends BaseGameEvent {
  newState: "FINAL_RESULT";
  finalResults: {
    rank: number;
    name: string;
    finalScore: number;
  }[];
  gameStats: {
    totalPlayers: number;
    totalQuestions: number;
  };
}

export type PlayerGameEvent = QuestionEvent | FinalResultEvent;

export type PresenterGameEvent = QuestionEvent | ResultEvent | FinalResultEvent;
