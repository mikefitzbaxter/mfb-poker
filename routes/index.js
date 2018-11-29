const express = require('express')
const router = express.Router()

// Index
router.get('/', function(req, res, next) {
	res.render('pages/index.njk')
})

// export the router
module.exports = router