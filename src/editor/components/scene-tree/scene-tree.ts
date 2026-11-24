import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Icon } from '../../../app/components/icon/icon';
import { SceneTreeService } from '../../services/scene-tree.service';
import {
  SceneEntity,
  EntityType,
  Scene,
  ObjectInstanciator,
  ClassMetadata,
  ClassType,
} from 'omega-game-engine';
import { EditorService } from '@editor/services/editor.service';
import { TreeNode } from './scene-node';
import { TreeNodeComponent } from './tree-node/tree-node';
import { AddBehaviourMenuComponent } from '../../components/add-behaviour-menu/add-behaviour-menu';
import { PRIMITIVES, createPrimitiveEntity } from '@editor/scene/primitive-factory';

@Component({
  selector: 'app-scene-tree',
  imports: [CommonModule, Icon, TreeNodeComponent, AddBehaviourMenuComponent],
  templateUrl: './scene-tree.html',
  styleUrl: './scene-tree.scss',
})
export class SceneTree {
  @Input() public set targetScene(scene: Scene) {
    if (!scene) return;
    this.scene = scene;
    this.prepareObjects();
  }

  constructor(
    public sceneTreeService: SceneTreeService,
    private editorService: EditorService,
  ) {
    this.editorService.onSceneUpdated.subscribe((scene) => {
      this.targetScene = scene;
    });
    this.editorService.onSceneLoaded.subscribe((scene) => {
      this.targetScene = scene;

      const entity = scene.getEntitieByUuid(this.selectedUuid);
      this.sceneTreeService.onEntitySelected.emit(entity);
    });
    this.sceneTreeService.onEntitySelected.subscribe((entity) => {
      this.selectedUuid = entity?.uuid;
    });
  }

  objectsToDraw: SceneEntity[] = [];
  scene!: Scene;
  selectedUuid!: string;
  sceneTreeNodes!: TreeNode<string>[];
  treeNodeMap: { [key: string]: SceneEntity } = {};

  readonly iconNames: { [key: string]: string } = {
    [EntityType.STATIC]: 'fa-object-group',
    [EntityType.CAMERA]: 'fa-camera',
    [EntityType.LIGHT_AMBIENT]: 'fa-circle-half-stroke',
    [EntityType.LIGHT_DIRECTIONAL]: 'fa-sun',
    [EntityType.LIGHT_POINT]: 'fa-lightbulb',
    [EntityType.LIGHT_SPOT]: 'fa-traffic-light',
    [EntityType.SCENE]: 'fa-bank',
  };

  toggleObj(obj: SceneEntity, event: Event) {
    event.preventDefault();
    obj.show = !obj.show;
  }

  entitySelected(entity: SceneEntity, event: MouseEvent) {
    if (entity.uuid == (event.target! as any).id) {
      this.selectedUuid = entity.uuid;
      this.sceneTreeService.onEntitySelected.emit(entity);
      setTimeout(() => this.editorService.requestCanvasResize(), 30);
    }
  }

  refreshTree() {
    this.prepareObjects();
  }

  prepareObjects() {
    if (!this.scene) return;
    // Entities made at run time by others (a terrain's chunks) are not listed.
    const sceneObjects = this.scene.objects.filter((o) => !o.transient);
    this.treeNodeMap = sceneObjects.reduce((acc, curr) => {
      return { ...acc, [curr.uuid]: curr };
    }, {});
    const rootObjects = [
      ...sceneObjects.filter((e) => !e.transform.parent?.parentEntity),
    ];
    const childObjects: { [key: string]: SceneEntity[] } = {};

    sceneObjects.forEach((ob) => {
      if (ob.transform.parent) {
        if (ob.transform.parent.parentEntity) {
          const key = ob.transform.parent.parentEntity.uuid;
          const parentList: SceneEntity[] = (childObjects[key] =
            childObjects[key] || []);
          parentList.push(ob);
        }
      }
    });
    const nodes = this.createNodeListFromObjectArray(rootObjects, childObjects);
    this.objectsToDraw = rootObjects;
    this.sceneTreeNodes = nodes;
  }

  protected createNodeListFromObjectArray(
    objs: SceneEntity[],
    childObjectsMap: { [key: string]: SceneEntity[] },
  ) {
    const result: TreeNode<string>[] = [];

    for (const elm of objs) {
      const node: TreeNode<string> = {
        icon: this.iconNames[elm.entityType],
        name: elm.name,
        id: elm.uuid,
        object: elm.uuid,
      };
      const child = childObjectsMap[elm.uuid];
      if (child?.length > 0) {
        node.children = this.createNodeListFromObjectArray(
          child,
          childObjectsMap,
        );
      }
      result.push(node);
    }

    return result;
  }

