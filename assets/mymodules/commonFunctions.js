//module i made to store some simple functions
const fs = require("node:fs");
const https = require("https");
const Downloader = require("nodejs-file-downloader");

exports.download = async function (link, name, directory) {
  const downloader = new Downloader({
    url: link,
    directory: directory,
    fileName: name,
  });
  try {
    const filePath = await downloader.download();

    return filePath;
  } catch (error) {
    console.log("Download failed", error);
  }
};

exports.formatDate_YYYY_MM_DD = function (date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

exports.getLocaleString = function (tz, type) {
  if (tz != undefined) {
    if (type === "localeDate") {
      return new Date().toLocaleDateString("en-US", {
        timeZone: tz,
      });
    } else if (type === "localeTime") {
      return new Date().toLocaleTimeString("en-US", {
        timeZone: tz,
      });
    } else {
      return new Date().toLocaleString("en-US", {
        timeZone: tz,
      });
    }
  } else {
    if (type === "localeDate") {
      return new Date().toLocaleDateString();
    } else if (type === "localeTime") {
      return new Date().toLocaleTimeString();
    } else {
      return new Date().toLocaleString();
    }
  }
};

function fileExists(path) {
  try {
    return fs.existsSync(path);
  } catch (err) {
    console.log(err);

    return false;
  }
}

exports.fileExists = function (path) {
  try {
    return fs.existsSync(path);
  } catch (err) {
    console.log(err);

    return false;
  }
};

exports.del = function (files) {
  for (const file in files) {
    if (fileExists(file)) {
      try {
        fs.unlink(file);
      } catch (err) {
        console.log(err);
      }
    }
  }
};

exports.formatNumberWithCommas = function (num) {
  return num.toLocaleString("en-US");
};
