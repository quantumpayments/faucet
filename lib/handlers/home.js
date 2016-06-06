module.exports = handler

var debug = require('debug')('qpm_faucet:home')
var fs    = require('fs')
var wc    = require('webcredits')
var wc_db = require('wc_db')

function handler(req, res) {

  var origin = req.headers.origin
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }


  if (!req.session.userId) {
    res.send('Must be authenticated via WebID.  Get a webid <a href="https://databox.me/">NOW</a>!')
    return
  }

  var config = res.locals.config

  res.status(200)
  res.header('Content-Type', 'text/html');

  res.render('pages/home', { ui : config.ui })

/*
  res.write('Welcome to HTTP 402 test.  Options:')
  res.write('<br>\n')
  res.write('See your <a href="/balance">balance</a> ')
  res.write('<br>\n')
  res.write('Visit the <a href="/faucet">faucet</a> if you dont have enough credits')
  res.write('<br>\n')
*/

}
