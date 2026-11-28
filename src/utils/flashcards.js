/**
 * Flashcard grading — pure decision logic (task B4).
 *
 * The Anki-style grading scale maps to exactly two effects: does the
 * word's "known" membership change, and should the card be re-queued
 * for another pass in the current session? The component applies the
 * side effects; this function only decides.
 */
export function gradeDecision(grade) {
  switch (grade) {
    case 'again':
      // Didn't know it: unmark + see it again this session.
      return { known: false, requeue: true }
    case 'hard':
      // So-so: no membership change.
      return { known: null, requeue: false }
    case 'good':
    case 'easy':
      return { known: true, requeue: false }
    default:
      return { known: null, requeue: false }
  }
}
