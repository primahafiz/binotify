const path = require("path");

module.exports = {
  async getSongBlob(req, res) {
    var options = {
      root: path.join(__dirname, "../songs/"),
    };

    const audioPath = req.query.audioPath;
    res.sendFile(audioPath, options, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Sent:", audioPath);
      }
    });
  },

  async postSongBlob(req, res) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any
    console.log(req.file, req.body);
  },
};
