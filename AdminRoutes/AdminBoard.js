const express = require('express');
const router = express.Router();
const { AuthorizeAdmin } = require('./AuthorizeAdmin');

//admin route path
const AdminBoardMain = require('./MainAdmin/AdminBoardMain');
const AdminBoardBakery = require('./BakeryAdmin/AdminBoardBakery');


//asign routers
router.get('/', AuthorizeAdmin, (req, res) =>{
    res.send('AuthorizedAdmin');
})

router.use('/main',AdminBoardMain);//Main Admin Api Route file path
router.use('/bakery',AdminBoardBakery);//Bakery Admin Route file path



module.exports = router;