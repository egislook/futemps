var express = require("express");
var engine = require('express-dot-engine');
var request = require('request');
var lodash = require('lodash');
var moment = require('moment');

// settings
var host = process.env.IP;
var port = process.env.PORT;
var poinoutApp = '5702b79cf9104c03004f15e8';

var app = express();

engine.settings.dot = {
  evaluate:    /\{\{([\s\S]+?)\}\}/g,
  interpolate: /\{\{=([\s\S]+?)\}\}/g,
  encode:      /\{\{!([\s\S]+?)\}\}/g,
  use:         /\{\{#([\s\S]+?)\}\}/g,
  define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
  conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
  iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
  varname: 'layout, partial, locals, it',
  strip: false,
  append: true,
  selfcontained: false
};

var loadData = function(cb){
  console.time('LOADING DATA');
  request('https://poinout.herokuapp.com/api/json/' + poinoutApp, function (error, response, body) {
    if(error || response.statusCode !== 200){
      var msg = 'Poinout data can not be loaded. Check if poinoutApp "' + poinoutApp + '" id is correct';
      return cb && cb({ok: false, msg: error || msg});
    }
    app.data = JSON.parse(body);
    app.data.json = JSON.stringify(app.data);
    app.data.year = new Date().getFullYear();
    app.data.server = {poinoutApp: poinoutApp};
    // extra data modifications for VIEWS
    app.data.server.tags = [];
    app.data.flickr && app.data.flickr.forEach(function(album){
      app.data.server.tags = lodash.union(app.data.server.tags, album.tags);
    });
    
    app.data.libs = {
      lodash: lodash,
      moment: moment,
    };
    
    console.timeEnd('LOADING DATA');
    cb && cb({ok: true});
  });
};

// setting view engine to dot
app.engine('dot', engine.__express);
app.set('view engine', 'dot');

// setting public folder
app.use(express.static(__dirname + '/public'));

// loading data when setver starts
loadData(function(json){
  if(!json.ok) throw json.msg;
  app.listen(port, host);
});

// data restart route
app.get('/refresh/:poinoutApp', function(req, res, next){
  res.set('Access-Control-Allow-Origin', '*');
  
  if(!req.params.poinoutApp || req.params.poinoutApp && req.params.poinoutApp !== poinoutApp){
    return res.json({ok: false, msg: 'Poinout app is not correct'});
  }
  
  loadData(function(json){
    res.json(json);
  });
});

app.get('/data', function(req, res){
  res.json(app.data);
});



// ROUTING
app.get('/', function (req, res) {
  res.render('home', app.data);
});

app.get('/album/:id*', function (req, res) {
  var selectedAlbumIndex = lodash.findIndex(app.data.flickr, {id: req.params.id});
  
  app.data.server.prevAlbum = lodash.get(app.data.flickr, selectedAlbumIndex-1) 
    || lodash.get(app.data.flickr, app.data.flickr.length-1);
  
  app.data.server.selectedAlbum = lodash.get(app.data.flickr, selectedAlbumIndex);
  
  app.data.server.nextAlbum = lodash.get(app.data.flickr, selectedAlbumIndex+1) 
    || lodash.get(app.data.flickr, 0);
    
  app.data.server.url = req.get('host') + req.url;
  
  app.data.json = JSON.stringify({ album: app.data.server.selectedAlbum });
  res.render('horizontal-album', app.data);
});

//<!--style="width:{{? (it.server.selectedAlbum.photos.length * 800) }}px"-->