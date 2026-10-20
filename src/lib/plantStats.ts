// Figures that more than one screen shows, computed once from the plant data so the screens agree.
import type { Equipment, HandoverItem } from "@/hooks/usePlantData";

const DAY = 86_400_000;

/** Machines with a predicted failure date in the next 30 days, and in the next 90 days (the "flagged" ones). */
export function predictedFailureCounts(equipment: Pick<Equipment, "predictedFailure">[], now = Date.now()) {
  const within = (days: number) =>
    equipment.filter((e) => e.predictedFailure && e.predictedFailure.getTime() > now && e.predictedFailure.getTime() < now + days * DAY).length;
  return { within30: within(30), within90: within(90) };
}

/** Overall handover readiness (%): completed over target across every requirement. */
export function handoverReadiness(items: Pick<HandoverItem, "completed" | "target">[]) {
  const target = items.reduce((a, h) => a + h.target, 0);
  return target === 0 ? 0 : Math.round((items.reduce((a, h) => a + h.completed, 0) / target) * 100);
}
