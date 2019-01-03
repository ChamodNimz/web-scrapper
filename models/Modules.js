const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Modules Schema 
const ModuleSchema = new Schema({
    course_name : {
        type:String,
        required: true
    },
    subjects:[{
        name: {
            type: String,
            required:true
        },
        credit:{type: Number, required: true}
    }]
});

const Modules = module.exports = mongoose.model('modules', ModuleSchema, 'modules');
