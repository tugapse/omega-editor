import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { EngineCache } from 'omega-game-engine';
import { AssetService } from 'src/app/api/services/asset.service';
import { EditorStateService } from './editor-state.service';
import { assetIdFromUri } from '../scene/texture-refs';

/**
 * Resolves `asset://<id>` URIs for the engine.
 *
 * Project files are behind the API's JWT, but the engine loads textures with
 * `<img src>`, which cannot send headers. This service downloads the file
 * with the authenticated HttpClient and hands the engine an object URL. The
 * scene keeps saving `asset://<id>`, never the object URL or the token.
 */
@Injectable({ providedIn: 'root' })
export class AssetUriResolverService {
  private assetService = inject(AssetService);
  private editorState = inject(EditorStateService);

  /** Object URL per "projectId/assetId". */
  private urls = new Map<string, Promise<string>>();

  /** Registers this resolver with the engine. Safe to call more than once. */
  register(): void {
    EngineCache.setUriResolver((uri) => this.resolve(uri));
  }

  resolve(uri: string): string | Promise<string> {
    const assetId = assetIdFromUri(uri);
    if (!assetId) return uri;

    const projectId = this.editorState.activeProject()?.id;
    if (!projectId) {
      return Promise.reject(new Error(`No active project to resolve ${uri}`));
    }

    const key = `${projectId}/${assetId}`;
    let url = this.urls.get(key);
    if (!url) {
      url = firstValueFrom(this.assetService.getRawAssetContent(projectId, assetId)).then(
        (blob) => URL.createObjectURL(blob),
      );
      // Allow a retry after a failed download.
      url.catch(() => this.urls.delete(key));
      this.urls.set(key, url);
    }
    return url;
  }

  /** Releases all object URLs (e.g. when leaving a project). */
  clear(): void {
    for (const url of this.urls.values()) {
      url.then((u) => URL.revokeObjectURL(u)).catch(() => {});
    }
    this.urls.clear();
  }
}
