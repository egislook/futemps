function tagMixin(stores){
  return {
    init: function(){
      //this.opts.SERVER           = typeof window === 'undefined';
      this.store = stores.appStore;

      this.opts.getValue         = this.opts.getValue         || stores.appStore.getValue.bind(stores.appStore);
      this.opts.getTree          = this.opts.getTree          || stores.appStore.getTree.bind(stores.appStore);
      this.opts.getLeaf          = this.opts.getLeaf          || stores.appStore.getLeaf.bind(stores.appStore);
      this.opts.getParentLeaf    = this.opts.getParentLeaf    || stores.appStore.getParentLeaf.bind(stores.appStore);
      this.opts.getActiveRoute   = this.opts.getActiveRoute   || stores.appStore.getActiveRoute.bind(stores.appStore);
      this.opts.handleEdit       = this.opts.handleEdit       || stores.appStore.handleEdit.bind(stores.appStore);
      this.opts.handleCreate     = this.opts.handleCreate     || stores.appStore.handleCreate.bind(stores.appStore);
      this.opts.handleCreateChunk= this.opts.handleCreateChunk|| stores.appStore.handleCreateChunk.bind(stores.appStore);
      this.opts.handleUpload     = this.opts.handleUpload     || stores.appStore.handleUpload.bind(stores.appStore);
      this.opts.handleDelete     = this.opts.handleDelete     || stores.appStore.handleDelete.bind(stores.appStore);
      this.opts.handleDuplicate  = this.opts.handleDuplicate  || stores.appStore.handleDuplicate.bind(stores.appStore);
      this.opts.handleMove       = this.opts.handleMove       || stores.appStore.handleMove.bind(stores.appStore);

      this.opts.getDef           = this.opts.getDef           || ((path, data) => riot.util.tmpl(this.store.getDefinition(path), data));

      this.getTags = (tagName) =>
        this.tags[tagName].length ? this.tags[tagName] : [ this.tags[tagName] ];


      /**
  			component data has 3 types
  			-------------------------
  			1) settings/static (data which are static and not changing during the lifetime)
  				eg: debug, delay....
  			2) dynamic (data which are changing externaly usign opts change or triggers or internal update)
  				eg: { message }
  			3) inner (data which are changin internally only)
  				eg: _innerUpdate, _timer
  			*) static functions (received from opts)
  				eg: onRemove, onClick

  			component state has 2 types
  			---------------------------
  			1) default (data which been set as default and it can be overwrite by following datas)
  			2) initial (data which has been passed using opts (component attributes))
  			3) inner (data which has been changed inside component)
  			4) external (it changes on update of the component (opts) or triggered (on))

  			component has 3 types of updates
  			-------------------------------
  			1) external (when opts has been changed or component is a child of updated component)
  			2) internal (when update component is called from inside of the component)
  			3) full (when riot.update has been called then all components are updated)
  		*/

      this.setState = (data, defaults = {}, models = {}) => {
  			if(Object.keys(defaults).length)
  				this.default = defaults;

  			for(let i in data){
  				if(data[i] === undefined)
  					delete data[i];
  			}

  			this.models	 = models;
  			Object.assign(this, defaults, data);
  			//console.log('new state', data);
  			return this;
  		}



      this.tagShouldUpdate = (data, nextOpts) => {
  			if(data)
  				return true;

        const optsUpdate = JSON.stringify(this.opts) !== JSON.stringify(nextOpts);

        //console.log(optsUpdate, this.opts, nextOpts);

        //if(!optsUpdate) console.log(this.__.tagName, 'optimised update');

        if(optsUpdate){
  				this.setState(nextOpts);
  				this._optsUpdate = true;
  				return true;
  			}
  		}

      /**
        AlTERNATIVE to setState
      */

      // for(let i in this.opts){
  		// 	if(this.opts[i] === undefined)
  		// 		delete this.opts[i];
  		// }
      //
  		// this.default = {
  		// 	debug: 		false,
  		// }
      //
  		// const tag = Object.assign(this, this.default, opts);



  		// const structure = {
  		// 	delay: 'number',
  		// 	pos: 'string',
      //
  		// 	message: new messageModel({
  		// 		msg: 'string',
  		// 		ok: 'boolean',
  		// 		timestamp: 'number',
  		// 	}),
      //
  		// 	_timer: 'object',
  		// 	_innerUpdate: 'boolean',
  		// 	_toastPos: 'object',
      //
  		// 	onRemove: 'function',
  		// }
    }
  }
};
