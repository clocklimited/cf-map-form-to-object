require('./test-env')
const mapFormToObject = require('..')
const schemata = require('@clocklimited/schemata')

const idSchema = schemata({
  name: 'Test',
  properties: {
    _id: {
      type: String
    }
  }
})

const schema = schemata({
  name: 'Test',
  properties: {
    test: {
      type: String
    }
  }
})

const dateSchema = schemata({
  name: 'Test',
  properties: {
    test: {
      type: Date
    }
  }
})

const arraySchema = schemata({
  name: 'Test',
  properties: {
    test: {
      type: Array
    }
  }
})

const booleanSchema = schemata({
  name: 'Test',
  properties: {
    test1: { type: Boolean },
    test2: { type: Boolean }
  }
})


describe('map-form-to-object()', () => {
  beforeEach(done => {
    $('body').html('<form></form>')
    done()
  })

  test(
    'should only return schema keys that have corresponding :input',
    done => {
      $('body form').empty()
      expect(mapFormToObject($('form'), schema)).toEqual({})
      done()
    }
  )

  test('should not map _id fields', done => {
    $('body form').empty().append('<input type="text" name="_id" value="123" />')
    expect(mapFormToObject($('form'), idSchema)).toEqual({})
    done()
  })

  describe('input[type=radio]', () => {
    test('should only return the selected value', done => {
      $('body form').empty().append('<input type="radio" name="test" value="Text Input" checked />')
      expect(mapFormToObject($('form'), schema)).toEqual({ test: 'Text Input' })
      done()
    })

    test('should return null when no radio button is selected', done => {
      $('body form').empty().append('<input type="radio" name="test" value="Text Input" />')
      expect(mapFormToObject($('form'), schema)).toEqual({ test: null })
      done()
    })
  })

  describe('select', () => {
    test('should only return the selected value', done => {
      $('body form').empty().append(
        '<select name="test"><option>Not this option</option>' +
        '<option selected="selected">Text Input</option></select>')

      expect(mapFormToObject($('form'), schema)).toEqual({ test: 'Text Input' })
      done()
    })
  })

  describe('input[type=text]', () => {
    test('should return text value', done => {
      $('body form').empty().append('<input type="text" name="test" value="Text Input" />')
      expect(mapFormToObject($('form'), schema)).toEqual({ test: 'Text Input' })
      done()
    })

    test('should trim whitespace from input', done => {
      $('body form').empty().append('<input type="text" name="test" value=" \t  Text Input   \n  " />')
      expect(mapFormToObject($('form'), schema)).toEqual({ test: 'Text Input' })
      done()
    })

    test('should return null from and empty input', done => {
      $('body form').empty().append('<input type="text" name="test" value="" />')
      expect(mapFormToObject($('form'), schema)).toEqual({ test: null })
      done()
    })

    test(
      'should correctly coerce date properties for a GMT/BWT date',
      done => {
        $('body form').empty().append('<input type="text" name="test" value="20 Jan 2013, 10:02" />')
        var result = mapFormToObject($('form'), dateSchema).test
        expect(result).toBeInstanceOf(Date)

        expect(result.toISOString()).toBe('2013-01-20T10:02:00.000Z')
        done()
      }
    )

    test(
      'should correctly coerce date properties for a BST date',
      done => {
        $('body form').empty().append('<input type="text" name="test" value="Saturday 27 April 2013, 10:02" />')
        var result = mapFormToObject($('form'), dateSchema).test
        expect(result).toBeInstanceOf(Date)

        expect(result.toISOString()).toBe('2013-04-27T09:02:00.000Z')
        done()
      }
    )
  })

  describe('textarea', () => {
    test('should return text value', done => {
      $('body form').empty().append('<textarea name="test">Text Input</textarea>')
      expect(mapFormToObject($('form'), schema)).toEqual({ test: 'Text Input' })
      done()
    })

    test('should trim whitespace', done => {
      $('body form').empty().append('<textarea name="test"> \t Text Input   \n   </textarea>')
      expect(mapFormToObject($('form'), schema)).toEqual({ test: 'Text Input' })
      done()
    })
  })

  describe('input[type=checkbox]', () => {
    test('should return array of values when checked', done => {
      $('body form').empty().append('<input type="checkbox" name="test" value="Text Input" checked="checked" />')
      expect(mapFormToObject($('form'), arraySchema)).toEqual({ test: [ 'Text Input' ] })
      done()
    })

    test('should return empty array when no values are checked', done => {
      $('body form').empty().append('<input type="checkbox" name="test" value="Text Input"/>')
      expect(mapFormToObject($('form'), arraySchema)).toEqual({ test: [] })
      done()
    })

    test(
      'should return an array when there are multi checkboxes with the same name',
      done => {
        $('body form').empty()
          .append('<input type="checkbox" name="test" value="value1" checked="checked" />' +
            '<input type="checkbox" name="test" value="value2" checked="checked" />')

        expect(mapFormToObject($('form'), arraySchema)).toEqual({ test: [ 'value1', 'value2' ] })
        done()
      }
    )

    test(
      'should return a boolean value only if the schema property has a boolean type annotation',
      done => {
        $('body form').empty()
          .append('<input type="checkbox" name="test1" value="hello" checked="checked" />')
          .append('<input type="checkbox" name="test2" value="hello" />')
        expect(mapFormToObject($('form'), booleanSchema)).toEqual({ test1: true, test2: false })
        done()
      }
    )
  })
})
