function clearCanvas(canvasContext, img) {
  canvasContext.clearRect(0, 0, 800, 400);
  canvasContext.globalAlpha = 0.5;
  canvasContext.drawImage(img, 0, 0, 800, 400);
  canvasContext.globalAlpha = 1;
}
var facing = "up";
var axleLength = document.getElementById("axleLength").value;
var backwardsMotors = document.getElementById("backwardsMotors").value;
var textBox = "";
var points = [];
var redoList = [];
var redoActionList = [];
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var i = 1;
var output = "";
var img = new Image();

img.src = "https://raw.githubusercontent.com/html-ninjas/FLS/master/matcropped.jpg";

window.onload = function() {
  clearCanvas(ctx, img);
};

function addAction(points) {
  var orderedListSelect = document.querySelector("ol");
  var lastLiSelect = orderedListSelect.childNodes[orderedListSelect.childElementCount - 1];
  var UlSelect = lastLiSelect.querySelector("ul");
  var textInLiInUl = document.createTextNode("[Action]");
  var liInUl = document.createElement("li");
  liInUl.setAttribute("class", "liInUl");
  liInUl.appendChild(textInLiInUl);
  UlSelect.appendChild(liInUl);
  points[points.length - 1].actionsYesOrNo = 1;
  var lastPoint = points[points.length - 1];
  lastPoint.type = "action";
  redraw(ctx, img, points);
  redoList = [];
  update(points, redoList);
}

function addLiElement(listId, x, y) {
  var speed = document.getElementById("speed").value;
  var getOrderedList = document.getElementById(listId);
  var newLi = document.createElement("li");
  var newUl = document.createElement("ul");
  newUl.setAttribute("class", "ulNew");
  var textInLi = document.createTextNode(`(${x},${y}) ${speed}`);
  newLi.appendChild(textInLi);
  newLi.appendChild(newUl);
  getOrderedList.appendChild(newLi);
}

function drawCircle(canvasContext, point, color) {
  canvasContext.beginPath();
  canvasContext.fillStyle = color;
  canvasContext.strokeStyle = "black";
  canvasContext.lineWidth = 2;
  canvasContext.arc(point.coordinates[0], point.coordinates[1], 5, 0, 2 * Math.PI);
  canvasContext.fill();
  canvasContext.stroke();
}

