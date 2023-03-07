import {MeshBuilder, GizmoManager, Vector3} from "@babylonjs/core"

export class MeshFactory{
    constructor(scene, canvas, gizmoManager){
        this.scene = scene;
        this.canvas = canvas;
        this.gizmoManager = gizmoManager;
    }

    AddToGizmoManager(mesh){
        mesh.isPickable = true;
        this.gizmoManager.attachableMeshes.push(mesh);
    }

    CreateSphere(segments, size, position, name = "", addToGizmoManager = false){
        var result = MeshBuilder.CreateSphere(name, segments, size, this.scene);
        result.position = position;
        if(addToGizmoManager)
        {
            this.AddToGizmoManager(result);
        }
        return result;
    }

    CreateGround(size, position, name = "", addToGizmoManager = false){
        var result = MeshBuilder.CreateGround(name, {width: size, height: size}, this.scene);
        result.position = position;
        if(addToGizmoManager)
        {
            this.AddToGizmoManager(result);
        }
        return result;
    }

    CreateBox(_size, position, name ="", addToGizmoManager = false){
        var result = MeshBuilder.CreateBox(name, {size: _size}, this.scene);
        result.position = position;
        if(addToGizmoManager)
        {
            this.AddToGizmoManager(result);
        }
        return result;
    }
}