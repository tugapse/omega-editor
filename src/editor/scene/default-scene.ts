import { Colors, DirectionalLight, Light, Scene } from 'omega-game-engine';

/**
 * A new scene, ready to work in: like Unity, it starts with a directional
 * light (and an ambient one), so lit meshes added to it are not black.
 */
export function createDefaultScene(name: string): Scene {
  const scene = new Scene();
  scene.name = name;

  const ambient = new Light('Ambient light');
  scene.addEntity(ambient);

  const sun = new DirectionalLight('Directional light');
  sun.color = Colors.white;
  sun.transform.rotate(50, -30, 0);
  scene.addEntity(sun);

  return scene;
}
