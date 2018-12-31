const express = require('express')
const router = express.Router()
const secured = require('../middleware/secured')


// API Index
router.get('/', function(req, res, next) {
	res.send('respond with API data')
})

// export the router
module.exports = router