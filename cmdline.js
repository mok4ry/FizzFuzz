
var command = "";
var url = "";
var options = [];

process.argv.forEach(function (val, index, array) {

  if (index == 2){command = val;}
  else if (index == 3) {url = val;}
  else if (index > 3) {options.push(val)}
});

console.log("Command: " + command);
console.log("Command: " + url);
console.log("Command: " + options);
