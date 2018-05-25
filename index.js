const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const db = require('./models');

const router = require('./routes');

app.db = db;

app.use(morgan('combined')); //login request 
app.use(cors());
app.use(bodyParser.json(({ type: '*/*'})));
app.use(express.static('views'));
// Passport configuration
require('./services/passport')(app);

router(app);

function print (path, layer) {
    if (layer.route) {
      layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
    } else if (layer.name === 'router' && layer.handle.stack) {
      layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
    } else if (layer.method) {
      console.log('%s /%s',
        layer.method.toUpperCase(),
        path.concat(split(layer.regexp)).filter(Boolean).join('/'))
    }
}
  
function split (thing) {
    if (typeof thing === 'string') {
        return thing.split('/')
    } else if (thing.fast_slash) {
        return ''
    } else {
        var match = thing.toString()
        .replace('\\/?', '')
        .replace('(?=\\/|$)', '$')
        .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
        return match
        ? match[1].replace(/\\(.)/g, '$1').split('/')
        : '<complex:' + thing.toString() + '>'
    }
}

app._router.stack.forEach(print.bind(null, []))

const port = process.env.HTTP_PORT || 8080;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on: ', port);