const express = require('express')
const nunjucks = require('nunjucks')
const compression = require('compression')

const app = express()
const port = process.argv[2] || 3000

/* ###### TEMPLATE CONFIG ###### */
// configure nunjucks template engine
// http://mozilla.github.io/nunjucks
nunjucks.configure('templates', {
	autoescape: true,
	express: app,
	watch: true
})

/* ###### MIDDLEWARE ###### */
// static files middleware
app.use(express.static('dist'))
// gzip compression on everything
app.use(compression())


/* ###### ROUTING ###### */
// Home
app.get( '/', function(req, res, next) {
	res.render('pages/index.njk')
})

// 404 catchall
app.get( '*', function(req, res, next) {
	next(new Error('404'))
	res.status(404).render('pages/404.html')
})

/* ###### ERROR HANDLERS ###### */
// 404 Handler
app.use(function (err, req, res, next) {
	if (err.message === '404') {
		console.error(`Error: 404, URL: ${req.url}`)
	} else {
		next()
	}
})

// Default
app.use(function (err, req, res, next) {
	console.error(`Error: ${err.message}`)
})

/* ###### SERVER START ###### */
// start server and listen on port
app.listen(port, () => console.log(`App running on port ${port}!`))
