import { SECTION_ORDER } from "@/lib/scene/sceneConfig";

/** Float index in [0, SECTION_ORDER.length - 1]: whole numbers land on section centers; fractional = blend toward the next section. */
export function scrollAlongForLerp(
  viewportCenterY: number,
  sectionCentersY: number[],
): number {
  const n = sectionCentersY.length;
  if (n === 0) {
    return 0;
  }
  if (n === 1) {
    return 0;
  }
  if (viewportCenterY <= sectionCentersY[0]) {
    return 0;
  }
  const last = sectionCentersY[n - 1];
  if (viewportCenterY >= last) {
    return n - 1;
  }
  for (let i = 0; i < n - 1; i++) {
    const a = sectionCentersY[i];
    const b = sectionCentersY[i + 1];
    if (viewportCenterY >= a && viewportCenterY <= b) {
      const span = b - a;
      const t = span > 1e-6 ? (viewportCenterY - a) / span : 0;
      return i + t;
    }
  }
  return n - 1;
}

export function dominantSectionIndex(
  viewportCenterY: number,
  sectionCentersY: number[],
): number {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < sectionCentersY.length; i++) {
    const d = Math.abs(sectionCentersY[i] - viewportCenterY);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}

export function orderedSceneSections(scope: HTMLElement): HTMLElement[] {
  const out: HTMLElement[] = [];
  for (const slug of SECTION_ORDER) {
    const el = scope.querySelector<HTMLElement>(
      `[data-scene-section="${slug}"]`,
    );
    if (el) {
      out.push(el);
    }
  }
  return out;
}
