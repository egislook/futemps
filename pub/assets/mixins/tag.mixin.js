function tagMixin(stores){
  return {
    init: function(){
      this.store = stores.appStore;

      this.opts.getValue         = this.opts.getValue       || stores.appStore.getValue.bind(stores.appStore);
      this.opts.getActiveRoute   = this.opts.getActiveRoute || stores.appStore.getActiveRoute.bind(stores.appStore);
      this.opts.handleEdit       = this.opts.handleEdit     || stores.appStore.handleEdit.bind(stores.appStore);


      // let self = this;
      // this.appStore.on('storeUpdated',
      //   () => self.update({
      //     poinject: self.appStore.poinject,
      //     content: self.appStore.content
      //   }));

      // Object.defineProperty(this, 'unmount', { value: function(){
      //   console.log('new unmount', this.opts.dataIs);
      //   origUnmount(self);
      //   false && setTimeout(function(){
      //     origUnmount(self);
      //     console.log(self.opts.dataIs)
      //   }, 1000);
      // }.bind(this)});


    }
  }
};
