import {
  AbstractMesh,
  ArcRotateCamera,
  Color3,
  FramingBehavior,
  Mesh,
  MeshBuilder,
  Path3D,
  Scene,
  SceneLoader,
  Space,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";

export const loadSTLModels = async (
  rootUrl: string,
  scene: Scene,
  ...fileName: string[]
) => {
  console.log(fileName);

  const femurAssetContainer = await SceneLoader.LoadAssetContainerAsync(
    rootUrl,
    fileName[0],
    scene
  );

  const tibiaAssetContainer = await SceneLoader.LoadAssetContainerAsync(
    rootUrl,
    fileName[1],
    scene
  );

  const rootNode1 = femurAssetContainer.meshes[0];
  rootNode1.scalingDeterminant = 0.5;
  rootNode1.name = "femur";

  const femurMat = new StandardMaterial("femurMat", scene);

  femurMat.diffuseColor = Color3.FromHexString("#30c1a9");

  rootNode1.material = femurMat;

  const rootNode2 = tibiaAssetContainer.meshes[0];
  rootNode2.scalingDeterminant = 0.5;

  rootNode2.name = "tibia";

  const tibiaMat = new StandardMaterial("tibiaMat", scene);
  tibiaMat.diffuseColor = Color3.FromHexString("#956258");

  rootNode2.material = tibiaMat;

  femurAssetContainer.addAllToScene();
  tibiaAssetContainer.addAllToScene();

  return { femurAssetContainer, tibiaAssetContainer };
};

export const onSceneLoad = (camera: ArcRotateCamera) => {
  camera.useFramingBehavior = true;

  const framingBehaviour = camera.getBehaviorByName(
    "Framing"
  ) as FramingBehavior;

  framingBehaviour.framingTime = 0;
  framingBehaviour.elevationReturnTime = -1;
  framingBehaviour.mode = FramingBehavior.IgnoreBoundsSizeMode;

  camera.wheelDeltaPercentage = 0.01;
  camera.pinchDeltaPercentage = 0.01;
  camera.lowerRadiusLimit = 0;

  const worldExtends = camera.getScene().getWorldExtends((mesh) => {
    return mesh.isVisible && mesh.isEnabled();
  });

  framingBehaviour.zoomOnBoundingInfo(worldExtends!.min, worldExtends!.max);
  camera.alpha += Math.PI;
  camera.beta = 1.3;
  camera.target.y += 50;
};

export const drawLineFromPoints = (targetName: string, points: Vector3[]) => {
  const path = new Path3D(points);
  const curve = path.getCurve();

  const createLine = MeshBuilder.CreateLines(targetName, {
    points: curve,
    updatable: true,
  });

  createLine.renderingGroupId = 1;
  createLine.color = Color3.Random();

  return curve;
};

export const createPerpendicularPlane = (
  hipCenterMesh: AbstractMesh,
  femurCenterMesh: AbstractMesh
) => {
  const p = MeshBuilder.CreatePlane("mechanicalPerpedicular", {
    size: 100,
    sideOrientation: Mesh.DOUBLESIDE,
  });

  const dir = new Vector3(
    hipCenterMesh!.absolutePosition.x - femurCenterMesh!.absolutePosition.x,
    0,
    hipCenterMesh!.absolutePosition.z - femurCenterMesh!.absolutePosition.z
  );

  p.position = femurCenterMesh!.absolutePosition;
  p.lookAt(dir, undefined, undefined, undefined, Space.WORLD);

  return p;
};
