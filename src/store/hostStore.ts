import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Event,
  EventStatus,
  Participant,
  PriceRange,
  Wine,
} from "../types";
import { peerService } from "../services/peerService";
import { randomizeOrder } from "../utils/randomize";
import { generateLabels } from "../utils/labels";
import { generateId } from "../utils/id";
import { calculateLeaderboard } from "../utils/scoring";

interface HostState {
  event: Event | null;
  participants: Participant[];

  // Actions
  createEvent: (wines: Wine[], priceRanges: PriceRange[]) => Promise<void>;
  addParticipant: (participant: Participant) => void;
  updateParticipantAnswers: (
    participantId: string,
    type: "display" | "bottle" | "price",
    answers: Record<string, number> | Record<number, string>,
  ) => void;
  changeRound: (round: EventStatus) => void;
  calculateResults: () => void;
  resetEvent: () => void;
}

export const useHostStore = create<HostState>()(
  persist(
    (set, get) => ({
      event: null,
      participants: [],

      createEvent: async (wines: Wine[], priceRanges: PriceRange[]) => {
        const peerId = await peerService.initializeHost();

        const event: Event = {
          id: generateId(),
          peerId,
          wines,
          displayOrder: randomizeOrder(wines.length),
          bottleOrder: randomizeOrder(wines.length),
          priceRanges,
          status: "waiting",
          createdAt: Date.now(),
        };

        set({ event, participants: [] });

        // Setup message handler
        peerService.onMessage((peerId, message) => {
          const state = get();

          switch (message.type) {
            case "JOIN": {
              const newParticipant: Participant = {
                id: message.participantId,
                name: message.name,
                peerId: message.peerId,
                displayAnswers: {},
                bottleAnswers: {},
                priceAnswers: {},
                points: 0,
                connectedAt: Date.now(),
              };

              get().addParticipant(newParticipant);

              // Send event info to new participant
              if (state.event) {
                peerService.send(peerId, {
                  type: "EVENT_INFO",
                  wineCount: state.event.wines.length,
                  displayLabels: generateLabels(state.event.wines.length),
                  bottleLabels: generateLabels(state.event.wines.length),
                  priceRanges: state.event.priceRanges,
                  currentRound: state.event.status,
                });
              }
              break;
            }

            case "SUBMIT_DISPLAY":
              get().updateParticipantAnswers(
                message.participantId,
                "display",
                message.answers,
              );
              break;

            case "SUBMIT_BOTTLE":
              get().updateParticipantAnswers(
                message.participantId,
                "bottle",
                message.answers,
              );
              break;

            case "SUBMIT_PRICE":
              get().updateParticipantAnswers(
                message.participantId,
                "price",
                message.answers,
              );
              break;
          }
        });
      },

      addParticipant: (participant: Participant) => {
        set((state) => ({
          participants: [...state.participants, participant],
        }));
      },

      updateParticipantAnswers: (participantId, type, answers) => {
        set((state) => ({
          participants: state.participants.map((p) =>
            p.id === participantId
              ? {
                ...p,
                ...(type === "display" &&
                  { displayAnswers: answers as Record<string, number> }),
                ...(type === "bottle" &&
                  { bottleAnswers: answers as Record<string, number> }),
                ...(type === "price" &&
                  { priceAnswers: answers as Record<number, string> }),
              }
              : p
          ),
        }));
      },

      changeRound: (round: EventStatus) => {
        set((state) => ({
          event: state.event ? { ...state.event, status: round } : null,
        }));

        // Broadcast round change to all participants
        peerService.broadcast({
          type: "ROUND_CHANGE",
          round,
        });
      },

      calculateResults: () => {
        const { event, participants } = get();
        if (!event) return;

        const leaderboard = calculateLeaderboard(
          participants,
          event.wines,
          event.displayOrder,
          event.bottleOrder,
          event.priceRanges,
        );

        // Send results to each participant
        participants.forEach((p) => {
          const participantScore = leaderboard.find((l) => l.name === p.name);
          if (participantScore) {
            peerService.send(p.peerId, {
              type: "RESULTS",
              leaderboard,
              yourScore: {
                points: participantScore.points,
                displayCorrect: participantScore.displayCorrect,
                bottleCorrect: participantScore.bottleCorrect,
                priceCorrect: participantScore.priceCorrect,
              },
            });
          }
        });

        // Update local state with points
        set((state) => ({
          event: state.event ? { ...state.event, status: "results" } : null,
          participants: state.participants.map((p) => {
            const score = leaderboard.find((l) => l.name === p.name);
            return score
              ? {
                ...p,
                points: score.points,
                displayCorrect: score.displayCorrect,
                bottleCorrect: score.bottleCorrect,
                priceCorrect: score.priceCorrect,
              }
              : p;
          }),
        }));
      },

      resetEvent: () => {
        peerService.disconnect();
        set({ event: null, participants: [] });
      },
    }),
    {
      name: "host-storage",
      partialize: (state) => ({
        event: state.event,
        participants: state.participants,
      }),
    },
  ),
);
