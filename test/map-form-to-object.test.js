require('./test-env')
var mapFormToObject = require('../')

describe('map-form-to-object()', function () {

  beforeEach(function (done) {
    $('body').html('<form></form>')
    done()
  })

  it('should only return schema keys that have corresponding :input', function (done) {
    $('body form').empty()
    mapFormToObject($('form'), { test: true }).should.eql({})
    done()
  })

  it('should not map _id fields', function (done) {
    $('body form').empty().append('<input type="text" name="_id" value="123" />')
    mapFormToObject($('form'), { _id: true }).should.eql({})
    done()
  })

  describe('input[type=radio]', function () {
    it('should only return the selected value', function (done) {
      $('body form').empty().append('<input type="radio" name="test" value="Text Input" checked />')
      mapFormToObject($('form'), { test: true }).should.eql({ test: 'Text Input' })
      done()
    })

    it('should return null when no radio button is selected', function (done) {
      $('body form').empty().append('<input type="radio" name="test" value="Text Input" />')
      mapFormToObject($('form'), { test: true }).should.eql({ test: null })
      done()
    })
  })

  describe('select', function () {

    it('should only return the selected value', function (done) {
      $('body form').empty().append(
        '<select name="test"><option>Not this option</option>' +
        '<option selected="selected">Text Input</option></select>')

      mapFormToObject($('form'), { test: true }).should.eql({ test: 'Text Input' })
      done()
    })

  })

  describe('input[type=text]', function () {

    it('should return text value', function (done) {
      $('body form').empty().append('<input type="text" name="test" value="Text Input" />')
      mapFormToObject($('form'), { test: true }).should.eql({ test: 'Text Input' })
      done()
    })

    it('should trim whitespace from input', function (done) {
      $('body form').empty().append('<input type="text" name="test" value=" \t  Text Input   \n  " />')
      mapFormToObject($('form'), { test: true }).should.eql({ test: 'Text Input' })
      done()
    })

    it('should return null from and empty input', function (done) {
      $('body form').empty().append('<input type="text" name="test" value="" />')
      mapFormToObject($('form'), { test: true }).should.eql({ test: null })
      done()
    })


    it('should correctly coerce date properties for a GMT/BWT date', function (done) {
      $('body form').empty().append('<input type="text" name="test" value="20 Jan 2013, 10:02" />')
      var result = mapFormToObject($('form'), { test: { type: Date } }).test
      result.should.be.instanceOf(Date)

      result.toISOString().should.equal('2013-01-20T10:02:00.000Z')
      done()
    })

    it('should correctly coerce date properties for a BST date', function (done) {
      $('body form').empty().append('<input type="text" name="test" value="Saturday 27 April 2013, 10:02" />')
      var result = mapFormToObject($('form'), { test: { type: Date } }).test
      result.should.be.instanceOf(Date)

      result.toISOString().should.equal('2013-04-27T09:02:00.000Z')
      done()
    })
  })

  describe('textarea', function () {

    it('should return text value', function (done) {
      $('body form').empty().append('<textarea name="test">Text Input</textarea>')
      mapFormToObject($('form'), { test: true }).should.eql({ test: 'Text Input' })
      done()
    })

    it('should trim whitespace', function (done) {
      $('body form').empty().append('<textarea name="test"> \t Text Input   \n   </textarea>')
      mapFormToObject($('form'), { test: true }).should.eql({ test: 'Text Input' })
      done()
    })

  })

  describe('input[type=checkbox]', function () {

    it('should return array of values when checked', function (done) {
      $('body form').empty().append('<input type="checkbox" name="test" value="Text Input" checked="checked" />')
      mapFormToObject($('form'), { test: true }).should.eql({ test: [ 'Text Input' ] })
      done()
    })

    it('should return empty array when no values are checked', function (done) {
      $('body form').empty().append('<input type="checkbox" name="test" value="Text Input"/>')
      mapFormToObject($('form'), { test: true }).should.eql({ test: [] })
      done()
    })

    it('should return an array when there are multi checkboxes with the same name', function (done) {

      $('body form').empty()
        .append('<input type="checkbox" name="test" value="value1" checked="checked" />' +
          '<input type="checkbox" name="test" value="value2" checked="checked" />')

      mapFormToObject($('form'), { test: Array })
        .should.eql({ test: ['value1', 'value2'] })
      done()
    })

    it('should return a boolean value only if the schema property has a boolean type annotation', function (done) {
      $('body form').empty()
        .append('<input type="checkbox" name="test1" value="hello" checked="checked" />')
        .append('<input type="checkbox" name="test2" value="hello" />')
      mapFormToObject($('form'),
        { test1: { type: Boolean }
        , test2: { type: Boolean }
        }).should.eql({ test1: true, test2: false })
      done()
    })

  })
})
