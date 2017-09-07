'use strict';

const express     = global.express = require('express'),
      bodyParser  = require('body-parser'),
      exrioting   = require('../exrioting'),
      poinouter   = require('../poinouter'),
      cfg         = require('./cfg.js');


/** Setting up the APP */
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/',       express.static(cfg.pubPath, { index: false }));
app.use('/assets', express.static(cfg.assetsPath));
app.get('/favicon.ico',     (req, res) => res.status(204));



const appStore  = exrioting.cleantRequire(`${cfg.storesPath}/app.store.js`);

const storeMixin = exrioting.cleantRequire(`${cfg.mixinsPath}/store.mixin.js`);


const stores = {}, actions = {}, mixins = {};

mixins.store = storeMixin(stores);

/** actions */
actions.initRouter = () => {
  app.get('/content', (req, res) => {
    res.json({
      poinject: poinouter.poinject(),
      content: poinouter.json()
    });
  });

  exrioting.initMixins(mixins);
  exrioting.init(cfg);
  app.get('/:tag?', actions.tagRoute);
}

actions.tagRoute = (req, res) => {
  let col = req.params.tag;
  let render = exrioting.render;
  const store = stores.appStore;

  col = col || store.getAllRoutes() && Object.keys(store.getAllRoutes()).shift();

  if(!col)
    return res.send(render({ store }));

  store.setActiveRoute(col);
  return res.send(render(store.route.view, { stores }))
}

actions.getContent = (cb) => {
  let json = {
    content:  poinouter.fileToObj(cfg.contentFilePath),
    poinject: poinouter.poinject()
  }
  return cb && cb(json)
};

actions.getContent((json) => {
  stores.appStore = new appStore(json);
  actions.initRouter();
});

/** Server Routing */
app.get('/poinject/:path?', require('./func/poinject.func.js').get);
app.patch('/poinject/:id',  require('./func/poinject.func.js').patch);

app.listen(process.env.PORT || 3000,
  () => console.log(`Example app listening on port ${process.env.PORT || 3000}!`));
