import React from "react";
import * as Baby from "@babylonjs/core"
import * as GUI from "@babylonjs/gui"
//import {FreeCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";
//import {AdvancedDynamicTexture} from "@babylonjs/gui";
import SceneComponent from "./SceneComponent"; // uses above component in same directory
// import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
import "./App.css";

let box;



const onSceneReady = async (scene) => {
  // This creates and positions a free camera (non-mesh)
  const camera = new Baby.FreeCamera("camera1", new Baby.Vector3(0, 5, -10), scene);

  camera.setTarget(Baby.Vector3.Zero());
  const canvas = scene.getEngine().getRenderingCanvas();

  camera.attachControl(canvas, true);
  const light = new Baby.HemisphericLight("light", new Baby.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
    //const response = await fetch("sampleGui.json");
    //advancedTexture.parseSerializedObject(response.json(), false);
    //GUI.AdvancedDynamicTexture.ParseSerializedObject(response.json(), false);

    document.onkeydown = (e)=>{
        if(e.key == 'q'){
            advancedTexture.parseFromSnippetAsync("#PWXSII", false);
        }
      }
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene) => {
  if (box !== undefined) {
    const deltaTimeInMillis = scene.getEngine().getDeltaTime();

    const rpm = 10;
    box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  }
};

export default () => (
  <div>
    <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />
  </div>
);