import {Mesh, PointerEventTypes, GizmoManager, SceneLoader, Engine, Tools, Vector3} from "@babylonjs/core";
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
            }
        }
    }

    UpdatePickedObjectRotation(input){
        if(_sGuiManager.pickedObject)
        {
            let rotUI = _sGuiManager.transformUI.rotation;
            switch(input._managedInput){
                case 'x': _sGuiManager.pickedObject.rotation.x = rotUI.x.text; break;
                case 'y': _sGuiManager.pickedObject.rotation.y = rotUI.y.text; break;
                case 'z': _sGuiManager.pickedObject.rotation.z = rotUI.z.text; break;
            }
        }
    }

    UpdatePickedObjectScale(input){
        if(_sGuiManager.pickedObject)
        {
            let scaleUI = _sGuiManager.transformUI.scale;
            switch(input._managedInput){
                case 'x': _sGuiManager.pickedObject.scale.x = scaleUI.x.text; break;
                case 'y': _sGuiManager.pickedObject.scale.y = scaleUI.y.text; break;
                case 'z': _sGuiManager.pickedObject.scale.z = scaleUI.z.text; break;
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
        let picked = _sGuiManager.pickedObject;
        let posUI = _sGuiManager.transformUI.position;
        let rotUI = _sGuiManager.transformUI.rotation;
        let scaleUI = _sGuiManager.transformUI.scale;

        posUI.x.text = picked.position.x;
        posUI.y.text = picked.position.y;
        posUI.z.text = picked.position.z;

        rotUI.x.text = picked.rotation.x;
        rotUI.y.text = picked.rotation.y;
        rotUI.z.text = picked.rotation.z;

        scaleUI.x.text = picked.scaling.x;
        scaleUI.y.text = picked.scaling.y;
        scaleUI.z.text = picked.scaling.z;
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