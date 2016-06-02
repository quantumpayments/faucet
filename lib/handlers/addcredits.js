module.exports = handler

var debug    = require('debug')('qpm_faucet:addcredits')
var fs       = require('fs')
var hdwallet = require('qpm_hdwallet')
var qpm_ui   = require('qpm_ui')
var wc_db    = require('wc_db')
var wc       = require('webcredits')


function handler(req, res) {

  var origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  var defaultCurrency = res.locals.config.currency || 'https://w3id.org/cc#bit';

  var source      = req.body.source;
  var destination = req.body.destination;
  var currency    = req.body.currency || defaultCurrency;
  var amount      = req.body.amount;
  var timestamp   = null;
  var description = req.body.description;
  var context     = req.body.context;


  var source      = req.session.userId

  if (!req.session.userId) {
    res.send('must be authenticated')
    return
  }

  var faucetURI = 'https://w3id.org/cc#faucet'

  config = res.locals.config

  var sequelize = wc_db.getConnection(config.db);
  wc.getBalance(faucetURI, sequelize, config, function(err, ret){
    if (err) {
      console.error(err);
    } else {
      console.log(ret);
      if (ret === null) {
        ret = 0
      }


      if (req.body.year === '1989') {

        var credit = {};

        credit["https://w3id.org/cc#source"] = faucetURI
        credit["https://w3id.org/cc#amount"] = payout
        credit["https://w3id.org/cc#currency"] = 'https://w3id.org/cc#bit'
        credit["https://w3id.org/cc#destination"] = req.session.userId


        wc.insert(credit, res.locals.sequelize, res.locals.config, function(err, ret) {
          if (err) {
            res.write(err);
          } else {

            res.status(200)
            res.header('Content-Type', 'text/html')


            var head   = qpm_ui.head
            var nav    = qpm_ui.nav
            var footer = qpm_ui.footer

            var body = `
            <div>
            Correct!<br>
            ` + payout + ` has been added to your <a href="/balance">balance</a><br>
            </div>
            `

            res.write(head)
            res.write(nav)
            res.write(body)
            res.write(footer)

          }

          res.end()

        });

      } else {

        res.status(200)
        res.header('Content-Type', 'text/html')


        var head   = qpm_ui.head
        var nav    = qpm_ui.nav
        var footer = qpm_ui.footer

        var body = `
        <div>
        Wrong answer.  Please go back and try again.
        </div>
        `

        res.write(head)
        res.write(nav)
        res.write(body)
        res.write(footer)
        res.end()

      }
    }
    sequelize.close();
  });


}
