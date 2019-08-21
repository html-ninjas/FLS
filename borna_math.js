function calculateTotalDistance(lengths) {
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
  if (facing == "right") {
    start =
      Math.PI / 2 - Math.acos(vec[0] / Math.sqrt(vec[0] ** 2 + vec[1] ** 2));
  } else {
    start =
      Math.acos(vec[0] / Math.sqrt(vec[0] ** 2 + vec[1] ** 2)) - Math.PI / 2;
  }
  return start;
}

function calculateAngles(vectors, points) {
  if (points.length > 1) {
    initialAngle = calculateInitialAngle(
      points[0].coordinates,
      points[1].coordinates
    );
    var angles = [initialAngle];
    for (var i = 0; i < vectors.length - 1; i++) {
      var angle = calculateAngle(vectors[i], vectors[i + 1], points, i + 1);
      angles.push(angle);
    }
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

function generateEstimate() {
  var wheelSize = document.getElementById("wheelSize").value;
  var speed = document.getElementById("speed").value;

  wheelSize = document.getElementById("wheelSize").value;
  speed = document.getElementById("speed").value;

  lengths = calculateLengths(points);

  if (wheelSize === "" || speed === "") {
    var wrongParams = 1;
    document
      .getElementById("wheelSize")
      .setAttribute("class", "add-point-error");
    document.getElementById("speed").setAttribute("class", "add-point-error");
  } else {
    if (wheelSize >= 1 && speed >= 1) {
      var wrongParams = 0;
      document.getElementById("wheelSize").setAttribute("class", "input_box");
      document.getElementById("speed").setAttribute("class", "input_box");
    } else {
      var wrongParams = 1;
      document
        .getElementById("wheelSize")
        .setAttribute("class", "add-point-error");
      document.getElementById("speed").setAttribute("class", "add-point-error");
    }
  }
  if (wrongParams === 1) {
    var time = "Wrong Parameters";
  } else {
    if (points.length <= 1) {
      var time = 0;
    } else {
      var timeForLine = 0;
      for (var i = 0; i < lengths.length; i++) {
        if (points[i].speedOfLine >= 80) {
          var rot = 2.24;
        } else {
          var rot = 0.027625 * points[i].speedOfLine;
        }

        timeForLine += Math.round(
          Math.abs(lengths[i]) / 3.386 / (wheelSize * Math.PI * rot)
        );
      }

      console.log(timeForLine);
      var time = `${timeForLine}s`;
    }
  }
  console.log(time);
  document.getElementById("time_estimate").innerHTML = time;
}

function makeTextBox(points, wheelSize, angles, speedOfLine) {
  var axleLength = document.getElementById("axleLength").value;

  if (points.length > 0) {
    var numberOfMovements = points.length - 1;
  } else {
    var numberOfMovements = 0;
  }

  const lineEnding = String.fromCharCode(13);

  textBox = "";
  textBox += wheelSize;
  textBox += lineEnding;
  textBox += axleLength;
  textBox += lineEnding;
  textBox += motorsCheck();
  textBox += lineEnding;
  textBox += numberOfMovements;
  textBox += lineEnding;

  var numberOfActions = 0;

  for (var i = 0; i < angles.length; i++) {
    if (points[i].actionsYesOrNo === 1) {
      numberOfActions += 1;
      textBox = textBox + "3" + lineEnding;
      textBox = textBox + numberOfActions + lineEnding;
      textBox = textBox + "2" + lineEnding;
      textBox = textBox + angles[i].toString() + lineEnding;
      textBox =
        textBox +
        (lengths[i] / 3.386 / (wheelSize * Math.PI)).toString() +
        lineEnding;
      textBox = textBox + points[i].speedOfLine.toString() + lineEnding;
    } else {
      textBox = textBox + "2" + lineEnding;
      textBox = textBox + angles[i].toString() + lineEnding;
      textBox =
        textBox +
        (lengths[i] / 3.386 / (wheelSize * Math.PI)).toString() +
        lineEnding;
      textBox = textBox + points[i].speedOfLine.toString() + lineEnding;
    }
    if (points[i].actionsYesOrNo === 1) {
    }
  }

  textBox = textBox.replace(/NaN/g, "0");

  return textBox + String.fromCharCode(10);
}

function makeTextFile(text) {
  var data = new Blob([text], { type: "text/rtf" });
  var textFile = null;

  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  textFile = window.URL.createObjectURL(data);

  return textFile;
}

function generateFile(points, wheelSize, speedOfLine) {
  var anchor = document.createElement("a");
  var orderedListSelect = document.querySelector("ol");
  anchor.setAttribute("id", "invisibleLink");
  anchor.setAttribute("download", "fajlnejm2");
  lengths = calculateLengths(points);
  vectors = vectorize(points);
  angles = calculateAngles(vectors, points);
  const a = makeTextBox(points, wheelSize, angles, speedOfLine);

  anchor.href = makeTextFile(a);
  orderedListSelect.appendChild(anchor);
}

function generateLists(points, speed) {
  lengths = calculateLengths(points);

  vectors = vectorize(points);

  angles = calculateAngles(vectors, points);

  totalDistance = calculateTotalDistance(lengths);

  generateEstimate(speed);
}
