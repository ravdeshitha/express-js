const express = require('express');
const router = express.Router();


//admin route path
const Contact = require('./MainHomeRoutes/Contact');
const Events = require('./MainHomeRoutes/Events');
const Owners = require('./MainHomeRoutes/Owners');
const Gallery = require('./MainHomeGalleryRouts/MainGallery');
const Countdown = require('./MainHomeRoutes/Countdown');
const Services = require('./MainHomeRoutes/Services');
const MainSlide = require('./MainHomeRoutes/MainSlide');

//asign routers
router.use('/contact',Contact);//MainHome Api Route file path
router.use(Events);
router.use(Owners);
router.use('/gallery', Gallery);
router.use(Countdown);
router.use(Services);
router.use(MainSlide);


module.exports = router;