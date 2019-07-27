function clearCanvas(canvasContext, img) {
  canvasContext.clearRect(0, 0, 800, 400);
  canvasContext.globalAlpha = 0.5;
  canvasContext.drawImage(img, 0, 0, 800, 400);
  canvasContext.globalAlpha = 1;
}

var points = [];
var redoList = [];
var redoActionList = [];
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

function addAction(points) {
  var orderedListSelect = document.querySelector("ol");
  var lastLiSelect =
    orderedListSelect.childNodes[orderedListSelect.childElementCount - 1];
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
  var getOrderedList = document.getElementById(listId);
  var newLi = document.createElement("li");
  var newUl = document.createElement("ul");
  newUl.setAttribute("class", "ulNew");
  var textInLi = document.createTextNode(`(${x},${y})`);
  newLi.appendChild(textInLi);
  newLi.appendChild(newUl);

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

function onCanvasClick(event) {
  var x = event.x;
  var y = event.y;

  x -= canvasDivisor.offsetLeft;
  y -= canvasDivisor.offsetTop;

  if (event.shiftKey) {
    points.push({
      coordinates: [x, y],
      direction: "backwards",
      type: "waypoint",
      actionsYesOrNo: 0
    });
  } else {
    points.push({
      coordinates: [x, y],
      direction: "forwards",
      type: "waypoint",
      actionsYesOrNo: 0
    });
  }

  redraw(ctx, img, points);
  addLiElement(
    "orderedList",
    Math.floor(x / 3.386),
    Math.floor((y / 3.386) * -1 + 114.29)
  );
  redoList = [];
  update(points, redoList);
  generateLists(points);
}

function undoButton(ctx, img, points, redoActionList) {
  const point = points[points.length - 1];
  var ol = document.getElementById("orderedList");
  var liToKill = ol.childNodes[points.length - 1];

  if (point.actionsYesOrNo === 1) {
    redoList.push({ type: "emptyAction" });
    points[points.length - 1].actionsYesOrNo = 0;
    liToKill.childNodes[liToKill.childElementCount].remove();
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
  points=[]
  document.querySelector("ol").innerHTML = "";
  redoList = [];
  update(points, redoList);
}

function update(points, redoList) {
  generateEstimate();

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
  if (points.length >= 0 && points[points.length - 1].actionsYesOrNo === 1) {
    document.getElementById("addAction").setAttribute("disabled", "");
  } else {
    document.getElementById("addAction").removeAttribute("disabled");
  }
  if (points.length === 0) {
    document.getElementById("generate-button").setAttribute("disabled", "");
  } else {
    document.getElementById("generate-button").removeAttribute("disabled");
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
  var facing = "up";
  console.log(facing);
}
function startingRight() {
  closeStartingModal();
  clearPath(ctx, img);
  var facing = "right";
  console.log(facing);
}

function redoButton(redoList, points) {
  var current = redoList.pop();

  if (current.type === "emptyAction") {
    points[points.length - 1].actionsYesOrNo = 1;
    var orderedListSelect = document.querySelector("ol");
    var lastLiSelect =
      orderedListSelect.childNodes[orderedListSelect.childElementCount - 1];
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
}

function coordCheck() {
  x = document.getElementById("x_coord").value;
  y = document.getElementById("y_coord").value;

  if (x == "" || y == "") {
    document.getElementById("add_point").setAttribute("disabled", "");
  } else {
    if (x <= 236 && y <= 114) {
      if (x >= 0 && y >= 0) {
        document.getElementById("add_point").removeAttribute("disabled");
      }
    } else {
      document.getElementById("add_point").setAttribute("disabled", "");
    }
  }
}

var axleLength = document.getElementById("axleLength").value;
var backwardsMotors = document.getElementById("backwardsMotors").value;

function calculateLength(pointA, pointB) {
  var xdistance = pointB[0] - pointA[0];
  var ydistance = pointB[1] - pointA[1];
  var length = Math.sqrt(xdistance ** 2 + ydistance ** 2);
  return length;
}

function calculateLengths(points) {
  var lengths = [];
  for (var i = 0; i < points.length - 1; i++) {
    if (points[i + 1].direction === "forwards") {
      lengths.push(
        calculateLength(points[i].coordinates, points[i + 1].coordinates)
      );
    } else {
      lengths.push(
        calculateLength(points[i].coordinates, points[i + 1].coordinates)
      );
    }
  }
  return lengths;
}

function calculateTotalDistance(lengths) {
  var totalDistance = 0;
  if (points.length > 0) {
    for (var i = 0; i < lengths.length; i++) {
      totalDistance += Math.abs(lengths[i]);
    }
  }
  return totalDistance;
}

function vectorize(points) {
  var vectors = [];
  for (var i = 0; i < points.length - 1; i++) {
    vectors.push([
      points[i + 1].coordinates[0] - points[i].coordinates[0],
      points[i + 1].coordinates[1] - points[i].coordinates[1]
    ]);
  }
  return vectors;
}

function calculateInitialAngle(firstPoint, secondPoint) {
  var vec = [secondPoint[0] - firstPoint[0], secondPoint[1] - firstPoint[1]];
  if (document.getElementById("startValue").value == "right") {
    start =
      Math.PI / 2 - Math.acos(vec[0] / Math.sqrt(vec[0] ** 2 + vec[1] ** 2));
  } else {
    start =
      Math.acos(vec[0] / Math.sqrt(vec[0] ** 2 + vec[1] ** 2)) - Math.PI / 2;
  }
  return start;
}

function calculateAngles(vectors, points) {
  var angles = [];
  for (var i = 0; i < vectors.length - 1; i++) {
    var angle = calculateAngle(vectors[i], vectors[i + 1], points, i + 1);
    angles.push(angle);
  }
  return angles;
}

function calculateAngle(vectorA, vectorB, points, pointNumber) {
  if (points[pointNumber].direction === points[pointNumber + 1].direction) {
    if (vectorA[1] < 0) {
      vectorAngle1 =
        2 * Math.PI -
        Math.acos(vectorA[0] / Math.sqrt(vectorA[0] ** 2 + vectorA[1] ** 2));
    } else {
      vectorAngle1 = Math.acos(
        vectorA[0] / Math.sqrt(vectorA[0] ** 2 + vectorA[1] ** 2)
      );
    }
    if (vectorB[1] < 0) {
      vectorAngle2 =
        2 * Math.PI -
        Math.acos(vectorB[0] / Math.sqrt(vectorB[0] ** 2 + vectorB[1] ** 2));
    } else {
      vectorAngle2 = Math.acos(
        vectorB[0] / Math.sqrt(vectorB[0] ** 2 + vectorB[1] ** 2)
      );
    }
    var finalAngle = vectorAngle2 - vectorAngle1;
    if (Math.abs(finalAngle) > Math.PI) {
      if (finalAngle > 0) {
        finalAngle -= 2 * Math.PI;
      } else {
        finalAngle += 2 * Math.PI;
      }
    }
  } else {
    vectorB[0] = -vectorB[0];
    vectorB[1] = -vectorB[1];
    if (vectorA[1] < 0) {
      vectorAngle1 =
        2 * Math.PI -
        Math.acos(vectorA[0] / Math.sqrt(vectorA[0] ** 2 + vectorA[1] ** 2));
    } else {
      vectorAngle1 = Math.acos(
        vectorA[0] / Math.sqrt(vectorA[0] ** 2 + vectorA[1] ** 2)
      );
    }
    if (vectorB[1] < 0) {
      vectorAngle2 =
        2 * Math.PI -
        Math.acos(vectorB[0] / Math.sqrt(vectorB[0] ** 2 + vectorB[1] ** 2));
    } else {
      vectorAngle2 = Math.acos(
        vectorB[0] / Math.sqrt(vectorB[0] ** 2 + vectorB[1] ** 2)
      );
    }
    var finalAngle = vectorAngle2 - vectorAngle1;
    if (Math.abs(finalAngle) > Math.PI) {
      if (finalAngle > 0) {
        finalAngle -= 2 * Math.PI;
      } else {
        finalAngle += 2 * Math.PI;
      }
    }
    vectorB[0] = -vectorB[0];
    vectorB[1] = -vectorB[1];
  }
  finalAngle = (finalAngle * 180) / Math.PI;
  return finalAngle;
}

function makeTextFile(text) {
  var data = new Blob([text], { type: "text/plain" });
  var textFile = null;

  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  textFile = window.URL.createObjectURL(data);

  return textFile;
}

function generateFile(textBox) {
  var anchor = document.createElement("a");
  var orderedListSelect = document.querySelector("ol");
  anchor.setAttribute("id", "invisibleLink");
  anchor.setAttribute("download", true);
  anchor.href = makeTextFile(textBox);
  orderedListSelect.appendChild(anchor);
}

function generateLists(points) {
  lengths = calculateLengths(points);

  vectors = vectorize(points);

  angles = calculateAngles(vectors, points);

  totalDistance = calculateTotalDistance(lengths);
  var numberOfMovements = points.length - 1;

  var textBox = "";

  textBox += wheelSize;
  textBox += "\n";
  textBox += speed;
  textBox += "\n";
  textBox += axleLength;
  textBox += "\n";
  textBox += backwardsMotors;
  textBox += "\n";
  textBox += numberOfMovements;
  textBox += "\n";

  console.log(textBox);

  var start = "pocetnikut";

  if (lengths.lenght > 0) {
    textBox = textBox + "2" + "\n";
    textBox = textBox + start.toString() + "\n";
    textBox = textBox + lengths[0].toString() + "\n";

    for (var i = 0; i < lengths.length - 1; i++) {
      textBox = textBox + "2" + "\n";
      textBox = textBox + angles[i].toString() + "\n";
      textBox = textBox + lengths[i + 1].toString() + "\n";
    }
  }
  generateFile(textBox);
}

function generateEstimate() {
  var wheelSize = document.getElementById("wheelSize").value;
  var speed = document.getElementById("speed").value;

  if (wheelSize.length == 0 || speed.length == 0) {
    var time = "Wrong params";
  } else {
    totalDistance = calculateTotalDistance(calculateLengths(points));

    console.log(totalDistance);

    if (speed >= 80) {
      var rot = 2.24;
    } else {
      var rot = 0.027625 * speed;
    }

    if (points.length === 1 || points.length === 0) {
      var time = 0;
    } else {
      var number =
        Math.round(
          (totalDistance / 3.386 / (wheelSize * Math.PI * rot) + 0.5) * 10
        ) / 10;
      var time = `${number}s`;
    }
  }
  document.getElementById("time_estimate").innerHTML = time;
}

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
  var invisibleLink = document.getElementById("invisibleLink");
  invisibleLink.click();
}
