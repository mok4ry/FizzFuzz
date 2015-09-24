const Browser = require('zombie');

var bodgeit = {
  loginURL: "http://127.0.0.1:8080/bodgeit/login.jsp",
  userNameSelector: "username",
  userName: "admin@gmail.com",
  passwordSelector: "password",
  password: "password",
  loginSelector: "Login",
  successString: "You have logged in successfully"
}

var dwva = {
  loginURL: "http://127.0.0.1/dvwa/login.php",
  userNameSelector: "username",
  userName: "admin",
  passwordSelector: "password",
  password: "password",
  loginSelector: "Login",
  successString: "You have logged in"
}

function login(siteObject, callback) {
  Browser.visit(siteObject.loginURL, function(e, browser) {
    browser.
      fill(siteObject.userNameSelector, siteObject.userName).
      fill(siteObject.passwordSelector, siteObject.password).
      pressButton(siteObject.loginSelector, function() {
        callback(browser);
      });
  });
}


login(dwva, function(browser) {
  var bodyText = browser.document.body.textContent;
  var didWork = bodyText.indexOf(dwva.successString) != -1;
  console.log("Logged into DWVA: "+didWork);
});

login(bodgeit, function(browser) {
  var bodyText = browser.document.body.textContent;
  var didWork = bodyText.indexOf(bodgeit.successString) != -1;
  console.log("Logged into BodgeIt: " + didWork);
});
