const stores = {}, actions = {}, mixins = {};

mixins.store  = storeMixin(stores);
mixins.tag    = tagMixin(stores);

actions.tagRoute = (col, act, id) => {
  const store = stores.appStore;
  col = col || store.getAllRoutes() && Object.keys(store.getAllRoutes()).shift();

  stores.appStore.setActiveRoute(col);
  window.route(store.route.link, store.route.meta.title);
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
  riot.mount('app');
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
