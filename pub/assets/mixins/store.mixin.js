function storeMixin(stores){
  return {
    init: function(){
      this.appStore = stores.appStore;

      this.poinject = this.appStore.poinject;
      this.content  = this.appStore.content;
      this.route    = this.appStore.route;

      this.getValue       = this.appStore.getValue.bind(this.appStore);
      this.getActiveRoute = this.appStore.getActiveRoute.bind(this.appStore);

      this.handleEdit     = this.appStore.handleEdit.bind(this.appStore);
      this.handleCreate   = this.appStore.handleCreate.bind(this.appStore);
      this.handleDelete   = this.appStore.handleDelete.bind(this.appStore);

      let self = this;
      this.appStore.on('storeUpdated',
        () => self.update({
          poinject: self.appStore.poinject,
          content: self.appStore.content
        }));

      // Unmount modifications for feature animation implementation
      this.on('before-unmount',
        () => console.log('before unmount', this.opts.dataIs))

      let origUnmount = this.unmount;

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
