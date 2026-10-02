export type MotionValue = { value: number; velocity: number };

/** Critically damped spring with a travel limit, including after a scroll jump. */
export function advanceMotion(
  state: MotionValue,
  target: number,
  delta: number,
  settleTime = 0.55,
  maxSpeed = 1.8,
) {
  const dt = Math.min(Math.max(delta, 0), 0.05);
  if (dt === 0) return state.value;
  const omega = 2 / Math.max(0.01, settleTime);
  const change = Math.max(
    -maxSpeed * settleTime,
    Math.min(maxSpeed * settleTime, state.value - target),
  );
  const decay = Math.exp(-omega * dt);
  const impulse = (state.velocity + omega * change) * dt;
  let next = state.value - change + (change + impulse) * decay;
  state.velocity = (state.velocity - omega * impulse) * decay;
  next = Math.max(state.value - maxSpeed * dt, Math.min(state.value + maxSpeed * dt, next));
  // Arrival never oscillates around the destination.
  if ((target - state.value) * (target - next) <= 0) {
    next = target;
    state.velocity = 0;
  }
  state.value = next;
  return next;
}

/** Zero velocity and acceleration at either end of a section transition. */
export function cinematicEase(t: number) {
  const u = Math.max(0, Math.min(1, t));
  return u * u * u * (u * (u * 6 - 15) + 10);
}
