import { html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { UpdateLoopType } from "../data/types/LitThreeTypes";

export abstract class LitThree extends LitElement {
  scene!: Scene;
  camera!: PerspectiveCamera;
  renderer!: WebGLRenderer;
  targetElement: ShadowRoot | null = null;

  @state() protected startTime: number = 0;
  @state() protected deltaTime: number = 0;
  @state() protected currentTime: number = 0;

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
  }

  protected setRenderer(target: ShadowRoot | null) {
    target?.appendChild(this.renderer.domElement);
  }

  private loop() {
    requestAnimationFrame(this.loop.bind(this));

    this.currentTime = performance.now();
    this.deltaTime = (this.currentTime - this.startTime) * 0.001;

    this.mainLoop();
    this.updateLoop({
      deltaTime: this.deltaTime,
      currentTime: this.currentTime,
    });
    this.renderer.render(this.scene, this.camera);
  }

  protected addControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.update();
  }

  protected abstract mainLoop(): void;
  protected abstract updateLoop({
    deltaTime,
    currentTime,
  }: UpdateLoopType): void;

  render() {
    return html`<slot></slot>`;
  }
}
