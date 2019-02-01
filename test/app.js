const assert = require('assert')
const chai   = require('chai')
const expect = chai.expect
const should = chai.should()

const request = require('supertest')

// Don't use arrow functions when dealing with Mocha as the `this` keyword doesn't work

describe('Environment variables', function () {
	let app = require('../app')

	describe('exist', function () {
		it('should return a value if variables are loaded', function () {
			expect(app.env.APP_SECRET).to.be.a('string')
		})	
	})
	describe('configured', function () {
		it('should not return the default values for APP_SECRET', function () {
			expect(app.env.APP_SECRET).to.not.equal('funky cold medina')
			expect(app.env.APP_SECRET).to.not.equal('APP_SECRET')
			expect(app.env.APP_SECRET).to.not.equal('')
		})
		it('should not return the default values for APP_NAME', function () {
			expect(app.env.APP_NAME).to.not.equal('<APP_NAME>')
			expect(app.env.APP_NAME).to.not.equal('')
		})
		it('should not return the default values for APP_TITLE', function () {
			expect(app.env.APP_TITLE).to.not.equal('<APP_TITLE>')
			expect(app.env.APP_TITLE).to.not.equal('')
		})		
		it('should not return the default values for APP_URL', function () {
			expect(app.env.APP_URL).to.not.equal('<APP_URL>')
			expect(app.env.APP_URL).to.not.equal('')
		})		
	})
})

describe('Server is running', function () {
	let server

	beforeEach(function () {
		delete require.cache[require.resolve('../bin/www')]
		server = require('../bin/www')
	})

	afterEach(function (done) {
		server.close(done);
	})

	describe('status ok', function () {
		it('responds to /', function testSlash(done) {
			request(server)
				.get('/')
				.expect(200, done)
		})
		it('404 tester', function testPath(done) {
			request(server)
				.get('/test/404')
				.expect(404, done)
		})
	})
})

