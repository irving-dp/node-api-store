const mongoose = require('mongoose');
const Task = require("../models/task");

exports.get_all = async (req, res, next) => {
    await Task.find()
    .select('_id title description')
    .exec()
    .then( docs => {
        if(docs.length >= 0){
            const response = {
                count: docs.length,
                tasks: docs.map(doc => {
                    return {
                        id: doc._id,
                        title:doc.title,
                        description:doc.description,
                        request:{
                            type:'GET',
                            url: 'http://localhost:3000/task/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        }else{
            res.status(404).json({
                message:"No entries found !"
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }); 
}

exports.store = async (req, res, next) => {
    const task = new Task({
        _id         : new mongoose.Types.ObjectId(),
        title       : req.body.title,
        description : req.body.description,
    });
    await task.save()
    .then(result => {
        res.status(201).json({
            message : "Task saved",
            createdTask : {
                id      : result.id,
                title   : result.title,
                description : result.description,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/tasks/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
}

exports.update = (req, res, next) => {
    const id = req.params.taskId;
    const updateOps = {};
    // for(const ops of req.body){
    //     updateOps[ops.propName] = ops.value;
    // }
    Task.updateOne({ _id: id}, {$set: {"title" : req.body.title, "description": req.body.description}})    
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Task Updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/task/' + id
            }
        });
    }).catch(err => {
        console.log(err);
        req.status(500).json({
            error:err
        })
    });
}

exports.delete = (req, res, next) => {
    const id = req.params.taskId;
    Task.remove({_id: id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Task Deleted !',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/task/',
                body: { title: 'String', description: 'String'}
            }
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
}
