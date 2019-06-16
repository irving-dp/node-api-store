const mongoose = require('mongoose');

const productSchema =  mongoose.Schema({
    _id         : mongoose.Schema.Types.ObjectId,
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    name        : { type: String, required: true },
    price_buy   : { type:Number, required:true },
    price_sell  : { type: Number, required: true },
    stock       : {type:Number, default: 0},
    productImage: {type:String, required:true}
});

module.exports = mongoose.model('Product', productSchema);