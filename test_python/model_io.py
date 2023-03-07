import os

#Scans directory for file names and returns a list of file names.
def get_path_filenames(path):
    files = []
    with os.scandir(folder_path) as entries:
        for entry in entries:
            if entry.is_file():
                files.append(entry.name)
    return files

#Scans directory for sub-folders and returns a list of directory names.
def get_path_directories(path):
    directories = []
    with os.scandir(path) as entries:
        for entry in entries:
            if entry.is_dir():
                directories.append(entry.name)
    return directories

def list_to_string(list):
    return ",".join(str(item) for item in list)

def get_model_url(path, jsonData):
    selectionType = jsonData.get("Selection");
    fileList = []
    path = path + jsonData.get("Name") + "/";

    with os.scandir(path) as entries:
        for entry in entries:
            if entry.is_file() and entry.name.endswith(".obj"):
                fileList.append(entry.name)

    selectedModelName = ""
    if len(fileList) < 1:
        raise Exception("Sub-Directory {path} is empty!")
    match selectionType:
        case "Any":
            #Should return latest model number, assume naming sorts the numbers properly
            selectedModelName = fileList[len(fileList) - 1];
        case "Original":
            selectedModelName = fileList[0];
        case "Latest":
            selectedModelName = fileList[len(fileList) - 1];
        case "Specified":
            raise Exception("Speficifed Version is pending to do")
    return path + selectedModelName;