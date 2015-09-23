const Browser = require('zombie');

Browser.visit('http://www.rit.edu/', function(e, browser) {
  browser.queryAll("a").map(function (node) {
    console.log(node.href);
  })
});
