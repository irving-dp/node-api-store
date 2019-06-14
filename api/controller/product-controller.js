const mongoose = require('mongoose');
//include models
const Product = require("../models/product");

exports.product_get_all = (req, res, next) => {
    Product.find()
    .select('name price_buy price_sell productImage')
    .exec()
    .then(docs => {
        if (docs.length >= 0) {
            const response = {
                count: docs.length,
                product: docs.map(doc => {
                    return {
                        id: doc.id,
                        name: doc.name,
                        buy: doc.price_buy,
                        sell: doc.price_sell,
                        productImage: doc.productImage,
                        url: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        } else {
            res.status(404).json({
                message: 'No entries found'
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

//store data to DB
exports.product_store_product = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price_buy: req.body.price_buy,
        price_sell: req.body.price_sell,
        productImage: req.file.path
    });
    product.save()
    .then(result => {
        res.status(201).json({
            message: "Created Data Successfuly",
            createdProduct: {
                id: result._id,
                name: result.name,
                price_buy: result.price_buy,
                price_sell: result.price_sell,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.product_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price_buy price_sell productImage _id')
    .exec()
    .then(doc => {
        if (doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/'
                }
            });
        } else {
            res.status(404).json({
                message: 'No valid entry ID'
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

exports.product_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateMany({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.product_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product Deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products/',
                body: { name: 'String', price: 'Number' }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
}