// @see https://www.npmjs.com/package/canvas-confetti for other effects
import confetti from 'canvas-confetti'

export const runConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  })
}
