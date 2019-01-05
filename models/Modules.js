const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Modules Schema 
const ModuleSchema = new Schema({
    course_name : {
        type:String,
        required: true
    },
    subject:{
        type:String,
        required: true
    },
    credit:{
        type:Number,
        required: true
    }
});

const Modules = module.exports = mongoose.model('modules', ModuleSchema, 'modules');


/**
 *  insert module
 * 
 */
module.exports.insertModule = function(body,callback){
   let modules = new Modules({
       course_name: body.course_name,
       subject: body.subject,
       credit: body.credit
   });
   modules.save(callback);
}

/**
 * get one Module by name 
 * 
 */
module.exports.getOneModuleByName = function (params, callback) {
    Modules.findOne({course_name: params.course_name, subject: params.subject }, callback);
}