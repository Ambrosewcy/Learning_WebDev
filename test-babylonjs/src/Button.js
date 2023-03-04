import React, {useState} from "react";
import axios from 'axios';
// import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
import "./App.css";

function ButtonRequest(){

    const [infoString, setInfoString] = useState(() =>{return "Empty";});
    const [infoCount, setInfoCount] = useState(() =>{return 0});

    const handleButton = async() =>{
        try{
            axios.get('http://192.168.1.126:8000/data.json')
            .then(response => {
                setInfoString(response.data.info);
                setInfoCount(response.data.count);
            })
            .catch(error => {
              console.log(error);
            });
        }catch(error){
            console.error(error);
        }
    }

    return (
        <div>
            <button onClick={handleButton}>Button!</button>
            <p>{infoString}</p>
            <p>{infoCount}</p>
        </div>
    )
}

export default ButtonRequest;