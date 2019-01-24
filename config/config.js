const base64 = require('js-base64').Base64;

module.exports = {

    database:'mongodb://chamod:chamod123@ds251747.mlab.com:51747/coursemanager', // database connection string
    database_dev: 'mongodb://localhost/courseManager',
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

/**
 * Get int values according to result
 * 
 */

module.exports.getIntVal = function(string){
    if (string == "A+" || string == "A") {
        return 1;
    } else if (string == "A-") {
        return 2;
    } else if (string == "B+") {
        return 3;
    } else if (string == "B") {
        return 4;
    } else if (string == "B-") {
        return 5;
    } else if (string == "C+") {
        return 6;
    } else if (string == "C") {
        return 7;
    } else if (string == "C-") {
        return 8;
    } else if (string == "D+") {
        return 9;
    } else if (string == "D") {
        return 10;
    } else if (string == "E") {
        return 11;
    }
}

/**
 * Get result values according to int values
 * 
 */
module.exports.getStringVal = function(val) {
    if (val == 1 ) {
        return "A";
    } 
      else if (val == 2) {
        return "A-";
    } else if (val == 3) {
        return "B+";
    } else if (val == 4) {
        return "B";
    } else if (val == 5) {
        return "B-";
    } else if (val == 6) {
        return "C+";
    } else if (val == 7) {
        return "C";
    } else if (val == 8) {
        return "C-";
    } else if (val == 9) {
        return "D+";
    } else if (val == 10) {
        return "D";
    } else if (val == 11) {
        return "E";
    } 
}


