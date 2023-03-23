const soapRequest = require('easy-soap-request');
const xml2js = require('xml2js')
require('dotenv').config()

module.exports = {
    async getPending(req,res){
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
             <pending xmlns="http://approve/">
                 <arg0 xmlns="">${process.env.SOAP_API_KEY}</arg0>
             </pending>
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
             status = JSON.parse(JSON.stringify(result))['S:Envelope']['S:Body']['ns2:pendingResponse']['return']
           })
        console.log(status)
        ans = []
        for(let i=0;i<status.length;i++){
            let arr = status[i].split(':')
            ans.push({'creator_id':parseInt(arr[0]),'subscriber_id':parseInt(arr[1])})
        }
        res.status(200).send({'data':ans})
    }
}