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

  document.getElementById("TITLE_CASIFY").innerHTML = "Titled Message = " + "<span class='strong'>" + msg + "</span>";
}

/*
  JAVA SCRIPT NAMING CONVENTIONS
  - camelCase
  - 2 Spaces for code indentations
*/