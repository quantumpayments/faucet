module.exports = createApp

var express = require('express')
var session = require('express-session')
var uuid = require('node-uuid')
var cors = require('cors')
var vhost = require('vhost')
var path = require('path')
var WcMiddleware = require('wc_express').middleware
var Sequelize  = require('sequelize')
var express    = require('express')
var program    = require('commander')
var bodyParser = require('body-parser')
var https      = require('https')
var fs         = require('fs')
var wc         = require('webcredits')
var wc_db      = require('wc_db')

var ejs = require('ejs');

var balance    = require('qpm_balance').handlers.balance
var faucet     = require('./handlers/faucet')
var addcredits = require('./handlers/addcredits')
var home       = require('./handlers/home')



var corsSettings = cors({
  methods: [
    'OPTIONS', 'HEAD', 'GET', 'PATCH', 'POST', 'PUT', 'DELETE'
  ],
  exposedHeaders: 'User, Location, Link, Vary, Last-Modified, ETag, Accept-Patch, Updates-Via, Allow, Content-Length',
  credentials: true,
  maxAge: 1728000,
  origin: true
})

function createApp (argv, sequelize, config) {
  var app = express()

  // Session
  var sessionSettings = {
    secret: uuid.v1(),
    saveUninitialized: false,
    resave: false
  }
  sessionSettings.cookie = {
    secure: true
  }

  app.use(session(sessionSettings))
  app.use('/', WcMiddleware(corsSettings))

  app.use( bodyParser.json() )       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }))

  var config = require('../config/config')
  sequelize = wc_db.getConnection(config.db)
  config.ui = config.ui || {}

  app.set('view engine', 'ejs')



  app.use(function(req,res, next) {
    res.locals.sequelize = sequelize
    res.locals.config = config
    next()
  })

  config.ui.tabs = [
    {"label" : "Home", "uri" : "/"},
    {"label" : "Balance", "uri" : "/balance"},
    {"label" : "Faucet", "uri" : "/faucet"},
  ]
  config.ui.name = "Faucet"


  app.get('/balance', balance)
  app.get('/faucet', faucet)
  app.post('/addcredits', addcredits)
  app.get('/', home)

  return app
}
