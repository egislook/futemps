class appStore{
  constructor(opts = { poinject: [], content: {} }){
    riot.observable(this);
    this.content  = opts.content;
    this.poinject = opts.poinject;
    this.route    = null;
    this.lang     = 'en';
    this.def      = '$def.';

    //this.on('editor', this.setEditor);
  }

  setOpts(opts, updated){
    if(opts){
      this.content = opts.content;
      this.poinject = opts.poinject;
    }

    if(this.trigger){
      if(!updated) return this.trigger('storeUpdated');
      updated.path && this.trigger(updated.path);
      updated.id   && this.trigger(updated.id);
    }
  }

  getOpts(){
    return this.content;
  }

  /** ROUTE DATA */
  getAllRoutes(){ return this.content.routes }
  setActiveRoute(routeName){
    this.route = this.content.routes[routeName] || this.content.routes.main;
    this.trigger('routeUpdated');
  }
  getActiveRoute(key){ return key ? this.route[key] : this.route }
  getMeta(){ return Object.assign(this.content.meta || {}, this.getActiveRoute('meta') || {})}

  /** CONTENT DATA */
  getValue(path, field='value'){
    const self = this;
    let leaf = self.poinject && self.poinject.filter(leaf => leaf.path === path || leaf.id === path);

    if(!leaf || leaf && !leaf.length)
      return path;
    if(leaf.length === 1){
      let value = leaf.shift()[field];

      if(false && value && value.indexOf(self.def) > -1)
        return self.getDefinition(value.replace(self.def, ''));

      return value;
    }

    return leaf.map(obj => obj.value);
    //return JSON.stringify(leaf.map(obj => obj.value), 0, 2);
  }

  getDefinition(path){
    const self = this;
    let leaf = this.poinject.filter(leaf => leaf.path === `definitions.${self.lang}.${path}`);
    if(!leaf || leaf && !leaf.length)
      return path;
    if(leaf.length === 1)
      return leaf.shift()['value'];
  }

  getLeaf(id){
    let self = this;
    let leaf = self.poinject && self.poinject.filter(leaf => leaf.id === id || leaf.path === id);
    //console.log(leaf);
    if(!leaf || leaf && !leaf.length)
      return id;
    if(leaf.length === 1)
      return leaf.shift();
  }

  getParentLeaf(path){
    let self = this;
    let leaf = self.poinject && self.poinject.filter(leaf => leaf.id === path || leaf.path === path);
    if(!leaf || leaf && !leaf.length)
      return path;

    let parentId = leaf.shift().parent;

    let parent = self.poinject && self.poinject.filter(leaf => leaf.id === parentId);
    if(!parent || parent && !parent.length)
      return parentId;

    return parent.shift();
  }

  getTree(path){
    if(!path)
      return {};
    let key = path.split('.').pop();
    return { [key] : this._treeDigger(null, path) };
  }

  _treeDigger(parent, path){
    let self = this;
    let children = this.poinject.filter(leaf => (path && leaf.path === path || leaf.parent === parent));

    if(children.length === 1){
      let child = children[0];
      if(child.type === 'value')
        return child.value;
    }

    let obj = {};
    children.forEach((child) => {
      obj[child.value] = self._treeDigger(child.id);
    });

    return obj;
  }

  handleEdit(value, id, cb){
    const self = this;
    let path = id && id.split('-').length !== 5 && id;
    id = path ? this.getValue(id, 'id') : id;
    path = !path ? this.getLeaf(id) : path;
    window.fetch('/poinject/'+id, {
      headers: { 'Content-Type': 'application/json'},
      method: 'PATCH',
      body: JSON.stringify({ value })
    }).then(res => res.json())
      .then(json => {
        self.setOpts(json.opts, { path, id });
        cb && cb();
        console.log(json);
      });
  }

  handleMove(leaf, sibling, onlyClient){
    const self = this;
    if(onlyClient){
      let leafIndex = self.poinject.findIndex(obj => obj.id === leaf.id);
      let siblingIndex = self.poinject.findIndex(obj => obj.id === sibling.id);
      let poinject = self.poinject;

      poinject[leafIndex] = Object.assign(leaf, { parent: sibling.parent });
      poinject.splice(siblingIndex, 0, poinject.splice(leafIndex, 1)[0]);

      return self.setOpts({ content: self.content , poinject });

    } else {
      window.fetch('/poinject/'+leaf.id, {
        headers: { 'Content-Type': 'application/json'},
        method: 'PUT',
        body: JSON.stringify({ siblingId: sibling.id })
      }).then(res => res.json())
        .then(json => {
          self.setOpts(json.opts);
          //cb && cb();
          console.log(json);
        });
    }
  }

  handleCreate(value, leaf, cb){
    const self = this;
    window.fetch('/poinject/', {
      headers: { 'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({ value, parent: leaf.parent, type: leaf.type || 'field' })
    }).then(res => res.json())
      .then(json => {
        self.setOpts(json.opts);
        cb && cb();
        console.log(json);
      });
  }

  handleCreateChunk(data, schema, cb){
    const self = this;

    window.fetch('/poinject/', {
      headers: { 'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({ data, schema })
    }).then(res => res.json())
      .then(json => {
        self.setOpts(json.opts);
        cb && cb();
        console.log(json);
      });
  }

  handleDuplicate(id, cb){
    const self = this;
    window.fetch('/poinject/'+id, {
      headers: { 'Content-Type': 'application/json'},
      method: 'POST'
    }).then(res => res.json())
      .then(json => {
        self.setOpts(json.opts);
        console.log(json);
      });
  }

  handleUpload(id, e, cb){

    const file = e.target && e.target.files && e.target.files.item(0);
    e.target.value = '';

    if(!file)
      return;

    const self = this;

    upload(file, (err, json) => {
      if(!id)
        return cb(err, json);

      self.getLeaf(id).type === 'field'
        ? this.handleCreate(json.src, { parent: id, type: 'value' }, cb)
        : this.handleEdit(json.src, id, cb);
    });

    function upload(fileItem, cb){
      var data = new FormData();
      data.append('file', fileItem);

      fetch('/upload', {
        method: 'POST',
        body: data
      })
      .then(res     => res.json())
      .then(json    => cb(null, json))
      .catch(err    => cb(err));
    }
  }

  handleDelete(id, cb){
    const self = this;
    window.fetch('/poinject/'+id, {
      headers: { 'Content-Type': 'application/json'},
      method: 'DELETE'
    }).then(res => res.json())
      .then(json => {
        self.setOpts(json.opts);
        console.log(json);
      });
  }
}
