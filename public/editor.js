let codearea = document.getElementById("code");
let data = document.querySelector(".data");
var editor = CodeMirror.fromTextArea(codearea, {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true
});
var input = document.getElementById("select");
function selectTheme() {
  var theme = input.options[input.selectedIndex].textContent;
  editor.setOption("theme", theme);
  location.hash = "#" + theme;
}
var choice = (location.hash && location.hash.slice(1)) ||
  (document.location.search &&
    decodeURIComponent(document.location.search.slice(1)));
if (choice) {
  input.value = choice;
  editor.setOption("theme", choice);
}
CodeMirror.on(window, "hashchange", function () {
  var theme = location.hash.slice(1);
  if (theme) { input.value = theme; selectTheme(); }
});

data.addEventListener("keyup", function (key) {
if(key.key=="Enter"){
  let cal = editor.doc.getValue().split("\n");
  socket.emit("editor", { code: cal })
  console.log(editor.doc.getValue().split("\n"));
}
})
let codeedit = document.getElementById("code");





socket.on("code", function (editObj) {
  setTimeout(chageeditor,1000,editObj)
})
function chageeditor(editObj){
  let formremove = document.querySelector(".set");
let data = document.querySelector(".data");

  codeedit.innerText = editObj.code;
  let form = document.createElement("form");
  form.classList.add("data");

  let codeDiv = document.createElement("textarea");
  codeDiv.id="code";
  // codeDiv.innerText = `${editObj.code}`;
  formremove.removeChild(data);
  form.appendChild(codeDiv);
  formremove.appendChild(form);

  var editor = CodeMirror.fromTextArea(codeDiv, {
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true
  });



  ////can change
  let data1 = document.querySelector(".data");

  var input = document.getElementById("select");
function selectTheme() {
  var theme = input.options[input.selectedIndex].textContent;
  editor.setOption("theme", theme);
  location.hash = "#" + theme;
}
var choice = (location.hash && location.hash.slice(1)) ||
  (document.location.search &&
    decodeURIComponent(document.location.search.slice(1)));
if (choice) {
  input.value = choice;
  editor.setOption("theme", choice);
}
CodeMirror.on(window, "hashchange", function () {
  var theme = location.hash.slice(1);
  if (theme) { input.value = theme; selectTheme(); }
});

data1.addEventListener("keyup", function (key) {

  let cal = editor.doc.getValue().split("\n");
  socket.emit("editor", { code: cal })
  console.log(editor.doc.getValue().split("\n"));

})
socket.on("code", function (editObj) {
  setTimeout(chageeditor,1000,editObj)
})

///

  for(let i = 0;i<editObj.code.length;i++){
  var doc = editor.getDoc();
  console.log(doc);
var cursor = doc.getCursor(); // gets the line number in the cursor position
var line = doc.getLine(cursor.line); // get the line contents
var pos = { // create a new object to avoid mutation of the original selection
    line: i+1,
    ch: i // set the character position to the end of the line
}
// setLineContent(handle, string)
doc.replaceRange(`${editObj.code[i]}\n`, pos); 
}// adds a new li
}