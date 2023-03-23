const {Song} = require('../models')

module.exports = {
    async updateSong(req,res){
        const songToUpdate = await Song.findOne({
            where:{
                song_id: req.params.song_id
            }
        })
        if(!songToUpdate){
            res.status(400).send({
                err: 'Song does not exists'
            })
            return
        }
        if(songToUpdate.penyanyi_id != req.user_id){
            res.status(401).send({
                err: 'User can only update their own song'
            })
            return
        }
        console.log(req.body.audio_path)
        const song = await Song.update(
            {
                Judul: req.body.judul,
                Audio_path : req.body.audio_path
            },
            {
                where:{
                    song_id: req.params.song_id,
                    penyanyi_id: req.user_id
                }
            }
        )
        res.status(200).send({
            succ: 'Song successfully edited'
        })
    }
}