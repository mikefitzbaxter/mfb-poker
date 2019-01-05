const express = require('express')
const router = express.Router()
const t = require('../middleware/tournaments')

// Index
router.get('/', function(req, res, next) {
	let tournaments = t.tournaments
	console.log(tournaments)
	res.render('index.njk', {
		tournaments: tournaments
	})
})

// export the router
module.exports = router