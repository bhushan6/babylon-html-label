import {
  AbstractMesh,
  ArcRotateCamera,
  Engine,
  Matrix,
  MeshBuilder,
  Nullable,
  Scene,
  SceneLoader,
  UniversalCamera,
  Vector3,
} from "@babylonjs/core";

//@ts-expect-error
import { HTML2DLabel } from "babylon-html-label";

export class Experience {
  private _canvas: HTMLCanvasElement;

  private _engine: Engine;
  public scene: Scene;

  private _camera: Nullable<ArcRotateCamera | UniversalCamera> = null;

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;

    this._engine = new Engine(this._canvas, true);
    this.scene = new Scene(this._engine);

    this.initUniversalCamera({});

    this.scene.createDefaultLight();

    this.pointerDownEvent(this.scene);

    // this.initArcRotateCamera({});
    this.initUniversalCamera({});

    const box = MeshBuilder.CreateBox("box", { size: 1 }, this.scene);

    const sphere = MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 0.1 },
      this.scene
    );

    box.addChild(sphere);

    sphere.position.x = 0.5;
    sphere.position.y = 0.5;
    sphere.position.z = -0.5;

    const div = document.createElement("div");
    div.innerText = "Hello World";
    div.style.background = "white";
    div.style.padding = "5px 10px";
    div.style.borderRadius = "5px";
    div.style.fontFamily = "sans-serif";

    const htmlNode = new HTML2DLabel(
      "html-node",
      { htmlElement: div, center: true, distanceFactor: 4.5 },
      this.scene
    );

    htmlNode.position.x = 0.5;
    htmlNode.position.y = 0.5;
    htmlNode.position.z = -0.5;

    box.addChild(htmlNode);

    this.scene.onBeforeRenderObservable.add(() => {
      box.position.z = (Math.sin(Date.now() * 0.001) + 1) * 3;
      box.rotation.x = (Math.sin(Date.now() * 0.001) - 0.5) * 1.5;
      box.rotation.y = (Math.sin(Date.now() * 0.001) - 0.5) * 1.5;
    });

    this._GameLoop(this._engine, this.scene);
  }

  private _GameLoop = (
    engine: Engine = this._engine,
    scene: Scene = this.scene
  ) => {
    engine.runRenderLoop(() => {
      scene.getEngine().setSize(window.innerWidth, window.innerHeight);
      scene.getEngine().resize();
      scene.render();
    });
  };

  private pointerDownEvent = (scene: Scene) => {
    scene.onPointerDown = () => {
      const ray = scene.createPickingRay(
        scene.pointerX,
        scene.pointerY,
        Matrix.Identity(),
        scene._activeCamera
      );
      const hit = scene.pickWithRay(ray);

      if (!hit?.pickedMesh) {
        return;
      }

      console.log({ meshName: hit.pickedMesh.name, hit });
    };
  };

  private initArcRotateCamera = ({ position }: { position?: Vector3 }) => {
    this._camera?.dispose();
    this._camera = new ArcRotateCamera(
      "Camera",
      -Math.PI / 2,
      Math.PI / 2,
      10,
      position || new Vector3(0, 0, 0),
      this.scene
    );
    this._camera.attachControl();
  };

  private initUniversalCamera = ({ position }: { position?: Vector3 }) => {
    this._camera?.dispose();
    this._camera = new UniversalCamera(
      "Camera",
      position || new Vector3(0, 0, -4),
      this.scene
    );
    this._camera.speed = 0.2;
    this._camera.attachControl();
  };
}
