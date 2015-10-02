var expect = require('chai').expect

var options = require('../util/options')

describe('Options', function() {
	
	var dummyOptions = {}
	
	before(function() {
		dummyOptions = {
			test: 123,
			asd: 'Works'
		}
	})
	
	beforeEach(function() {
		options.set(dummyOptions)
	})
	
	describe('#get', function() {
		it('should return the same dummy JSON', function() {
			expect(options.get()).to.deep.equal(dummyOptions)
		})
	})
	
	describe('#set', function() {
		it('should return an empty JSON', function() {
			options.set({})
			expect(options.get()).to.deep.equal({})
		})
		
		it('should return undefined', function() {
			options.set(undefined)
			expect(options.get()).to.be.undefined
		})
		
		it('should return a JSON with fields name and size', function() {
			options.set({name: 'asda', size: 10})
			expect(options.get()).to.deep.equal({name: 'asda', size: 10})
		})
	})
})
