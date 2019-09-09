// test_math_functions.js

var test1 = [1, 2, 2, 2, 3, 4, 4, 3, 3];
var test2 = [1, 3];
var emptyArray = [];

var testCases = [test1, test2, emptyArray];

for (let i = 0; i < testCases.length; i++) {
  var result = calculateTotalDistance(testCases[i]);
  console.log(result);
}
