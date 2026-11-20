import { JsonSerializedData, Scene, SceneManager, Transform } from 'omega-game-engine';

/**
 * Loads a scene and restores the parent/child hierarchy.
 *
 * Workaround for BUGS.md G2: the engine saves each transform's `parent`
 * (the parent transform's uuid) but `SceneManager.loadScene` never links
 * them (its `prepareTransforms` is not called). Remove this wrapper once
 * the engine links parents itself.
 */
export async function loadSceneWithHierarchy(
  gl: WebGL2RenderingContext,
  sceneData: JsonSerializedData,
): Promise<Scene> {
  // loadScene replaces sceneData.objects with entity instances, so read the
  // parent links first.
  const parentLinks: { childTransformUuid: string; parentTransformUuid: string }[] = [];
  for (const object of (sceneData['objects'] ?? []) as JsonSerializedData[]) {
    const transform = object?.['transform'] as JsonSerializedData | undefined;
    if (transform?.['uuid'] && transform['parent']) {
      parentLinks.push({
        childTransformUuid: transform['uuid'],
        parentTransformUuid: transform['parent'],
      });
    }
  }

  const scene = await SceneManager.loadScene(gl, sceneData);

  if (parentLinks.length) {
    const transforms = new Map<string, Transform>();
    for (const entity of scene.objects) {
      transforms.set(entity.transform.uuid, entity.transform);
    }
    for (const { childTransformUuid, parentTransformUuid } of parentLinks) {
      const child = transforms.get(childTransformUuid);
      const parent = transforms.get(parentTransformUuid);
      if (child && parent && child.parent !== parent) {
        child.setParent(parent);
      }
    }
  }

  return scene;
}
