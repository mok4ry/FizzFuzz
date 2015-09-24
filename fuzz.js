const Browser = require('zombie');

Browser.visit('http://127.0.0.1:8080/bodgeit/login.jsp', function(e, browser) {
  // log into "The BodgeIt Store"
  browser.
    fill("username", "foobar@gmail.com").
    fill("password", "foobar").
    pressButton("Login", function(err) {
      // check validation text
      var didWork = browser.document.body.textContent;
      var successString = "You have logged in successfully";
      console.log(didWork.indexOf(successString) != -1);
    });

});

function login(browser, url,
                userNameSelector, userName,
                passwordSelector, password,
                loginSelector, successString) {
  Browser.visit(url, function(e, browser) {
    browser.
      fill(userNameSelector, userName).
      fill(passwordSelector, password).
      pressButton(loginSelector, function(err) {
        // check validation text
        var didWork = browser.document.body.textContent;
        console.log(didWork.indexOf(successString) != -1);
      });
  });
}
