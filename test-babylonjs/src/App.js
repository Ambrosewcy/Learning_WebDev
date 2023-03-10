import React from "react";
import {InputText, AdvancedDynamicTexture, Button, Control, Slider} from '@babylonjs/gui';
//import 'babylonjs-inspector'
import '@babylonjs/loaders'
import {Matrix, PointerEventTypes, GizmoManager, SceneLoader, Engine, Tools, FreeCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";
import SceneComponent from "./SceneComponent"; // uses above component in same directory

import { ImmersificationFlyCamera } from "./babylon_scripts/_FlyCamera";
import { MeshFactory} from "./babylon_scripts/_MeshFactory";
import {GUIManager} from "./babylon_scripts/_GuiManager";

import "./App.css";

let box;
let _canvas;
let divFps;
let gizmoManager;
let meshFactory;
let pickedMesh;
let boxCreateCount = 0;
let xPosInput, yPosInput, zPosInput;

let guiManager;

const onSceneReady = async (scene) => {
  // This creates and positions a free camera (non-mesh)
  divFps = document.getElementById("fps");
  const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());
  
  const canvas = scene.getEngine().getRenderingCanvas();
  _canvas = canvas;
  
  gizmoManager = new GizmoManager(scene);
  gizmoManager.positionGizmoEnabled = true;
  gizmoManager.attachableMeshes = [];

  // This attaches the camera to the canvas
  const camController = new ImmersificationFlyCamera(_canvas);
  camera.attachControl(canvas, true);
  camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
  camera.inputs.add(camController);
  camController.camera = camera;
  
  meshFactory = new MeshFactory(scene, _canvas, gizmoManager);
  box = meshFactory.CreateBox(1, new Vector3(0.0, 3.0, 2.0), "newBox", true)
  meshFactory.CreateGround(6, new Vector3(0, 0, 0), "FlatGround", true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;
  //scene.debugLayer.show({embedMode: true,})

  var burg = SceneLoader.ImportMeshAsync("", "", "3.obj", scene).then(function(meshes){
    console.log(meshes);
    burg.isPickable = true;
  }, function(error){
    console.log(error)
  }
  )
  gizmoManager.attachableMeshes.push(burg);

  burg.isPickable = true;

  // GUI
  var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
  camController.guiControls(advancedTexture);

  // Toggle gizmos with keyboard buttons
  document.onkeydown = (e)=>{
    if(e.key == 'w'){
        gizmoManager.positionGizmoEnabled = !gizmoManager.positionGizmoEnabled
        gizmoManager.rotationGizmoEnabled = false;
        gizmoManager.scaleGizmoEnabled = false;
        gizmoManager.boundingBoxGizmoEnabled = false;
    }
    if(e.key == 'e'){
        gizmoManager.rotationGizmoEnabled = !gizmoManager.rotationGizmoEnabled
        gizmoManager.positionGizmoEnabled = false
        gizmoManager.scaleGizmoEnabled = false;
        gizmoManager.boundingBoxGizmoEnabled = false;
    }
    if(e.key == 'r'){
        gizmoManager.scaleGizmoEnabled = !gizmoManager.scaleGizmoEnabled
        gizmoManager.positionGizmoEnabled = false
        gizmoManager.rotationGizmoEnabled = false;
        gizmoManager.boundingBoxGizmoEnabled = false;
    }
    if(e.key == 'q'){
        gizmoManager.boundingBoxGizmoEnabled = !gizmoManager.boundingBoxGizmoEnabled
        gizmoManager.positionGizmoEnabled = false
        gizmoManager.rotationGizmoEnabled = false;
        gizmoManager.scaleGizmoEnabled = false;
    }
    if(e.key == 'h'){
      guiManager = new GUIManager();
      guiManager.InitializeGUI();

      scene.onPointerObservable.add((pointInfo)=>{
        if(pointInfo.type == PointerEventTypes.POINTERPICK && pointInfo.pickInfo.hit)
        {
          pickedMesh = pointInfo.pickInfo.pickedMesh;
          guiManager.AssignPickedObject(pickedMesh);
        }
      })

      if(e.key == 'j'){
        guiManager.AssignPickedObject(pickedMesh);
      }
      scene.onBeforeRenderObservable.add(guiManager.UpdateTransformValues);
  }
  }

  scene.onPointerDown = function castRay(){
    var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, Matrix.Identity(), camera);	

    var hit = scene.pickWithRay(ray);

    if (hit.pickedMesh){
      console.log("Hit a Mesh called: ", hit.pickedMesh.name);
    }
}   

  const createBoxButton = new Button("CreateBox", "Create Box");
  createBoxButton.text = "Create Box";
  createBoxButton.width = "50px";
  createBoxButton.height = "50px";
  createBoxButton.color = "Black";
  createBoxButton.background = "Purple";
  createBoxButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
  createBoxButton.top = "-50px";
  createBoxButton.onPointerUpObservable.add(function(){
    if(boxCreateCount % 2 == 0){
      meshFactory.CreateBox(1, new Vector3(boxCreateCount * 1.25, 0.5, -2), "new_box_" + boxCreateCount, true);
    }
    else{
      meshFactory.CreateBox(1, new Vector3(boxCreateCount * -1.25, 0.5, -2), "new_box_" + boxCreateCount, true);
    }
    boxCreateCount += 1;
  })

  advancedTexture.addControl(createBoxButton);

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
    box.rotation.x = box.rotation.y;
  }
};

export default () => (
  <div style={{margin:'auto'}}>
    <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas"/>
  </div>
);