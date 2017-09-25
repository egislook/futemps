'use strict';

const express     = global.express = require('express'),
      bodyParser  = require('body-parser'),
      exriothing  = require('exriothing'),
      poinject    = require('../_packs/poinject'),
      cfg         = require('./cfg.js');


/** Setting up the APP */
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/',       express.static(cfg.pubPath, { index: false }));
app.use('/assets', express.static(cfg.assetsPath));
app.get('/favicon.ico',     (req, res) => res.status(204));



const appStore    = exriothing.cleantRequire(`${cfg.storesPath}/app.store.js`);

const storeMixin  = exriothing.cleantRequire(`${cfg.mixinsPath}/store.mixin.js`);
const tagMixin    = exriothing.cleantRequire(`${cfg.mixinsPath}/tag.mixin.js`);


const stores = {}, actions = {}, mixins = {};

mixins.store = storeMixin(stores);
mixins.tag   = tagMixin(stores);

/** actions */
actions.initRouter = () => {
  /** Server Routing */
  app.use('/poinject', require('./func/poinject.func.js'));
  app.use('/upload', require('./func/upload.func.js'));
  app.get('/content', (req, res) => {
    res.json({
      poinject: poinject.poinject(),
      content: poinject.json()
    });
  });

  exriothing.initMixins(mixins);
  exriothing.init(cfg);
  app.get('/:tag?', actions.tagRoute);
}

actions.tagRoute = (req, res) => {
  let col = req.params.tag;
  let render = exriothing.render;
  const store = stores.appStore;

  col = col || store.getAllRoutes() && Object.keys(store.getAllRoutes()).shift();

  if(!col)
    return res.send(render({ store }));

  store.setActiveRoute(col);
  return res.send(render(store.route.view, { stores }))
}

actions.getContent = (cb) => {
  let json = {
    content:  poinject.fileToObj(cfg.contentFilePath),
    poinject: poinject.poinject()
  }
  return cb && cb(json)
};

actions.getContent((json) => {
  stores.appStore = new appStore(json);
  actions.initRouter();
});

app.listen(process.env.PORT || 3000,
  () => console.log(`Example app listening on port ${process.env.PORT || 3000}!`));
