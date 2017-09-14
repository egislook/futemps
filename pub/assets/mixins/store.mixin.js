function storeMixin(stores){
  return {
    init: function(){
      this.appStore = stores.appStore;

      this.poinject = this.appStore.poinject;
      this.content  = this.appStore.content;
      this.route    = this.appStore.route;

      this.extended = [];

      this.getValue         = this.appStore.getValue.bind(this.appStore);
      this.getActiveRoute   = this.appStore.getActiveRoute.bind(this.appStore);

      this.handleEdit       = this.appStore.handleEdit.bind(this.appStore);
      this.handleCreate     = this.appStore.handleCreate.bind(this.appStore);
      this.handleUpload     = this.appStore.handleUpload.bind(this.appStore);
      this.handleDelete     = this.appStore.handleDelete.bind(this.appStore);
      this.handleDuplicate  = this.appStore.handleDuplicate.bind(this.appStore);

      let self = this;
      this.appStore.on('storeUpdated',
        () => self.update({
          poinject: self.appStore.poinject,
          content: self.appStore.content
        }));

      this.on('extend', (id) => {
        let index = this.extended.indexOf(id);
        console.log(id, index, self.extended);
        if(index < 0){
          self.extended.push(id);
          return self.update();
        }

        self.extended.splice(index, 1);
        self.update();
      });

      this.handleExtend = (id, e) => self.trigger('extend', id);

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
