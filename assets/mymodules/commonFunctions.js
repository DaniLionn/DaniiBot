  //module i made to store some simple functions
  const fs = require("node:fs");
  const fsPromises = require("node:fs").promises;
  const nodemailer = require("nodemailer");
  //const https = require('https');
  const Downloader = require("nodejs-file-downloader");
  const { createCanvas, loadImage } = require("@napi-rs/canvas");

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env["EMAIL"],
      pass: process.env["EMAIL_PASSWORD"],
      clientId: process.env["CLIENTID"],
      clientSecret: process.env["CLIENTSECRET"],
      refreshToken: process.env["REFRESH"],
    },
  });

  exports.download = async function (url, downloadDirectory) {
    try {
      const downloader = new Downloader({
        url: url,
        directory: downloadDirectory,
      });

      const filePath = await downloader.download();
      // console.log(`Downloaded: ${url}`);
      return filePath;
    } catch (error) {
      console.error(`Error downloading ${url}: ${error.message}`);
      throw error; // Re-throw the error to be caught by the caller if needed
    }
  };

  exports.downloadMultiple = async (links, downloadDirectory) => {
    const downloadedFilePaths = [];

    for (const link of links) {
      try {
        const downloader = new Downloader({
          url: link,
          directory: downloadDirectory,
        });

        const { filePath } = await downloader.download();
        downloadedFilePaths.push(filePath);
        console.log(`Downloaded: ${link}`);
      } catch (error) {
        console.error(`Error downloading ${link}: ${error.message}`);
      }
    }

    return downloadedFilePaths;
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
      return fs.promises.existsSync(path);
    } catch (err) {
      console.log(err);

      return false;
    }
  };

  exports.del = async function (filePaths) {
    for (const filePath of filePaths) {
      try {
        await fs.promises.unlink(filePath);
        //console.log(`Deleted: ${filePath}`);
      } catch (error) {
        console.error(`Error deleting ${filePath}: ${error.message}`);
      }
    }
  };

  exports.formatNumberWithCommas = function (num) {
    return num.toLocaleString("en-US");
  };

  exports.emailSomething = function (subject, message, recipient) {
    let mailOptions = {
      from: process.env["EMAIL"],
      to: recipient,
      subject: subject,
      text: message,
    };

    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Email sent successfully");
      }
    });
  };

  exports.mergeImages = async function (filePaths, canvasWidth, canvasHeight) {
    // Create a new canvas
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");

    // Calculate the width of each image on the canvas
    const imageWidth = canvasWidth / filePaths.length;

    // Loop through each file path and draw the image on the canvas
    for (let i = 0; i < filePaths.length; i++) {
      const filePath = filePaths[i];

      try {
        // Load the image from the file path
        const image = await loadImage(await fsPromises.readFile(filePath));

        // Calculate the position to draw the image on the canvas
        const x = i * imageWidth;
        const y = 0;

        // Draw the image on the canvas
        ctx.drawImage(image, x, y, imageWidth, canvasHeight);
      } catch (error) {
        console.error(
          `Error loading or drawing image ${filePath}: ${error.message}`,
        );
      }
    }

    // Return the PNG buffer
    return canvas.toBuffer("image/png");
  };
