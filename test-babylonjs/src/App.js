import React from "react";
import {AdvancedDynamicTexture, Button, Control, Slider} from '@babylonjs/gui';
import {OBJFileLoader} from '@babylonjs/loaders'
import {SceneLoader, Engine, Tools, FreeCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";
import SceneComponent from "./SceneComponent"; // uses above component in same directory


import { ImmersificationFlyCamera } from "./babylon_scripts/_FlyCamera";

import "./App.css";

let box;
let _canvas;
let divFps;

const onSceneReady = (scene) => {
  // This creates and positions a free camera (non-mesh)
  divFps = document.getElementById("fps");
  const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();
  _canvas = canvas;

  // This attaches the camera to the canvas
  //const camController = new FreeCameraKeyboardRotateInput();
  const camController = new ImmersificationFlyCamera(_canvas);
  camera.attachControl(canvas, true);
  camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
  camera.inputs.add(camController);
  camController.camera = camera;

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'box' shape.
  box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

  // Move the box upward 1/2 its height
  box.position.y = 1;

  // Our built-in 'ground' shape.
  MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

  SceneLoader.ImportMeshAsync("semi_house", "https://assets.babylonjs.com/meshes/", "both_houses_scene.babylon");
  SceneLoader.ImportMeshAsync("fruitSnackTable", "http://localhost:8000/models/fruitSnackTable/", "3.obj", scene).then(function(meshes){
    console.log(meshes);
  }, function(error){
    console.log(error)
  }
  )
  
  // GUI
  var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
  camController.guiControls(advancedTexture);

  scene.getEngine().onResizeObservable.add(() =>{
  }
  )
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene) => {
  const engine = scene.getEngine();
  const deltaTimeInMillis = engine.getDeltaTime();
  divFps.innerHTML = engine.getFps().toFixed() + " fps";
  if (box !== undefined) {
    const rpm = 10;
    box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  }
};

export default () => (
  <div style={{margin:'auto'}}>
    <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas"/>
  </div>
);