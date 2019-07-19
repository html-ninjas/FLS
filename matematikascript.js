var j = 0;
var x;
var y;
var xco = [];
var yco = [];

function onSumbit(event) {
  event.preventDefault();
  j += 1;

  x = document.getElementById("x1").value;
  y = document.getElementById("y1").value;

  document.getElementById("x1").value = "";
  document.getElementById("y1").value = "";

  xco.push(x);
  yco.push(y);

  function length(x1, y1, x2, y2) {
    var x_1 = x2 - x1;
    var y_1 = y2 - y1;
    var l1 = Math.sqrt(x_1 * x_1 + y_1 * y_1);
    return l1;
  }

  function trig(x1, y1, x2, y2, x3, y3) {
    var x_1 = x2 - x1;
    var y_1 = y2 - y1;
    var x_2 = x3 - x2;
    var y_2 = y3 - y2;
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
      kut = Math.abs(kut - 360);
    }
    return kut;
  }

  if (j == 1) {
  }
  if (j == 2) {
    var node1 = document.createElement("li");
    var textnode1 = document.createTextNode(
      length(xco[0], yco[0], xco[1], yco[1])
    );
    node1.appendChild(textnode1);
    document.getElementById("list").appendChild(node1);
  }
  if (j > 2) {
    var node2 = document.createElement("li");
    var textnode2 = document.createTextNode(
      -1 *
        trig(
          xco[j - 3],
          yco[j - 3],
          xco[j - 2],
          yco[j - 2],
          xco[j - 1],
          yco[j - 1]
        )
    );
    node2.appendChild(textnode2);
    document.getElementById("list").appendChild(node2);

    var node3 = document.createElement("li");
    var textnode3 = document.createTextNode(
      length(xco[j - 2], yco[j - 2], xco[j - 1], yco[j - 1])
    );
    node3.appendChild(textnode3);
    document.getElementById("list").appendChild(node3);
  }
}
document.getElementById("x1").value = "";
document.getElementById("y1").value = "";
document.querySelector("form").onsubmit = onSumbit;
