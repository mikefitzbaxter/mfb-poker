const express      = require('express')
const nunjucks     = require('nunjucks')
const helmet       = require('helmet')
const logger       = require('morgan')
const bodyParser   = require('body-parser')
const cookieParser = require('cookie-parser')
const compression  = require('compression')

const app = express()

/* ###### TEMPLATE CONFIG ###### */
// configure nunjucks template engine
// http://mozilla.github.io/nunjucks
nunjucks.configure('views', {
	autoescape: true,
	express: app,
	watch: true
})

/* ###### MIDDLEWARE ###### */
app.use(helmet()) // protect app by setting various http headers
app.use(logger('dev')) // morgan logger for http
app.use(bodyParser.json()) // parse json body
app.use(bodyParser.urlencoded({ extended: false })) //urlencode parsed body
app.use(cookieParser()); // parse cookies
app.use(compression()) // gzip compression all routes

app.use(express.static('dist')) // static files middleware


/* ###### ROUTING ###### */
// Home
app.get('/', function(req, res, next) {
	res.render('pages/index.njk')
})

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

	if (err.status === 404) {
		// Render the 404 page
		res.status = err.status
		res.render('pages/404.html')
	} else {
		// Render the error page
		res.status(err.status || 500)
		res.render('error')
	}
});

// export app to ./bin/www
module.exports = app