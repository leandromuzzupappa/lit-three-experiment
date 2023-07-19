import { customElement, query } from "lit/decorators.js";
import {
  BoxGeometry,
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  AmbientLight,
  MeshStandardMaterial,
} from "three";
import { LitThree } from "../../utils/LitThree";

@customElement("three-experience")
export class ThreeExperience extends LitThree {
  @query("#pepitos") canvas!: HTMLCanvasElement;

  constructor() {
    super(null);
  }

  connectedCallback() {
    super.connectedCallback();
    this.setCanvas();
  }

  async setCanvas() {
    await this.updateComplete;
    this.initExperience();
    this.addControls();
    this.setRenderer(this.shadowRoot);
  }

  mainLoop() {
    const geometry = new SphereGeometry(2, 8, 8);
    const material = new MeshBasicMaterial({
      color: 0xffff00,
      wireframe: true,
    });
    const sphere = new Mesh(geometry, material);
    this.scene.add(sphere);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "three-experience": ThreeExperience;
  }
}
