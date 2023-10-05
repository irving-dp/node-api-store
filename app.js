const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//make folder can be access in browser
app.use('/uploads', express.static('uploads'));

//connect to mongo db atlas
// mongoose.connect("mongodb+srv://irvingdev:"+ process.env.MONGO_ATLAS_PW +"@storeapi.xea5wsb.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect("mongodb://localhost:27017/todo_list", {
   useNewUrlParser: true,
   useUnifiedTopology: true
});
mongoose.Promise = global.Promise;

// const { MongoClient, ServerApiVersion } = require('mongodb');
//mongoose.connect("mongodb+srv://irvingdev:"+ process.env.MONGO_ATLAS_PW +"@storeapi.xea5wsbmongoose.connect("mongodb+srv://irvingdev:"+ process.env.MONGO_ATLAS_PW +"@storeapi.xea5wsb.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);


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
const taskRoutes = require('./api/routes/task-routes');

//Routes which should handle request
app.use('/category', categoryRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);
app.use('/task', taskRoutes);

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