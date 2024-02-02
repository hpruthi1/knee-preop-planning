import { Component, LegacyRef, useContext } from "react";
import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import SceneComponent, { SceneEventArgs } from "./Scene";
import {
  ArcRotateCamera,
  BackgroundMaterial,
  Engine,
  GizmoManager,
  IPointerEvent,
  Mesh,
  MeshBuilder,
  MirrorTexture,
  Nullable,
  Plane,
  Scene,
  Texture,
  Tools,
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

    this.engine.displayLoadingUI();

    this.prepareCamera();
    this.prepareLighting();

    this.setupEnvironment();

    // document.addEventListener("keydown", function (zEvent) {
    //   if (zEvent.ctrlKey && zEvent.shiftKey) {
    //     scene.debugLayer.isVisible()
    //       ? scene.debugLayer.hide()
    //       : scene.debugLayer.show();
    //   }
    // });

    scene.whenReadyAsync().then(() => {
      engine.hideLoadingUI();
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
      this.gizmoManager = new GizmoManager(
        this.scene!,
        undefined,
        utilityLayer
      );

      this.gizmoManager.positionGizmoEnabled = true;
      this.gizmoManager.usePointerToAttachGizmos = false;

      const ground = MeshBuilder.CreateGround(
        "ground1",
        { width: 2000, height: 2000 },
        this.scene
      );
      ground.receiveShadows = true;

      const backgroundMaterial = new BackgroundMaterial(
        "backgroundMaterial",
        this.scene
      );
      backgroundMaterial.diffuseTexture = new Texture(
        "https://assets.babylonjs.com/environments/backgroundGround.png",
        this.scene
      );
      backgroundMaterial.diffuseTexture.hasAlpha = true;
      backgroundMaterial.opacityFresnel = false;
      backgroundMaterial.shadowLevel = 0.4;

      ground.material = backgroundMaterial;

      const mirror = new MirrorTexture("mirror", 512, this.scene);
      mirror.mirrorPlane = new Plane(0, -1, 0, 0);
      mirror.renderList!.push(
        femurAssetContainer.meshes[0],
        tibiaAssetContainer.meshes[0]
      );
      backgroundMaterial.reflectionTexture = mirror;
      backgroundMaterial.reflectionFresnel = true;
      backgroundMaterial.reflectionStandardFresnelWeight = 0.8;

      this.props.experienceContextProp?.setisLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  stopLandmarkCreation = () => {
    this.scene!.onPointerDown = () => {};
  };

  updateVarusPlane(value: number) {
    const plane = this.scene?.getMeshByName("varusPlane");
    if (!plane) return;

    plane.rotation.x -= Tools.ToRadians(value);
    plane.rotation.y += Tools.ToRadians(value);
    plane.rotation.z += Tools.ToRadians(value);
  }

  updateFlexionPlane(value: number) {
    const plane = this.scene?.getMeshByName("flexionPlane");
    if (!plane) return;

    plane.rotation.x += Tools.ToRadians(value);
  }

  togglePlaneVisibility = () => {
    const perpendicularplane = this.scene?.getMeshByName(
      "mechanicalPerpedicular"
    );
    const varusplane = this.scene?.getMeshByName("varusPlane");
    const flexionplane = this.scene?.getMeshByName("flexionPlane");
    if (!perpendicularplane || !varusplane || !flexionplane) return;

    perpendicularplane?.visibility === 0
      ? (perpendicularplane.visibility = 1)
      : (perpendicularplane.visibility = 0);

    varusplane?.visibility === 0
      ? (varusplane.visibility = 1)
      : (varusplane.visibility = 0);

    flexionplane?.visibility === 0
      ? (flexionplane.visibility = 1)
      : (flexionplane.visibility = 0);
  };

  updateLines = () => {};

  createLines = () => {
    this.props.experienceContextProp.setlinesCreated(true);
    this.gizmoManager?.attachToMesh(null);
    const femurCenterMesh = this.scene?.getMeshByName("Femur Center");
    const hipCenterMesh = this.scene?.getMeshByName("Hip Center");

    Utils.drawLineFromPoints("mechanicalAxis", [
      femurCenterMesh!.position,
      hipCenterMesh!.position,
    ]);

    const femurProximalMesh = this.scene?.getMeshByName("Femur Proximal Canal");
    const femurDistalMesh = this.scene?.getMeshByName("Femur Distal Canal");

    Utils.drawLineFromPoints("anatomicalAxis", [
      femurProximalMesh!.position,
      femurDistalMesh!.position,
    ]);

    const medialEpiMesh = this.scene?.getMeshByName("Medial Epicondyle");
    const lateralEpiMesh = this.scene?.getMeshByName("Lateral Epicondyle");

    Utils.drawLineFromPoints("teaAxis", [
      medialEpiMesh!.position,
      lateralEpiMesh!.position,
    ]);

    const postMedialMesh = this.scene?.getMeshByName("Posterior Medial Pt");
    const postLateralMesh = this.scene?.getMeshByName("Posterior Lateral Pt");

    Utils.drawLineFromPoints("pcAxis", [
      postMedialMesh!.position,
      postLateralMesh!.position,
    ]);

    const plane = Utils.createPerpendicularPlane(
      hipCenterMesh!,
      femurCenterMesh!
    );

    Utils.projectTeaAxisonPlane(
      medialEpiMesh!.position,
      lateralEpiMesh!.position,
      plane
    );
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

        sphere.isPickable = false;

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
