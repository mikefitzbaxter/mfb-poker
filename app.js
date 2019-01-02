
/* ###### INCLUDES ###### */
const dotenv	   = require('dotenv').config()
const express      = require('express')
const nunjucks     = require('nunjucks')
const helmet       = require('helmet')
const logger       = require('morgan')
const bodyParser   = require('body-parser')
const cookieParser = require('cookie-parser')
const compression  = require('compression')
const session	   = require('express-session')

const app 	= express()
const http  = require('http')

/** Create HTTP server **/
const server = http.createServer(app)
/** Create Socket IO instance **/
// const io = require('socket.io')(server)

/* ###### TEMPLATE CONFIG ###### */
// configure nunjucks template engine
// http://mozilla.github.io/nunjucks
const env = nunjucks.configure('views', {
	autoescape: true,
	express: app,
	watch: true
})
env.addGlobal('app', { 
	title: process.env.APP_TITLE,
	ga: process.env.GA,
	env: app.get('env'),
})

/* ###### SESSION CONFIG ###### */
const sess = {
	secret: process.env.APP_SECRET, // configured in .env
	cookie: {},
	resave: false,
	saveUninitiated: true
}
if (app.get('env') === 'production') {
	sess.cookie.secure = true // serve secure cookies, requires https
}

/* ###### MIDDLEWARE ###### */
app.use(helmet()) // protect app by setting various http headers
app.use(logger('dev')) // morgan logger for http
app.use(bodyParser.json()) // parse json body
app.use(bodyParser.urlencoded({ extended: false })) //urlencode parsed body
app.use(session(sess)) // use sessions middleware
app.use(cookieParser()) // parse cookies
app.use(compression()) // gzip compression all routes
app.use(express.static(__dirname + '/dist')) // static files middleware

/* ###### PASSPORT & AUTH CONFIG ###### */
// only enable if Auth0 Config is available
if (process.env.AUTH0_CLIENT) {
	const passport 	   = require('passport')
	const Auth0Strategy= require('passport-auth0')

	const appScheme = (app.get('env') === 'production') ? 
		'http://' + process.env.APP_URL :
		'http://localhost:3000/'

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

	const userInViews = require('./middleware/userInViews')
	const secured = require('./middleware/secured')
	const auth = require('./routes/auth')(appScheme)
	const user = require('./routes/users')

	app.use(userInViews()) // assign the user object to res.locals.user
	app.use('/', auth) // assign routes for /login, /logout, and /callback
	app.use('/', user) // assign routes for /user
}


/* ###### ROUTING ###### */
const api = require('./routes/api')
const index = require('./routes/index')

// site url sections
app.use('/', index)
app.use('/api', api)


// Catch 404 and forward to error handler
app.use(function(req, res, next) {
	let err = new Error('Not Found')
	err.status = 404
	next(err)
})

/* ###### ERROR HANDLERS ###### */
app.use(function(err, req, res, next) {
	// Set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}
	res.status(err.status || 500)

	if (err.status === 404) {
		res.render('pages/404.html')
	} else {
		res.json({message: err.message, error: err})
	}
});

// export app to ./bin/www
module.exports = {
	'server': server,
	'name'  : process.env.APP_NAME
}