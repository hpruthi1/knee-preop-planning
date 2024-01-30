import {
  ArcRotateCamera,
  FramingBehavior,
  Scene,
  SceneLoader,
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

  const rootNode2 = tibiaAssetContainer.meshes[0];
  rootNode2.scalingDeterminant = 0.5;

  rootNode2.name = "tibia";

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
  camera.beta = 0;
};
