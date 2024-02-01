import { Component, LegacyRef, useContext } from "react";
import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import SceneComponent, { SceneEventArgs } from "./Scene";
import {
  ArcRotateCamera,
  Engine,
  IPointerEvent,
  Mesh,
  MeshBuilder,
  Nullable,
  Quaternion,
  Scene,
  Vector3,
} from "@babylonjs/core";

import {
  IExperienceContextType,
  experienceContext,
} from "../../../context/Context";
import { STLFileLoader } from "@babylonjs/loaders";

import * as Utils from "../../../utils/FunctionLibrary";

interface IViewerState {}

interface IViewerProps {
  experienceContextProp: IExperienceContextType;
}

const ViewerFC = (props: { viewerRef: LegacyRef<Viewer> | undefined }) => {
  const experienceContextRef = useContext(experienceContext);
  // console.log(experienceContextRef.currentLandmark);

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

  constructor(props: IViewerProps) {
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

    scene.whenReadyAsync().then(() => {
      engine.runRenderLoop(() => {
        scene.render();
      });
    });
  };

  componentWillUnmount(): void {
    this.scene?.dispose();
    this.engine?.dispose();
  }

  prepareCamera = () => {
    this.scene!.createDefaultCamera(true);
    this.camera = this.scene!.activeCamera as ArcRotateCamera;
    this.camera.attachControl();
    this.camera.maxZ = 2000;
  };

  prepareLighting = () => {
    this.scene!.createDefaultLight();
  };

  setupEnvironment = async () => {
    STLFileLoader.DO_NOT_ALTER_FILE_COORDINATES = false;
    const rootUrl = "/models/";

    try {
      const { femurAssetContainer, tibiaAssetContainer } =
        await Utils.loadSTLModels(
          rootUrl,
          this.scene!,
          "femur.stl",
          "tibia.stl"
        );

      console.log(femurAssetContainer, tibiaAssetContainer);

      Utils.onSceneLoad(this.camera!);

      this.props.experienceContextProp?.setisLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  startLandmarkCreation = (pointName: string) => {
    console.log(this.props.experienceContextProp.currentLandmark);

    const onPointerDown = (evt: IPointerEvent) => {
      if (evt.button !== 0) {
        return;
      }

      if (!this.scene) return;
      if (!pointName) return;

      // check if we are under a mesh
      const pickInfo = this.scene.pick(
        this.scene.pointerX,
        this.scene.pointerY,
        (mesh) => {
          return mesh === this.scene?.getMeshByName("femur");
        }
      );

      if (pickInfo.hit) {
        const position = pickInfo.pickedPoint!;
        const normal = pickInfo.getNormal(true)!;

        const sphere = MeshBuilder.CreateSphere(pointName, {
          sideOrientation: Mesh.DOUBLESIDE,
        });

        sphere.position = position;

        const axis2 = Vector3.Up();
        const axis3 = Vector3.Up();
        const start = this.camera!.position!;

        Vector3.CrossToRef(start, normal, axis2);
        Vector3.CrossToRef(axis2, normal, axis3);
        const tmpVec = Vector3.RotationFromAxis(axis3.negate(), normal, axis2);
        const quat = Quaternion.RotationYawPitchRoll(
          tmpVec.y,
          tmpVec.x,
          tmpVec.z
        );
        sphere.rotation = quat.toEulerAngles();

        this.props.experienceContextProp.setcurrentLandmark((value) => {
          return { ...value, isPlaced: true };
        });
      }
    };

    this.scene!.onPointerDown = (evt) => {
      onPointerDown(evt);
    };
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
        }}
      />
    );
  }
}

export default ViewerFC;
