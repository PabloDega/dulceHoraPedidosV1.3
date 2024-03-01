const soap = require('soap');
const urlDummy = 'https://servicios1.afip.gob.ar/wsfev1/service.asmx?op=FEDummy';
var args = {name: 'value'};
const headerDummy = {
    wsdl_headers: {
        "Host": "servicios1.afip.gob.ar",
        "SOAPAction": "http://ar.gov.afip.dif.FEV1/FEDummy",
        "Content-Type": "text/xml; charset=utf-8",
    }
} 


const checkDummy = async() => {
    soap.createClientAsync(url).then((client) => {
        return client.MyFunctionAsync(args);
      }).then((result) => {
        console.log(result);
      });
}

module.exports = {
    checkDummy,
}