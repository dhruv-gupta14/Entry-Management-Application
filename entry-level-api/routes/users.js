var express = require('express');
var router = express.Router();
const users = require('../controllers/users.controller.js');

/** This API is Used for Check IN Request */
router.post('/checkin', users.check_in);

/** This API is Used for Check Check ID and get the data for Check IN using check in id */
router.get('/checkin/:id', users.get_checkin_info);

/** This API is Used for Checkout using check in ID */
router.put('/checkout/:id', users.update_checkin_info);
module.exports = router;