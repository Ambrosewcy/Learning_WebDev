import {Vector3, Tools} from "@babylonjs/core"
import {Control, Slider, button} from "@babylonjs/gui"

export const ImmersificationFlyCamera = function (inputCanvas) {
  this._keys = [];
  this.trackedKeys = [87, 83, 65, 68, 32]; //W, S, A, D, Spacebar
  this.moveSpeed = 5.0;
  this.camera = null;
  this._canvas = inputCanvas;
  this._onKeyDown = null;
  this._onKeyUp = null;
};

  //Standard Camera Control functions for babylon
ImmersificationFlyCamera.prototype.getClassName = function(){
    return "Custom_Immersification_Fly_Camera";
}

ImmersificationFlyCamera.prototype.getSimpleName = function (){
    return "Cus_Fly_Camera";
}

ImmersificationFlyCamera.prototype.attachControl = function (noPreventDefault){
    const _this = this;
    const engine = this.camera.getEngine();
    const element = engine.getInputElement();
    const dt = this.camera.getScene().deltaTime;

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
    }
    };

    element.addEventListener("keydown", this._onKeyDown, false);
    element.addEventListener("keyup", this._onKeyUp, false);
    Tools.RegisterTopRootEvents(this._canvas, [{ name: "blur", handler: this._onLostFocus }]);
}

  ImmersificationFlyCamera.prototype.checkInputs = function(){
    if(this._onKeyDown)
    {
        const camera = this.camera;
        const dt = this.camera.getScene().deltaTime / 1000;
        for (let index = 0; index < this._keys.length; index++) 
        {
        const keyCode = this._keys[index];
        var dir = new Vector3();
        switch(keyCode){
            case 87://W
            dir = camera.getDirection(new Vector3(0,0,1));
            break;
            case 83://S
            dir = camera.getDirection(new Vector3(0,0,-1));
            break;
            case 65://A
            dir = camera.getDirection(new Vector3(-1, 0, 0));
            break;
            case 68://D
            dir = camera.getDirection(new Vector3(1,0,0));
            break;
            case 32: //Spacebar
            dir = camera.getDirection(new Vector3(0, 1, 0));
            break;
        }
        camera.position.addInPlace(dir.scale(this.moveSpeed * dt));
        }
    }
}

ImmersificationFlyCamera.prototype.detachControl = function (){
    const engine = this.camera.getEngine();
    const element = engine.getInputElement();
    if (this._onKeyDown) {
    element.removeEventListener("keydown", this._onKeyDown);
    element.removeEventListener("keyup", this._onKeyUp);
    Tools.UnregisterTopRootEvents(this._canvas, [{ name: "blur", handler: this._onLostFocus }]);
    this._keys = [];
    this._onKeyDown = null;
    this._onKeyUp = null;
    }
}

ImmersificationFlyCamera.prototype.guiControls = function(advancedTexture){
    const _this = this;
    const camera = _this.camera;
    var moveSenseSlider = new Slider("move_speed_slider");
    var lookSenseSlider = new Slider("look_sensibility_slider");

    moveSenseSlider.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    moveSenseSlider.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

    moveSenseSlider.width = "150px";
    moveSenseSlider.height = "25px";
    moveSenseSlider.left = 20;
    moveSenseSlider.top = 20;
    moveSenseSlider.background = "white";
    moveSenseSlider.color = "purple";

    moveSenseSlider.minimum = 1.0;
    moveSenseSlider.maximum = 10.0;
    moveSenseSlider.value = this.moveSpeed;

    moveSenseSlider.onValueChangedObservable.add(function(value){
        _this.moveSpeed = value;
    })

    lookSenseSlider.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    lookSenseSlider.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

    lookSenseSlider.width = "150px";
    lookSenseSlider.height = "25px";
    lookSenseSlider.left = 20;
    lookSenseSlider.top = 50;
    lookSenseSlider.background = "white";
    lookSenseSlider.color = "purple";

    lookSenseSlider.minimum = 500.0;
    lookSenseSlider.maximum = 8000.0;
    lookSenseSlider.value = 3000.0;

    lookSenseSlider.onValueChangedObservable.add(function(value){
        camera.angularSensibility = 8000.0 - value + 200;
    })

    advancedTexture.addControl(moveSenseSlider);
    advancedTexture.addControl(lookSenseSlider);
  }