  /**
   * Applies a drop to the scene itself (parent and order), then rebuilds the
   * tree from it. Nodes are matched by entity uuid, never by name.
   */
  handleNodeDropped(event: {
    draggedNode: TreeNode<string>;
    targetNode: TreeNode<string>;
    dropPosition: 'above' | 'below' | 'inside';
  }) {
    const { draggedNode, targetNode, dropPosition } = event;
    const dragged = this.treeNodeMap[draggedNode.id];
    const target = this.treeNodeMap[targetNode.id];
    if (!this.scene || !dragged || !target || dragged === target) return;
    // An entity can't move under one of its own descendants.
    if (this.isDescendantOf(target, dragged)) return;

    const newParent = dropPosition === 'inside' ? target.transform : target.transform.parent;
    if (dragged.transform.parent !== newParent) {
      dragged.transform.setParent(newParent ?? null);
    }

    // Sibling order follows the scene's object order.
    if (dropPosition !== 'inside') {
      const objects = this.scene.objects;
      objects.splice(objects.indexOf(dragged), 1);
      const targetIndex = objects.indexOf(target);
      objects.splice(dropPosition === 'above' ? targetIndex : targetIndex + 1, 0, dragged);
    }

    this.editorService.onSceneUpdated.emit(this.scene);
  }

  private isDescendantOf(entity: SceneEntity, ancestor: SceneEntity): boolean {
    for (let t = entity.transform.parent; t; t = t.parent) {
      if (t === ancestor.transform) return true;
    }
    return false;
  }

  onNodeDeleted(node: TreeNode<string>) {
    if (!this.scene) return;
    const entity = this.treeNodeMap[node.id];
    if (entity) {
      this.deleteEntityAndChildren(entity);
      this.editorService.onSceneUpdated.emit(this.scene);
      if (this.selectedUuid === node.id) {
        this.selectedUuid = '';
        this.sceneTreeService.onEntitySelected.emit(undefined as any);
      }
    }
  }

  private deleteEntityAndChildren(entity: SceneEntity) {
    const children = this.scene.objects.filter(
      (e) => e.transform.parent?.parentEntity === entity,
    );
    for (const child of children) {
      this.deleteEntityAndChildren(child);
    }
    this.scene.removeEntity(entity);
  }

  onNodeSelected(node: TreeNode<string>) {
    console.debug('Scene tree selected ', node);
    this.selectedUuid = node.id;
    const entity = this.treeNodeMap[this.selectedUuid];
    if (entity) {
      this.sceneTreeService.onEntitySelected.emit(entity);
      setTimeout(() => this.editorService.requestCanvasResize(), 30);
    } else {
    }
  }

  isAddEntityMenuOpen = false;
  availableEntities: ClassMetadata[] = [];
  menuX = 0;
  menuY = 0;

  onSceneTreeAddNewRequested(event: MouseEvent) {
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    // Position slightly below the button
    this.menuY = rect.bottom + 5;
    this.menuX = rect.left;
    const hiddenentities = ['SceneEntity', 'Scene'];
    const registered = ObjectInstanciator.getMetadata([
      ClassType.Entity,
      ClassType.Light,
    ]).filter((meta) => !hiddenentities.includes(meta.name));
    this.availableEntities = [
      ...this.builtInEntities.map((b) => b.metadata),
      ...registered,
    ];
    this.isAddEntityMenuOpen = true;
  }

  /**
   * Entries the editor always offers in the "+" menu, before the entities
   * registered in the engine. Each one builds its entity directly.
   */
  private readonly builtInEntities: {
    metadata: ClassMetadata;
    create: () => SceneEntity | Promise<SceneEntity>;
  }[] = [
    {
      metadata: {
        name: 'Empty Object',
        type: ClassType.Entity,
        path: 'Built-in',
        description: 'An entity with only a transform. Use it as a group or to attach behaviours.',
      },
      create: () => SceneEntity.instanciate(this.uniqueEntityName('Empty Object')),
    },
    ...PRIMITIVES.map((primitive) => ({
      metadata: {
        name: primitive.name,
        type: ClassType.Entity,
        path: 'Primitives',
        description: primitive.description,
      },
      create: () =>
        createPrimitiveEntity(
          this.editorService.gl,
          primitive,
          this.uniqueEntityName(primitive.name),
        ),
    })),
  ];

  /** "Empty Object", then "Empty Object (1)", "Empty Object (2)"... */
  private uniqueEntityName(base: string): string {
    const names = new Set(this.scene.objects.map((e) => e.name));
    if (!names.has(base)) return base;
    let i = 1;
    while (names.has(`${base} (${i})`)) i++;
    return `${base} (${i})`;
  }

  async onEntitySelected(entityMetadata: ClassMetadata) {
    if (!this.scene) return;
    const builtIn = this.builtInEntities.find(
      (b) => b.metadata === entityMetadata,
    );
    const instance = builtIn
      ? await builtIn.create()
      : ObjectInstanciator.instanciateObjectFromJsonData<SceneEntity>(
          entityMetadata.name,
          ['New ' + entityMetadata.name],
        );
    if (instance) {
      this.scene.addEntity(instance);
      this.editorService.onSceneUpdated.emit(this.scene);
      this.sceneTreeService.onEntitySelected.emit(instance);
    }
  }

  inspectScene(arg0: Scene) {
    this.sceneTreeService.onEntitySelected.emit(this.scene as SceneEntity);
  }
}
