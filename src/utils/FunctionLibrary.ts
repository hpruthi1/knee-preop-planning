import {
  ArcRotateCamera,
  Color3,
  FramingBehavior,
  Scene,
  SceneLoader,
  StandardMaterial,
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
