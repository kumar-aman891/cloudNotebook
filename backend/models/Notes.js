const mongoose = require('mongoose');
const { Schema } = mongoose;
const NotesSchema = new Schema({
    //we want each notes to be assciated with a particular user so that no two users can access each others content. 
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'//refernce model of User
    },
    title:{
        type: String,
        required : true,
    },
    description:{
        type: String,
        required : true,
    },
    tag:{
        type: String,
        default:"General"
    },
    date:{
        type: Date,
        default : Date.now(),
    },
    
});

module.exports = mongoose.model('notes',NotesSchema) //model ka naam , and kis ka model banana h