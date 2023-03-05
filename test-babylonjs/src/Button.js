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

    return (
        <div>
            <button onClick={handleButton}>Button!</button>
            <p>{infoString}</p>
            <p>reqCount: {requestCount + reqCount}</p>
            <p>{infoCount}</p>
        </div>
    )
}

export default ButtonRequest;