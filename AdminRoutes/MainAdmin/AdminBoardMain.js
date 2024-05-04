const express = require('express');
const router = express.Router();


//admin route path
const UserList = require('./UserListRoute');
const AdminListRoute =require('./AdminListRoute');
const Owners = require('./OwnerDetails');
const Events = require('./EventDetails');
const Contact = require('./UserContacts');
const Gallery = require('./GalleryImages');
const Contents = require('./PageContent');

//asign routers
router.use(UserList);
router.use(AdminListRoute)
router.use(Owners);
router.use(Events);
router.use(Contact);
router.use(Gallery);
router.use(Contents);


module.exports = router;