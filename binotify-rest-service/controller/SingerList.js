const {User} = require('../models');
const redis = require('redis');
require('dotenv').config();

module.exports = {
    async getListSinger(req,res){
        const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
        const client = redis.createClient({
            url,
            password: process.env.REDIS_KEY
        });
        await client.connect();
        // send_command expects a command name and array of parameters.
        last_update = null;
        client.get('last_update', (err, reply) => {
            if (err) throw err;
            last_update = parseInt(reply);
        });
        if (Date.now() - last_update < 600){
            // get from redis
            client.get('singer', (err, reply) => {
                if (err) throw err;
                reply = JSON.parse(reply);
                console.log(reply);
                res.status(200).send({
                    data: reply
                })
            });
        } else {
            // get from mysql
            const singer = await User.findAll({
                where:{
                    isAdmin: false
                },
                attributes: [['user_id','penyanyi_id'], 'name'], 
            })
            console.log(singer);
            // update redis
            client.set('last_update', Date.now(), (err, reply) => {
                if (err) throw err;
                console.log(reply);
            });
            client.set('singer', JSON.stringify(singer), (err, reply) => {
                if (err) throw err;
                console.log(reply);
            });
            res.status(200).send({
                data: singer
            })
        }
    }
}