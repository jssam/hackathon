// const fs = require("fs");
// var socket = io();
let body = document.querySelector("body");
let board = document.getElementById("board");
// let leftmargin = document.querySelector(".CodeMirror");
let color_red = document.querySelector(".color.red");
let color_blue = document.querySelector(".color.blue");
let color_green= document.querySelector(".color.green");
let color_yellow= document.querySelector(".color.yellow");
let color_eraser= document.querySelector(".eraser");
let newpage= document.querySelector(".newpage");

let downpdf = document.querySelector(".downpdf");
socket.on('drawing', onDrawingEvent);
var current = {
    color: 'white '
  };

// const imgToPDF = require('image-to-pdf');
let pages = [];
let color_black= document.querySelector(".color.black");
let parent = document.querySelector(".parent");
let isMouseDown = false;
let win_height = (window.innerWidth)*2/5;
board.height = (window.innerHeight)*9/10;
board.width = (window.innerWidth)*2/5;

// 2d 
let tool = board.getContext("2d");
tool.fillStyle= "black";
tool.fillRect(0, 0, board.width, board.height);
current.color="white";
tool.lineWidth = 5;

color_eraser.addEventListener("click",function(e){

    current.color="black";
    });  
color_black.addEventListener("click",function(e){
  
    current.color="white";
    });  
color_red.addEventListener("click",function(e){

current.color="red";
});   
color_blue.addEventListener("click",function(e){

    current.color="blue";
}); 
  color_green.addEventListener("click",function(e){
 
    current.color="green";
});
color_yellow.addEventListener("click",function(e){
 
    current.color="yellow";
});



document.body.addEventListener("mousedown",function(e){
    let x = e.clientX;
    let y = e.clientY;
    current.x =getCoordinates_x(x);
    current.y = getCoordinates(y);
    x = getCoordinates_x(x);
    y = getCoordinates(y);
    tool.beginPath();
    tool.moveTo(x,y);
    isMouseDown = true;
});
document.body.addEventListener("mousemove",function(e){
    let x = e.clientX;
    let y = e.clientY;
    y = getCoordinates(y);
    x = getCoordinates_x(x);
    if(isMouseDown){
        drawLine(current.x, current.y, x||e.touches[0].clientX, y||e.touches[0].clientY, current.color, true);
        current.x = x||e.touches[0].clientX;
        current.y = y||e.touches[0].clientY;
    }
});
function getCoordinates(initialY) {
    let obj = parent.getBoundingClientRect();
    return initialY - obj.height-20;

}
function getCoordinates_x(initialx) {
    let obj = body.getBoundingClientRect();
    let s= initialx - (obj.width)*2/5;
    console.log(s);
return s;
}

document.body.addEventListener("mouseup",function(e){
    let x = e.clientX;
    let y = e.clientY;
    y = getCoordinates(y);
    x = getCoordinates_x(x);
    drawLine(current.x, current.y, x||e.touches[0].clientX, y||e.touches[0].clientY, current.color, false);
    isMouseDown = false;

});
newpage.addEventListener("click",function(){
    let canvas = document.createElement("canvas");
    
    canvas.width = board.width;
    canvas.height = board.height;
    let tool1 = canvas.getContext("2d");
    tool1.fillStyle= "black";
    tool1.fillRect(0, 0, canvas.width, canvas.height);
    tool1.drawImage(board,0,0);
    let link = canvas.toDataURL();
    let anchor = document.createElement("a");
    anchor.href = link;
    pages.push(link);
    anchor.download= "file.png";
console.log(pages);
    anchor.click();
    tool = replaceCanvas(board);
    tool.fillStyle= "black";
tool.fillRect(0, 0, board.width, board.height);
    tool.strokeStyle="white";
    tool.lineWidth = 5;
  
    board = document.getElementById("board");
   
})
function replaceCanvas(elem) {
    let newcanvas = document.createElement("canvas");
    newcanvas.setAttribute('id',"board");
    
    newcanvas.width = board.width;
    newcanvas.height = board.height;
    tool = newcanvas.getContext('2d');
    // Insert the new canvas after the old one
    elem.parentNode.insertBefore(newcanvas, elem.nextSibling);
    // Remove old canvas. Now the new canvas has its position.
    elem.parentNode.removeChild(elem);
    return tool;
}
// downpdf.addEventListener("click",function(){
//     imgToPDF(link, 'A4')
//     .pipe(fs.createWriteStream('output.pdf'));
   
// })


function onDrawingEvent(data){
    var w = board.width;
    var h = board.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
  }


  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }
  
  function drawLine(x0, y0, x1, y1, color, emit){
    tool.beginPath();
    tool.moveTo(x0, y0);
    tool.lineTo(x1, y1);
    tool.strokeStyle = color;
    tool.lineWidth = 5;
    tool.stroke();
    tool.closePath();
    if (!emit) { return; }
    var w = board.width;
    var h = board.height;

    socket.emit('drawing', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: color
    });
}