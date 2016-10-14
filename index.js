var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var location = require('./local_modules/location')();
var service = require('./local_modules/service')();

app.use('/', express.static(__dirname + '/static'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/angular', express.static(__dirname + '/node_modules/angular'));
app.use(bodyParser.json());

app.post('/api/service/next', service.next);

app.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});