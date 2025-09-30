export function calculateScore(
  playerAnswer: number,
  correctAnswer: number,
): number {
  if (playerAnswer === correctAnswer) return -10;
  return Math.abs(playerAnswer - correctAnswer);
}