function drawPoints(canvasContext, points) {
  for (var i = 0; i < points.length; i++) {
    if (points[i].actionsYesOrNo === 1) {
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

function motorsCheck() {
  if (document.getElementById("backwardsMotors").checked) {
    var backwardsMotors = 1;
  } else {
    var backwardsMotors = 0;
  }
  return backwardsMotors;
}

function onCanvasClick(event) {
  var x = event.x;
  var y = event.y;

  x -= canvasDivisor.offsetLeft + 64 + 1.5;
  y -= canvasDivisor.offsetTop + 85 + 16 - 3;

  var speed = document.getElementById("speed").value;

  if (event.shiftKey) {
    points.push({
      coordinates: [x, y],
      direction: "backwards",
      type: "waypoint",
      actionsYesOrNo: 0,
      speedOfLine: speed
    });
  } else {
    points.push({
      coordinates: [x, y],
      direction: "forwards",
      type: "waypoint",
      actionsYesOrNo: 0,
      speedOfLine: speed
    });
  }

  redraw(ctx, img, points);
  addLiElement("orderedList", Math.floor(x / 3.386), Math.floor((y / 3.386) * -1 + 114.29));
  redoList = [];
  generateLists(points, speed);
  update(points, redoList);
}

function undoButton(ctx, img, points, redoActionList) {
  const point = points[points.length - 1];
  var ol = document.getElementById("orderedList");
  var liToKill = ol.childNodes[points.length - 1];

  if (point.actionsYesOrNo === 1) {
    redoList.push({ type: "emptyAction" });
    points[points.length - 1].actionsYesOrNo = 0;
    var childElementCount = liToKill.childElementCount;
    var ulToKill = liToKill.getElementsByClassName("ulNew")[0];
    ulToKill.childNodes[childElementCount - 1].remove();
  } else {
    var redoElement = points.pop();
    redoList.push(redoElement);
    liToKill.parentNode.removeChild(liToKill);
  }

  redraw(ctx, img, points);
  update(points, redoList);
}

function clearPath(canvasContext, img) {
  clearCanvas(canvasContext, img);
  points.splice(0, points.length);
  document.querySelector("ol").innerHTML = "";
  redoList = [];
  textBox = "";
  update(points, redoList);
}

function update(points, redoList) {
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
  if (redoList.length === 0) {
    document.getElementById("redo").setAttribute("disabled", "");
  } else {
    document.getElementById("redo").removeAttribute("disabled");
  }
  if (points.length > 0 && points[points.length - 1].actionsYesOrNo === 1) {
    document.getElementById("addAction").setAttribute("disabled", "");
  } else {
    document.getElementById("addAction").removeAttribute("disabled");
  }
}

function openModal() {
  document.querySelector("#clear-modal").style.display = "block";
  document.querySelector("#backdrop-modal").style.display = "block";
  document.querySelector("body").classList.add("modal-no-scroll");
}

function closeModal() {
  document.querySelector("#clear-modal").style.display = "none";
  document.querySelector("#backdrop-modal").style.display = "none";
  document.querySelector("body").classList.remove("modal-no-scroll");
}
function confirmModal() {
  closeModal();
  clearPath(ctx, img);
}

function closeStartingModal() {
  document.querySelector("#start-modal").style.display = "none";
  document.querySelector("#canvas-overlay").style.display = "none";
  document.querySelector("body").classList.remove("modal-no-scroll");
}

function startingUp() {
  closeStartingModal();
  clearPath(ctx, img);
  facing = "up";
}
function startingRight() {
  closeStartingModal();
  clearPath(ctx, img);
  facing = "right";
}

function redoButton(redoList, points) {
  var current = redoList.pop();

  if (current.type === "emptyAction") {
    points[points.length - 1].actionsYesOrNo = 1;
    var orderedListSelect = document.querySelector("ol");
    var lastLiSelect = orderedListSelect.childNodes[orderedListSelect.childElementCount - 1];
    var UlSelect = lastLiSelect.querySelector("ul");
    var textInLiInUl = document.createTextNode("[Action]");
    var liInUl = document.createElement("li");
    liInUl.setAttribute("class", "liInUl");
    liInUl.appendChild(textInLiInUl);
    UlSelect.appendChild(liInUl);
  } else {
    points.push(current);
    addLiElement("orderedList", current.coordinates[0], current.coordinates[1]);
  }

  redraw(ctx, img, points);
  update(points, redoList);
}

// TODOOOOOOOOOOO
function addCoord() {
  x = document.getElementById("x_coord").value;
  y = document.getElementById("y_coord").value;
  if (x === "" || y === "") {
  } else {
    if (event.shiftKey) {
      points.push({
        coordinates: [Math.floor(3.386 * x), Math.floor(387 - 3.386 * y)],
        direction: "backwards",
        type: "waypoint"
      });
      addLiElement("orderedList", x, y);
      redraw(ctx, img, points);
      update(points, redoList);
    } else {
      points.push({
        coordinates: [Math.floor(3.386 * x), Math.floor(387 - 3.386 * y)],
        direction: "forwards",
        type: "waypoint"
      });
      addLiElement("orderedList", x, y);
      redraw(ctx, img, points);
      update(points, redoList);
    }
  }
  generateLists(points, speed);
}

function coordCheck() {
  x = document.getElementById("x_coord").value;
  y = document.getElementById("y_coord").value;

  if (x == "" || y == "") {
    document.getElementById("add_point").setAttribute("disabled", "");
    document.getElementById("y_coord").setAttribute("class", "add-point-error");
    document.getElementById("x_coord").setAttribute("class", "add-point-error");
  } else {
    if (x <= 236 && y <= 114) {
      if (x >= 0 && y >= 0) {
        document.getElementById("add_point").removeAttribute("disabled");
        document.getElementById("y_coord").setAttribute("class", "input_box");
        document.getElementById("x_coord").setAttribute("class", "input_box");
      }
    } else {
      document.getElementById("add_point").setAttribute("disabled", "");
      document.getElementById("y_coord").setAttribute("class", "add-point-error");
      document.getElementById("x_coord").setAttribute("class", "add-point-error");
    }
  }
}

// function generateFile(textBox) {
//   var anchor = document.createElement("a");
//   var orderedListSelect = document.querySelector("body");
//   anchor.setAttribute("id", "invisibleLink");
//   anchor.setAttribute("download", true);
//   anchor.href = makeTextFile(textBox);
//   orderedListSelect.appendChild(anchor);

// }

function scrollSmooth(id) {
  const section = document.querySelector(`#${id}`);
  section.scrollIntoView({ behavior: "smooth" });

  setTimeout(() => {
    section.classList.add("scale-animation");
  }, 100);
  setTimeout(() => {
    section.classList.remove("scale-animation");
  }, 1100);
}

function handleGenerateClick(event) {
  var wheelSize = document.getElementById("wheelSize").value;
  var old = document.getElementById("invisibleLink");

  if (old) {
    old.remove();
  }
  generateFile(points, wheelSize);
  var invisibleLink = document.getElementById("invisibleLink");
  invisibleLink.click();
}
