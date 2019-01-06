const express = require('express')
const secured = require('../middleware/secured')
const router  = express.Router()

const t = require('../middleware/tournaments')

// create a new tournament
router.get('/create', secured(), (req, res, next) => {
	let tournament = t.createTournament(req.user)
	res.redirect(`/tournament/${tournament.id}`)
})

// get a tournament by ID
router.get('/:id', secured(), (req, res, next) => {
	let tournament = t.getTournament(req.params.id)
	if (tournament) {	
		res.render('tournament/tournament.njk', {
			tournament: tournament
		})
	} else {
		let err = new Error('Incorrect Tournament ID')
		err.status = 404
		next(err)
	}
})

module.exports = router