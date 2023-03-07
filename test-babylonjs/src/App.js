import React from "react";
import {InputText, AdvancedDynamicTexture, Button, Control, Slider} from '@babylonjs/gui';
import '@babylonjs/loaders'
import {PointerEventTypes, GizmoManager, SceneLoader, Engine, Tools, FreeCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";
import SceneComponent from "./SceneComponent"; // uses above component in same directory

import { ImmersificationFlyCamera } from "./babylon_scripts/_FlyCamera";
import { MeshFactory} from "./babylon_scripts/_MeshFactory";

import "./App.css";

let box;
let _canvas;
let divFps;
let gizmoManager;
let meshFactory;
let pickedMesh;
let boxCreateCount = 0;
let xPosInput, yPosInput, zPosInput;

const onSceneReady = (scene) => {
  // This creates and positions a free camera (non-mesh)
  divFps = document.getElementById("fps");
  const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());
  
  const canvas = scene.getEngine().getRenderingCanvas();
  _canvas = canvas;
  
  gizmoManager = new GizmoManager(scene);  
  gizmoManager.positionGizmoEnabled = true;
  gizmoManager.attachableMeshes = [box, grnd, house];
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
  }

  // This attaches the camera to the canvas
  //const camController = new FreeCameraKeyboardRotateInput();
  const camController = new ImmersificationFlyCamera(_canvas);
  camera.attachControl(canvas, true);
  camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
  camera.inputs.add(camController);
  camController.camera = camera;
  
  meshFactory = new MeshFactory(scene, _canvas, gizmoManager);
  box = meshFactory.CreateBox(1, new Vector3(0.0, 3.0, 2.0), "newBox", true)
  meshFactory.CreateGround(6, new Vector3(0, 0, 0), "FlatGround", true);

  /*
  const xOffset = -4;
  for(let i = 0; i < 5; ++i){
      var tempBox = meshFactory.CreateBox(1, new Vector3(xOffset + i * 2, 0.5, -2), "new_box_" + i, true);
      tempBox.rotation.y += 10 * i;
  }*/

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'ground' shape.
  var grnd = MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
  grnd.isPickable = true;

  var house = SceneLoader.ImportMeshAsync("semi_house", "https://assets.babylonjs.com/meshes/", "both_houses_scene.babylon");
  house.isPickable = true;
  house.checkCollisions = true;
  //SceneLoader.ImportMeshAsync("fruitSnackTable", "http://localhost:8000/models/fruitSnackTable/", "3.obj", scene).then(function(meshes){
  //  console.log(meshes);
  //}, function(error){
  //  console.log(error)
  //}
  //)
  
  // GUI
  var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
  camController.guiControls(advancedTexture);

  scene.onPointerObservable.add((pointInfo)=>{
    if(pointInfo.type == PointerEventTypes.POINTERPICK && pointInfo.pickInfo.hit)
    {
      console.log("Picked");
      pickedMesh = pointInfo.pickInfo.pickedMesh;

      console.log("PickedMesh.position: ", pickedMesh.position)
      xPosInput.text = pickedMesh.position.x;
      yPosInput.text = pickedMesh.position.y;
      zPosInput.text = pickedMesh.position.z;
    }
  })

  xPosInput = new InputText();
  xPosInput.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
  xPosInput.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
  xPosInput.height = "35px";
  xPosInput.width = "70px";
  xPosInput.fontSize = 20;
  xPosInput.text = "0";
  xPosInput.color = "white";
  xPosInput.background = "gray";
  xPosInput.paddingBottom = "10px";
  xPosInput.left = "-90px";
  
  xPosInput.onBeforeKeyAddObservable.add((input) =>{
    let key = input.currentKey;
    if(isNaN(parseFloat(key)) && key !== "." && key !== "-"){
      input.addKey = false;
    }
  })
  xPosInput.onTextChangedObservable.add((input)=>{
    if(pickedMesh == null){
      return;
    }
    pickedMesh.position.x = xPosInput.text;
  });

  yPosInput = new InputText();
  yPosInput.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
  yPosInput.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
  yPosInput.height = "35px";
  yPosInput.width = "70px";
  yPosInput.fontSize = 20;
  yPosInput.text = "0";
  yPosInput.color = "white";
  yPosInput.background = "gray";
  yPosInput.paddingBottom = "10px";
  
  yPosInput.onBeforeKeyAddObservable.add((input) =>{
    let key = input.currentKey;
    if(isNaN(parseFloat(key)) && key !== "." && key !== "-"){
      input.addKey = false;
    }
  })
  yPosInput.onTextChangedObservable.add((input)=>{
    if(pickedMesh == null){
      return;
    }
    pickedMesh.position.y = yPosInput.text;
  });

  zPosInput = new InputText();
  zPosInput.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
  zPosInput.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
  zPosInput.height = "35px";
  zPosInput.width = "70px";
  zPosInput.fontSize = 20;
  zPosInput.text = "0";
  zPosInput.color = "white";
  zPosInput.background = "gray";
  zPosInput.paddingBottom = "10px";
  zPosInput.left = "90px";
  
  zPosInput.onBeforeKeyAddObservable.add((input) =>{
    let key = input.currentKey;
    if(isNaN(parseFloat(key)) && key !== "." && key !== "-"){
      input.addKey = false;
    }
  })
  zPosInput.onTextChangedObservable.add((input)=>{
    if(pickedMesh == null){
      return;
    }
    pickedMesh.position.z = zPosInput.text;
  });

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
  


  advancedTexture.addControl(xPosInput);
  advancedTexture.addControl(yPosInput);
  advancedTexture.addControl(zPosInput);
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