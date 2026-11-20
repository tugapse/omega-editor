import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { builtinTextureUrl, LoadedImage, ResourceLoader, Resources } from 'omega-game-engine';
import { AssetService } from 'src/app/api/services/asset.service';
import { EditorStateService } from './editor-state.service';
import { assetIdFromUri } from '../scene/texture-refs';

/**
 * How the engine loads files inside the editor.
 *
 * Project files (`asset://<id>`) are behind the API's JWT, so they are
 * downloaded with the authenticated HttpClient: text as text, images as an
 * ImageBitmap for the GPU. Everything else uses the engine's default loader.
 * Scenes keep saving `asset://<id>`, never a URL or a token.
 */
@Injectable({ providedIn: 'root' })
export class EditorResourceLoader implements ResourceLoader {
  private assetService = inject(AssetService);
  private editorState = inject(EditorStateService);

  /** Object URLs of downloaded project images, for <img> previews in the UI. */
  private previews = new Map<string, string>();

  /** Makes the engine load through this loader. Safe to call more than once. */
  register(): void {
    Resources.setLoader(this);
  }

  async loadText(uri: string): Promise<string> {
    const assetId = assetIdFromUri(uri);
    if (!assetId) return Resources.defaultLoader.loadText(uri);
    return (await this.download(assetId)).text();
  }

  async loadImage(uri: string): Promise<LoadedImage> {
    const assetId = assetIdFromUri(uri);
    if (!assetId) return Resources.defaultLoader.loadImage(uri);
    const blob = await this.download(assetId);
    if (!this.previews.has(uri)) this.previews.set(uri, URL.createObjectURL(blob));
    return createImageBitmap(blob);
  }

  /**
   * A URL an <img> can show for a texture URI: the preview of a downloaded
   * project image, a built-in texture's data URL, or the bundled path itself.
   */
  previewUrl(uri: string | null | undefined): string | null {
    if (!uri) return null;
    if (assetIdFromUri(uri)) return this.previews.get(uri) ?? null;
    return builtinTextureUrl(uri) ?? uri;
  }

  /** Releases the preview URLs (e.g. when leaving a project). */
  clearPreviews(): void {
    for (const url of this.previews.values()) URL.revokeObjectURL(url);
    this.previews.clear();
  }

  private async download(assetId: string): Promise<Blob> {
    const projectId = this.editorState.activeProject()?.id;
    if (!projectId) throw new Error(`No active project to load asset ${assetId}`);
    return firstValueFrom(this.assetService.getRawAssetContent(projectId, assetId));
  }
}
