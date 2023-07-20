import { customElement, query } from "lit/decorators.js";
import {
  BoxGeometry,
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  AmbientLight,
  MeshStandardMaterial,
  Vector3,
  Group,
  PointLight,
} from "three";
import { LitThree } from "../../utils/LitThree";
import { UpdateLoopType } from "../../data/types/LitThreeTypes";

@customElement("three-experience")
export class ThreeExperience extends LitThree {
  @query("#pepitos") canvas!: HTMLCanvasElement;

  constructor() {
    super(null);

    this.setCanvas();
  }

  wireframeSphereGroup: Group = new Group();
  wireframedSphere: Mesh | null = null;
  filledSphere: Mesh | null = null;

  pointLight: PointLight | null = null;

  async setCanvas() {
    await this.updateComplete;
    this.initExperience();
    this.addControls();
    this.setRenderer(this.shadowRoot);
  }

  addSphereWireframe() {
    const geometry = new SphereGeometry(2, 50, 30);
    const material = new MeshBasicMaterial({
      color: 0xffff00ff,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    this.wireframedSphere = new Mesh(geometry, material);

    this.wireframeSphereGroup.add(this.wireframedSphere);
    this.placeSpheresOnWireframedSphere();

    this.scene.add(this.wireframeSphereGroup);
  }

  placeSpheresOnWireframedSphere() {
    const vertices: Vector3[] = [];
    const positionAttribute =
      this.wireframedSphere?.geometry.attributes.position;
    const arr = positionAttribute!.array;

    for (let i = 0; i < arr.length; i += 3) {
      const x = arr[i];
      const y = arr[i + 1];
      const z = arr[i + 2];

      vertices.push(new Vector3(x, y, z));
    }

    const geometry = new SphereGeometry(0.05);
    const material = new MeshStandardMaterial({
      color: "#ff0fff",
      opacity: 0.9,
      transparent: true,
    });

    vertices.forEach((vertex) => {
      const box = new Mesh(geometry, material);

      box.position.copy(vertex);
      this.wireframeSphereGroup.add(box);
    });
  }

  addSphereFilled() {
    const geometry = new SphereGeometry(1.7);
    const material = new MeshStandardMaterial({
      color: "#333",
    });
    this.filledSphere = new Mesh(geometry, material);
    this.scene.add(this.filledSphere);
  }

  mainLoop() {
    if (this.scene.children.length) return;

    const ambientLight = new AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);

    this.pointLight = new PointLight(0xffffff, 1.2);
    this.scene.add(this.pointLight);

    this.addSphereWireframe();
    this.addSphereFilled();
  }

  updateLoop({ deltaTime }: UpdateLoopType) {
    this.wireframeSphereGroup?.rotateY(Math.sin(deltaTime * 0.5));
    this.wireframeSphereGroup?.rotateZ(deltaTime * 0.007);

    this.pointLight?.position.set(
      Math.sin(deltaTime * 0.5) * 5,
      Math.cos(deltaTime * 0.5) * 5,
      Math.cos(deltaTime * 0.5) * 5
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "three-experience": ThreeExperience;
  }
}
