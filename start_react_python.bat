set "pythonRoot=%~dp0\test_python"
set "reactRoot=%~dp0\test-babylonjs"

start cmd /k "%pythonRoot%\startPyServer.bat"
start cmd /k "%reactRoot%\startReact.bat"