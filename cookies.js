const Browser = require('zombie');

const bodgitURL = "http://127.0.0.1:8080/bodgeit/login.jsp";
const dwvaURL = "http://127.0.0.1:7000/dvwa/login.php";

var usernameB = "foobar@gmail.com"; // bodgit user
var passwordB = "foobar"; // bodgit password

var usernameD = "admin";
var passwordD = "password";




Browser.visit(dwvaURL, function(e, browser) {
  // log into "The BodgeIt Store"
  browser.setCookie(name: 'security', domain: 'login', value: 'high');

  const value = browser.getCookie('security');
  console.log('Cookie', value);

});
