import { MathUtils, PerspectiveCamera } from "three";

/**
 * Convert a viewport lateral (-1 left … 1 right) into world X at the bust’s
 * depth, so “far right” means the right side of the page on any aspect ratio.
 * `meshHalfWidth` keeps most of the scaled bust on-screen.
 */
export function worldXFromLateral(
  lateral: number,
  camera: PerspectiveCamera,
  objectZ: number,
  meshHalfWidth: number,
  aspect = camera.aspect,
) {
  const distance = Math.max(0.4, camera.position.z - objectZ);
  const halfHeight =
    Math.tan(MathUtils.degToRad(camera.fov * 0.5)) * distance;
  const halfWidth = halfHeight * Math.max(0.5, aspect);
  const travel = Math.max(0.45, halfWidth - Math.max(0, meshHalfWidth) * 0.82);
  return MathUtils.clamp(lateral, -1, 1) * travel;
}

