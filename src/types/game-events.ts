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
    categoryName: string;
  };
}

export interface ResultEvent extends BaseGameEvent {
  newState: "RESULT";
  questionResult: {
    question: string;
    answer: number;
    categoryName: string;
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
