import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SceneEntity } from 'omega-game-engine';
import { Icon } from 'src/app/components/icon/icon';
import { TreeNode } from '../scene-node';

@Component({
  selector: 'app-tree-node',
  imports: [Icon],
  templateUrl: './tree-node.html',
  styleUrl: './tree-node.scss',
})
export class TreeNodeComponent<T> {
  @Input() node!: TreeNode<T>;
  @Input() selectedNodeId: string = '';

  @Output() nodeDropped = new EventEmitter<{
    draggedNode: TreeNode<T>;
    targetNode: TreeNode<T>;
    dropPosition: 'above' | 'below' | 'inside';
  }>();
  @Output() visibilityChange = new EventEmitter<TreeNode<T>>();
  @Output() nodeSelected = new EventEmitter<TreeNode<T>>();
  @Output() nodeDeleted = new EventEmitter<TreeNode<T>>();

  /** Collapsed state by node id; kept here because the tree is rebuilt on every scene change. */
  private static collapsedById = new Map<string, boolean>();
  /** Branches bigger than this (a model's skeleton) start collapsed. */
  static readonly AUTO_COLLAPSE_DESCENDANTS = 10;

  get hasChildren(): boolean {
    return !!this.node.children?.length;
  }

  get collapsed(): boolean {
    const stored = TreeNodeComponent.collapsedById.get(this.node.id);
    return stored ?? TreeNodeComponent.descendants(this.node) > TreeNodeComponent.AUTO_COLLAPSE_DESCENDANTS;
  }

  toggleCollapsed(event: MouseEvent): void {
    event.stopPropagation();
    TreeNodeComponent.collapsedById.set(this.node.id, !this.collapsed);
  }

  private static descendants(node: TreeNode<unknown>): number {
    return (node.children ?? []).reduce((n, c) => n + 1 + TreeNodeComponent.descendants(c), 0);
  }

  isDropAbove = false;
  isDropBelow = false;
  isDropInside = false;

  onDeleteClick(node: TreeNode<T>, event: MouseEvent) {
    event.stopPropagation();
    this.nodeDeleted.emit(node);
  }

  onChildDeleted(node: TreeNode<T>) {
    this.nodeDeleted.emit(node);
  }

  onDragStart(event: DragEvent): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify(this.node));
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // Measure the node row itself, not the icon/label under the pointer.
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const y = event.clientY - rect.top;

    this.isDropAbove = false;
    this.isDropBelow = false;
    this.isDropInside = false;

    if (y < rect.height / 3) {
      this.isDropAbove = true;
    } else if (y > (rect.height / 3) * 2) {
      this.isDropBelow = true;
    } else {
      this.isDropInside = true;
    }
  }

  onDragLeave(event: DragEvent): void {
    this.isDropAbove = false;
    this.isDropBelow = false;
    this.isDropInside = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer) {
      const draggedNode = JSON.parse(
        event.dataTransfer.getData('application/json'),
      );
      if (draggedNode && draggedNode.id !== this.node.id) {
        const dropPosition = this.isDropAbove
          ? 'above'
          : this.isDropBelow
            ? 'below'
            : 'inside';
        this.nodeDropped.emit({
          draggedNode,
          targetNode: this.node,
          dropPosition,
        });
      }
    }
    this.isDropAbove = false;
    this.isDropBelow = false;
    this.isDropInside = false;
  }

  onChildDropped(event: {
    draggedNode: TreeNode<T>;
    targetNode: TreeNode<T>;
    dropPosition: 'above' | 'below' | 'inside';
  }): void {
    this.nodeDropped.emit(event);
  }

  onNodeClick(node: TreeNode<T>) {
    if (node && node.id != this.selectedNodeId) {
      console.debug('selected node', node);
      this.nodeSelected.emit(node);
    }
  }

  onMouseUp(node: TreeNode<T>, event: any) {
    console.debug('Node mouse up', node);
    this.onNodeClick(node);
    event.preventDefault();
    event.stopPropagation();
  }
}
