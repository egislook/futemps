function globalMixin(stores){
  return {
    init: function(){
      //this.opts.SERVER           = typeof window === 'undefined';

      this.ACTION = (actionName, payload, cb) => {
        let action = null;

        for(let storeName in stores){
          if(typeof stores[storeName][actionName] === 'function'){
            action = stores[storeName][actionName];
            break;
          }
        }
        console.log(action);
        // if(typeof this.store[name] !== 'function')
        //   console.log(`ACTION ${name} does not exist`);
      }

      this.ACTION('setOpts', { poinject: [], content: {} });
    }
  }
};
