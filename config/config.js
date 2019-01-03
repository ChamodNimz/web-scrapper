const base64 = require('js-base64').Base64;

module.exports = {

    database:'mongodb://chamod:chamod123@ds251747.mlab.com:51747/coursemanager', // database connection string
    secret:'$2a$10$hVGvofC92FZJuZV8wLHde.DcTbvtRj632UfCcIBLBxCDoTA.B4OSC', // Secret key need to change when deploying 
    port:3000,
    issuer: 'www.tenent.com', // to verify token issuer with this value
    audience: 'mysite.com', // to verify token audience with this value 
                
}

/**
 *  Base64 encoder
 * 
 */
module.exports.base64Encode = function(string){
    return base64.encode(string);
}


/**
*  Base64 decoder
* 
*/
module.exports.base64Decode = function(code){
    return base64.decode(code);
}
