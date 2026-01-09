import { create } from "zustand";
import type { EventStatus, PriceRange } from "../types";
import { peerService } from "../services/peerService";
import { generateId } from "../utils/id";

interface ParticipantState {
  participantId: string;
  name: string;
  hostPeerId: string | null;
  connected: boolean;

  wineCount: number;
  displayLabels: string[];
  bottleLabels: string[];
  priceRanges: PriceRange[];
  currentRound: EventStatus;

  displayAnswers: Record<string, number>;
  bottleAnswers: Record<string, number>;
  priceAnswers: Record<number, string>;

  results: {
    points: number;
    displayCorrect: number;
    bottleCorrect: number;
    priceCorrect: number;
    leaderboard: Array<{
      name: string;
      points: number;
      displayCorrect: number;
      bottleCorrect: number;
      priceCorrect: number;
    }>;
  } | null;

  // Actions
  joinEvent: (hostPeerId: string, name: string) => Promise<void>;
  submitDisplayAnswers: (answers: Record<string, number>) => void;
  submitBottleAnswers: (answers: Record<string, number>) => void;
  submitPriceAnswers: (answers: Record<number, string>) => void;
  reset: () => void;
}

export const useParticipantStore = create<ParticipantState>((set, get) => ({
  participantId: generateId(),
  name: "",
  hostPeerId: null,
  connected: false,

  wineCount: 0,
  displayLabels: [],
  bottleLabels: [],
  priceRanges: [],
  currentRound: "waiting",

  displayAnswers: {},
  bottleAnswers: {},
  priceAnswers: {},

  results: null,

  joinEvent: async (hostPeerId: string, name: string) => {
    await peerService.connectToHost(hostPeerId);

    set({
      name,
      hostPeerId,
      connected: true,
    });

    // Setup message handler
    peerService.onMessage((_, message) => {
      switch (message.type) {
        case "EVENT_INFO":
          set({
            wineCount: message.wineCount,
            displayLabels: message.displayLabels,
            bottleLabels: message.bottleLabels,
            priceRanges: message.priceRanges,
            currentRound: message.currentRound,
          });
          break;

        case "ROUND_CHANGE":
          set({ currentRound: message.round });
          break;

        case "RESULTS":
          set({
            results: {
              points: message.yourScore.points,
              displayCorrect: message.yourScore.displayCorrect,
              bottleCorrect: message.yourScore.bottleCorrect,
              priceCorrect: message.yourScore.priceCorrect,
              leaderboard: message.leaderboard,
            },
            currentRound: "results",
          });
          break;
      }
    });

    // Send join message
    const state = get();
    peerService.send(hostPeerId, {
      type: "JOIN",
      participantId: state.participantId,
      name,
      peerId: peerService.getPeerId() || "",
    });
  },

  submitDisplayAnswers: (answers: Record<string, number>) => {
    const { participantId, hostPeerId } = get();
    if (!hostPeerId) return;

    set({ displayAnswers: answers });

    peerService.send(hostPeerId, {
      type: "SUBMIT_DISPLAY",
      participantId,
      answers,
    });
  },

  submitBottleAnswers: (answers: Record<string, number>) => {
    const { participantId, hostPeerId } = get();
    if (!hostPeerId) return;

    set({ bottleAnswers: answers });

    peerService.send(hostPeerId, {
      type: "SUBMIT_BOTTLE",
      participantId,
      answers,
    });
  },

  submitPriceAnswers: (answers: Record<number, string>) => {
    const { participantId, hostPeerId } = get();
    if (!hostPeerId) return;

    set({ priceAnswers: answers });

    peerService.send(hostPeerId, {
      type: "SUBMIT_PRICE",
      participantId,
      answers,
    });
  },

  reset: () => {
    peerService.disconnect();
    set({
      participantId: generateId(),
      name: "",
      hostPeerId: null,
      connected: false,
      wineCount: 0,
      displayLabels: [],
      bottleLabels: [],
      priceRanges: [],
      currentRound: "waiting",
      displayAnswers: {},
      bottleAnswers: {},
      priceAnswers: {},
      results: null,
    });
  },
}));
