var expect = require('chai').expect;

var validator = require('../util/validator')

describe('Validator', function() {
	
	var badFileNames = [
		'.asd',
		'1.',
		'\'.asd',
		'asdasd',
		'*.123',
		'%.dda',
		'(.asd',
		'#.asd',
		'@.asd',
		'notInStandard,format',
		'NameTooLongToEverBeAcceptedByAnyRationalSocialEcoCulturalPoliticallyActiveCitizenOfThisNiceWorldCalledEarthNearTheSunAndAwayFromEverythingElse.format',
		'A.WayTooLongFormatForTheAverageUserOfThisMiddleware',
		'No,Small,Stops,In,My,Movie.avi',
		'+ThanEnoughSpecialCharacters.avi',
		'AInsidious\\BackslashInTheMiddleOfEverything.txt',
		''
	]
		
	var goodFileNames = [
		'n0th1ngwr0ngw1thl33t.txt',
		'NiceNameForABook.pdf',
		'a_nice_movie.avi',
		'several.dots.in.my.music.mp4',
		'difficulttoreadnamebutyetvalid.txt',
		'aNiceFile.WithALongFormat',
		'aReallyLargeFileNameButYetAcceptableDueToTheFactThatIts71CharactersLong.frmt'
	]
	
	var badSizes = [
		'asd',
		'noLettersInSizePlease',
		'01258587',
		'.2',
		'55.5',
		'-5',
		''
	]
	
	var goodSizes = [
		'15',
		'199999',
		'100000',
		'16666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666',
		'3492'
	]
	
	var badIds = [
		'@',
		'#',
		'-',
		'/',
		'!',
		'?',
		'$',
		'%',
		'¬',
		'*',
		'{',
		')',
		'=',
		';',
		'',
		' ',
		'651aaasda56465135mjnaiueooakxlmoinnxovm'
	]
	
	var goodIds = [
		'abcdefghijklmnopqrstuvwxyz0123456789asdc',
		'asjysgyajenguaheyrnaungiajianguiajccahnv',
		'0000000000000000000000000000000000000000',
		'5684864254864685435432168468453215346848',
		'a65s4d8a4s6d8a4sa6g86rs1b68a1818666e4abv',
		'651aaasda56465135mjnaiueooakxlmoinnxovma'
	]
	
	var badChunks = [
		''
	]
	
	var goodChunks = [
		'asdasd',
		'anythingThatIsNotAnEmptyString12938128519375!@#!(#%&(#@%!*%))'
	]
	
	var badChecksums = badIds
	
	var goodChecksums = goodIds
	
	var badOptions = [
		{
			secret: 'abcd',
			savePath: '/a/path/with/slash/',
			maxChunkSize: 10,
			expires: 5
		},
		{
			secret: 'waytoolongtobeanicesecretsolongthatismorethan15characterslong',
			savePath: '/a/valid/path/',
			maxChunkSize: 5,
			expires: 9
		},
		{
			secret: 'avalidsecret',
			savePath: '/a/path/without/slash/in/the/end',
			maxChunkSize: 68,
			expires: 199
		},
		{
			secret: 'avalidsecret',
			savePath: '/a/',
			maxChunkSize: -68,
			expires: 199
		},
		{
			secret: 'avalidsecret',
			savePath: '/a/path/with/no/name/',
			maxChunkSize: 68,
			expires: 199.5
		},
		{
			secret: 'avalidsecret',
			savePath: '/expires/way/too/big/for/javascript/',
			maxChunkSize: 1,
			expires: 99999999999999999999999999999999999999999999999999
		}
	]
	
	var goodOptions = [
		{
			secret: 'abcde',
			savePath: '/a/nice/path/ending/with/slash/',
			maxChunkSize: 100,
			expires: 1
		},
		{
			secret: '#!@&%!*',
			savePath: '/a/valid/path/',
			maxChunkSize: 10000000000000,
			expires: 99999999999999
		},
		{
			secret: '#!@&%!*',
			savePath: '/a/valid/path/',
			maxChunkSize: '10000000000000',
			expires: '99999999999999'
		}
	]
	
	describe('#file', function() {
		it('should return undefined on every test', function() {
			for(var i = 0; i < badSizes.length; i++) {
				for(var j = 0; j < badFileNames.length; j++) {
					var id = {file: badFileNames[j], size: badSizes[i]}
					expect(validator.file(id)).to.be.undefined
				}
			}
			
			for(var i = 0; i < goodSizes.length; i++) {
				for(var j = 0; j < badFileNames.length; j++) {
					var id = {file: badFileNames[j], size: goodSizes[i]}
					expect(validator.file(id)).to.be.undefined
				}
			}
			
			for(var i = 0; i < badSizes.length; i++) {
				for(var j = 0; j < goodFileNames.length; j++) {
					var id = {file: goodFileNames[j], size: badSizes[i]}
					expect(validator.file(id)).to.be.undefined
				}
			}
		})
		
		it('should return a json on every test', function() {
			for(var i = 0; i < goodSizes.length; i++) {
				for(var j = 0; j < goodFileNames.length; j++) {
					var id = {file: goodFileNames[j], size: goodSizes[i]}
					expect(validator.file(id)).to.deep.equal({path: goodFileNames[j], size: goodSizes[i]})
				}
			}
		})
	})
	
	describe('#chunk', function() {
		it('should return undefined on every test', function() {
			for(var i = 0; i < badChunks.length; i++) {
				for(var j = 0; j < badIds.length; j++) {
					var id = {id: badIds[j], chunk: badChunks[i]}
					expect(validator.chunk(id)).to.be.undefined
				}
			}
			
			for(var i = 0; i < goodChunks.length; i++) {
				for(var j = 0; j < badIds.length; j++) {
					var id = {id: badIds[j], chunk: goodChunks[i]}
					expect(validator.chunk(id)).to.be.undefined
				}
			}
			
			for(var i = 0; i < badChunks.length; i++) {
				for(var j = 0; j < goodIds.length; j++) {
					var id = {id: goodIds[j], chunk: badChunks[i]}
					expect(validator.chunk(id)).to.be.undefined
				}
			}
		})
		
		it('should return a json on every test', function() {
			for(var i = 0; i < goodChunks.length; i++) {
				for(var j = 0; j < goodIds.length; j++) {
					var id = {id: goodIds[j], chunk: goodChunks[i]}
					expect(validator.chunk(id)).to.deep.equal({id: goodIds[j]})
				}
			}
		})
	})
	
	describe('#end', function() {
		it('should return undefined on every test', function() {
			for(var i = 0; i < badChecksums.length; i++) {
				for(var j = 0; j < badIds.length; j++) {
					var id = {id: badIds[j], checksum: badChecksums[i]}
					expect(validator.end(id)).to.be.undefined
				}
			}
			
			for(var i = 0; i < goodChecksums.length; i++) {
				for(var j = 0; j < badIds.length; j++) {
					var id = {id: badIds[j], checksum: goodChecksums[i]}
					expect(validator.end(id)).to.be.undefined
				}
			}
			
			for(var i = 0; i < badChecksums.length; i++) {
				for(var j = 0; j < goodIds.length; j++) {
					var id = {id: goodIds[j], checksum: badChecksums[i]}
					expect(validator.end(id)).to.be.undefined
				}
			}
		})
		
		it('should return a json on every test', function() {
			for(var i = 0; i < goodChecksums.length; i++) {
				for(var j = 0; j < goodIds.length; j++) {
					var id = {id: goodIds[j], checksum: goodChecksums[i]}
					expect(validator.end(id)).to.deep.equal({id: goodIds[j], checksum: goodChecksums[i]})
				}
			}
		})
	})
	
	describe('#options', function() {
		it('should return undefined on every test', function() {
			for(var i = 0; i < badOptions.length; i++) {
				expect(validator.options(badOptions[i])).to.be.undefined
			}
		})
		
		it('should return the same JSON on every test, with numbers enforced', function() {
			for(var i = 0; i < goodOptions.length; i++) {
				expect(validator.options(goodOptions[i])).to.deep.equal({secret: goodOptions[i].secret, savePath: goodOptions[i].savePath, maxChunkSize: Number(goodOptions[i].maxChunkSize), expires: Number(goodOptions[i].expires)})
			}
		})
	})
})