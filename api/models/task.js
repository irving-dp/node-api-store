const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    _id   : mongoose.Schema.Types.ObjectId,
    title : { type:String, required:true},
    description : { type:String, required:true}, 
});

module.exports = mongoose.model('Task', taskSchema);