export interface Wine {
  id: string;
  name: string;
  year?: string;
  price: number;
}

export interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number;
}

export type EventStatus =
  | "setup"
  | "waiting"
  | "displayRound"
  | "bottleRound"
  | "priceRound"
  | "results";

export interface Event {
  id: string;
  peerId: string;
  wines: Wine[];
  displayOrder: number[];
  bottleOrder: number[];
  priceRanges: PriceRange[];
  status: EventStatus;
  createdAt: number;
}

export interface Participant {
  id: string;
  name: string;
  peerId: string;
  displayAnswers: Record<string, number>;
  bottleAnswers: Record<string, number>;
  priceAnswers: Record<number, string>;
  points: number;
  displayCorrect?: number;
  bottleCorrect?: number;
  priceCorrect?: number;
  connectedAt: number;
}

export type MessageType =
  | "JOIN"
  | "SUBMIT_DISPLAY"
  | "SUBMIT_BOTTLE"
  | "SUBMIT_PRICE"
  | "EVENT_INFO"
  | "ROUND_CHANGE"
  | "RESULTS";

export interface JoinMessage {
  type: "JOIN";
  participantId: string;
  name: string;
  peerId: string;
}

export interface SubmitDisplayMessage {
  type: "SUBMIT_DISPLAY";
  participantId: string;
  answers: Record<string, number>;
}

export interface SubmitBottleMessage {
  type: "SUBMIT_BOTTLE";
  participantId: string;
  answers: Record<string, number>;
}

export interface SubmitPriceMessage {
  type: "SUBMIT_PRICE";
  participantId: string;
  answers: Record<number, string>;
}

export interface EventInfoMessage {
  type: "EVENT_INFO";
  wineCount: number;
  displayLabels: string[];
  bottleLabels: string[];
  priceRanges: PriceRange[];
  currentRound: EventStatus;
}

export interface RoundChangeMessage {
  type: "ROUND_CHANGE";
  round: EventStatus;
}

export interface ResultsMessage {
  type: "RESULTS";
  leaderboard: Array<{
    name: string;
    points: number;
    displayCorrect: number;
    bottleCorrect: number;
    priceCorrect: number;
  }>;
  yourScore: {
    points: number;
    displayCorrect: number;
    bottleCorrect: number;
    priceCorrect: number;
  };
}

export type PeerMessage =
  | JoinMessage
  | SubmitDisplayMessage
  | SubmitBottleMessage
  | SubmitPriceMessage
  | EventInfoMessage
  | RoundChangeMessage
  | ResultsMessage;
