'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const path = require('path');
const favicon = require('serve-favicon');
const app = express();
const countries = require('./lib/eu-countries');
const endpoint = 'http://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl';
const soap = require('soap');


app.disable('x-powered-by');

app.set('view engine', 'ejs');
app.set('env', 'development');


app.use(favicon(path.join(__dirname, 'favicon.png')));

app.use('/public', express.static(path.join(__dirname, '/public'), {
    maxAge: 0,
    dotfiles: 'ignore',
    etag: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
   res.render('index', {countries: countries});
});

app.post('/validate', (req, res) => {
   let country = req.body.country;
   let vat = req.body.vat;
   let params = {
       countryCode: country,
       vatNumber: vat
   };
    soap.createClient(endpoint, (err, client) => {
       client.checkVat(params, (err, result) => {
          res.send(result);
       });
    });
});



if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
    });
}

app.use((err, req, res, next) => {
    res.status(err.status || 500);
});

app.listen(port);
