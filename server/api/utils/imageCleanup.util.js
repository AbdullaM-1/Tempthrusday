const fs = require("fs");

/***
 * @description: Function to remove images from the server
 * @param {String} file - file path
 * @returns {void}
 */
const imageCleanup = (file) => {
  if (file)
    fs.unlink(file, (error) => {
      if (error) {
        fs.appendFileSync(`logs/files-not-deleted.txt`, file + "\n");
        console.log("imagesCleanup -> failed while removing picture");
      }
      // console.log("imagesCleanup -> Image Removed:", file);
    });
};

module.exports = { imageCleanup };
