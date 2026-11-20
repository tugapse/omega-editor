import {
  CubePrimitive,
  EngineCache,
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

/** A primitive the editor can add to a scene from the scene tree "+" menu. */
export interface PrimitiveDefinition {
  /** Menu label and base name of the created entity. */
  name: string;
  description: string;
  /** Builds the mesh data (engine primitive or a bundled .obj). */
  meshData: () => Promise<MeshData> | MeshData;
}

export const PRIMITIVES: PrimitiveDefinition[] = [
  {
    name: 'Cube',
    description: 'A 1×1×1 cube.',
    meshData: () => new CubePrimitive(),
  },
  {
    name: 'Sphere',
    description: 'A UV sphere.',
    meshData: () => new SpherePrimitive(),
  },
  {
    name: 'Plane',
    description: 'A flat square on the XZ plane.',
    meshData: () => new PlanePrimitive(10),
  },
  {
    name: 'Quad',
    description: 'A single square facing the camera (XY plane).',
    meshData: () => new QuadPrimitive(),
  },
  {
    name: 'Cylinder',
    description: 'A cylinder (bundled .obj).',
    meshData: () => EngineCache.getMeshDataFromObj('assets/primitives/cilinder.obj'),
  },
  {
    name: 'Torus',
    description: 'A torus (bundled .obj).',
    meshData: () => EngineCache.getMeshDataFromObj('assets/primitives/torus.obj'),
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
  mesh.meshData = await primitive.meshData();

  const material = new LitMaterial();
  material.mainTex = await EngineCache.getWhiteTexture(gl);

  const renderer = new MeshRendererBehaviour(gl);
  renderer.mesh = mesh;
  renderer.shader = new LitShader(gl, material);

  entity.addBehaviour(renderer);
  return entity;
}
