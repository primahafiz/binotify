const soapRequest = require('easy-soap-request');
const xml2js = require('xml2js')
require('dotenv').config()

module.exports = {
    async verifySubscription(req,res){
        if(!req.isAdmin){
            return res.status(401).send({
                err: 'Unauthorized access'
            })
        }

         // verify subscription with SOAP
         const url = `http://localhost:${process.env.SOAP_PORT}/approve`;
         const soapHeader = {
         'user-agent': 'REST',
         'Content-Type': 'text/xml;charset=UTF-8',
         'soapAction': 'http://approve/',
         };
         const xml = 
         `
         <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
            <Body>
                <verdict xmlns="http://approve/">
                    <arg0 xmlns="">${req.body.creator_id}</arg0>
                    <arg1 xmlns="">${req.body.subscriber_id}</arg1>
                    <arg2 xmlns="">${req.body.status}</arg2>
                    <arg3 xmlns="">${process.env.SOAP_API_KEY}</arg3>
                </verdict>
            </Body>
        </Envelope>
        `
 
         const { response } = await soapRequest({ url: url, headers: soapHeader, xml: xml, timeout: 200000 }); // Optional timeout parameter(milliseconds)
         const { headers, body, statusCode } = response;
         console.log(headers)
         console.log(body)
         let status = ''
         var parser = new xml2js.Parser({explicitArray: false});
         await parser.parseString(body,function (err,result) {
             console.log(result)
            status = JSON.parse(JSON.stringify(result))['S:Envelope']['S:Body']['ns2:verdictResponse']['return']
           })
        console.log(status)
        res.send({
            'status':status
        })

    }
}