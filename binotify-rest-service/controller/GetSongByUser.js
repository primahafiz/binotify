const { Song } = require("../models");

module.exports = {
  async getSong(req, res) {
    if (req.isAdmin) {
      return res.status(401).send({
        err: "Admin does not have song",
      });
    }
    const songs = await Song.findAll({
      where: {
        penyanyi_id: req.user_id,
      },
      attributes: ["song_id", "Judul", "Audio_path"],
    });

    const list = [];
    const base = `${req.protocol}://${req.get("host")}/api/songblob?audioPath=`;
    for (let song of songs) {
      list.push({
        id: song.song_id,
        title: song.Judul,
        audio_path: `${base}${song.Audio_path}`,
      });
    }

    return res.status(200).send(list);
  },
};
