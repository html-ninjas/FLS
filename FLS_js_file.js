function clearCanvas(canvasContext, img) {
  canvasContext.clearRect(0, 0, 800, 400);
  canvasContext.globalAlpha = 0.5;
  canvasContext.drawImage(img, 0, 0, 800, 400);
  canvasContext.globalAlpha = 1;
}

function drawCircle(canvasContext, point) {
  canvasContext.beginPath();
  canvasContext.fillStyle = "yellow";
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
    drawCircle(canvasContext, points[i]);
  }
}

function drawLine(canvasContext, pointA, pointB) {
  if (pointB.direction === "forwards") {
    canvasContext.beginPath();
    canvasContext.strokeStyle = "red";
    canvasContext.lineWidth = 5;

    canvasContext.moveTo(pointA.coordinates[0], pointA.coordinates[1]);
    canvasContext.lineTo(pointB.coordinates[0], pointB.coordinates[1]);
    canvasContext.stroke();
  } else {
    canvasContext.beginPath();
    canvasContext.strokeStyle = "blue";
    canvasContext.lineWidth = 5;

    canvasContext.moveTo(pointA.coordinates[0], pointA.coordinates[1]);
    canvasContext.lineTo(pointB.coordinates[0], pointB.coordinates[1]);
    canvasContext.stroke();
  }
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
    points.push({ coordinates: [x, y], direction: "backwards" });
    console.log(points);
    console.log("Shift");
  } else {
    points.push({ coordinates: [x, y], direction: "forwards" });
    console.log("No shift");
  }
  redraw(ctx, img, points);

  //console.log(points);

  var k = points[points.length - 1];
  output += `<li id="a${i}">(${k})</li>`;
  document.querySelector("ol").innerHTML = output;
  i = i + 1;
}
