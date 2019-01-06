const passport 	   = require('passport')
const Auth0Strategy= require('passport-auth0')

module.exports = (app) => {

	const appScheme = (app.get('env') === 'production') ? 
		`https://${process.env.APP_URL}` :
		`http://localhost:3000`

	const strategy = new Auth0Strategy({
		domain: process.env.AUTH0_DOMAIN,
		clientID: process.env.AUTH0_CLIENT,
		clientSecret: process.env.AUTH0_SECRET,
		callbackURL: appScheme + process.env.AUTH0_CALLBACK
	}, function(accessToken, refreshToken, extraParams, profile, done) {
		// accessToken is the token to call Auth0 API (not needed in the most cases)
		// extraParams.id_token has the JSON Web Token
		// profile has all the information from the user
		return done(null, profile)
	})

	passport.use(strategy)

	app.use(passport.initialize())
	app.use(passport.session())
	
	passport.serializeUser((user, done) => {
		done(null, user);
	})
	passport.deserializeUser((user, done) => {
		done(null, user);
	})

	// add routes for /login /callback and /logout
	// assign the user object to res.locals.user
	app.use(function (req, res, next) {
		res.locals.user = req.user
		res.locals.auth = true // flag that auth is enabled
		next()
	})

	// Perform the login, after login Auth0 will redirect to callback
	app.get('/login', passport.authenticate('auth0', {
		scope: 'openid email profile'
	}), (req, res) => {
		res.redirect('/')
	})

	// Perform the final stage of authentication and redirect to previously requested URL or '/'
	app.get(process.env.AUTH0_CALLBACK, (req, res, next) => {
		passport.authenticate('auth0', function(err, user, info) {
			if (err) { return next(err) }
			if (!user) { return res.redirect('/login') }
			req.logIn(user, (err) => {
				if (err) { return next(err) }
				let returnTo = req.session.returnTo
				delete req.session.returnTo
				res.redirect(returnTo || '/')
			})
		})(req, res, next)
	})

	// Perform session logout and redirect to homepage
	app.get('/logout', (req, res) => {
		req.logout()
		
		// https://auth0.com/docs/logout
		let logoutURL = `https://${process.env.AUTH0_DOMAIN}/v2/logout`
		let returnURL = `returnTo=${encodeURIComponent(appScheme)}` // will redirect to index homepage
		let clientID  = `&client_id=${process.env.AUTH0_CLIENT}`
		let url = `${logoutURL}?${returnURL}&${clientID}`
		res.redirect(url)
	})
}
