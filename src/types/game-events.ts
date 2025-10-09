interface BaseGameEvent {
  newState: "LOBBY" | "QUESTION" | "RESULT" | "FINAL_RESULT";
  currentQuestionIndex: number;
  totalQuestions: number;
  nextAdvanceTimestamp: string;
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

export interface PlayerResult {
  name: string;
  answer: number;
  scoreForQuestion: number;
  currentScore: number;
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
  playerResults: PlayerResult[];
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

export type PlayerGameEvent = QuestionEvent | ResultEvent | FinalResultEvent;

export type PresenterGameEvent = QuestionEvent | ResultEvent | FinalResultEvent;

export interface PlayerStatus {
  name: string;
  answered: boolean;
}

export interface PlayerQuestionEvent extends QuestionEvent {
  hasAnswered: boolean;
  submittedAnswer?: number;
}

export type PlayerViewResponse =
  | PlayerQuestionEvent
  | ResultEvent
  | FinalResultEvent
  | null; // null for LOBBY state
