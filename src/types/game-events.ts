interface BaseGameAdvanceEvent {
  newState: "LOBBY" | "QUESTION" | "RESULT" | "FINAL_RESULT";
  currentQuestionIndex: number;
  totalQuestions: number;
  timestamp: string;
}

export interface QuestionAdvanceEvent extends BaseGameAdvanceEvent {
  newState: "QUESTION";
  currentQuestion: {
    question: string;
    categoryName: string;
  };
}

export interface ResultAdvanceEvent extends BaseGameAdvanceEvent {
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

export interface PlayerFinalResultAdvanceEvent extends BaseGameAdvanceEvent {
  newState: "FINAL_RESULT";
  playerResult: {
    rank: number;
    finalScore: number;
    totalCorrect: number;
  };
  gameStats: {
    totalPlayers: number;
    totalQuestions: number;
  };
}

export interface FinalResultAdvanceEvent extends BaseGameAdvanceEvent {
  newState: "FINAL_RESULT";
  finalResults: {
    rank: number;
    name: string;
    finalScore: number;
    totalCorrect: number;
    totalQuestions: number;
  }[];
  gameStats: {
    totalPlayers: number;
    totalQuestions: number;
    averageScore: number;
  };
}

export type PlayerGameAdvanceEvent =
  | QuestionAdvanceEvent
  | PlayerFinalResultAdvanceEvent;

export type PresenterGameAdvanceEvent =
  | QuestionAdvanceEvent
  | ResultAdvanceEvent
  | FinalResultAdvanceEvent;
