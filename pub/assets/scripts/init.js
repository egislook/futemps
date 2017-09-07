const stores = {}, actions = {}, mixins = {};

mixins.store = storeMixin(stores);

actions.tagRoute = (col, act, id) => {
  const store = stores.appStore;
  col = col || store.getAllRoutes() && Object.keys(store.getAllRoutes()).shift();

  store.setActiveRoute(col);
  window.route(store.route.link, store.route.meta.title);
  window.riot.mount('main#main', store.route.view, { stores });
}

actions.initMixins = (mixins = {}) => {
  if(!Object.keys(mixins).length)
    return;

  for(let mixinName in mixins){
    riot.mixin(mixinName, mixins[mixinName]);
  }
}

actions.initRouter = () => {
  window.route(actions.tagRoute);
  window.route.base('/');
  window.route.start(1);
};

actions.getContent = (cb) => {
  window.fetch('/content')
    .then(res => res.json())
    .then(json => cb && cb(json));
};

actions.getContent((json) => {
  console.log(json);
  stores.appStore = new appStore(json);
  actions.initMixins(mixins);
  actions.initRouter();
});

/* external */
// riot.mixin('Store', {
//   init: function(){
//     this.appStore = stores.appStore;
//   }
// });

/* component */
// this.mixin('Store');


	/*router.routes([
    new Router.Route({tag: 'main-page'}),
    new Router.DefaultRoute({tag: 'sub-page'})
  ])*/
