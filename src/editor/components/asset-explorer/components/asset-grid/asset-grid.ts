import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { IAsset } from '@editor/interfaces/asset.interface';
import { DraggedAsset, OMEGA_ASSET_DRAG_TYPE } from '@editor/scene/texture-refs';
import { AssetIcons } from '../../icons';
import { Icon } from 'src/app/components/icon/icon';

@Component({
  selector: 'app-asset-grid',
  standalone: true,
  templateUrl: './asset-grid.html',
  styleUrls: ['./asset-grid.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
})
export class AssetGridComponent {
  activeFolder = input.required<IAsset | null>();
  selectedNodeId = input<string | null>(null);

  itemClick = output<IAsset>();
  itemDoubleClick = output<IAsset>();
  contextMenu = output<{ e: MouseEvent; node: IAsset }>();

  /** Lets assets be dropped on inspector fields (e.g. texture slots). */
  onDragStart(event: DragEvent, item: IAsset) {
    if (!event.dataTransfer || item.type === 'folder') return;
    const payload: DraggedAsset = { id: item.id, name: item.name, type: item.type };
    event.dataTransfer.setData(OMEGA_ASSET_DRAG_TYPE, JSON.stringify(payload));
    event.dataTransfer.setData('text/plain', item.name);
    event.dataTransfer.effectAllowed = 'copy';
  }
  icons = AssetIcons;
}
