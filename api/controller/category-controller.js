//include mongoose
const mongoose = require('mongoose');
//include models
const Category = require('../models/category');

//get all data
exports.get_all = (req, res, next) => {
    Category.find()
    .select('_id name')
    .exec()
    .then( docs => {
        if(docs.length >= 0){
            
            const response = {
                count: docs.length,
                category: docs.map(doc => {
                    return {
                        id: doc._id,
                        name:doc.name,
                        request:{
                            type: 'GET',
                            url: 'http://localhost:3000/category/' + doc._id
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

//show detail data
exports.show = (req, res, next) => {
    const id = req.params.categoryId;
    Category.findById(id)
    .select('_id name')
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json({
                category: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/category/'
                }
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
}


//store data 
exports.store = (req, res, next) => {
    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });

    category.save()
    .then( result => {
        res.status(201).json({
            message: "Created Data Successfuly",
            createdCategory: {
                id: result._id,
                name: result.name,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/category/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
}

//update data
exports.update = (req, res, next) => {
    const id = req.params.categoryId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Category.update({_id: id}, {$set:updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Category Updated",
            request: {
                type: 'GET',
                url: 'http://localhost:3000/category/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
}

//delete data
exports.delete = (req, res, next) => {
    const id = req.params.categoryId;
    Category.findById(id)
    .exec()
    .then(doc => {
        if(!doc){
            return res.status(404).json({
                message: "Category not found"
            });
        }
        Category.remove({_id: req.params.categoryId })
        .exec()
        .then( result =>{
            res.status(200).json({
                message:"Category deleted",
                request: {
                    type: "POST",
                    url:"http://localhost:3000/category/",
                    body:{
                        name:"String"
                    }
                }
            });
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    })

}