from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import json
import model_io
import uvicorn

app = FastAPI()

serverInfo = "Retrieved server info from python uvicorn hosted on ambrose wcy desktop."
requestCount = 0;

model_directory = "models/"

origins = [
    "http://localhost:3000",
    "http://192.168.1.126"
]

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/data.json")
async def read_data():
    global requestCount
    requestCount += 1
    data = {
        "info": serverInfo,
        "count": requestCount
    }
    return data

#Unused function. Will Delete later.
@app.post("/findModel_OLD")
async def find_model_info_OLD(request: Request):
    data = await request.json()
    name = data.get("name")
    print(name);
    dict = {
        "Version": "1.0",
        "Date": "01-01-2023",
        "Iteration": "3",
        "Descriptor": "Tiresome",
        "Effect": "Doop"
    }
    dict["Effect"] = "Proop"
    return dict;


@app.post("/getModelNames")
async def find_model_names(request: Request):
    data = await request.json()
    modelNames = model_io.get_path_directories("./ " + model_directory)
    return {"models": modelNames};

@app.post("/getModelURL")
async def get_model_URL(request: Request):
    print("Got Request")
    data = await request.json();
    resultData = {
        "url": "gibberish",
        "state": "fail",
    }
    try:
        resultData["url"] = model_io.get_model_url(model_directory, data);
        resultData["state"] = "success"
    except Exception as e:
        print("Unhandled Exception! Returning invalid url to client")
    print("Okay! " + resultData.get("url"))
    return resultData

@app.get("/models/{modelName}/{fileName}")
async def load_model_file(modelName: str, fileName: str):
    print("Function Called")
    path = model_directory + modelName + "/" + fileName
    print(path)
    return {"Help"}

if __name__ == "__main__":
    uvicorn.run(app, host="192.168.1.126", port=8000)