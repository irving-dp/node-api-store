const express = require('express');
const router  = express.Router(); 
const multer = require('multer');
const checkAuth = require('../middlewere/check-auth');

//import coontroller
const ProductController = require('../controller/product-controller');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb( null, './uploads/' );
    },
    filename: function(req, file, cb){
        cb( null, new Date().toISOString() + file.originalname );
    }
});

const fileFilter = (req, file, cb) => {
    //reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(new Error('File does not required'), false);
    }
};
const upload = multer({ storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5 //accept only 5mb file
    },
    fileFilter:fileFilter
});




router.get('/', ProductController.get_all );  

router.post('/', checkAuth, upload.single('productImage'), ProductController.store );  

router.get("/:productId", checkAuth, ProductController.show );

router.patch('/:productId', checkAuth, ProductController.update );

router.delete('/:productId', checkAuth, ProductController.delete );

module.exports = router;