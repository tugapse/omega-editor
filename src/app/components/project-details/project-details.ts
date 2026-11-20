import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { createDefaultScene } from '@editor/scene/default-scene';
import { AssetService } from '../../api/services/asset.service';
import { EngineAssetType } from '@editor/models/asset-types';
import { ProjectResponse } from '../../api/models/omega-api.models';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './project-details.html',
  styleUrls: ['./project-details.scss']
})
export class ProjectDetails implements OnChanges {
  @Input({ required: true }) project!: ProjectResponse;
  @Output() save = new EventEmitter<ProjectResponse>();

  editableProject!: ProjectResponse;
  openingEditor = false;

  private assetService = inject(AssetService);
  private router = inject(Router);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project']) {
      // Create a copy for editing to avoid mutating the original object directly
      this.editableProject = { ...this.project };
    }
  }

  onSave(): void {
    this.save.emit(this.editableProject);
  }

  /**
   * Opens the scene editor on the most recently updated scene. The editor
   * route needs a scene, so a project without scenes gets a "Main Scene".
   */
  goToEditor(): void {
    const projectId = this.project?.id;
    if (!projectId || this.openingEditor) return;
    this.openingEditor = true;

    this.assetService.listAssets(projectId, EngineAssetType.Scene).subscribe({
      next: (index) => {
        const scenes = index.assets
          .filter((a) => a.assetType === EngineAssetType.Scene)
          .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''));
        if (scenes.length) {
          this.openScene(projectId, scenes[0].id);
        } else {
          this.createDefaultScene(projectId);
        }
      },
      error: (err) => {
        this.openingEditor = false;
        console.error('Failed to list scenes', err);
      },
    });
  }

  private createDefaultScene(projectId: string): void {
    const sceneName = 'Main Scene.scene';
    const scene = createDefaultScene('Main Scene');
    const file = new File([JSON.stringify(scene.toJsonObject())], sceneName, {
      type: 'application/json',
    });
    this.assetService
      .uploadAsset(projectId, file, `/Scenes/${sceneName}`, EngineAssetType.Scene)
      .subscribe({
        next: (asset) => this.openScene(projectId, asset.id),
        error: (err) => {
          this.openingEditor = false;
          console.error('Failed to create the default scene', err);
        },
      });
  }

  private openScene(projectId: string, sceneId: string): void {
    this.openingEditor = false;
    this.router.navigate(['/editor', projectId, sceneId]);
  }
}
