import assert from "node:assert/strict";
import test from "node:test";
import { advanceMotion, cinematicEase } from "../lib/scene/motion.ts";

test("large scroll jumps respect the travel limit at different frame rates", () => {
  for (const fps of [20, 30, 60, 120, 144]) {
    const state = { value: 0, velocity: 0 };
    for (let frame = 0; frame < fps * 6; frame++) {
      const previous = state.value;
      const target = frame < fps * 2 ? 10 : -10;
      advanceMotion(state, target, 1 / fps, 0.62, 1.65);
      assert.ok(Number.isFinite(state.value));
      assert.ok(Math.abs(state.value - previous) <= 1.65 / fps + 1e-10);
    }
  }
});

test("the spring settles without overshoot and is independent of frame rate", () => {
  const outcomes = [30, 60, 120].map((fps) => {
    const state = { value: 0, velocity: 0 };
    for (let frame = 0; frame < fps; frame++) {
      advanceMotion(state, 1, 1 / fps, 0.62, 1.65);
      assert.ok(state.value >= 0 && state.value <= 1);
    }
    const atOneSecond = state.value;
    for (let frame = 0; frame < fps * 4; frame++) {
      advanceMotion(state, 1, 1 / fps, 0.62, 1.65);
    }
    assert.ok(Math.abs(state.value - 1) < 0.00001);
    assert.ok(Math.abs(state.velocity) < 0.00001);
    return atOneSecond;
  });
  assert.ok(Math.max(...outcomes) - Math.min(...outcomes) < 0.001);
});

test("rapid direction reversals stay bounded and settle at the latest target", () => {
  const state = { value: 0, velocity: 0 };
  for (let frame = 0; frame < 120; frame++) {
    advanceMotion(state, frame % 12 < 6 ? 2 : -2, 1 / 60);
    assert.ok(Math.abs(state.value) < 2);
  }
  for (let frame = 0; frame < 300; frame++) {
    advanceMotion(state, -0.5, 1 / 60);
  }
  assert.ok(Math.abs(state.value + 0.5) < 0.00001);
});

test("a suspended tab and zero-duration frame cannot teleport the portrait", () => {
  const state = { value: 0, velocity: 0 };
  advanceMotion(state, 100, 10, 0.62, 1.65);
  assert.ok(state.value <= 1.65 * 0.05);
  const previous = { ...state };
  advanceMotion(state, -100, 0);
  assert.deepEqual(state, previous);
});

test("section easing is continuous, monotonic and comes to rest at each end", () => {
  assert.equal(cinematicEase(-1), 0);
  assert.equal(cinematicEase(2), 1);
  let previous = 0;
  for (let step = 0; step <= 100; step++) {
    const value = cinematicEase(step / 100);
    assert.ok(value >= previous && value <= 1);
    previous = value;
  }
  assert.ok(cinematicEase(0.001) / 0.001 < 0.0001);
  assert.ok((1 - cinematicEase(0.999)) / 0.001 < 0.0001);
});
