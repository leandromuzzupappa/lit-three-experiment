import { html, LitElement } from "lit";
import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export abstract class LitThree extends LitElement {
  scene!: Scene;
  camera!: PerspectiveCamera;
  renderer!: WebGLRenderer;
  targetElement: ShadowRoot | null = null;

  constructor(shadowRoot: ShadowRoot | null) {
    super();

    this.targetElement = shadowRoot;
  }

  initExperience() {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.loop();
  }

  private initScene() {
    this.scene = new Scene();
  }

  private initCamera() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    this.camera = new PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    this.camera.position.z = 5;
  }

  private initRenderer() {
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.targetElement?.appendChild(this.renderer.domElement);

    console.log(1, this.targetElement);
  }

  setRenderer(target: ShadowRoot | null) {
    target?.appendChild(this.renderer.domElement);
  }

  private loop() {
    requestAnimationFrame(this.loop.bind(this));

    this.mainLoop();
    this.renderer.render(this.scene, this.camera);
  }

  addControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.update();
  }

  abstract mainLoop(): void;

  render() {
    return html`<slot></slot>`;
  }
}
