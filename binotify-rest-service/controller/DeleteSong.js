const {Song} = require('../models')

module.exports = {
    async deleteSong(req,res){
        const songToDelete = await Song.findOne({
            where:{
                song_id: req.params.song_id
            }
        })
        if(!songToDelete){
            res.status(400).send({
                err: 'Song does not exists'
            })
            return
        }
        if(songToDelete.penyanyi_id != req.user_id){
            res.status(401).send({
                err: 'User can only delete their own song'
            })
            return
        }
        const song = await Song.destroy({
            where:{
                song_id: req.params.song_id,
                penyanyi_id: req.user_id
            }
        })
        res.status(200).send({
            succ: 'Song successfully deleted'
        })
    }
}