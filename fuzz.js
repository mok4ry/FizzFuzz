const Browser = require('zombie');

const bodgitURL = "http://127.0.0.1:8080/bodgeit/login.jsp";
const dwvaURL = "http://127.0.0.1:7000/dvwa/login.php";

var usernameB = "foobar@gmail.com"; // bodgit user
var passwordB = "foobar"; // bodgit password

var usernameD = "admin";
var passwordD = "password";


//The string: "You have logged in as 'admin'" --- the class: "message"

  Browser.visit(dwvaURL, function(e, browser) {
    // log into "The BodgeIt Store"
    browser.
      fill("username", usernameD).
      fill("password", passwordD).
      pressButton("Login", function(err) {
        // check validation text
        var didWork = browser.document.body.textContent;
        console.log(didWork);
      });

  });
