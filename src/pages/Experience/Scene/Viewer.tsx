import { Component, LegacyRef, useContext } from "react";
import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import SceneComponent, { SceneEventArgs } from "./Scene";
import {
  ArcRotateCamera,
  Color3,
  Engine,
  GizmoManager,
  IPointerEvent,
  Mesh,
  MeshBuilder,
  Nullable,
  Path3D,
  Scene,
  UtilityLayerRenderer,
} from "@babylonjs/core";

import {
  IExperienceContextType,
  experienceContext,
} from "../../../context/Context";
import { STLFileLoader } from "@babylonjs/loaders";

import * as Utils from "../../../utils/FunctionLibrary";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { Dispatch, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { ILandmark, toggleComplete } from "../../../store/slices/LandmarkSlice";
import { store } from "../../../store/Store";

interface IViewerState {}

interface IViewerProps {
  experienceContextProp: IExperienceContextType;
  landmarks: ILandmark[];
  dispatch: ThunkDispatch<
    {
      landmarks: ILandmark[];
    },
    undefined,
    UnknownAction
  > &
    Dispatch<UnknownAction>;
}

const ViewerFC = (props: { viewerRef: LegacyRef<Viewer> | undefined }) => {
  const experienceContextRef = useContext(experienceContext);
  const landmarks = useAppSelector((state) => state.landmarks);
  const dispatch = useAppDispatch();

  return (
    <Viewer
      ref={props.viewerRef}
      experienceContextProp={experienceContextRef}
      dispatch={dispatch}
      landmarks={landmarks}
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

  private gizmoManager: GizmoManager | undefined;

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
    this.camera.attachControl(this.canvas, true);
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

      const utilityLayer = new UtilityLayerRenderer(this.scene!, true);
      utilityLayer.utilityLayerScene.autoClearDepthAndStencil = false;
      this.gizmoManager = new GizmoManager(this.scene!, 4, utilityLayer);

      this.gizmoManager.positionGizmoEnabled = true;
      this.gizmoManager.usePointerToAttachGizmos = false;

      this.props.experienceContextProp?.setisLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  stopLandmarkCreation = () => {
    this.scene!.onPointerDown = () => {};
  };

  updateLines = () => {
    const landmarks = store.getState().landmarks;
    const placed = landmarks.filter((landmark) => landmark.isPlaced);
    const femurCenter = placed.find((point) =>
      point.name.includes("Femur Center")
    );

    const hipCenter = placed.find((point) => point.name.includes("Hip Center"));

    if (!femurCenter || !hipCenter) return;

    const femurCenterMesh = this.scene?.getMeshByName(femurCenter.name);
    const hipCenterMesh = this.scene?.getMeshByName(hipCenter.name);

    console.log(femurCenterMesh, hipCenterMesh);

    // line between
    const points = [
      femurCenterMesh!.absolutePosition,
      hipCenterMesh!.absolutePosition,
    ]; // array of Vector3
    const path = new Path3D(points);
    const curve = path.getCurve();
    // visualisation
    const line = MeshBuilder.CreateLines("li1", {
      points: curve,
      updatable: true,
    });

    line.renderingGroupId = 1;
    line.color = Color3.Red();
  };

  startLandmarkCreation = (pointName: string) => {
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
          diameter: 5,
        });

        sphere.position = position;

        sphere.lookAt(sphere.position.add(normal));

        this.gizmoManager?.attachToMesh(sphere);

        this.props.dispatch(
          toggleComplete({ name: pointName, isPlaced: true })
        );

        this.stopLandmarkCreation();
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
