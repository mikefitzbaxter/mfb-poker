const express  = require('express')
const passport = require('passport')

module.exports = (appScheme) => {
	const router   = express.Router()
	
	// Perform the login, after login Auth0 will redirect to callback
	router.get('/login', passport.authenticate('auth0', {
		scope: 'openid email profile'
	}), (req, res) => {
		res.redirect('/')
	})

	const callbackURL = '/' + process.env.AUTH0_CALLBACK
	// Perform the final stage of authentication and redirect to previously requested URL or '/user'
	router.get(callbackURL, (req, res, next) => {
		passport.authenticate('auth0', function(err, user, info) {
			if (err) { return next(err) }
			if (!user) { return res.redirect('/login') }
			req.logIn(user, (err) => {
				if (err) { return next(err) }
				let returnTo = req.session.returnTo
				delete req.session.returnTo
				res.redirect(returnTo || '/user')
			})
		})(req, res, next)
	})

	// Perform session logout and redirect to homepage
	router.get('/logout', (req, res) => {
		req.logout()
		
		// https://auth0.com/docs/logout
		let logoutURL = 'https://' + process.env.AUTH0_DOMAIN + '/v2/logout'
		let returnURL = 'returnTo=' + encodeURIComponent(appScheme) // will redirect to index homepage
		let clientID  = '&client_id=' + process.env.AUTH0_CLIENT
		let url = logoutURL + '?' + returnURL + '&' + clientID
		res.redirect(url)
	})
	
	// export the router
	return router
}