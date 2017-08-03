
var Linter = require("eslint").Linter;
var linter = new Linter();

var messages = linter.verify("var foo\n console.log(a);",
{
  rules: {
    semi: 2
  }
});

messages.forEach((el) => {console.log(el.fix)})
