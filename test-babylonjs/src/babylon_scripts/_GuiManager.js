import {Mesh, PointerEventTypes, GizmoManager, SceneLoader, Engine, Tools, Vector3} from "@babylonjs/core";
import { Math_Utilities } from "../utils/Math";
import {AdvancedDynamicTexture} from '@babylonjs/gui';

//Properties x y and z are intended as references to input fields in babylon GUI
class Vector3UIControl{
    constructor(){
        this.x = null;
        this.y = null;
        this.z = null;
    }
}

class TransformInspector{
    constructor(){
        this.UIContainer = undefined;
        this.position = new Vector3UIControl();
        this.rotation = new Vector3UIControl();
        this.scale = new Vector3UIControl();
    }
}

var _sGuiManager = undefined;
export class GUIManager{
    constructor(){
        this.pickedObject = null;
        this.transformUI = new TransformInspector();
        this.babylonAdvanceTexture = AdvancedDynamicTexture.CreateFullscreenUI("InspectorDynamicTexture");
    }

    //Only allow input if it is a numerical value, or character used for numbers.
    static BindInput_OnlyAcceptNumbers(input){
        let key = input.currentKey;
        if(isNaN(parseFloat(key)) && key !== "." && key !== "-"){
            input.addKey = false;
        }
        else{
            input.addKey = true;
        }
    }

    UpdatePickedObjectPosition(input){
        if(_sGuiManager.pickedObject)
        {
            let posUI = _sGuiManager.transformUI.position;
            switch(input._managedInput){
                case 'x': _sGuiManager.pickedObject.position.x = posUI.x.text; break;
                case 'y': _sGuiManager.pickedObject.position.y = posUI.y.text; break;
                case 'z': _sGuiManager.pickedObject.position.z = posUI.z.text; break;
                default: console.warn("UpdatePickedObjectPosition Expected x,y, or z. Received: " + input._managedInput);
            }
        }
    }

    UpdatePickedObjectRotation(input){
        if(_sGuiManager.pickedObject)
        {
            let rotUI = _sGuiManager.transformUI.rotation;
            switch(input._managedInput){
                case 'x': _sGuiManager.pickedObject.rotation.x = Math_Utilities.degrees_to_radians(rotUI.x.text); break;
                case 'y': _sGuiManager.pickedObject.rotation.y = Math_Utilities.degrees_to_radians(rotUI.y.text); break;
                case 'z': _sGuiManager.pickedObject.rotation.z = Math_Utilities.degrees_to_radians(rotUI.z.text); break;
                default: console.warn("UpdatePickedObjectRotation Expected x,y, or z. Received: " + input._managedInput);
            }
        }
    }

    UpdatePickedObjectScale(input){
        if(_sGuiManager.pickedObject)
        {
            let scaleUI = _sGuiManager.transformUI.scale;
            switch(input._managedInput){
                case 'x': _sGuiManager.pickedObject.scaling.x = scaleUI.x.text; break;
                case 'y': _sGuiManager.pickedObject.scaling.y = scaleUI.y.text; break;
                case 'z': _sGuiManager.pickedObject.scaling.z = scaleUI.z.text; break;
                default: console.warn("UpdatePickedObjectScale Expected x, y, or z. Received: " + input._managedInput);
            }
        }
    }


    #InitTransformUI(){
        let advTexture = this.babylonAdvanceTexture;

        //Initializing Position UI.
        let posUI = this.transformUI.position;
        posUI.x = advTexture.getControlByName("transform_position_x");
        posUI.y = advTexture.getControlByName("transform_position_y");
        posUI.z = advTexture.getControlByName("transform_position_z");
        
        posUI.x._managedInput = 'x';
        posUI.y._managedInput = 'y';
        posUI.z._managedInput = 'z';
        
        posUI.x.onBeforeKeyAddObservable.add(GUIManager.BindInput_OnlyAcceptNumbers);
        posUI.y.onBeforeKeyAddObservable.add(GUIManager.BindInput_OnlyAcceptNumbers);
        posUI.z.onBeforeKeyAddObservable.add(GUIManager.BindInput_OnlyAcceptNumbers);
        
