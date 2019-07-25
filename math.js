var points = [
  { coordinates: [0, 0], direction: "forwards", actionsOrNo: 0 },
  { coordinates: [2, 2], direction: "forwards", actionsOrNo: 1 },
  { coordinates: [2, 4], direction: "backwards", actionsOrNo: 1 },
  { coordinates: [1, 4], direction: "forwards", actionsOrNo: 0 },
  { coordinates: [5, 0], direction: "forwards", actionsOrNo: 1 },
  { coordinates: [3, 0], direction: "backwards", actionsOrNo: 0 },
  { coordinates: [2, 1], direction: "backwards", actionsOrNo: 1 }
];

function calculatetotalDistance(lengths) {
  var totalDistance = 0;
  for (var i = 0; i < lengths.length; i++) {
    totalDistance += Math.abs(lengths[i]);
  }
  return totalDistance;
}

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
        -calculateLength(points[i].coordinates, points[i + 1].coordinates)
      );
    }
  }
  return lengths;
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
  var create = document.getElementById("create");

  create.addEventListener(
    "click",
    function() {
      var link = document.getElementById("downloadlink");
      link.href = makeTextFile(textBox);
      link.style.display = "block";
    },
    false
  );
}

function generateLists(points) {
  lengths = calculateLengths(points);

  vectors = vectorize(points);

  angles = calculateAngles(vectors, points);

  totalDistance = calculatetotalDistance(lengths);

  var wheelSize;
  var speed;
  var axleLength;
  var backwardsMotors;
  var numberOfMovements;
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
  var numberOfActions = 0;

  var start = "pocetnikut";

  textBox = textBox + "2" + "\n";
  textBox = textBox + start.toString() + "\n";
  textBox = textBox + lengths[0].toString() + "\n";

  for (var i = 0; i < lengths.length - 1; i++) {
    if (points[i].actionsOrNo == 1) {
      numberOfActions += 1;
      textBox += "3" + "\n";
      textBox += numberOfActions + "\n";
      textBox = textBox + "2" + "\n";
      textBox = textBox + angles[i].toString() + "\n";
      textBox = textBox + lengths[i + 1].toString() + "\n";
    } else {
      textBox = textBox + "2" + "\n";
      textBox = textBox + angles[i].toString() + "\n";
      textBox = textBox + lengths[i + 1].toString() + "\n";
    }
  }

  generateFile(textBox);
}

generateLists(points);
