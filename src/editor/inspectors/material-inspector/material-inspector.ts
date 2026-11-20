import { Component, Input } from '@angular/core';
import { InpectorTogglePanel } from '@editor/components/inpector-toggle-panel/inpector-toggle-panel';
import { DefaultInspector } from '../default-inspector/default-inspector';
import {
  ITargetProperty,
  ObjectInspector,
} from '../object-inspector/object-inspector';
import { Color, ColorMaterial, EngineCache, NumberRange, Texture } from 'omega-game-engine';
import { TextureSlot } from '../texture-slot/texture-slot';
import { MISSING_TEXTURE_URI, TextureChoice } from '@editor/scene/texture-refs';
import { TextureInspector } from '../texture-inspector/texture-inspector';

@Component({
  selector: 'editor-material-inspector',
  imports: [
    DefaultInspector,
    InpectorTogglePanel,
    ObjectInspector,
    TextureInspector,
    TextureSlot,
  ],
  templateUrl: './material-inspector.html',
  styleUrl: './material-inspector.scss',
})
export class MaterialInspector extends ObjectInspector {
  @Input() set material(value: ColorMaterial) {
    this._selectedObject = {
      key: value.className,
      type: 'material',
      property: value,
    };
    this._material = value;
    this.loadProperties();
  }

  _material!: ColorMaterial;

  /** Texture properties of the material (e.g. mainTex, normalTex), set or not. */
  textureKeys: string[] = [];

  protected override loadProperties(): void {
    if (!this._selectedObject?.property) {
      this._properties = [];
      return;
    }

    const object = this._selectedObject.property;
    const properties = Object.keys(object)
      .filter((key) => this.isPropertyValid(key))
      .map((key) => super.createPropertyViewModel(key, object[key]))
      .filter((p) => !!p.key);
    // Empty slots are not own properties, so read the keys the material saves.
    const saved = Object.keys((object as ColorMaterial).toJsonObject?.() ?? {});
    const texKeys = new Set([
      ...saved.filter((k) => /Tex$/.test(k)),
      ...properties.filter((p) => p.type === 'texture').map((p) => p.key),
    ]);
    this.textureKeys = [...texKeys];
    this._properties = properties.filter((p) => p.type !== 'texture');
  }

  textureOf(key: string): Texture | null {
    const value = (this._material as any)?.[key];
    return value instanceof Texture ? value : null;
  }

  /** Assigns the chosen texture; "None" uses the magenta missing texture. */
  async onTextureSelected(key: string, choice: TextureChoice | null) {
    const uri = choice?.uri ?? MISSING_TEXTURE_URI;
    try {
      const texture = await EngineCache.getTexture2D(uri, this.editorService.gl);
      await texture.load();
      (this._material as any)[key] = texture;
      this.loadProperties();
      this.updateScene();
    } catch (error) {
      console.error(`[MaterialInspector] Could not load texture ${uri}`, error);
    }
  }

  onDefaultChanged(
    item: ITargetProperty,
    value: string | number | boolean | NumberRange | Color,
  ) {
    if (value instanceof Event) return;

    this._material[item.key] = value;
  }
}
