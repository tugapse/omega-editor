import { BuiltinTextures, builtinTextureUrl } from 'omega-game-engine';

/**
 * Texture references used by the editor.
 *
 * - Project textures are stored in scenes as `asset://<assetId>` and loaded by
 *   EditorResourceLoader (download with the JWT). The editor ships no textures
 *   of its own: user content lives in the project (see the API's templates).
 * - Engine built-ins are `builtin://white|black|normal|missing`.
 */

export const ASSET_URI_PREFIX = 'asset://';

/** Drag-and-drop MIME type carrying an asset ({ id, name, type }). */
export const OMEGA_ASSET_DRAG_TYPE = 'application/x-omega-asset';

/** Shown in an empty texture slot, like Unity's magenta "missing" texture. */
export const MISSING_TEXTURE_URI: string = BuiltinTextures.missing;

export interface DraggedAsset {
  id: string;
  name: string;
  type: string;
}

export interface TextureChoice {
  /** URI saved in the scene: `asset://<id>` or `builtin://<name>`. */
  uri: string;
  name: string;
  /** URL usable in an <img> for the picker thumbnail (built-ins only). */
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

/** Engine built-in textures, always available in the picker. */
export const BUILTIN_TEXTURES: TextureChoice[] = [
  BuiltinTextures.white,
  BuiltinTextures.black,
  BuiltinTextures.normal,
].map((uri) => ({ uri, name: textureDisplayName(uri), previewUrl: builtinTextureUrl(uri) ?? uri }));

/** Readable name for a texture URI (built-in name, or the last path segment). */
export function textureDisplayName(uri: string | undefined | null): string {
  if (!uri) return 'None';
  if (uri === MISSING_TEXTURE_URI) return 'None';
  if (uri.startsWith('builtin://')) return uri.slice('builtin://'.length);
  return uri.split('/').pop() || uri;
}
