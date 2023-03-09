import {PointerEventTypes, GizmoManager, SceneLoader, Engine, Tools, Vector3} from "@babylonjs/core";
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

export class GUIManager{
    constructor(){
        this.transformUI = new TransformInspector();
        this.babylonAdvanceTexture = AdvancedDynamicTexture.CreateFullscreenUI("InspectorDynamicTexture");
    }

    //Only allow input if it is a numerical value, or character used for numbers.
    static BindInput_OnlyAcceptNumbers(input){
        let key = input.currentKey;
        if(isNaN(parseFloat(key)) && key !== "." && key !== "-"){
            input.addKey = false;
            console.log("Disallowed");
        }
        else{
            input.addKey = true;
        }
    }

    async InitializeGUI(){
        //Load UI canvas from file/web
        let advTexture = this.babylonAdvanceTexture;
        await advTexture.parseFromURLAsync("inspectorUI.json", false);

        //Bind input fields to expected UI
        this.transformUI.position.x = advTexture.getControlByName("transform_position_x");
        this.transformUI.position.y = advTexture.getControlByName("transform_position_y");
        this.transformUI.position.z = advTexture.getControlByName("transform_position_z");

        this.transformUI.position.x.onBeforeKeyAddObservable.add(GUIManager.BindInput_OnlyAcceptNumbers);
        this.transformUI.position.y.onBeforeKeyAddObservable.add(GUIManager.BindInput_OnlyAcceptNumbers);
        this.transformUI.position.z.onBeforeKeyAddObservable.add(GUIManager.BindInput_OnlyAcceptNumbers);
        
        //
    }
}