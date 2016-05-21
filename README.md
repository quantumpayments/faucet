## Introduction

For today's hackday I am going to try and start to build an access controlled "route" in solid-server, which grants access to a resource based on a credit system.  If you have credits, it will show you the resource.  If not you will get a 402.  This builds a bit more functionality on the code written for the previous [hack day](http://melvincarvalho.github.io/markdown-editor/?uri=https://melvin.databox.me/.markdown/hackday/route.txt).  I'll try and incorporate the work from the web payments WG [http://w3c.github.io/webpayments-http-api/](http://w3c.github.io/webpayments-http-api/).  


## Components

The demo contains 4 components

* /pay -- the resource that costs 25 credits to view
* /balance -- shows your balance
* /faucet -- a small app that will see your balance
* /home -- navigation and instructions

Each was deployed as a custom route with its own handler.  

## Installation

Installation is via

    git clone https://github.com/melvincarvalho/402.git

Then run

    npm install


```bash
$ bin/server.js  --port 8443 --ssl-key path/to/ssl-key.pem --ssl-cert path/to/ssl-cert.pem
# server running on https://localhost:8443/
```

##### How do I get the --ssl-key and the --ssl-cert?
You need an SSL certificate you get this from your domain provider or for free from [Let's Encrypt!](https://letsencrypt.org/getting-started/).

If you don't have one yet, or you just want to test `solid`, generate a certificate
```
$ openssl genrsa 2048 > ../localhost.key
$ openssl req -new -x509 -nodes -sha256 -days 3650 -key ../localhost.key -subj '/CN=*.localhost' > ../localhost.cert
```

## Faucet

Using [webcredits](https://webcredits.org/) it is possible to set up a faucet using

    credit create

    credit genesis

    credit insert https://w3id.org/cc#coinbase 50000 '' https://w3id.org/cc#faucet


## Demo

[Demo](https://webcredits.org:3000/)