        posUI.x.onTextChangedObservable.add(this.UpdatePickedObjectPosition);
        posUI.y.onTextChangedObservable.add(this.UpdatePickedObjectPosition);
        posUI.z.onTextChangedObservable.add(this.UpdatePickedObjectPosition);

        //Initializing Rotation UI.
        let rotUI = this.transformUI.rotation;
        rotUI.x = advTexture.getControlByName("transform_rotation_x");
        rotUI.y = advTexture.getControlByName("transform_rotation_y");
        rotUI.z = advTexture.getControlByName("transform_rotation_z");

        rotUI.x._managedInput = 'x';
        rotUI.y._managedInput = 'y';
        rotUI.z._managedInput = 'z';

        rotUI.x.onBeforeKeyAddObservable.add(GUIManager.BindInput_OnlyAcceptNumbers);
        rotUI.y.onBeforeKeyAddObservable.add(GUIManager.BindInput_OnlyAcceptNumbers);
        rotUI.z.onBeforeKeyAddObservable.add(GUIManager.BindInput_OnlyAcceptNumbers);
        
        rotUI.x.onTextChangedObservable.add(this.UpdatePickedObjectRotation);
        rotUI.y.onTextChangedObservable.add(this.UpdatePickedObjectRotation);
        rotUI.z.onTextChangedObservable.add(this.UpdatePickedObjectRotation);
        
        //Initializing Scale UI.
        let scaleUI = this.transformUI.scale;
        scaleUI.x = advTexture.getControlByName("transform_scale_x");
        scaleUI.y = advTexture.getControlByName("transform_scale_y");
        scaleUI.z = advTexture.getControlByName("transform_scale_z");

        scaleUI.x._managedInput = 'x';
        scaleUI.y._managedInput = 'y';
        scaleUI.z._managedInput = 'z';

        scaleUI.x.onBeforeKeyAddObservable.add(GUIManager.BindInput_OnlyAcceptNumbers);
        scaleUI.y.onBeforeKeyAddObservable.add(GUIManager.BindInput_OnlyAcceptNumbers);
        scaleUI.z.onBeforeKeyAddObservable.add(GUIManager.BindInput_OnlyAcceptNumbers);
        
        scaleUI.x.onTextChangedObservable.add(this.UpdatePickedObjectScale);
        scaleUI.y.onTextChangedObservable.add(this.UpdatePickedObjectScale);
        scaleUI.z.onTextChangedObservable.add(this.UpdatePickedObjectScale);
    }

    async InitializeGUI(){
        //Load UI canvas from file/web
        _sGuiManager = this;
        let advTexture = this.babylonAdvanceTexture;
        await advTexture.parseFromURLAsync("inspectorUI.json", false);

        this.#InitTransformUI();
        //
    }

    UpdateTransformValues(){
        if(!_sGuiManager.pickedObject)
            return;
            
        let picked = _sGuiManager.pickedObject;
        let posUI = _sGuiManager.transformUI.position;
        let rotUI = _sGuiManager.transformUI.rotation;
        let scaleUI = _sGuiManager.transformUI.scale;

        posUI.x.text = parseFloat(picked.position.x).toFixed(2);
        posUI.y.text = parseFloat(picked.position.y).toFixed(2);
        posUI.z.text = parseFloat(picked.position.z).toFixed(2);

        rotUI.x.text = parseFloat(Math_Utilities.radians_to_degrees(picked.rotation.x)).toFixed(2);
        rotUI.y.text = parseFloat(Math_Utilities.radians_to_degrees(picked.rotation.y)).toFixed(2);
        rotUI.z.text = parseFloat(Math_Utilities.radians_to_degrees(picked.rotation.z)).toFixed(2);

        scaleUI.x.text = parseFloat(picked.scaling.x).toFixed(2);
        scaleUI.y.text = parseFloat(picked.scaling.y).toFixed(2);
        scaleUI.z.text = parseFloat(picked.scaling.z).toFixed(2);
    }

    AssignPickedObject(obj){
        if(obj instanceof Mesh)
        {
            //Update picked object.
            this.pickedObject = obj;

            //Update linked UI transform values.
            this.UpdateTransformValues();
        }
    }
}