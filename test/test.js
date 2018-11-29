const assert = require('assert')
const chai   = require('chai')
const expect = chai.expect
const should = chai.should()

// Don't use arrow functions when dealing with Mocha as the `this` keyword doesn't work

describe('Array', function() {
 	describe('#indexOf()', function() {
		it('should return -1 when the value is not present', () => {
			[1, 2, 3].indexOf(4).should.equal(-1)
			//assert.equal([1,2,3].indexOf(4), -1)
		})
	})
})