const tournaments = {}

class Tournament {
	constructor(id, user, options) {
		this.id = id
		this.createdAt = Date.now()
		this.options = {}
		if (options) {
			for (let [key, value] of Object.entries(options)) {
				this.options[key] = value
			}
		}
		this.status = 'open' // open, running, complete
		this.createdBy = user
	}
}

// return a random string of characters of given length (default 7)
function makeRandomHexString (length) {
	let options = "abcdef0123456789" // possible chars to use
	let l = length || 10 // hard code default length to 7 chars. (56,800,235,584 combinations)
	let h = '' // holder for the hash string
	
	// loop length times
	for (let i=0; i < l; i++) {
		h += options.charAt(Math.floor(Math.random() * options.length))
	}

	return h // return the hash string
}

// create a unique tournament id, instantiate a new Tournament, and attach to tournaments object
function createTournament(user) {
	let id = makeRandomHexString(10)
	let options = {
		type: 'texas holdem',
		format: 'turbo',
		stack: 5000,
		maxPlayers: 6
	}
	if (tournaments.hasOwnProperty(id)) {
		// tournament ID already in use
		return createTournament()
	} else {
		tournaments[id] = new Tournament(id, user, options)
		return tournaments[id]
	}
}

// get a tournament by ID and return it
function getTournament(id) {
	return tournaments[id]
}

module.exports = {
	'tournaments': tournaments,
	'getTournament': getTournament,
	'createTournament': createTournament,
}