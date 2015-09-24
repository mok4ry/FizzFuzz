const Browser = require('zombie');

const dwvaURL = "http://127.0.0.1:7000/dvwa/login.php";

Browser.visit(dwvaURL, function(e, browser) {
  // log into "The BodgeIt Store"
  browser.setCookie({"name": 'security', "domain": 'login', "value": 'high'});

  const value = browser.cookies;
  console.log(value);

});
