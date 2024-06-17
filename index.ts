import { AbstractMesh, Camera, Scene, Vector3 } from "@babylonjs/core";

const isInBehindOfCamera = (
  pointPosition: Vector3,
  cameraPosition: Vector3,
  cameraDirection: Vector3
) => {
  const pointDirection = pointPosition.subtract(cameraPosition).normalize();
  const dot = Vector3.Dot(pointDirection, cameraDirection);
  const angleRadians = Math.acos(dot);
  return angleRadians > Math.PI / 2;
};

const labelScale = (camera: Camera, position: Vector3) => {
  const vFOV = camera.fov;
  const dist = Vector3.Distance(position, camera.position);
  const scaleFOV = 2 * Math.tan(vFOV / 2) * dist;
  return 1 / scaleFOV;
};

const v_ = new Vector3(0.5, 0.5, 0.0);

export class HTML2DLabel extends AbstractMesh {
  private htmlElement: HTMLElement;

  private observableCleanUp: () => void;

  private el: HTMLElement;

  private settings: {
    center?: boolean;
    onCameraMoveOnly?: boolean;
    distanceFactor?: number;
  };

  constructor(
    name: string,
    {
      htmlElement,
      center,
      onCameraMoveOnly,
      el,
      distanceFactor,
    }: {
      htmlElement: HTMLElement;
      center?: boolean;
      onCameraMoveOnly?: boolean;
      el?: string;
      distanceFactor?: number;
    },
    scene: Scene
  ) {
    super(name, scene);
    this.htmlElement = htmlElement;

    this.el = document.createElement(el || "div");

    this.settings = {
      center,
      onCameraMoveOnly,
      distanceFactor,
    };

    this.observableCleanUp = this.attachUIToMesh(
      this.el,
      this.settings.onCameraMoveOnly
    );

    this.el.style.position = "absolute";
    document.body.appendChild(this.el);

    this.el.appendChild(this.htmlElement);

    const { px, py } = this.projectPointToScreenSpace();

    this.el.style.cssText = `position:absolute;top:0;left:0;transform:translate3d(${px}px,${py}px,0);transform-origin:0 0;`;
    if (this.settings.center) {
      this.htmlElement.style.transform = "translate(-50%, -50%)";
    }
  }

  private projectPointToScreenSpace = () => {
    const camera = this._scene.activeCamera!;
    const point = this.getAbsolutePosition();

    const isPointBehindCamera = isInBehindOfCamera(
      point,
      camera.position,
      camera.getForwardRay().direction
    );

    if (isPointBehindCamera) {
      return { px: -1000000000, py: -1000000000 };
    }

    const posInViewProj = Vector3.TransformCoordinates(
      point,
      this._scene.getTransformMatrix()
    );
    const screenCoords = posInViewProj
      .multiplyByFloats(0.5, -0.5, 1.0)
      .add(v_)
      .multiplyByFloats(
        this._scene.getEngine().getRenderWidth(),
        this._scene.getEngine().getRenderHeight(),
        1
      );

    let px = screenCoords.x;
    let py = screenCoords.y;

    const scale =
      this.settings.distanceFactor === undefined
        ? 1
        : labelScale(camera, point) * this.settings.distanceFactor;

    return { px, py, scale };
  };

  public attachUIToMesh = (root: HTMLElement, onCameraMoveOnly?: boolean) => {
    const camera = this._scene.activeCamera;

    if (!camera) {
      throw new Error("Camera not found");
    }

    const observableCallback = () => {
      const position = this.projectPointToScreenSpace();
      root.style.left = 0 + "px";
      root.style.top = 0 + "px";
      root.style.transform = `translate3d(${position.px}px,${position.py}px,0) scale(${position.scale})`;
    };

    window.addEventListener("resize", observableCallback);

    if (onCameraMoveOnly) {
      observableCallback();
      camera.onViewMatrixChangedObservable.add(observableCallback);
      return () => {
        camera.onViewMatrixChangedObservable.removeCallback(observableCallback);
        window.removeEventListener("resize", observableCallback);
      };
    } else {
      this._scene.onBeforeRenderObservable.add(observableCallback);
      return () => {
        this._scene.onBeforeRenderObservable.removeCallback(observableCallback);
        window.removeEventListener("resize", observableCallback);
      };
    }
  };

  public dispose = () => {
    super.dispose();
    this.htmlElement.remove();
    this.el.remove();
    this.observableCleanUp();
  };
}
