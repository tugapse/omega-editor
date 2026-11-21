import {
  CubePrimitive,
  BuiltinTextures,
  Resources,
  LitMaterial,
  LitShader,
  Mesh,
  MeshData,
  MeshRendererBehaviour,
  PlanePrimitive,
  QuadPrimitive,
  SceneEntity,
  SpherePrimitive,
} from 'omega-game-engine';
import { CylinderPrimitive, TorusPrimitive } from './procedural-primitives';

/** A primitive the editor can add to a scene from the scene tree "+" menu. */
export interface PrimitiveDefinition {
  /** Menu label and base name of the created entity. */
  name: string;
  description: string;
  /** Builds the mesh data. */
  meshData: () => MeshData;
}

export const PRIMITIVES: PrimitiveDefinition[] = [
  {
    name: 'Cube',
    description: 'A 2×2×2 cube (scale 0.5 for a 1×1×1 one).',
    meshData: () => new CubePrimitive(),
  },
  {
    name: 'Sphere',
    description: 'A UV sphere.',
    meshData: () => new SpherePrimitive(),
  },
  {
    name: 'Plane',
    description: 'A 10×10 flat square on the XZ plane.',
    meshData: () => new PlanePrimitive(10),
  },
  {
    name: 'Quad',
    description: 'A single square facing the camera (XY plane).',
    meshData: () => new QuadPrimitive(),
  },
  {
    name: 'Cylinder',
    description: 'A capped cylinder along Y.',
    meshData: () => new CylinderPrimitive(),
  },
  {
    name: 'Torus',
    description: 'A torus on the XZ plane.',
    meshData: () => new TorusPrimitive(),
  },
];

/**
 * Creates a primitive the same way the demo scene does: an empty entity
 * holding a MeshRendererBehaviour with the mesh and a plain white lit material.
 */
export async function createPrimitiveEntity(
  gl: WebGL2RenderingContext,
  primitive: PrimitiveDefinition,
  entityName: string,
): Promise<SceneEntity> {
  const entity = SceneEntity.instanciate(entityName);

  const mesh = new Mesh();
  mesh.meshData = primitive.meshData();

  const material = new LitMaterial();
  material.mainTex = await Resources.for(gl).getTexture(BuiltinTextures.white);

  const renderer = new MeshRendererBehaviour(gl);
  renderer.mesh = mesh;
  renderer.shader = new LitShader(gl, material);

  entity.addBehaviour(renderer);
  return entity;
}
