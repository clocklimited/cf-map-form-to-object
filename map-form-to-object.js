module.exports = mapFormToObject

const schemata = require('@clocklimited/schemata')
/*
 * Takes a jQuery `form` object and extracts values for `schema` properties.
 */
function mapFormToObject (form, schema) {
  const formData = {}
  const properties = schema.getProperties()

  Object.keys(properties).forEach(function (key) {
    // Don't ever update the _id property
    if (key === '_id') return

    let formValue = getValue(form, key, properties[key].type)
    if (formValue !== undefined) {
      // Trim off any extra whitespace
      if (typeof formValue === 'string') {
        formValue = formValue.trim()
      }

      formData[key] = formValue

      // Use schemata to correctly cast form values e.g Dates
      if (properties[key].type) formData[key] = schemata.castProperty(properties[key].type, formData[key])
    }
  })

  return formData
}

/*
 * Get the value from `form` for an input name matching
 * the schema property name `key`.
 */
function getValue (form, key, type) {
  const $input = form.find(':input[name=' + key + ']')

  switch ($input.attr('type')) {
    case 'radio':
      return $input.is(':checked') ? $input.filter(':checked').val() : null
    case 'checkbox':
      return mapCheckboxes($input, type)
    default:
      return $input.val() !== '' ? $input.val() : null
  }
}

/*
 * Checkboxes have two cases:
 *  - A booolean [x] or [ ]
 *  - A list:
 *     [x] a
 *     [x] b
 *     [ ] c
 *
 * This function takes the property's type from the schema to decide which
 * whether to return a boolean or an array of values.
 */
function mapCheckboxes ($input, type) {
  if (type === Boolean) return $input.is(':checked')
  return $input.filter(':checked').map(function (index, el) {
    return $(el).val()
  }).toArray()
}
