import React from "react";
import * as BABYLON from 'babylonjs';
import {FreeCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";
import SceneComponent from "./SceneComponent"; // uses above component in same directory

import "./App.css";

let box;
let _canvas;

const FreeCameraKeyboardRotateInput = function () {
  this._keys = [];
  this.trackedKeys = [87, 83, 65, 68]; //W, S, A, D
  this.sensibility = 0.1;
};

FreeCameraKeyboardRotateInput.prototype.getClassName = function () {
return "FreeCameraKeyboardRotateInput";
};
FreeCameraKeyboardRotateInput.prototype.getSimpleName = function () {
return "keyboardRotate";
};

FreeCameraKeyboardRotateInput.prototype.attachControl = function (noPreventDefault) {
  const _this = this;
  const engine = this.camera.getEngine();
  const element = engine.getInputElement();
  
  if (!this._onKeyDown) 
  {
    element.tabIndex = 1;
    this._onKeyDown = function (evt) 
    {
      //If event keycode is a tracked keycode.
      if (_this.trackedKeys.indexOf(evt.keyCode) !== -1) 
      {
        //Get index in _keysArray.
        const index = _this._keys.indexOf(evt.keyCode);
        if (index === -1) //If not in array
        {
          _this._keys.push(evt.keyCode); //Add to array.
        }
        if (!noPreventDefault) //???
        {
          evt.preventDefault();
        }
      }
    };

    this._onKeyUp = function (evt) 
    {
      //If keyup event and event keycode is in tracked keys,
      //and keycode is in _keys, remove from _keys.
      if (_this.trackedKeys.indexOf(evt.keyCode) !== -1 ) 
      {
        const index = _this._keys.indexOf(evt.keyCode);
        if (index >= 0) 
        {
          _this._keys.splice(index, 1);
        }
        if (!noPreventDefault) 
        {
          evt.preventDefault();
        }
      }
    };

    element.addEventListener("keydown", this._onKeyDown, false);
    element.addEventListener("keyup", this._onKeyUp, false);
    BABYLON.Tools.RegisterTopRootEvents(_canvas, [{ name: "blur", handler: this._onLostFocus }]);
  }
};

FreeCameraKeyboardRotateInput.prototype.detachControl = function () {
const engine = this.camera.getEngine();
const element = engine.getInputElement();
if (this._onKeyDown) {
  element.removeEventListener("keydown", this._onKeyDown);
  element.removeEventListener("keyup", this._onKeyUp);
  BABYLON.Tools.UnregisterTopRootEvents(_canvas, [{ name: "blur", handler: this._onLostFocus }]);
  this._keys = [];
  this._onKeyDown = null;
  this._onKeyUp = null;
}
};


FreeCameraKeyboardRotateInput.prototype.checkInputs = function () {
  if (this._onKeyDown) 
  {
    const camera = this.camera;
    // Keyboard
    for (let index = 0; index < this._keys.length; index++) 
    {
      const keyCode = this._keys[index];
      var dir;
      switch(keyCode){
        case 87://W
          dir = camera.getDirection(new BABYLON.Vector3(0,0,1));
        break;
        case 83://S
          dir = camera.getDirection(new BABYLON.Vector3(0,0,-1));
        break;
        case 65://A
          dir = camera.getDirection(new BABYLON.Vector3(-1, 0, 0));
        break;
        case 68://D
          dir = camera.getDirection(new BABYLON.Vector3(1,0,0));
        break;
      }
      console.log("Direction: ", dir);
      camera.position.addInPlace(dir.scale(this.sensibility));
    }
  }
};

const onSceneReady = (scene) => {
  // This creates and positions a free camera (non-mesh)
  const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();
  _canvas = canvas;

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);
  camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
  camera.inputs.add(new FreeCameraKeyboardRotateInput());

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

  scene.getEngine().onResizeObservable.add(() =>{
  }
  )
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
  <div style={{margin:'auto'}}>
    <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas"/>
  </div>
);