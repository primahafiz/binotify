const soapRequest = require('easy-soap-request');
require("dotenv").config();
const xml2js = require('xml2js')
const {Song} = require('../models')
const {User} = require('../models')

module.exports = {
    async getSong(req,res){
        const song = await Song.findAll({
            where:{
                penyanyi_id: req.query.penyanyi_id
            },
            attributes: ['song_id', 'Judul', ['Audio_path','audio_path']], 
        })

        const penyanyi = await User.findOne({
            where:{
                user_id: req.query.penyanyi_id
            },
            attributes: ['name'], 
        })

        // verify subscription with SOAP
        const url = `http://localhost:${process.env.SOAP_PORT}/verify`;
        const soapHeader = {
        'user-agent': 'REST',
        'Content-Type': 'text/xml;charset=UTF-8',
        'soapAction': 'http://verify/',
        };
        const xml = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Body><check xmlns="http://verify/"><arg0 xmlns="">${req.query.penyanyi_id}</arg0><arg1 xmlns="">${req.query.user_id}</arg1><arg2 xmlns="">${process.env.SOAP_API_KEY}</arg2></check></Body></Envelope>`

        const { response } = await soapRequest({ url: url, headers: soapHeader, xml: xml, timeout: 200000 }); // Optional timeout parameter(milliseconds)
        const { headers, body, statusCode } = response;
        console.log(headers)
        console.log(body)
        let status = ''
        var parser = new xml2js.Parser({explicitArray: false});
        await parser.parseString(body,function (err,result) {
            console.log(result)
            status = JSON.parse(JSON.stringify(result))['S:Envelope']['S:Body']['ns2:checkResponse']['return']
          })
        if(status == 'ACCEPTED'){
            return res.status(200).send({
                data: song,
                penyanyi_name: penyanyi['name']
            })
        }else{
            return res.status(400).send({
                err : `Subscription is ${status}`
            })
        }

    }
}