from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

serverInfo = "Retrieved server info from python uvicorn hosted on ambrose wcy desktop."
requestCount = 0;

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

if __name__ == "__main__":
    uvicorn.run(app, host="192.168.1.126", port=8000)