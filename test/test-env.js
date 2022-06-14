const jsdom = require('jsdom')
const { JSDOM } = jsdom
global.dom = new JSDOM('<html><body></body></html>')
const jquery = require('./jquery-3.2.1.min')
global.$ = jquery
