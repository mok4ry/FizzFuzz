// zombie is our fast headless browser
const Browser = require('zombie');
// fs is node's filesystem library
const fs = require('fs');
// visited urls
process.visitedURLs = [];

// ================= command line arguments ===================================#
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
// ================= end command line arguments ===============================#

// ================= site objects for logging in ==============================#
var bodgeit = {
  userNameSelector: "username",
  userName: "admin@gmail.com",
  passwordSelector: "password",
  password: "password",
  loginSelector: "Login",
  successString: "You have logged in successfully",
  loginPath: "bodgeit/login.jsp"
}

var dvwa = {
  userNameSelector: "username",
  userName: "admin",
  passwordSelector: "password",
  password: "password",
  loginSelector: "Login",
  successString: "You have logged in",
  loginPath: "dvwa/login.php"
}
// ================= end site objects for logging in ==========================#

// ================= functions and callback ===================================#
// Takes a site object, logs in with the information, and runs the callback.
// The callback exposes a browser object to interact with after logging in.
function login(url, auth, callback) {
  Browser.visit(url, function(e, browser) {
    browser.
      fill(auth.userNameSelector, auth.userName).
      fill(auth.passwordSelector, auth.password).
      pressButton(auth.loginSelector, function() {
        callback(browser);
      });
  });
}

// Takes a url, and runs the callback.
// The callback exposes a browser object to interact with.
function visit(url, browser, callback) {
  if (browser == undefined) {
    browser = Browser;
  }
  browser.visit(url, function() {
    callback(browser);
  });
}

// Makes a query on the page for every link
// returns a list of urls
function queryLinks(browser) {
  var urls = browser.document.getElementsByTagName("a");
  var urlNodes = Array.from(urls);
  var links = urlNodes.map(function(node) {
      return node.href;
  });
  return links;
}

// Makes a query on the page for every input
// returns a list of input names
function queryInputs(browser) {
  var inputs = browser.document.getElementsByTagName("input");
  var inputNodes = Array.from(inputs);
  var ins = inputNodes.map(function(node) {
      return node.name;
  });
  return ins;
}

// Makes a query for the cookies on the browser
// returns a list of cookie elements
function getCookies(browser) {
  var cookies = browser.cookies
  return cookies;
}

// Makes a query for the inputs on the URL
// returns a list of url parameters and their values
function getURLParams(browser) {
  var url = browser.document.URL;
  var params = url.split("?").filter( function(urlPiece) {
    return (urlPiece.indexOf("=") != -1);
  }).map( function(param) {
    return param.split("=");
  });
  return params;
}


// Checks if the inputs on the given page are sanitizing
// the inputed values before use.
function inputSanCheck(browser){
  var inputs = browser.document.getElementsByTagName("input");
  var inputNodes = Array.from(inputs);
  inputTestHTML(browser, inputNodes,"'<div><div id='test1234'>test</div>","#test1234");
  return true;
}

// Inject HTML on the page and see if it becomes an element
//Ex: broswer - browser
//    nodes - inputs
//    injectedHTML - "'<div><div id='1234'>test</div>"
//    htmlId - "#1234"
function inputTestHTML(browser, nodes, injectedHTML, htmlId){
  nodes.map(function(node){
    //Input Tests

    if (node.type == "submit"){
      browser.
        pressButton(node.name, function() {
          console.log("submit button pressed");
          //'<div><div>test</div>
          if (browser.queryAll(htmlId).length > 0){
            console.log("HTML was rendered to the page.");
          }else{
            console.log("HTML was not rendered to the page.");
          }
        });
    }else{
      node.value = injectedHTML;
      displayNodeStats(node);
    }
  });
}



// Pretty prints out information about an element
function displayNodeStats(node){
  console.log("Node name: " + node.name);
  console.log("   Node type: " + node.type);
  console.log("   Node id: " + node.id);
  console.log("   Node value: " + node.value);
}

function readHttpResponses(browser){
  var r = browser.resources;
  r.forEach(function(obj){
    console.log("Status Code: " + obj.statusCode);
  });
}

// Returns an array of exploits
function vectorFileRead(filename, callback){
  var exploits;
  fs.readFile(filename,function(err, data){
    exploits = data.toString().split('/n');
    callback(exploits);
  });
}

// ================= end functions and callback ===============================#

// ================= commands =================================================#
// lists information about the current browser session
// crawls to an unvisited page on the same domain, and recurses
// returns a list of visitedURLs
function discoverAndCrawl(browser) {
  urlDomain = browser.document.location.hostname
  url = browser.document.location.href
  console.log("RUNNING DISCOVERY FOR " + url);
  // append url to list of urls
  process.visitedURLs.push(url);
  console.log(process.visitedURLs.length)

  console.log("   LINKS ON THE PAGE:");
  var links = queryLinks(browser);
  console.log(links);

  console.log("   INPUTS ON THE PAGE:");
  var inputs = queryInputs(browser);
  console.log(inputs);

  console.log("   COOKIES ON THE BROWSER:");
  var cookies = getCookies(browser);
  console.log(cookies);

  console.log("   PARAMETERS ON THE URL:");
  var params = getURLParams(browser);
  console.log(params);

  var crawlLinks = links.filter( function(link) {
    return (link.indexOf(urlDomain) != -1) &&
            (link.indexOf(".xml") == -1 ) &&
            (process.visitedURLs.indexOf(link)==-1);
  }).forEach( function(link) {
    visitAndCrawl(link, browser);
  }, []);
  return crawlLinks;
}

function visitAndCrawl(url, browser) {
  return visit(url, browser, function(browser) {
    discoverAndCrawl(browser);
  });
}

function test(url,browser) {
  visit(url,browser,function(broswer){
    console.log("   INPUTS ON THE PAGE:");
    var inputs = queryInputs(browser);
    console.log(inputs);

    console.log("   ARE INPUTS ON PAGE SANITIZING");
    var complete = inputSanCheck(browser);
  });

  if (argsObject.vectors != undefined){
      vectorFileRead(argsObject.vectors, function(exploits){
            console.log("The Exploits");
          exploits.forEach(function(currentValue){
            console.log(currentValue);
          });
      });
  }
}
// ================= end commands =============================================#

var customAuth = false;
var auth;
if (argsObject["custom-auth"]) {
  customAuth = true;
  if (argsObject["custom-auth"] == "dvwa") {
    auth = dvwa;
  }
  else if (argsObject["custom-auth"] == "bodgeit") {
    auth = bodgeit;
  }
}

if (customAuth) {
  baseURL = argsObject.url.match(/https?\:\/\/[^/]*\//)[0];
  loginURL = baseURL + auth.loginPath;
  console.log(loginURL);
  login(loginURL, auth, function(browser) {
    var bodyText = browser.document.body.textContent;
    var didWork = bodyText.indexOf(auth.successString) != -1;
    console.log("Logged in? : "+didWork);
    if (argsObject.command == "test") {
      test(argsObject.url, browser);
    }
    else if (argsObject.command == "discover") {
      visitAndCrawl(argsObject.url, browser);
    }
  });
}else {

  if (argsObject.command == "test") {
    test();
  }
  else if (argsObject.command == "discover") {
    visitAndCrawl(argsObject.url);
  }
}
