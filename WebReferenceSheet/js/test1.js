var buttonCount = 0;

function Foo() {
  ++buttonCount;
  var element = document.getElementById("EMPTY");
  if (buttonCount % 3 == 0) {
    element.classList.add("strong");
  }
  else {
    element.classList.remove("strong");
  }
  element.innerHTML = "Button Presses = " + String(buttonCount);
}

function Doo() {
  var input = prompt("Please Enter Name", "Lorem IPsum");
  document.getElementById("INPUT_PROMPT").innerHTML = "Input = " + String(input);
}

function TitleCasify() {
  var msg = prompt("Please enter a message");
  var strIndex = 0;
  let prevWasWhiteSpace = true;

  msg = msg.toLocaleLowerCase();

  while (strIndex < msg.length) {
    if (prevWasWhiteSpace) {
      if (strIndex == 0)
        msg = msg[0].toUpperCase() + msg.slice(1);
      else
        msg = msg.slice(0, strIndex) + msg[strIndex].toUpperCase() + msg.slice(strIndex + 1)
    }

    if (msg[strIndex] == ' ') {
      prevWasWhiteSpace = true;
    }
    else {
      prevWasWhiteSpace = false;
    }

    ++strIndex;
  }

  Tools.log(msg);
  Tools.TypeOfNamespace();
  document.getElementById("TITLE_CASIFY").innerHTML = "Titled Message = " + "<span class='strong'>" + msg + "</span>";
}

function TestPassReference(){
  var myObj = {foo: "This is the original"};
  var secObj = myObj;
  secObj.foo = "This is the modified";
  console.log(myObj);
}

function GetFirstWord(msg)
{
  var wordArray = msg.split(" ");
  return wordArray[0];
}

function GetFirstNWords(msg, count)
{
  var wordArray = msg.split(" ");
  return wordArray.slice(0, count);
}

function TestGetWord()
{
  var msg = "This is my long word";
  var word = GetFirstWord(msg);
  var words = GetFirstNWords(msg, 3);

  console.log(typeof(word));
  console.log(JSON.stringify(words, null, 1));
  console.log(typeof(Tools.Print));
}

function GetRandomNumber(rangeStart = 0, rangeEnd = 1){
  return rangeStart + Math.random() * (rangeEnd - rangeStart);
}

function TestRandomNumber()
{
  var element = document.getElementById("RANDOM_RANGE");
  element.innerHTML = "Random Range 1 - 50: " + GetRandomNumber(1, 50);
}

var Tools = {
  Print(text)
  {
    console.log(text);
  },

  TypeOfNamespace()
  {
    console.log(typeof(Tools));
  }
}