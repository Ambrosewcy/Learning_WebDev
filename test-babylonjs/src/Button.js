import React, {useState} from "react";
import axios from 'axios';
import "./App.css";

function ButtonRequest(){
    const [infoString, setInfoString] = useState(() =>{return "Empty";});
    const [infoCount, setInfoCount] = useState(() =>{return 0});
    const [reqCount, setReqCount] = useState(()=> {return 0});

    var requestCount = 15;

    function updateReqCount(){
        requestCount += 1;
        console.log(requestCount);
    }

    const upd = function(){
        requestCount += 1;
        console.log(requestCount);
    }

    const handleButton = async() =>{
        try{
            upd();
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

    const messageServer = async() =>{
        const name = "table_fruit_snacks";
        //const data = {name};
        const data = {
            Name: "fruitSnackTable",
            Selection: "Any",
            Version: "1.0"
        }
        try{
            //const response = await axios.post("http://192.168.1.126:8000/findModel2", data);
            const response = await axios.post("http://192.168.1.126:8000/getModelURL", data);
            //console.log(response.data);
            //console.log(response.data.Version);
            //console.log(response.headers);
            //console.log(response.data.models);
            console.log(response.data)
            //const models = response.data.models;
            //models.forEach(fileName => console.log(fileName));
        }catch(error){
            console.error(error);
        }
    }

    const forceFileLoad = async() =>{
        try{
            const response = await axios.get("http://localhost:8000/models/fruitSnackTable/3");
        }catch(error){
            console.error(error);
        }
    }

    return (
        <div>
            <button onClick={forceFileLoad}>Button!</button>
            <p>{infoString}</p>
            <p>reqCount: {requestCount + reqCount}</p>
            <p>{infoCount}</p>
        </div>
    )
}

export default ButtonRequest;