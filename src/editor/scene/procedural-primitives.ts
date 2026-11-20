import { vec2, vec3 } from 'gl-matrix';
import { MeshData } from 'omega-game-engine';

/**
 * Primitives the engine doesn't ship, generated in code like the engine's
 * SpherePrimitive (same vertex layout and winding). Scenes store mesh data
 * inline, so they load as plain MeshData.
 */

/** A capped cylinder along Y, centred on the origin (Unity's default: radius 0.5, height 2). */
export class CylinderPrimitive extends MeshData {
  constructor(radius = 0.5, height = 2, slices = 32) {
    const vertices: vec3[] = [];
    const normals: vec3[] = [];
    const uvs: vec2[] = [];
    const indices: number[] = [];
    const half = height / 2;

    // Side: two rings (top, bottom) with outward normals.
    for (let i = 0; i <= 1; i++) {
      const y = i === 0 ? half : -half;
      for (let j = 0; j <= slices; j++) {
        const u = j / slices;
        const theta = u * 2 * Math.PI;
        const x = Math.cos(theta);
        const z = Math.sin(theta);
        vertices.push([radius * x, y, radius * z]);
        normals.push([x, 0, z]);
        uvs.push([u, i]);
      }
    }
    for (let j = 0; j < slices; j++) {
      const first = j;
      const second = j + slices + 1;
      indices.push(first, first + 1, second, first + 1, second + 1, second);
    }

    // Caps: a centre vertex and a ring with the cap's own normal.
    for (const top of [true, false]) {
      const y = top ? half : -half;
      const ny = top ? 1 : -1;
      const center = vertices.length;
      vertices.push([0, y, 0]);
      normals.push([0, ny, 0]);
      uvs.push([0.5, 0.5]);
      for (let j = 0; j <= slices; j++) {
        const theta = (j / slices) * 2 * Math.PI;
        const x = Math.cos(theta);
        const z = Math.sin(theta);
        vertices.push([radius * x, y, radius * z]);
        normals.push([0, ny, 0]);
        uvs.push([0.5 + x / 2, 0.5 + z / 2]);
      }
      for (let j = 0; j < slices; j++) {
        const a = center + 1 + j;
        if (top) indices.push(center, a + 1, a);
        else indices.push(center, a, a + 1);
      }
    }

    super(vertices, normals, uvs, indices);
  }
}

/** A torus lying on the XZ plane, centred on the origin. */
export class TorusPrimitive extends MeshData {
  constructor(radius = 1, tubeRadius = 0.3, radialSegments = 48, tubularSegments = 24) {
    const vertices: vec3[] = [];
    const normals: vec3[] = [];
    const uvs: vec2[] = [];
    const indices: number[] = [];

    // i walks around the tube (top, outer, bottom, inner), j around the ring.
    for (let i = 0; i <= tubularSegments; i++) {
      const v = i / tubularSegments;
      const phi = v * 2 * Math.PI;
      for (let j = 0; j <= radialSegments; j++) {
        const u = j / radialSegments;
        const theta = u * 2 * Math.PI;
        const nx = Math.sin(phi) * Math.cos(theta);
        const ny = Math.cos(phi);
        const nz = Math.sin(phi) * Math.sin(theta);
        vertices.push([
          radius * Math.cos(theta) + tubeRadius * nx,
          tubeRadius * ny,
          radius * Math.sin(theta) + tubeRadius * nz,
        ]);
        normals.push([nx, ny, nz]);
        uvs.push([u, v]);
      }
    }
    for (let i = 0; i < tubularSegments; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const first = i * (radialSegments + 1) + j;
        const second = first + radialSegments + 1;
        indices.push(first, first + 1, second, first + 1, second + 1, second);
      }
    }

    super(vertices, normals, uvs, indices);
  }
}
