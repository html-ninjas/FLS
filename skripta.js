function clearCanvas(canvasContext, img) {
  canvasContext.clearRect(0, 0, 800, 400);
  canvasContext.globalAlpha = 0.5;
  canvasContext.drawImage(img, 0, 0, 800, 400);
  canvasContext.globalAlpha = 1;
}

function drawCircle(canvasContext, point) {
  canvasContext.fillStyle = "yellow";
  canvasContext.beginPath();
  canvasContext.arc(point[0], point[1], 5, 0, 2 * Math.PI);
  canvasContext.stroke();
  canvasContext.fill();
}

function drawPoints(canvasContext, points) {
  for (var i = 0; i < points.length; i++) {
    drawCircle(canvasContext, points[i]);
  }
}

function drawLine(canvasContext, pointA, pointB) {
  canvasContext.moveTo(pointA[0], pointA[1]);
  canvasContext.lineTo(pointB[0], pointB[1]);
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
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var i = 1;
var output = "";
var img = new Image();
img.src = "FLL-board.jpg";

window.onload = function() {
  clearCanvas(ctx, img);
};

function onCanvasClick(event) {
  var x = event.x;
  var y = event.y;

  x -= canvasDivisor.offsetLeft;
  y -= canvasDivisor.offsetTop;

  points.push([x, y]);
  redraw(ctx, img, points);

  var k = points[points.length - 1];
  output += `<li id="a${i}">(${k})</li>`;
  console.log(i);
  document.querySelector("ol").innerHTML = output;
  i = i + 1;
}
