import React, { Component } from "react";
import "./Scene.css";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Nullable } from "@babylonjs/core/types";
import { WebGPUEngine } from "@babylonjs/core/Engines/webgpuEngine";
import { EngineOptions } from "@babylonjs/core/Engines/thinEngine";
import { GLTFFileLoader } from "@babylonjs/loaders/glTF";

export type SceneEventArgs = {
  engine: Engine;
  scene: Scene;
  canvas: Nullable<HTMLCanvasElement | WebGLRenderingContext>;
};

export type SceneProps = {
  engineOptions?: EngineOptions;
  adaptToDeviceRatio?: boolean;
  onSceneMount?: (args: SceneEventArgs) => void;
};

class SceneComponent extends Component<
  SceneProps & React.HTMLAttributes<HTMLCanvasElement>
> {
  private engine!: Engine;
  private canvas!: Nullable<HTMLCanvasElement | WebGLRenderingContext>;

  async initEngine(engineOptions: EngineOptions, adaptToDeviceRatio: boolean) {
    if (!Engine.isSupported()) {
      return;
    }

    GLTFFileLoader.IncrementalLoading = false;

    const useWebGPU = !!navigator.gpu;
    this.canvas = document.getElementById("studio") as HTMLCanvasElement;

    if (useWebGPU) {
      this.engine = new WebGPUEngine(this.canvas, {
        enableAllFeatures: true,
        setMaximumLimits: true,
        useHighPrecisionMatrix: true,
        antialias: true,
      });
      await (this.engine as WebGPUEngine).initAsync();
    } else {
      this.engine = new Engine(
        this.canvas,
        true,
        engineOptions,
        adaptToDeviceRatio
      );
    }

    return this.engine;
  }

  async componentDidMount() {
    const { engineOptions, adaptToDeviceRatio, onSceneMount } = this.props;

    this.engine = (await this.initEngine(
      engineOptions!,
      adaptToDeviceRatio!
    )) as Engine;

    const scene = new Scene(this.engine);

    if (typeof onSceneMount === "function") {
      onSceneMount({
        scene,
        engine: this.engine,
        canvas: this.canvas,
      });
    }

    window.addEventListener("resize", this.onResizeWindow);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResizeWindow);
  }

  onCanvasLoaded = (c: HTMLCanvasElement) => {
    if (c !== null) {
      this.canvas = c;
    }
  };

  onResizeWindow = () => {
    if (this.engine) {
      this.engine.resize();
      this.forceUpdate();
    }
  };

  render() {
    return <canvas id={this.props.id} ref={this.onCanvasLoaded} />;
  }
}

export default SceneComponent;
