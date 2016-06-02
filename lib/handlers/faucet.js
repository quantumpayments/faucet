module.exports = handler

var debug  = require('debug')('qpm_faucet:faucet')
var fs     = require('fs')
var qpm_ui = require('qpm_ui');
var wc     = require('webcredits')
var wc_db  = require('wc_db')


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

  var sequelize = wc_db.getConnection(config.db)
  wc.getBalance(faucetURI, sequelize, config, function(err, ret){
    if (err) {
      console.error(err);
    } else {
      console.log(ret);
      if (ret === null) {
        ret = 0
      }
      var payout = Math.floor(ret / 100.0)
      res.status(200)
      res.header('Content-Type', 'text/html');
      var balance = Math.round(ret).toString()

      var head   = qpm_ui.head;
      var nav    = qpm_ui.nav;
      var footer = qpm_ui.footer;

      var body = `
      <div>
      Faucet Balance : ` + balance + `<br>
      Next payout : ` + payout + `<br>
      <form method=post action=addcredits>Which year was the web invented?<br>
      <input name=year><br>
      <input type="submit" value="Submit"> </form>
      </div>
      `


      res.write(head);
      res.write(nav);
      res.write(body);
      res.write(footer);

      res.end()

    }
    sequelize.close();
  });


}
