var jsdom = require('jsdom').jsdom

global.window = jsdom('<html><body></body></html>').createWindow()

global.window.$ = window.jQuery = global.jQuery = global.$ = require('jquery-latest').create(global.window)
global.document = window.document
global.addEventListener = global.window.addEventListener