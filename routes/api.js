const express = require('express')
const router = express.Router()

// API Index
router.get('/', function(req, res, next) {
	res.send('respond with API data')
})

// API users
router.get('/users', function(req, res, next) {
	res.send('User listing API data here')
})

// export the router
module.exports = router