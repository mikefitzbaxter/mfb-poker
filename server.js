const express = require('express')
const nunjucks = require('nunjucks')
const compression = require('compression')

const app = express()
const port = process.argv[2] || 3000

// configure nunjucks template engine
// http://mozilla.github.io/nunjucks
nunjucks.configure('templates', {
	autoescape: true,
	express: app,
	watch: true
})

// static files middleware
app.use(express.static('dist'))
// gzip compression on everything
app.use(compression())

// routing
app.get( '/', (req, res) => res.render('pages/index.njk') )

// start server and listen on port
app.listen(port, () => console.log(`App running on port ${port}!`))