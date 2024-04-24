const express = require('express');
const router = express.Router();


//admin route path
const UserList = require('./UserListRoute');
const AdminListRoute =require('./AdminListRoute');
const Owners = require('./OwnerDetails');
const Events = require('./EventDetails');
const Contact = require('./UserContacts');
const Gallery = require('./GalleryImages');

//asign routers
router.use(UserList);
router.use(AdminListRoute)
router.use(Owners);
router.use(Events);
router.use(Contact);
router.use(Gallery);


module.exports = router;