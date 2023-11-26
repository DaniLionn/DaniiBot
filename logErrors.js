let fs = require("fs").promises;
let { email } = require("./assets/mymodules/commonFunctions.js");
let logErrors = (err, path) => {
  fs.appendFile(path, `${err.name}: ${err.message}\n`);

  email(
    "[AUTOMATED DANIBOT ERROR]",
    `An error has occured.\n\n${err.name}: ${err.message}\ `,
    process.env["RECIPIENT_EMAIL"],
  );
};

module.exports = logErrors;
