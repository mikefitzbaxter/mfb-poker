
const passport 	   = require('passport')
const Auth0Strategy= require('passport-auth0')

module.exports = (app) => {

	const appScheme = (app.get('env') === 'production') ? 
		`http://${process.env.APP_URL}` :
		'http://localhost:3000'

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

	// add a user object to the req once a user is logged in
	const userInViews = require('../middleware/userInViews')

	// deny access to a route if there is no User Object
	// this method is available to all routers used following
	// the inclusion of Auth0.js like so:
	// router.get('/user', secured(), (req, res, next) => {})
	const secured = require('../middleware/secured')

	// add routes for /login /callback and /logout
	const auth = require('../routes/auth')(appScheme)

	// add user route for /user
	const user = require('../routes/users')

	app.use(userInViews()) // assign the user object to res.locals.user
	app.use('/', auth) // assign routes for /login, /logout, and /callback
	app.use('/', user) // assign routes for /user

}
