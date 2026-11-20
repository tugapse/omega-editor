import { Component, EventEmitter, HostListener, inject, Input, Output, signal } from '@angular/core';
import { Camera, renderTextureUri, Texture } from 'omega-game-engine';
import { EditorService } from '@editor/services/editor.service';
import { AssetService } from 'src/app/api/services/asset.service';
import { EditorStateService } from '@editor/services/editor-state.service';
import { EditorResourceLoader } from '@editor/services/editor-resource-loader.service';
import {
  BUILTIN_TEXTURES,
  DraggedAsset,
  isTextureAsset,
  MISSING_TEXTURE_URI,
  OMEGA_ASSET_DRAG_TYPE,
  TextureChoice,
  textureDisplayName,
  toAssetUri,
} from '@editor/scene/texture-refs';

/**
 * Unity-style texture field: thumbnail + name. Click to pick a project or
 * built-in texture, or drop a texture from the Asset Explorer.
 * Emits the chosen texture, or `null` for "None".
 */
@Component({
  selector: 'editor-texture-slot',
  templateUrl: './texture-slot.html',
  styleUrl: './texture-slot.scss',
})
export class TextureSlot {
  private assetService = inject(AssetService);
  private editorState = inject(EditorStateService);
  private resourceLoader = inject(EditorResourceLoader);
  private editorService = inject(EditorService);

  @Input() label = 'Texture';
  @Input() texture: Texture | null | undefined = null;
  @Output() textureSelected = new EventEmitter<TextureChoice | null>();

  isOpen = signal(false);
  isDragOver = signal(false);
  isLoading = signal(false);
  search = signal('');
  projectTextures = signal<TextureChoice[]>([]);
  /** Textures the scene's cameras render into (`Camera.targetTexture`). */
  cameraTextures = signal<TextureChoice[]>([]);
  readonly builtinTextures = BUILTIN_TEXTURES;

  /** Asset names by id, to show "wall.png" instead of "asset://<uuid>". */
  private static assetNames = signal(new Map<string, string>());
  /** The project whose asset names are loaded (or loading). */
  private static namesProjectId: string | null = null;

  constructor() {
    this.loadAssetNames();
  }

  get isEmpty(): boolean {
    const uri = this.texture?.textureUri;
    return !uri || textureDisplayName(uri) === 'None';
  }

  /** Thumbnail of the current texture (the magenta one when empty). */
  get previewUrl(): string | null {
    return this.resourceLoader.previewUrl(this.isEmpty ? MISSING_TEXTURE_URI : this.texture?.textureUri);
  }

  readonly missingPreview = this.resourceLoader.previewUrl(MISSING_TEXTURE_URI);

  get displayName(): string {
    const uri = this.texture?.textureUri;
    const id = uri?.startsWith('asset://') ? uri.slice(8) : null;
    return (id && TextureSlot.assetNames().get(id)) || textureDisplayName(uri);
  }

  filtered(list: TextureChoice[]): TextureChoice[] {
    const q = this.search().toLowerCase();
    return q ? list.filter((t) => t.name.toLowerCase().includes(q)) : list;
  }

  toggle(event: MouseEvent) {
    event.stopPropagation();
    if (this.isOpen()) {
      this.isOpen.set(false);
      return;
    }
    this.search.set('');
    this.isOpen.set(true);
    this.loadProjectTextures();
    this.loadCameraTextures();
  }

  choose(choice: TextureChoice | null, event?: MouseEvent) {
    event?.stopPropagation();
    this.isOpen.set(false);
    this.textureSelected.emit(choice);
  }

  @HostListener('document:click')
  close() {
    this.isOpen.set(false);
  }

  onDragOver(event: DragEvent) {
    if (!event.dataTransfer?.types.includes(OMEGA_ASSET_DRAG_TYPE)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    this.isDragOver.set(true);
  }

  onDragLeave() {
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent) {
    this.isDragOver.set(false);
    const raw = event.dataTransfer?.getData(OMEGA_ASSET_DRAG_TYPE);
    if (!raw) return;
    event.preventDefault();
    const asset = JSON.parse(raw) as DraggedAsset;
    if (!isTextureAsset(asset)) {
      console.warn(`[TextureSlot] "${asset.name}" is not an image and cannot be used as a texture.`);
      return;
    }
    TextureSlot.rememberNames([[asset.id, asset.name]]);
    this.choose({ uri: toAssetUri(asset.id), name: asset.name });
  }

  private loadProjectTextures() {
    const projectId = this.editorState.activeProject()?.id;
    if (!projectId) return;
    this.isLoading.set(true);
    this.assetService.listAssets(projectId).subscribe({
      next: (index) => {
        const images = index.assets.filter((a) => isTextureAsset(a));
        TextureSlot.rememberNames(images.map((a) => [a.id, a.filename]));
        const textures = images.map((a) => ({ uri: toAssetUri(a.id), name: a.filename }));
        this.projectTextures.set(textures);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  private loadCameraTextures() {
    const objects = this.editorService.scene?.objects ?? [];
    const names = new Set(
      objects.filter((o): o is Camera => o instanceof Camera && !!o.targetTexture).map((c) => c.targetTexture),
    );
    this.cameraTextures.set([...names].sort().map((name) => ({ uri: renderTextureUri(name), name })));
  }

  /** Loads the project's asset names once per project, for the slot labels. */
  private loadAssetNames() {
    const projectId = this.editorState.activeProject()?.id;
    if (!projectId || TextureSlot.namesProjectId === projectId) return;
    TextureSlot.namesProjectId = projectId;
    TextureSlot.assetNames.set(new Map());
    this.assetService.listAssets(projectId).subscribe({
      next: (index) => TextureSlot.rememberNames(index.assets.map((a) => [a.id, a.filename])),
      error: () => (TextureSlot.namesProjectId = null),
    });
  }

  private static rememberNames(entries: [string, string][]) {
    const names = new Map(TextureSlot.assetNames());
    for (const [id, name] of entries) names.set(id, name);
    TextureSlot.assetNames.set(names);
  }
}
