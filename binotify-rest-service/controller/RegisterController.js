const {User} = require('../models')
const redis = require('redis');
const bcrypt = require('bcrypt')

module.exports = {
    async registerUser(req,res){
        var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
        console.log(req.body)
        if(!emailRegex.test(req.body.email)){
            res.status(400)
            res.send({
                err: 'Email is not valid'
            })
            return
        }
        try{
            if(req.body.password != req.body.retypePassword){
                return res.status(400).send({
                    err: 'Password and retype password is not same'
                })
            }
            const hashedPass = await bcrypt.hash(req.body.password,1000000007)
            const user = await User.create({email: req.body.email, password: hashedPass, username: req.body.username, name: req.body.name, isAdmin: false})
            res.status(200).send({
                succ: 'User is successfully created'
            })
            const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
            const client = redis.createClient({
                url,
                password: process.env.REDIS_KEY
            });
            await client.connect();
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
        }catch(err){
            res.status(400).send({
                err: 'Username or email already existed'
            })
        }
    }
}