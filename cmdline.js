
var command = "";
var url = "";
var options = [];
argsObject = {};
process.argv.forEach(function (val, index, array) {
  if (index == 2){
    argsObject.command = val;
  }
  else if (index == 3) {
    argsObject.url = val;
  }
  else if (index > 3) {
    option = val.split("--")[1].split("=")
    argsObject[option[0]] = option[1];
  }
});

console.log("argsObject " + JSON.stringify(argsObject));
