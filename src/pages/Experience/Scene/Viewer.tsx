import { Component, LegacyRef, useContext } from "react";
import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import SceneComponent, { SceneEventArgs } from "./Scene";
import { ArcRotateCamera, Engine, Nullable, Scene } from "@babylonjs/core";

import {
  IExperienceContextType,
  experienceContext,
} from "../../../context/Context";

interface IViewerState {}

interface IViewerProps {
  experienceContextProp: IExperienceContextType;
}

const ViewerFC = (props: { viewerRef: LegacyRef<Viewer> | undefined }) => {
  const experienceContextRef = useContext(experienceContext);
  return (
    <Viewer
      ref={props.viewerRef}
      experienceContextProp={experienceContextRef}
    />
  );
};

export class Viewer extends Component<IViewerProps, IViewerState> {
  private canvas:
    | Nullable<HTMLCanvasElement | WebGLRenderingContext>
    | undefined;
  private engine: Engine | undefined;
  public scene: Scene | undefined;
  private camera: ArcRotateCamera | undefined;

  constructor(props: IViewerProps | Readonly<IViewerProps>) {
    super(props);
    this.state = {};
  }

  onSceneMount = async (e: SceneEventArgs) => {
    const { canvas, scene, engine } = e;
    this.canvas = canvas;
    this.engine = engine;
    this.scene = scene;

    this.prepareCamera();
    this.prepareLighting();

    this.setupEnvironment();

    document.addEventListener("keydown", function (zEvent) {
      if (zEvent.ctrlKey && zEvent.shiftKey) {
        scene.debugLayer.isVisible()
          ? scene.debugLayer.hide()
          : scene.debugLayer.show();
      }
    });

    engine.runRenderLoop(() => {
      if (scene) {
        scene.render();
      }
    });
  };

  componentWillUnmount(): void {
    this.scene?.dispose();
    this.engine?.dispose();
  }

  prepareCamera = () => {
    this.scene!.createDefaultCamera(true);
    const camera = this.scene!.activeCamera as ArcRotateCamera;
    this.camera = camera;
    this.camera.fov = 1;
    this.camera.alpha = 1.57;
    this.camera.beta = 1.3;
    this.camera.radius = 10;
    this.camera.minZ = 0;
    this.camera.panningSensibility = 0;
    this.camera.inputs.remove(this.camera.inputs.attached.keyboard);
    this.camera.inputs.remove(this.camera.inputs.attached.mousewheel);
    camera.alpha += Math.PI;
    this.camera.attachControl();
  };

  prepareLighting = () => {
    this.scene!.createDefaultLight();
  };

  setupEnvironment = async () => {
    this.props.experienceContextProp?.setisLoading(false);
  };

  render() {
    return (
      <SceneComponent
        id="studio"
        onSceneMount={this.onSceneMount}
        engineOptions={{
          useHighPrecisionMatrix: true,
          premultipliedAlpha: false,
          antialias: true,
          preserveDrawingBuffer: true,
          stencil: true,
        }}
      />
    );
  }
}

export default ViewerFC;
