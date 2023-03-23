const {Song} = require('../models')

module.exports = {
    async addSong(req,res){
        if(req.isAdmin){
            return res.status(401).send({
                err: 'Admin cannot make song'
            })
        }
        const song = Song.create({
            Judul: req.body.judul,
            penyanyi_id: req.user_id,
            Audio_path: req.body.audio_path
        })
        return res.status(200).send({
            succ: 'Song successfully created'
        })
    }
}