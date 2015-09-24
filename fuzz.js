const Browser = require('zombie');

Browser.visit('http://127.0.0.1:8080/bodgeit/login.jsp', function(e, browser) {
  // log into "The BodgeIt Store"
  var userNameNode = browser.document.getElementById("username");
  userNameNode.value = "foobar@gmail.com";
  var passwordNode = browser.document.getElementById("password");
  passwordNode.value = "foobar";
  var submitNode = browser.document.getElementById("submit");
  submitNode.click();

  // check validation text
  var didWork = document.body.textContent.split("You have logged in successfully: ").length > 2

  console.log(didWork);
});
