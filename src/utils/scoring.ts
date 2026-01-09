import type { Participant, PriceRange, Wine } from "../types";

/**
 * Check if a price falls within a price range
 */
export function isPriceInRange(price: number, range: PriceRange): boolean {
  return price >= range.min && price <= range.max;
}

/**
 * Find the correct price range for a wine
 */
export function findPriceRange(
  price: number,
  ranges: PriceRange[],
): string | null {
  const range = ranges.find((r) => isPriceInRange(price, r));
  return range?.id || null;
}

/**
 * Calculate points for a single participant
 */
export function calculateParticipantPoints(
  participant: Participant,
  wines: Wine[],
  displayOrder: number[],
  bottleOrder: number[],
  priceRanges: PriceRange[],
): {
  points: number;
  displayCorrect: number;
  bottleCorrect: number;
  priceCorrect: number;
} {
  let displayCorrect = 0;
  let bottleCorrect = 0;
  let priceCorrect = 0;

  // Check display round answers
  Object.entries(participant.displayAnswers).forEach(
    ([label, tastingOrder]) => {
      // Find which wine this label represents
      const labelIndex = label.charCodeAt(0) - 65; // 'A' = 0, 'B' = 1, etc.
      const actualWineIndex = displayOrder[labelIndex];

      // Check if participant correctly identified which tasting order this was
      if (actualWineIndex === tastingOrder) {
        displayCorrect++;
      }
    },
  );

  // Check bottle round answers
  Object.entries(participant.bottleAnswers).forEach(([label, tastingOrder]) => {
    const labelIndex = label.charCodeAt(0) - 65;
    const actualWineIndex = bottleOrder[labelIndex];

    if (actualWineIndex === tastingOrder) {
      bottleCorrect++;
    }
  });

  // Check price round answers
  Object.entries(participant.priceAnswers).forEach(
    ([wineIndexStr, rangeId]) => {
      const wineIndex = parseInt(wineIndexStr);
      const wine = wines[wineIndex];

      if (wine) {
        const correctRangeId = findPriceRange(wine.price, priceRanges);
        if (correctRangeId === rangeId) {
          priceCorrect++;
        }
      }
    },
  );

  const points = displayCorrect + bottleCorrect + priceCorrect;

  return {
    points,
    displayCorrect,
    bottleCorrect,
    priceCorrect,
  };
}

/**
 * Calculate and sort leaderboard
 */
export function calculateLeaderboard(
  participants: Participant[],
  wines: Wine[],
  displayOrder: number[],
  bottleOrder: number[],
  priceRanges: PriceRange[],
): Array<{
  name: string;
  points: number;
  displayCorrect: number;
  bottleCorrect: number;
  priceCorrect: number;
}> {
  return participants
    .map((p) => ({
      name: p.name,
      ...calculateParticipantPoints(
        p,
        wines,
        displayOrder,
        bottleOrder,
        priceRanges,
      ),
    }))
    .sort((a, b) => b.points - a.points);
}
