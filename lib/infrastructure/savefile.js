const fs = require("fs-extra");

exports.saveFile = async (path, str) => {
  fs.ensureFileSync(path);
  return fs.appendFileSync(path, str);
};
