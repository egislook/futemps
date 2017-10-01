function tagMixin(stores){
  return {
    init: function(){
      this.store = stores.appStore;

      this.opts.getValue         = this.opts.getValue         || stores.appStore.getValue.bind(stores.appStore);
      this.opts.getTree          = this.opts.getTree          || stores.appStore.getTree.bind(stores.appStore);
      this.opts.getActiveRoute   = this.opts.getActiveRoute   || stores.appStore.getActiveRoute.bind(stores.appStore);
      this.opts.handleEdit       = this.opts.handleEdit       || stores.appStore.handleEdit.bind(stores.appStore);
      this.opts.handleCreate     = this.opts.handleCreate     || stores.appStore.handleCreate.bind(stores.appStore);
      this.opts.handleUpload     = this.opts.handleUpload     || stores.appStore.handleUpload.bind(stores.appStore);
      this.opts.handleDelete     = this.opts.handleDelete     || stores.appStore.handleDelete.bind(stores.appStore);
      this.opts.handleDuplicate  = this.opts.handleDuplicate  || stores.appStore.handleDuplicate.bind(stores.appStore);
      this.opts.handleMove       = this.opts.handleMove       || stores.appStore.handleMove.bind(stores.appStore);

      this.opts.getDef           = this.opts.getDef           || ((path, data) => riot.util.tmpl(this.store.getDefinition(path), data));
    }
  }
};
