/**
 * Texture references used by the editor.
 *
 * - Project textures are stored in scenes as `asset://<assetId>` and resolved
 *   at load time by AssetUriResolverService (download with the JWT, object URL).
 * - Textures bundled with the editor keep their relative path (`assets/images/...`).
 */

export const ASSET_URI_PREFIX = 'asset://';

/** Drag-and-drop MIME type carrying an asset ({ id, name, type }). */
export const OMEGA_ASSET_DRAG_TYPE = 'application/x-omega-asset';

/** Shown in an empty texture slot, like Unity's magenta "missing" texture. */
export const MISSING_TEXTURE_URI = 'assets/images/default/error.jpg';

export interface DraggedAsset {
  id: string;
  name: string;
  type: string;
}

export interface TextureChoice {
  /** URI saved in the scene: `asset://<id>` or a bundled path. */
  uri: string;
  name: string;
  /** URL usable in an <img> for the picker thumbnail (bundled textures only). */
  previewUrl?: string;
}

export function toAssetUri(assetId: string): string {
  return ASSET_URI_PREFIX + assetId;
}

export function assetIdFromUri(uri: string | undefined | null): string | null {
  return uri?.startsWith(ASSET_URI_PREFIX) ? uri.slice(ASSET_URI_PREFIX.length) : null;
}

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp'];

/** True for project assets that can be used as a 2D texture. */
export function isTextureAsset(asset: { type?: string; assetType?: string; name?: string; filename?: string; mimeType?: string }): boolean {
  const type = asset.assetType ?? asset.type;
  if (type === 'image' || type === 'texture') return true;
  if (asset.mimeType?.startsWith('image/')) return true;
  const ext = (asset.filename ?? asset.name ?? '').split('.').pop()?.toLowerCase() ?? '';
  return IMAGE_EXTENSIONS.includes(ext);
}

/** Textures shipped with the editor (src/assets/images). */
export const BUNDLED_TEXTURES: TextureChoice[] = [
  'assets/images/wood-texture.jpg',
  'assets/images/wood-normal.jpg',
  'assets/images/wood-normal1.jpg',
  'assets/images/brick-wall/TCom_Wall_Stone3_2x2_512_albedo.jpeg',
  'assets/images/brick-wall/TCom_Wall_Stone3_2x2_512_normal.jpeg',
  'assets/images/brick-wall/TCom_Wall_Stone3_2x2_512_roughness.jpeg',
  'assets/images/default/white.jpg',
  'assets/images/default/black.jpg',
  'assets/images/default/normal.jpg',
  'assets/images/default/grid.png',
].map((uri) => ({ uri, name: uri.split('/').pop()!, previewUrl: uri }));

/** Readable name for a texture URI (bundled file name, or the asset id). */
export function textureDisplayName(uri: string | undefined | null): string {
  if (!uri) return 'None';
  if (uri === MISSING_TEXTURE_URI) return 'None';
  return uri.split('/').pop() || uri;
}
