function addAction(points) {
  var lastPoint = points[points.length - 1];
  lastPoint.type = "action";
  redraw(ctx, img, points);
}

function clearCanvas(canvasContext, img) {
  canvasContext.clearRect(0, 0, 800, 400);
  canvasContext.globalAlpha = 0.5;
  canvasContext.drawImage(img, 0, 0, 800, 400);
  canvasContext.globalAlpha = 1;
}

function addLiElement(listId, x, y) {
  var getOrderedList = document.getElementById(listId);
  var newLi = document.createElement("li");
  var textInLi = document.createTextNode(`(${x},${y})`);
  newLi.appendChild(textInLi);
  getOrderedList.appendChild(newLi);
}

function drawCircle(canvasContext, point, color) {
  canvasContext.beginPath();
  canvasContext.fillStyle = color;
  canvasContext.strokeStyle = "black";
  canvasContext.lineWidth = 2;
  canvasContext.arc(
    point.coordinates[0],
    point.coordinates[1],
    5,
    0,
    2 * Math.PI
  );
  canvasContext.fill();
  canvasContext.stroke();
}

function drawPoints(canvasContext, points) {
  for (var i = 0; i < points.length; i++) {
    if (points[i].type === "action") {
      drawCircle(canvasContext, points[i], "#00cd00");
    } else {
      drawCircle(canvasContext, points[i], "yellow");
    }
  }
}

function drawLine(canvasContext, pointA, pointB) {
  if (pointB.direction === "forwards") {
    colorLine(canvasContext, pointA, pointB, "#831100", 7);
    colorLine(canvasContext, pointA, pointB, "#FF2600", 3);
  } else {
    colorLine(canvasContext, pointA, pointB, "#002E7A", 7);
    colorLine(canvasContext, pointA, pointB, "#0433FF", 3);
  }
}

function colorLine(canvasContext, pointA, pointB, color, width) {
  canvasContext.beginPath();
  canvasContext.strokeStyle = color;
  canvasContext.lineWidth = width;
  canvasContext.moveTo(pointA.coordinates[0], pointA.coordinates[1]);
  canvasContext.lineTo(pointB.coordinates[0], pointB.coordinates[1]);
  canvasContext.stroke();
}

function drawLines(canvasContext, points) {
  for (var i = 0; i < points.length - 1; i++) {
    drawLine(canvasContext, points[i], points[i + 1]);
  }
}

function redraw(canvasContext, img, points) {
  clearCanvas(canvasContext, img);
  drawLines(canvasContext, points);
  drawPoints(canvasContext, points);
}

var points = [];
var redoList = [];
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var i = 1;
var output = "";
var img = new Image();

img.src =
  "https://raw.githubusercontent.com/html-ninjas/FLS/master/matcropped.jpg";

window.onload = function() {
  clearCanvas(ctx, img);
};

function onCanvasClick(event) {
  var x = event.x;
  var y = event.y;

  x -= canvasDivisor.offsetLeft;
  y -= canvasDivisor.offsetTop;

  if (event.shiftKey) {
    points.push({
      coordinates: [x, y],
      direction: "backwards",
      type: "waypoint"
    });
    console.log(points);
    console.log("Shift");
  } else {
    points.push({
      coordinates: [x, y],
      direction: "forwards",
      type: "waypoint"
    });
    console.log("No shift");
  }

  redraw(ctx, img, points);
  addLiElement("orderedList", x, y);
  update(points);
}

function undoButton(ctx, img, points) {
  points.pop();
  redraw(ctx, img, points);
  var ol = document.getElementById("orderedList");
  var liToKill = ol.childNodes[points.length];
  liToKill.parentNode.removeChild(liToKill);
  update(points);
}

function clearPath(canvasContext, img) {
  clearCanvas(canvasContext, img);
  points.splice(0, points.length);
  document.querySelector("ol").innerHTML = "";
  update(points);
}

function update(points) {
  if (points.length === 0) {
    document.getElementById("Undo").setAttribute("disabled", "");
  } else {
    document.getElementById("Undo").removeAttribute("disabled");
  }
  if (points.length === 0) {
    document.getElementById("clearPath").setAttribute("disabled", "");
  } else {
    document.getElementById("clearPath").removeAttribute("disabled");
  }
  if (points.length === 0) {
    document.getElementById("addAction").setAttribute("disabled", "");
  } else {
    document.getElementById("addAction").removeAttribute("disabled");
  }
}

function openModal() {
  document.querySelector(".modal").classList.add("active");
  document.querySelector(".backdrop").classList.add("active");
}

function closeModal() {
  document.querySelector(".modal").classList.remove("active");
  document.querySelector(".backdrop").classList.remove("active");
}
function confirmModal() {
  closeModal();
  clearPath(ctx, img);
}

function redoButton() {}
