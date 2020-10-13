const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//make folder can be access in browser
app.use('/uploads', express.static('uploads'));

//connect to mongo db atlas
mongoose.connect("mongodb+srv://root:" + process.env.MONGO_ATLAS_PW + "@node-api-store-blvcz.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

//log request 
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());


//CORS Error Handling
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*"); //* give access to any client
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE');
    next(); 
});

//init routes
const categoryRoutes = require('./api/routes/category-routes');
const productRoutes = require('./api/routes/product-routes');
const orderRoutes = require('./api/routes/order-routes');
const userRoutes = require('./api/routes/user-routes');

//Routes which should handle request
app.use('/category', categoryRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

//Error handling requst http not found
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

//Error handling requst status
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;