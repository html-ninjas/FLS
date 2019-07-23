function onSumbit(event) {
  event.preventDefault();
  var x1 = document.getElementById("x1").value;
  var y1 = document.getElementById("y1").value;
  var x1 = document.getElementById("x1").value;
  var y1 = document.getElementById("y1").value;
  var x2 = document.getElementById("x2").value;
  var y2 = document.getElementById("y2").value;
  var x3 = document.getElementById("x3").value;
  var y3 = document.getElementById("y3").value;
  var x_1 = x2 - x1;
  var y_1 = y2 - y1;
  var x_2 = x3 - x2;
  var y_2 = y3 - y2;
  var l1 = Math.sqrt(x_1 * x_1 + y_1 * y_1);
  var l2 = Math.sqrt(x_2 * x_2 + y_2 * y_2);
  var k1 = y_1 / x_1;
  var k2 = y_2 / x_2;

  function angle(k) {
    if (k === Infinity) {
      return 90;
    } else if (k === -Infinity) {
      return 270;
    } else {
      return (Math.atan(k) * 180) / Math.PI;
    }
  }

  if (angle(k1) === angle(k2)) {
    kut = 0;
  } else if (angle(k1) > angle(k2)) {
    kut = angle(k1) - angle(k2);
  } else {
    kut = angle(k2) - angle(k1);
  }

  if (kut > 180) {
    kut -= 360;
  }
  var result1 = "";
  var result2 = "";
  var result3 = "";

  result1 += l1;
  result2 += l2;
  result3 += kut;
  document.getElementById("result1").innerHTML = result1;
  document.getElementById("result2").innerHTML = result2;
  document.getElementById("result3").innerHTML = result3;
}
function onReset(event) {
  event.preventDefault();
  x1.innerText = 0;
  y1.innerText = 0;
  x2.innerText = 0;
  y2.innerText = 0;
  x3.innerText = 0;
  y3.innerText = 0;
  result1.innerText = "";
  result2.innerText = "";
  result3.innerText = "";
}
document.querySelector("form").onsubmit = onSumbit;
document.querySelector("form").onreset = onReset;

function getResult() {
  var x1 = document.getElementById("x1").value;
  var y1 = document.getElementById("y1").value;
  var x2 = document.getElementById("x2").value;
  var y2 = document.getElementById("y2").value;
  var x3 = document.getElementById("x3").value;
  var y3 = document.getElementById("y3").value;
  var x_1 = x2 - x1;
  var y_1 = y2 - y1;
  var x_2 = x3 - x2;
  var y_2 = y3 - y2;
  var l1 = Math.sqrt(x_1 * x_1 + y_1 * y_1);
  var l2 = Math.sqrt(x_2 * x_2 + y_2 * y_2);
  var k1 = y_1 / x_1;
  var k2 = y_2 / x_2;

  function angle(k) {
    if (k === Infinity) {
      return 90;
    } else if (k === -Infinity) {
      return 270;
    } else {
      return (Math.atan(k) * 180) / Math.PI;
    }
  }

  if (angle(k1) === angle(k2)) {
    kut = 0;
  } else if (angle(k1) > angle(k2)) {
    kut = angle(k1) - angle(k2);
  } else {
    kut = angle(k2) - angle(k1);
  }

  if (kut > 180) {
    kut -= 360;
  }
  var result1 = "";
  var result2 = "";
  var result3 = "";

  result1 += l1;
  result2 += l2;
  result3 += kut;

  var ourLanguage = "";
  for (i = 0; i < 1; i++) {
    ourLanguage += `2\n${result3}\n${result2}\n`;
  }

  return `wheel size promjer\nspeed\naxle length\nbackwards motors\nnumber of movements\n${ourLanguage}\n`;
}

function onChange() {
  const res = getResult();
  console.log(res);
  var element = document.getElementById("downloadLink");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(res)
  );
}

function preventAction(event) {
  return false;
}
